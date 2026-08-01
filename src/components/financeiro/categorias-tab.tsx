import { Tags } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import type { Database } from "@/types/database.types";

type Categoria = Database["public"]["Tables"]["categorias_financeiras"]["Row"];

export function CategoriasTab({
  categorias,
  contasPorCategoria,
}: {
  categorias: Categoria[];
  contasPorCategoria: Map<string, number>;
}) {
  if (categorias.length === 0) {
    return (
      <EmptyState
        icon={Tags}
        title="Nenhuma categoria cadastrada"
        description="As categorias financeiras aparecem aqui assim que forem cadastradas no banco de dados."
        className="mt-5"
      />
    );
  }

  const receitas = categorias.filter((c) => c.tipo === "receita");
  const despesas = categorias.filter((c) => c.tipo === "despesa");

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
        <div className="text-[14.5px] font-semibold text-white">Categorias de receita</div>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {receitas.length === 0 ? (
            <p className="text-[12.5px] text-slate">Nenhuma categoria de receita.</p>
          ) : (
            receitas.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-[13px]">
                <span className="text-white">{c.nome}</span>
                <span className="text-slate-dim">{contasPorCategoria.get(c.id) ?? 0} contas</span>
              </div>
            ))
          )}
        </div>
      </div>
      <div className="rounded-2xl border border-white/[0.08] bg-card p-5 px-[22px]">
        <div className="text-[14.5px] font-semibold text-white">Categorias de despesa</div>
        <div className="mt-3.5 flex flex-col gap-2.5">
          {despesas.length === 0 ? (
            <p className="text-[12.5px] text-slate">Nenhuma categoria de despesa.</p>
          ) : (
            despesas.map((c) => (
              <div key={c.id} className="flex items-center justify-between text-[13px]">
                <span className="text-white">{c.nome}</span>
                <span className="text-slate-dim">{contasPorCategoria.get(c.id) ?? 0} contas</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
