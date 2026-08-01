"use client";

import { useEffect, useState } from "react";
import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { FluxoCaixaChart } from "@/components/financeiro/fluxo-caixa-chart";
import { createClient } from "@/lib/supabase/client";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export interface FinanceiroReportData {
  totalEntradas: number;
  totalSaidas: number;
  saldo: number;
  pontos: { label: string; entradas: number; saidas: number; saldo: number }[];
}

export function FinanceiroReport({
  inicio,
  fim,
  onData,
}: {
  inicio: string;
  fim: string;
  onData: (data: FinanceiroReportData) => void;
}) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinanceiroReportData | null>(null);

  useEffect(() => {
    let active = true;
    const supabase = createClient();
    Promise.all([
      supabase
        .from("contas_receber")
        .select("valor, data_pagamento")
        .eq("status", "pago")
        .gte("data_pagamento", inicio)
        .lte("data_pagamento", fim),
      supabase
        .from("contas_pagar")
        .select("valor, data_pagamento")
        .eq("status", "pago")
        .gte("data_pagamento", inicio)
        .lte("data_pagamento", fim),
    ]).then(([receberRes, pagarRes]) => {
      if (!active) return;
      const receber = (!receberRes.error && receberRes.data ? receberRes.data : []) as {
        valor: number;
        data_pagamento: string | null;
      }[];
      const pagar = (!pagarRes.error && pagarRes.data ? pagarRes.data : []) as {
        valor: number;
        data_pagamento: string | null;
      }[];

      const meses = new Map<string, { entradas: number; saidas: number }>();
      function key(dateStr: string | null): string {
        if (!dateStr) return "sem-data";
        const d = new Date(`${dateStr}T00:00:00`);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      }
      for (const r of receber) {
        const k = key(r.data_pagamento);
        const entry = meses.get(k) ?? { entradas: 0, saidas: 0 };
        entry.entradas += r.valor ?? 0;
        meses.set(k, entry);
      }
      for (const p of pagar) {
        const k = key(p.data_pagamento);
        const entry = meses.get(k) ?? { entradas: 0, saidas: 0 };
        entry.saidas += p.valor ?? 0;
        meses.set(k, entry);
      }

      const sortedKeys = Array.from(meses.keys()).sort();
      let acumulado = 0;
      const pontos = sortedKeys.map((k) => {
        const entry = meses.get(k)!;
        acumulado += entry.entradas - entry.saidas;
        return { label: k, entradas: entry.entradas, saidas: entry.saidas, saldo: acumulado };
      });

      const totalEntradas = receber.reduce((acc, r) => acc + (r.valor ?? 0), 0);
      const totalSaidas = pagar.reduce((acc, p) => acc + (p.valor ?? 0), 0);

      const result = { totalEntradas, totalSaidas, saldo: totalEntradas - totalSaidas, pontos };
      setData(result);
      onData(result);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [inicio, fim, onData]);

  if (loading) return <Skeleton className="h-52 w-full" />;

  if (!data || data.pontos.length === 0) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Sem dados financeiros no período"
        description="Ajuste o período selecionado para ver os dados."
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <StatCard icon={TrendingUp} label="Total de entradas" value={currency.format(data.totalEntradas)} />
        <StatCard icon={TrendingDown} label="Total de saídas" value={currency.format(data.totalSaidas)} />
        <StatCard icon={Wallet} label="Saldo do período" value={currency.format(data.saldo)} />
      </div>
      <div className="mt-4">
        <FluxoCaixaChart data={data.pontos} />
      </div>
    </div>
  );
}
