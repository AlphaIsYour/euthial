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
    <div className="bg-[#1A1A1A] border border-[rgba(207,207,207,0.10)] rounded-card p-4 sm:p-5">
      {/* Chart Title & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[rgba(207,207,207,0.08)]">
        <div>
          <div className="flex items-center gap-2">
            <MaterialIcon name="show_chart" size={18} className="text-blue-400" />
            <h3 className="text-sm font-semibold text-white">
              Covenant Floor vs Realisasi Pembayaran Kumulatif
            </h3>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            Perbandingan garis batas lantai pembayaran minimum (Floor) terhadap akumulasi riil settlement
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 bg-blue-500 rounded"></span>
            <span className="text-[#E4E4E7]">Realisasi Investor</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 border-b border-dashed border-[#8A8A8A]"></span>
            <span className="text-[#8A8A8A]">Target Floor(d)</span>
          </div>
        </div>
      </div>

      {/* Responsive SVG Chart */}
      <div className="relative mt-4 w-full overflow-x-auto">
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
                  stroke="rgba(207,207,207,0.06)"
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  fill="#52525B"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val === 0 ? "0" : `${val / 1000000}M`}
                </text>
              </g>
            );
          })}

          {/* Area fill under paid curve */}
          <path d={areaPath} fill="rgba(59, 130, 246, 0.08)" />

          {/* Floor Target Line (Dashed) */}
          <path
            d={floorPath}
            fill="none"
            stroke="#71717A"
            strokeWidth="2"
            strokeDasharray="4 4"
          />

          {/* Actual Paid Line (Solid Blue) */}
          <path
            d={paidPath}
            fill="none"
            stroke="#3B82F6"
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
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? 5 : 3.5}
                  fill="#3B82F6"
                  stroke="#0A0A0A"
                  strokeWidth="2"
                  onMouseEnter={() => setHoveredPoint(d)}
                />

                {/* X-axis labels (Months) */}
                <text
                  x={cx}
                  y={chartHeight - paddingY + 16}
                  textAnchor="middle"
                  fill="#71717A"
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
          <div className="absolute top-2 right-2 bg-[#27272A] border border-[rgba(207,207,207,0.15)] rounded-md p-2 text-xs font-mono shadow-xl z-20 pointer-events-none">
            <div className="text-white font-bold mb-1">
              Bulan Ke-{hoveredPoint.month} (Hari {hoveredPoint.day})
            </div>
            <div className="text-blue-400">
              Realisasi: {formatIDR(hoveredPoint.cumulativePaid)}
            </div>
            <div className="text-[#A1A1AA]">
              Target Floor: {formatIDR(hoveredPoint.floor)}
            </div>
            <div className="text-emerald-400 text-[10px] mt-0.5 font-sans font-semibold">
              Surplus: {formatIDR(hoveredPoint.cumulativePaid - hoveredPoint.floor)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
