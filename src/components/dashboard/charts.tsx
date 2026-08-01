"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import type { MonthPoint, DonutSlice } from "@/lib/dashboard-data";

const tooltipStyle = {
  background: "#080b1c",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 10,
  color: "#f5f7fc",
  fontSize: 12.5,
};

export function RevenueAreaChart({ data }: { data: MonthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4fd8ff" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#2b52ff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="#5c6486"
          tick={{ fill: "#5c6486", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis stroke="#5c6486" tick={{ fill: "#5c6486", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: "rgba(255,255,255,.1)" }} />
        <Area
          type="monotone"
          dataKey="value"
          stroke="#4fd8ff"
          strokeWidth={2}
          fill="url(#revenueFill)"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function ConsultoriasBarChart({ data }: { data: MonthPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={150}>
      <BarChart data={data} margin={{ top: 10, right: 4, left: -24, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="#5c6486"
          tick={{ fill: "#5c6486", fontSize: 10.5 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis hide />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,.04)" }} />
        <Bar dataKey="value" fill="#2b52ff" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ProjetosDonutChart({ data }: { data: DonutSlice[] }) {
  return (
    <ResponsiveContainer width={120} height={120}>
      <PieChart>
        <Pie
          data={data}
          dataKey="value"
          nameKey="label"
          innerRadius={40}
          outerRadius={58}
          strokeWidth={0}
        >
          {data.map((slice) => (
            <Cell key={slice.label} fill={slice.color} />
          ))}
        </Pie>
        <Tooltip contentStyle={tooltipStyle} />
      </PieChart>
    </ResponsiveContainer>
  );
}
