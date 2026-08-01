"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PRIORIDADE_CONFIG } from "./projeto-labels";
import type { EmpresaOption, Projeto } from "./types";

const WEEKDAYS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const PRIORIDADE_DOT: Record<string, string> = {
  baixa: "bg-slate",
  media: "bg-accent",
  alta: "bg-amber-400",
  urgente: "bg-red-400",
};

function toDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export function ProjetoCalendarioView({
  projetos,
  empresas,
  onProjetoClick,
}: {
  projetos: Projeto[];
  empresas: EmpresaOption[];
  onProjetoClick: (projeto: Projeto) => void;
}) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<string | null>(null);

  const empresaMap = useMemo(() => new Map(empresas.map((e) => [e.id, e.nome])), [empresas]);

  const byDay = useMemo(() => {
    const map = new Map<string, Projeto[]>();
    for (const p of projetos) {
      if (!p.prazo) continue;
      const list = map.get(p.prazo) ?? [];
      list.push(p);
      map.set(p.prazo, list);
    }
    return map;
  }, [projetos]);

  const projetosNoMes = useMemo(
    () =>
      projetos.filter(
        (p) => p.prazo && p.prazo.startsWith(`${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`)
      ),
    [projetos, cursor]
  );

  // Grid: leading blanks for the weekday offset of day 1, then one cell per day of the month.
  const firstWeekday = new Date(cursor.getFullYear(), cursor.getMonth(), 1).getDay();
  const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: firstWeekday }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(cursor.getFullYear(), cursor.getMonth(), i + 1)),
  ];

  const todayKey = toDateKey(new Date());
  const selectedList = selectedDay ? byDay.get(selectedDay) ?? [] : [];

  return (
    <div className="mt-5">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-display text-[16px] font-semibold text-white">
          {MONTHS[cursor.getMonth()]} {cursor.getFullYear()}
        </h2>
        <div className="flex items-center gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
              setSelectedDay(null);
            }}
          >
            <ChevronLeft size={15} />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
              setSelectedDay(null);
            }}
          >
            <ChevronRight size={15} />
          </Button>
        </div>
      </div>

      {projetosNoMes.length === 0 && (
        <p className="mb-3 text-[12.5px] text-slate-dim">Nenhum projeto com prazo neste mês.</p>
      )}

      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-card">
        <div className="grid grid-cols-7 border-b border-white/[0.08] text-center text-[11px] uppercase tracking-wide text-slate-dim">
          {WEEKDAYS.map((d) => (
            <div key={d} className="py-2.5">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {cells.map((date, i) => {
            if (!date) return <div key={`blank-${i}`} className="min-h-[92px] border-b border-r border-white/[0.05]" />;
            const key = toDateKey(date);
            const dayProjetos = byDay.get(key) ?? [];
            const isToday = key === todayKey;
            const isSelected = key === selectedDay;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setSelectedDay(dayProjetos.length > 0 ? key : null)}
                className={cn(
                  "min-h-[92px] border-b border-r border-white/[0.05] p-1.5 text-left align-top last:border-r-0",
                  isSelected && "bg-accent/[0.06]"
                )}
              >
                <span
                  className={cn(
                    "mb-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px]",
                    isToday ? "bg-accent font-bold text-[#04101f]" : "text-slate"
                  )}
                >
                  {date.getDate()}
                </span>
                <div className="space-y-1">
                  {dayProjetos.slice(0, 2).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-1 truncate rounded-full bg-white/[0.06] px-1.5 py-0.5 text-[10px] text-white"
                    >
                      <span className={cn("h-1.5 w-1.5 flex-shrink-0 rounded-full", PRIORIDADE_DOT[p.prioridade])} />
                      <span className="truncate">{p.nome}</span>
                    </div>
                  ))}
                  {dayProjetos.length > 2 && (
                    <div className="text-[10px] text-slate-dim">+{dayProjetos.length - 2} mais</div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDay && selectedList.length > 0 && (
        <div className="mt-4 rounded-2xl border border-white/[0.08] bg-card p-4">
          <div className="mb-3 text-[12.5px] font-semibold text-white">
            Projetos em {new Date(`${selectedDay}T00:00:00`).toLocaleDateString("pt-BR")}
          </div>
          <div className="space-y-2">
            {selectedList.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onProjetoClick(p)}
                className="flex w-full items-center justify-between rounded-xl border border-white/[0.08] bg-white/[0.02] px-3.5 py-2.5 text-left hover:bg-white/[0.04]"
              >
                <div>
                  <div className="text-[13px] font-medium text-white">{p.nome}</div>
                  <div className="text-[11.5px] text-slate-dim">
                    {p.cliente_id ? empresaMap.get(p.cliente_id) ?? "—" : "Sem cliente vinculado"}
                  </div>
                </div>
                <span className={cn("h-2 w-2 rounded-full", PRIORIDADE_DOT[p.prioridade])} title={PRIORIDADE_CONFIG[p.prioridade].label} />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
