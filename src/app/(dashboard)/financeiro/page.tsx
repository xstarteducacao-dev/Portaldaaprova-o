import { createClient } from "@/lib/supabase/server";
import { getFinanceiroStats, getFluxoCaixa } from "@/lib/financeiro-data";
import { FinanceiroView } from "@/components/financeiro/financeiro-view";

export const dynamic = "force-dynamic";

export default async function FinanceiroPage() {
  const supabase = await createClient();

  const [
    stats,
    fluxo,
    { data: contasReceber },
    { data: contasPagar },
    { data: categorias },
    { data: empresas },
    { data: todasContasPagar },
  ] = await Promise.all([
    getFinanceiroStats(),
    getFluxoCaixa(12),
    supabase.from("contas_receber").select("*").order("vencimento", { ascending: false }),
    supabase.from("contas_pagar").select("*").order("vencimento", { ascending: false }),
    supabase.from("categorias_financeiras").select("*").order("nome"),
    supabase.from("empresas").select("id, nome").order("nome"),
    supabase.from("contas_pagar").select("categoria_id"),
  ]);

  const contasPorCategoria = new Map<string, number>();
  for (const row of todasContasPagar ?? []) {
    if (row.categoria_id) {
      contasPorCategoria.set(row.categoria_id, (contasPorCategoria.get(row.categoria_id) ?? 0) + 1);
    }
  }

  return (
    <FinanceiroView
      stats={stats}
      fluxo={fluxo}
      contasReceber={contasReceber ?? []}
      contasPagar={contasPagar ?? []}
      categorias={categorias ?? []}
      empresas={empresas ?? []}
      contasPorCategoria={contasPorCategoria}
    />
  );
}
