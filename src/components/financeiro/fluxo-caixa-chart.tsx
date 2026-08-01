"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts";
import type { FluxoCaixaPonto } from "@/lib/financeiro-data";

const tooltipStyle = {
  background: "#080b1c",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 10,
  color: "#f5f7fc",
  fontSize: 12.5,
};

export function FluxoCaixaChart({ data }: { data: FluxoCaixaPonto[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
        <XAxis
          dataKey="label"
          stroke="#5c6486"
          tick={{ fill: "#5c6486", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis stroke="#5c6486" tick={{ fill: "#5c6486", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,.04)" }} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="entradas" name="Entradas" fill="#4fd8ff" radius={[5, 5, 0, 0]} />
        <Bar dataKey="saidas" name="Saídas" fill="#ff6b6b" radius={[5, 5, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
