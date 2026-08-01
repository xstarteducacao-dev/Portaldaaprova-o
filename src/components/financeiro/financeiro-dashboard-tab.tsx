import { Wallet, TrendingDown, TrendingUp, AlertTriangle, BarChart3 } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/shared/empty-state";
import { FluxoCaixaChart } from "./fluxo-caixa-chart";
import type { FinanceiroStats, FluxoCaixaPonto } from "@/lib/financeiro-data";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function FinanceiroDashboardTab({
  stats,
  fluxo,
}: {
  stats: FinanceiroStats;
  fluxo: FluxoCaixaPonto[];
}) {
  const hasFluxo = fluxo.some((p) => p.entradas > 0 || p.saidas > 0);
  const receitasDespesas = fluxo.slice(-6);

  return (
    <div>
      <div className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        <StatCard icon={TrendingUp} label="Receitas do mês" value={currency.format(stats.receitasMes)} />
        <StatCard icon={TrendingDown} label="Despesas do mês" value={currency.format(stats.despesasMes)} />
        <StatCard icon={Wallet} label="Lucro do mês" value={currency.format(stats.lucroMes)} />
        <StatCard icon={AlertTriangle} label="Contas em atraso" value={String(stats.contasAtrasadas)} />
      </div>

      <div className="mt-4 rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
        <div className="text-[14.5px] font-semibold text-white">Receitas x despesas</div>
        <div className="mb-3.5 mt-0.5 text-xs text-slate-dim">Últimos 6 meses</div>
        {hasFluxo ? (
          <FluxoCaixaChart data={receitasDespesas} />
        ) : (
          <EmptyState
            icon={BarChart3}
            title="Sem dados financeiros"
            description="Assim que houver contas pagas, o gráfico aparece aqui."
          />
        )}
      </div>
    </div>
  );
}
