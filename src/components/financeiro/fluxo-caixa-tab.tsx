import { BarChart3 } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { FluxoCaixaChart } from "./fluxo-caixa-chart";
import type { FluxoCaixaPonto } from "@/lib/financeiro-data";

const currency = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

export function FluxoCaixaTab({ fluxo }: { fluxo: FluxoCaixaPonto[] }) {
  const hasFluxo = fluxo.some((p) => p.entradas > 0 || p.saidas > 0);

  return (
    <div>
      <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
        <div className="text-[14.5px] font-semibold text-white">Fluxo de caixa</div>
        <div className="mb-3.5 mt-0.5 text-xs text-slate-dim">Últimos 12 meses</div>
        {hasFluxo ? (
          <FluxoCaixaChart data={fluxo} />
        ) : (
          <EmptyState
            icon={BarChart3}
            title="Sem movimentações"
            description="O fluxo de caixa aparece assim que houver contas pagas."
          />
        )}
      </div>

      {hasFluxo && (
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11.5px] uppercase tracking-wide text-slate-dim">
                <th className="px-5 py-3 font-medium">Mês</th>
                <th className="px-5 py-3 font-medium">Entradas</th>
                <th className="px-5 py-3 font-medium">Saídas</th>
                <th className="px-5 py-3 font-medium">Saldo acumulado</th>
              </tr>
            </thead>
            <tbody>
              {fluxo.map((p) => (
                <tr
                  key={p.label}
                  className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5 font-medium text-white">{p.label}</td>
                  <td className="px-5 py-3.5 text-green-400">{currency.format(p.entradas)}</td>
                  <td className="px-5 py-3.5 text-red-400">{currency.format(p.saidas)}</td>
                  <td className="px-5 py-3.5 text-white">{currency.format(p.saldo)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
