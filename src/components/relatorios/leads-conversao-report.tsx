"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import { KANBAN_COLUMNS } from "@/components/crm/kanban-columns";
import type { StatusLead } from "@/types/database.types";

export interface LeadsConversaoData {
  porStatus: { status: StatusLead; label: string; color: string; total: number }[];
  totalLeads: number;
}

export function LeadsConversaoReport({
  inicio,
  fim,
  onData,
}: {
  inicio: string;
  fim: string;
  onData: (data: LeadsConversaoData) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<LeadsConversaoData | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    supabase
      .from("leads")
      .select("status")
      .gte("created_at", inicio)
      .lte("created_at", `${fim}T23:59:59`)
      .then(({ data: rows, error }) => {
        if (!active) return;
        const counts = new Map<string, number>();
        if (!error && rows) {
          for (const row of rows as { status: StatusLead }[]) {
            counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
          }
        }
        const porStatus = KANBAN_COLUMNS.map((c) => ({
          status: c.status,
          label: c.title,
          color: c.color,
          total: counts.get(c.status) ?? 0,
        }));
        const totalLeads = porStatus.reduce((acc, p) => acc + p.total, 0);
        const result = { porStatus, totalLeads };
        setData(result);
        onData(result);
        setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [inicio, fim, onData]);

  if (loading) {
    return (
      <div className="space-y-2.5">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  if (!data || data.totalLeads === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Nenhum lead no período"
        description="Ajuste o período selecionado para ver os dados."
      />
    );
  }

  const max = Math.max(...data.porStatus.map((p) => p.total), 1);

  return (
    <div>
      <div className="mb-4 text-[13px] text-slate">
        Total de leads no período: <span className="font-semibold text-white">{data.totalLeads}</span>
      </div>
      <div className="flex flex-col gap-2.5">
        {data.porStatus.map((p) => (
          <div key={p.status} className="flex items-center gap-3">
            <span className="w-[170px] flex-shrink-0 text-[12.5px] text-slate">{p.label}</span>
            <div className="h-6 flex-1 overflow-hidden rounded-md bg-white/[0.04]">
              <div
                className="h-full rounded-md"
                style={{ width: `${(p.total / max) * 100}%`, background: p.color }}
              />
            </div>
            <span className="w-8 flex-shrink-0 text-right text-[12.5px] font-semibold text-white">
              {p.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
