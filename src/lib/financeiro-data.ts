import { createClient } from "@/lib/supabase/server";

export interface FinanceiroStats {
  receitasMes: number;
  despesasMes: number;
  lucroMes: number;
  contasAtrasadas: number;
}

export interface FluxoCaixaPonto {
  label: string;
  entradas: number;
  saidas: number;
  saldo: number;
}

const MESES = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

type ContaPaga = { data_pagamento: string | null; valor: number };

async function safeSelect<T>(query: Promise<{ data: T[] | null; error: unknown }>): Promise<T[]> {
  try {
    const { data, error } = await query;
    if (error || !data) return [];
    return data;
  } catch {
    return [];
  }
}

export async function getFinanceiroStats(): Promise<FinanceiroStats> {
  const supabase = await createClient();
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toISOString()
    .slice(0, 10);
  const today = now.toISOString().slice(0, 10);

  const [receber, pagar, atrasadasReceber, atrasadasPagar] = await Promise.all([
    safeSelect(
      supabase
        .from("contas_receber")
        .select("valor")
        .eq("status", "pago")
        .gte("data_pagamento", startOfMonth)
        .lt("data_pagamento", startOfNextMonth) as unknown as Promise<{
        data: { valor: number }[] | null;
        error: unknown;
      }>
    ),
    safeSelect(
      supabase
        .from("contas_pagar")
        .select("valor")
        .eq("status", "pago")
        .gte("data_pagamento", startOfMonth)
        .lt("data_pagamento", startOfNextMonth) as unknown as Promise<{
        data: { valor: number }[] | null;
        error: unknown;
      }>
    ),
    safeSelect(
      supabase
        .from("contas_receber")
        .select("id")
        .neq("status", "pago")
        .lt("vencimento", today) as unknown as Promise<{ data: { id: string }[] | null; error: unknown }>
    ),
    safeSelect(
      supabase
        .from("contas_pagar")
        .select("id")
        .neq("status", "pago")
        .lt("vencimento", today) as unknown as Promise<{ data: { id: string }[] | null; error: unknown }>
    ),
  ]);

  const receitasMes = receber.reduce((acc, r) => acc + (r.valor ?? 0), 0);
  const despesasMes = pagar.reduce((acc, r) => acc + (r.valor ?? 0), 0);

  return {
    receitasMes,
    despesasMes,
    lucroMes: receitasMes - despesasMes,
    contasAtrasadas: atrasadasReceber.length + atrasadasPagar.length,
  };
}

export async function getFluxoCaixa(mesesAtras = 12): Promise<FluxoCaixaPonto[]> {
  const supabase = await createClient();
  const now = new Date();
  const points: FluxoCaixaPonto[] = [];
  for (let i = mesesAtras - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    points.push({ label: `${MESES[d.getMonth()]}/${String(d.getFullYear()).slice(2)}`, entradas: 0, saidas: 0, saldo: 0 });
  }

  const start = new Date(now.getFullYear(), now.getMonth() - (mesesAtras - 1), 1)
    .toISOString()
    .slice(0, 10);

  const [receber, pagar] = await Promise.all([
    safeSelect(
      supabase
        .from("contas_receber")
        .select("valor, data_pagamento")
        .eq("status", "pago")
        .gte("data_pagamento", start) as unknown as Promise<{ data: ContaPaga[] | null; error: unknown }>
    ),
    safeSelect(
      supabase
        .from("contas_pagar")
        .select("valor, data_pagamento")
        .eq("status", "pago")
        .gte("data_pagamento", start) as unknown as Promise<{ data: ContaPaga[] | null; error: unknown }>
    ),
  ]);

  function indexFor(dateStr: string | null): number {
    if (!dateStr) return -1;
    const d = new Date(`${dateStr}T00:00:00`);
    return points.findIndex((_, i) => {
      const target = new Date(now.getFullYear(), now.getMonth() - (mesesAtras - 1 - i), 1);
      return target.getMonth() === d.getMonth() && target.getFullYear() === d.getFullYear();
    });
  }

  for (const row of receber) {
    const idx = indexFor(row.data_pagamento);
    if (idx >= 0) points[idx].entradas += row.valor ?? 0;
  }
  for (const row of pagar) {
    const idx = indexFor(row.data_pagamento);
    if (idx >= 0) points[idx].saidas += row.valor ?? 0;
  }

  let acumulado = 0;
  for (const p of points) {
    acumulado += p.entradas - p.saidas;
    p.saldo = acumulado;
  }

  return points;
}
