"use client";

import { useEffect, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/types/database.types";

type Consultoria = Database["public"]["Tables"]["consultorias"]["Row"];

export function ConsultoriasReport({
  inicio,
  fim,
  onData,
}: {
  inicio: string;
  fim: string;
  onData: (rows: Consultoria[]) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [rows, setRows] = useState<Consultoria[]>([]);
  const [consultores, setConsultores] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    Promise.all([
      supabase
        .from("consultorias")
        .select("*")
        .eq("status", "realizada")
        .gte("data_hora", inicio)
        .lte("data_hora", `${fim}T23:59:59`)
        .order("data_hora", { ascending: false }),
      supabase.from("profiles").select("id, nome"),
    ]).then(([consultoriasRes, profilesRes]) => {
      if (!active) return;
      const result = !consultoriasRes.error && consultoriasRes.data ? (consultoriasRes.data as Consultoria[]) : [];
      const map = new Map<string, string>();
      if (!profilesRes.error && profilesRes.data) {
        for (const p of profilesRes.data as { id: string; nome: string }[]) map.set(p.id, p.nome);
      }
      setConsultores(map);
      setRows(result);
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

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={CalendarCheck}
        title="Nenhuma consultoria realizada no período"
        description="Ajuste o período selecionado para ver os dados."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-white/[0.08] text-[11.5px] uppercase tracking-wide text-slate-dim">
            <th className="px-5 py-3 font-medium">Empresa</th>
            <th className="px-5 py-3 font-medium">Consultor</th>
            <th className="px-5 py-3 font-medium">Data</th>
            <th className="px-5 py-3 font-medium">Diagnóstico</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((c) => (
            <tr
              key={c.id}
              className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
            >
              <td className="px-5 py-3.5 font-medium text-white">{c.empresa_nome}</td>
              <td className="px-5 py-3.5 text-slate">
                {c.consultor_id ? consultores.get(c.consultor_id) ?? "—" : "—"}
              </td>
              <td className="px-5 py-3.5 text-slate">
                {new Date(c.data_hora).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-5 py-3.5 text-slate">{c.diagnostico ? "Sim" : "Não"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
