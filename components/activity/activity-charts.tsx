"use client";

import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { GithubLanguage } from "@/lib/github";

const PALETTE = ["#064e3b", "#059669", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"];

const tooltipStyle = {
  borderRadius: 10,
  border: "1px solid #e5e7eb",
  fontSize: 11,
  boxShadow: "0 10px 24px -16px rgba(6,78,59,0.5)",
};

export function ContributionChart({
  data,
}: {
  data: { date: string; label: string; count: number }[];
}) {
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
          <defs>
            <linearGradient id="activityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#059669" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#059669" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#6b7280" }} interval={Math.max(Math.floor(data.length / 6), 1)} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 9, fill: "#6b7280" }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [String(value) + " events", "Activity"]} />
          <Area type="monotone" dataKey="count" stroke="#059669" strokeWidth={1.6} fill="url(#activityFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function LanguageChart({ data }: { data: GithubLanguage[] }) {
  const top = data.slice(0, 6);
  return (
    <div className="h-[220px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={top} dataKey="percent" nameKey="name" innerRadius={52} outerRadius={82} paddingAngle={2} stroke="none">
            {top.map((entry, index) => (
              <Cell key={entry.name} fill={PALETTE[index % PALETTE.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [Number(value).toFixed(1) + "%", String(name)]} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
