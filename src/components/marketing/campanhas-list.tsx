"use client";

import { useMemo, useState } from "react";
import { Eye, Megaphone, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { CampanhaFormDialog } from "./campanha-form-dialog";
import { CampanhaDetailSheet } from "./campanha-detail-sheet";
import { StatusCampanhaBadge, TIPO_LABELS, TipoCampanhaBadge } from "./campanha-labels";
import type { Database } from "@/types/database.types";

type Campanha = Database["public"]["Tables"]["campanhas"]["Row"];
type EmpresaOption = { id: string; nome: string };

export function CampanhasList({
  initialCampanhas,
  empresas,
}: {
  initialCampanhas: Campanha[];
  empresas: EmpresaOption[];
}) {
  const [campanhas, setCampanhas] = useState<Campanha[]>(initialCampanhas);
  const [search, setSearch] = useState("");
  const [cliente, setCliente] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Campanha | null>(null);
  const [detailTarget, setDetailTarget] = useState<Campanha | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const empresaNome = useMemo(() => {
    const map = new Map(empresas.map((e) => [e.id, e.nome]));
    return (id: string | null) => (id ? map.get(id) ?? "—" : "—");
  }, [empresas]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return campanhas.filter((c) => {
      const matchesTerm = !term || c.nome.toLowerCase().includes(term);
      const matchesCliente = cliente === "todos" || c.cliente_id === cliente;
      const matchesTipo = tipo === "todos" || c.tipo === tipo;
      return matchesTerm && matchesCliente && matchesTipo;
    });
  }, [campanhas, search, cliente, tipo]);

  function handleCreated(c: Campanha) {
    setCampanhas((prev) => [c, ...prev]);
  }

  function handleUpdated(c: Campanha) {
    setCampanhas((prev) => prev.map((item) => (item.id === c.id ? c : item)));
    setDetailTarget(c);
  }

  function handleDeleted(id: string) {
    setCampanhas((prev) => prev.filter((c) => c.id !== id));
  }

  function openDetail(c: Campanha) {
    setDetailTarget(c);
    setSheetOpen(true);
  }

  function openEdit(c: Campanha) {
    setEditTarget(c);
    setDialogOpen(true);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Marketing</h1>
          <p className="mt-1 text-[13.5px] text-slate">
            Campanhas de tráfego pago, social media, SEO e email marketing.
          </p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditTarget(null);
            setDialogOpen(true);
          }}
        >
          <Plus size={15} />
          Nova campanha
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-dim" />
          <Input
            placeholder="Buscar por nome da campanha"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={cliente} onValueChange={setCliente}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os clientes</SelectItem>
            {empresas.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {Object.entries(TIPO_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title={campanhas.length === 0 ? "Nenhuma campanha cadastrada" : "Nenhum resultado"}
          description={
            campanhas.length === 0
              ? "Cadastre a primeira campanha para começar a acompanhar os resultados."
              : "Ajuste a busca ou os filtros."
          }
          actionLabel={campanhas.length === 0 ? "Nova campanha" : undefined}
          onAction={
            campanhas.length === 0
              ? () => {
                  setEditTarget(null);
                  setDialogOpen(true);
                }
              : undefined
          }
          className="mt-5"
        />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11.5px] uppercase tracking-wide text-slate-dim">
                <th className="px-5 py-3 font-medium">Campanha</th>
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Tipo</th>
                <th className="px-5 py-3 font-medium">Investimento</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr
                  key={c.id}
                  className="cursor-pointer border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                  onClick={() => openDetail(c)}
                >
                  <td className="px-5 py-3.5 font-medium text-white">{c.nome}</td>
                  <td className="px-5 py-3.5 text-slate">{empresaNome(c.cliente_id)}</td>
                  <td className="px-5 py-3.5">
                    <TipoCampanhaBadge tipo={c.tipo} />
                  </td>
                  <td className="px-5 py-3.5 text-slate">
                    {c.investimento.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusCampanhaBadge status={c.status} />
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDetail(c);
                      }}
                    >
                      <Eye size={15} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CampanhaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        campanha={editTarget}
        empresas={empresas}
        onSaved={(c) => {
          if (editTarget) {
            handleUpdated(c);
          } else {
            handleCreated(c);
          }
        }}
      />
      <CampanhaDetailSheet
        campanha={detailTarget}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        empresas={empresas}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
        onEdit={() => {
          if (detailTarget) {
            setSheetOpen(false);
            openEdit(detailTarget);
          }
        }}
      />
    </div>
  );
}
