"use client";

import { useEffect, useState } from "react";
import { PieChart as PieIcon } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { ProjetosDonutChart } from "@/components/dashboard/charts";
import { createClient } from "@/lib/supabase/client";
import type { StatusProjeto } from "@/types/database.types";
import type { DonutSlice } from "@/lib/dashboard-data";

const STATUS_LABELS: Record<StatusProjeto, string> = {
  a_fazer: "A fazer",
  em_andamento: "Em andamento",
  em_revisao: "Em revisão",
  concluido: "Concluído",
};

const STATUS_COLORS: Record<StatusProjeto, string> = {
  a_fazer: "#5c6486",
  em_andamento: "#2b52ff",
  em_revisao: "#fbbf24",
  concluido: "#4ade80",
};

export function ProjetosStatusReport({
  inicio,
  fim,
  onData,
}: {
  inicio: string;
  fim: string;
  onData: (data: DonutSlice[]) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [slices, setSlices] = useState<DonutSlice[]>([]);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase
      .from("projetos")
      .select("status")
      .gte("created_at", inicio)
      .lte("created_at", `${fim}T23:59:59`)
      .then(({ data, error }) => {
        if (!active) return;
        const counts = new Map<string, number>();
        if (!error && data) {
          for (const row of data as { status: StatusProjeto }[]) {
            counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
          }
        }
        const result = Array.from(counts.entries()).map(([status, value]) => ({
          label: STATUS_LABELS[status as StatusProjeto] ?? status,
          value,
          color: STATUS_COLORS[status as StatusProjeto] ?? "#93a0c2",
        }));
        setSlices(result);
        onData(result);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [inicio, fim, onData]);

  if (loading) return <Skeleton className="h-40 w-full" />;

  if (slices.length === 0) {
    return (
      <EmptyState
        icon={PieIcon}
        title="Nenhum projeto no período"
        description="Ajuste o período selecionado para ver os dados."
      />
    );
  }

  return (
    <div className="flex items-center gap-6">
      <ProjetosDonutChart data={slices} />
      <div className="flex flex-1 flex-col gap-2.5">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[12.5px] text-slate">
            <span className="h-2 w-2 flex-shrink-0 rounded-sm" style={{ background: s.color }} />
            <span>{s.label}</span>
            <b className="ml-auto font-semibold text-white">{s.value}</b>
          </div>
        ))}
      </div>
    </div>
  );
}
