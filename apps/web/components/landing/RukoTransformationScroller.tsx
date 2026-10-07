"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const TOTAL_FRAMES = 200;
const FRAME_PREFIX = "/euthial/frame_";
const FRAME_SUFFIX = ".webp";

const getFrameUrl = (index: number) => {
  const padded = String(Math.min(TOTAL_FRAMES, Math.max(1, index))).padStart(4, "0");
  return `${FRAME_PREFIX}${padded}${FRAME_SUFFIX}`;
};

export const RukoTransformationScroller: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imagesCache = useRef<Map<number, HTMLImageElement>>(new Map());
  const currentFrame = useRef<number>(1);
  const targetFrame = useRef<number>(1);
  const isRendering = useRef<boolean>(false);

  // Draw frame on canvas with full native resolution (100% sharp, no downscaling)
  const drawFrame = useCallback((frameNumber: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Enable highest quality image smoothing
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    // Find requested frame or closest available loaded frame
    let img = imagesCache.current.get(frameNumber);
    if (!img || !img.complete || img.naturalWidth === 0) {
      let closestDiff = Infinity;
      let closestImg: HTMLImageElement | undefined;
      for (const [fNum, cachedImg] of imagesCache.current.entries()) {
        if (cachedImg.complete && cachedImg.naturalWidth > 0) {
          const diff = Math.abs(fNum - frameNumber);
          if (diff < closestDiff) {
            closestDiff = diff;
            closestImg = cachedImg;
          }
        }
      }
      img = closestImg;
    }

    if (!img || !img.complete || img.naturalWidth === 0) return;

    const canvasW = canvas.width;
    const canvasH = canvas.height;
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;

    const imgRatio = imgW / imgH;
    const canvasRatio = canvasW / canvasH;

    let drawW = canvasW;
    let drawH = canvasH;
    let offsetX = 0;
    let offsetY = 0;

    // Fit cover while preserving full image sharpness
    if (canvasRatio > imgRatio) {
      drawH = canvasW / imgRatio;
      offsetY = (canvasH - drawH) / 2;
    } else {
      drawW = canvasH * imgRatio;
      offsetX = (canvasW - drawW) / 2;
    }

    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // Smooth lerp frame loop
  const startAnimationLoop = useCallback(() => {
    if (isRendering.current) return;
    isRendering.current = true;

    const render = () => {
      const diff = targetFrame.current - currentFrame.current;

      if (Math.abs(diff) > 0.05) {
        currentFrame.current += diff * 0.22;
        drawFrame(Math.round(currentFrame.current));
        requestAnimationFrame(render);
      } else {
        currentFrame.current = targetFrame.current;
        drawFrame(Math.round(currentFrame.current));
        isRendering.current = false;
      }
    };

    requestAnimationFrame(render);
  }, [drawFrame]);

  // Preload frames progressively at full fidelity
  useEffect(() => {
    // 1. Immediately preload and render Frame 1
    const frame1 = new Image();
    frame1.src = getFrameUrl(1);
    frame1.onload = () => {
      imagesCache.current.set(1, frame1);
      drawFrame(1);
    };

    // 2. Preload tier 1 milestone frames (every 8th frame) for responsive scrubbing
    const milestoneIndices: number[] = [];
    for (let i = 1; i <= TOTAL_FRAMES; i += 8) {
      milestoneIndices.push(i);
    }
    if (!milestoneIndices.includes(TOTAL_FRAMES)) {
      milestoneIndices.push(TOTAL_FRAMES);
    }

    milestoneIndices.forEach((idx) => {
      const img = new Image();
      img.src = getFrameUrl(idx);
      img.onload = () => {
        imagesCache.current.set(idx, img);
      };
    });

    // 3. Progressively prefetch the rest in background
    let currentBatchIdx = 2;
    const loadNextBatch = () => {
      if (currentBatchIdx > TOTAL_FRAMES) return;

      const batchEnd = Math.min(currentBatchIdx + 12, TOTAL_FRAMES);
      for (let i = currentBatchIdx; i <= batchEnd; i++) {
        if (!imagesCache.current.has(i)) {
          const img = new Image();
          img.src = getFrameUrl(i);
          img.onload = () => {
            imagesCache.current.set(i, img);
          };
        }
      }
      currentBatchIdx = batchEnd + 1;

      if (currentBatchIdx <= TOTAL_FRAMES) {
        setTimeout(loadNextBatch, 40);
      }
    };

    const idleTimer = setTimeout(loadNextBatch, 250);
    return () => clearTimeout(idleTimer);
  }, [drawFrame]);

  // Resize canvas to match full display resolution (Retina ready)
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);

      drawFrame(Math.round(currentFrame.current));
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, [drawFrame]);

  // Calculate scroll position specifically within this section's container
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) return;

      // Scrolled distance from top of this section
      const scrolled = -rect.top;
      const progress = Math.min(1, Math.max(0, scrolled / scrollableDistance));

      const frameNum = Math.min(
        TOTAL_FRAMES,
        Math.max(1, Math.round(progress * (TOTAL_FRAMES - 1)) + 1)
      );

      targetFrame.current = frameNum;
      startAnimationLoop();
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [startAnimationLoop]);

  return (
    <section
      ref={containerRef}
      className="relative h-[260vh] bg-[#ECEAE6]"
      aria-label="Animasi Transformasi Fit-Out Ruko"
    >
      {/* STICKY FULL-SCREEN CANVAS VIEWPORT */}
      <div className="sticky top-16 h-screen w-full flex items-center justify-center overflow-hidden bg-[#ECEAE6]">
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          style={{ width: "100%", height: "100%" }}
        />
      </div>
    </section>
  );
};
