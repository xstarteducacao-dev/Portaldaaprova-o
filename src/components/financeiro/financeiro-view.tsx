"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FinanceiroDashboardTab } from "./financeiro-dashboard-tab";
import { ContasReceberTable } from "./contas-receber-table";
import { ContasPagarTable } from "./contas-pagar-table";
import { FluxoCaixaTab } from "./fluxo-caixa-tab";
import { CategoriasTab } from "./categorias-tab";
import type { FinanceiroStats, FluxoCaixaPonto } from "@/lib/financeiro-data";
import type { Database } from "@/types/database.types";

type ContaReceber = Database["public"]["Tables"]["contas_receber"]["Row"];
type ContaPagar = Database["public"]["Tables"]["contas_pagar"]["Row"];
type Categoria = Database["public"]["Tables"]["categorias_financeiras"]["Row"];
type EmpresaOption = { id: string; nome: string };

type TabKey = "dashboard" | "receber" | "pagar" | "fluxo" | "categorias";

const TABS: { key: TabKey; label: string }[] = [
  { key: "dashboard", label: "Dashboard financeiro" },
  { key: "receber", label: "Contas a receber" },
  { key: "pagar", label: "Contas a pagar" },
  { key: "fluxo", label: "Fluxo de caixa" },
  { key: "categorias", label: "Categorias" },
];

export function FinanceiroView({
  stats,
  fluxo,
  contasReceber,
  contasPagar,
  categorias,
  empresas,
  contasPorCategoria,
}: {
  stats: FinanceiroStats;
  fluxo: FluxoCaixaPonto[];
  contasReceber: ContaReceber[];
  contasPagar: ContaPagar[];
  categorias: Categoria[];
  empresas: EmpresaOption[];
  contasPorCategoria: Map<string, number>;
}) {
  const [tab, setTab] = useState<TabKey>("dashboard");

  return (
    <div>
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Financeiro</h1>
        <p className="mt-1 text-[13.5px] text-slate">Receitas, despesas, fluxo de caixa e contas.</p>
      </div>

      <div className="mt-5 inline-flex flex-wrap gap-1 rounded-[10px] border border-white/[0.08] bg-white/[0.02] p-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-[12.5px] font-medium transition-colors",
              tab === t.key ? "bg-royal text-white" : "text-slate hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">
        {tab === "dashboard" && <FinanceiroDashboardTab stats={stats} fluxo={fluxo} />}
        {tab === "receber" && <ContasReceberTable initialContas={contasReceber} empresas={empresas} />}
        {tab === "pagar" && (
          <ContasPagarTable
            initialContas={contasPagar}
            categorias={categorias.map((c) => ({ id: c.id, nome: c.nome }))}
          />
        )}
        {tab === "fluxo" && <FluxoCaixaTab fluxo={fluxo} />}
        {tab === "categorias" && (
          <CategoriasTab categorias={categorias} contasPorCategoria={contasPorCategoria} />
        )}
      </div>
    </div>
  );
}
