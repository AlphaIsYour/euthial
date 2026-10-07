"use client";

import React, { useState } from "react";
import { MaterialIcon } from "../ui/MaterialIcon";

interface DataPoint {
  day: number;
  month: number;
  floor: number;
  cumulativePaid: number;
  event?: "CURE_STARTED" | "BOND_DRAWN" | "HEALTHY";
}

// 24 Months timeline dataset
const generateChartData = (): DataPoint[] => {
  const points: DataPoint[] = [];
  const targetTotal = 150000000; // Rp 150M

  for (let m = 0; m <= 24; m += 2) {
    const day = m * 30;
    // Floor trajectory: 0 at day 0, 60% (90M) at day 18 (day 540), 100% (150M) at day 24 (day 720)
    let floor = 0;
    if (m <= 18) {
      floor = (90000000 / 18) * m;
    } else {
      floor = 90000000 + ((60000000 / 6) * (m - 18));
    }

    // Actual realization (Healthy trajectory ahead of floor)
    let cumulativePaid = 0;
    if (m > 0) {
      cumulativePaid = Math.min(targetTotal, Math.round(m * 10500000));
    }

    let event: DataPoint["event"] = "HEALTHY";
    if (m === 8) event = "CURE_STARTED";
    if (m === 9) event = "BOND_DRAWN";

    points.push({
      day,
      month: m,
      floor: Math.round(floor),
      cumulativePaid: Math.round(cumulativePaid),
      event: m === 8 ? "CURE_STARTED" : m === 9 ? "BOND_DRAWN" : undefined,
    });
  }

  return points;
};

export const CovenantChart: React.FC = () => {
  const data = generateChartData();
  const [hoveredPoint, setHoveredPoint] = useState<DataPoint | null>(null);

  const formatIDR = (val: number) => {
    return `Rp ${(val / 1000000).toFixed(1)} jt`;
  };

  const maxVal = 160000000;
  const chartHeight = 220;
  const chartWidth = 720;
  const paddingX = 40;
  const paddingY = 25;

  const getX = (idx: number) => {
    return paddingX + (idx / (data.length - 1)) * (chartWidth - paddingX * 2);
  };

  const getY = (val: number) => {
    return chartHeight - paddingY - (val / maxVal) * (chartHeight - paddingY * 2);
  };

  // SVG Paths
  const floorPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.floor)}`)
    .join(" ");

  const paidPath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.cumulativePaid)}`)
    .join(" ");

  const areaPath = `
    ${data.map((d, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(d.cumulativePaid)}`).join(" ")}
    L ${getX(data.length - 1)} ${chartHeight - paddingY}
    L ${getX(0)} ${chartHeight - paddingY}
    Z
  `;

  return (
    <div className="bg-white dark:bg-black border border-slate-200/90 dark:border-white/10 rounded-xl p-5 sm:p-6 shadow-xs space-y-4">
      {/* Chart Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-500/10 border border-blue-200/80 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 shrink-0">
              <MaterialIcon name="show_chart" size={16} />
            </div>
            <h3 className="text-base font-semibold text-slate-900 dark:text-white tracking-tight">
              Covenant Floor vs Realisasi Pembayaran Kumulatif
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#8A8A8A] mt-1 font-normal leading-relaxed">
            Perbandingan garis batas lantai pembayaran minimum (Floor) terhadap akumulasi riil settlement
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-600 dark:bg-blue-400 rounded"></span>
            <span className="text-slate-700 dark:text-slate-300 font-medium">Realisasi Investor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 border-b border-dashed border-slate-400 dark:border-slate-500"></span>
            <span className="text-slate-500 dark:text-[#8A8A8A]">Target Floor(d)</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative mt-2 w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-56 select-none overflow-visible"
        >
          {/* Subtle horizontal grid lines */}
          {[0, 40000000, 80000000, 120000000, 160000000].map((val) => {
            const y = getY(val);
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={chartWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-slate-200 dark:text-white/10"
                  strokeWidth="1"
                  strokeDasharray="2 2"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="currentColor"
                  className="text-slate-400 dark:text-[#8A8A8A]"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val === 0 ? "0" : `${val / 1000000}M`}
                </text>
              </g>
            );
          })}

          {/* Area fill under paid curve */}
          <path d={areaPath} className="fill-blue-600/10 dark:fill-blue-500/15" />

          {/* Floor Target Line (Dashed) */}
          <path
            d={floorPath}
            fill="none"
            stroke="currentColor"
            className="text-slate-400 dark:text-slate-500"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Actual Paid Line (Solid Blue) */}
          <path
            d={paidPath}
            fill="none"
            stroke="currentColor"
            className="text-blue-600 dark:text-blue-400"
            strokeWidth="2.5"
            strokeLinecap="round"
          />

          {/* Data Points & Interactive hover triggers */}
          {data.map((d, i) => {
            const cx = getX(i);
            const cy = getY(d.cumulativePaid);
            const isHovered = hoveredPoint?.month === d.month;

            return (
              <g key={d.month} className="cursor-pointer">
                {/* Vertical helper on hover */}
                {isHovered && (
                  <line
                    x1={cx}
                    y1={paddingY}
                    x2={cx}
                    y2={chartHeight - paddingY}
                    stroke="currentColor"
                    className="text-slate-400 dark:text-slate-500"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : 3.5}
                  className="fill-blue-600 dark:fill-blue-400 stroke-white dark:stroke-black"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPoint(d)}
                />

                {/* X-axis labels (Months) */}
                <text
                  x={cx}
                  y={chartHeight - paddingY + 16}
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-slate-500 dark:text-[#8A8A8A]"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  M{d.month}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip Card */}
        {hoveredPoint && (
          <div className="absolute top-2 right-2 bg-white dark:bg-black border border-slate-200 dark:border-white/15 rounded-xl p-3 text-xs font-mono shadow-md z-20 pointer-events-none">
            <div className="text-slate-900 dark:text-white font-bold mb-1">
              Bulan Ke-{hoveredPoint.month} (Hari {hoveredPoint.day})
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-semibold">
              Realisasi: {formatIDR(hoveredPoint.cumulativePaid)}
            </div>
            <div className="text-slate-500 dark:text-[#8A8A8A]">
              Target Floor: {formatIDR(hoveredPoint.floor)}
            </div>
            <div className="text-emerald-600 dark:text-emerald-400 text-[10px] mt-0.5 font-sans font-semibold">
              Surplus: {formatIDR(hoveredPoint.cumulativePaid - hoveredPoint.floor)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
