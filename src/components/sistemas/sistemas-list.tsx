"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Plus, Search, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { SistemaFormDialog } from "./sistema-form-dialog";
import { SistemaDetailSheet } from "./sistema-detail-sheet";
import { StatusSistemaBadge } from "./sistema-labels";
import type { Database } from "@/types/database.types";

type Sistema = Database["public"]["Tables"]["sistemas"]["Row"];
type Chamado = Database["public"]["Tables"]["chamados"]["Row"];
type EmpresaOption = { id: string; nome: string };
type ProfileOption = { id: string; nome: string };

export function SistemasList({
  initialSistemas,
  initialChamados,
  empresas,
  profiles,
  currentUser,
}: {
  initialSistemas: Sistema[];
  initialChamados: Chamado[];
  empresas: EmpresaOption[];
  profiles: ProfileOption[];
  currentUser: { id: string; nome: string };
}) {
  const [sistemas, setSistemas] = useState<Sistema[]>(initialSistemas);
  const [chamados, setChamados] = useState<Chamado[]>(initialChamados);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Sistema | null>(null);
  const [detailTarget, setDetailTarget] = useState<Sistema | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const empresaNome = useMemo(() => {
    const map = new Map(empresas.map((e) => [e.id, e.nome]));
    return (id: string | null) => (id ? map.get(id) ?? "—" : "—");
  }, [empresas]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sistemas;
    return sistemas.filter(
      (s) =>
        s.sistema.toLowerCase().includes(term) || empresaNome(s.cliente_id).toLowerCase().includes(term)
    );
  }, [sistemas, search, empresaNome]);

  function handleSaved(sistema: Sistema) {
    setSistemas((prev) => {
      const exists = prev.some((s) => s.id === sistema.id);
      return exists ? prev.map((s) => (s.id === sistema.id ? sistema : s)) : [sistema, ...prev];
    });
    if (detailTarget?.id === sistema.id) setDetailTarget(sistema);
  }

  function handleDeleted(id: string) {
    setSistemas((prev) => prev.filter((s) => s.id !== id));
  }

  function openDetail(sistema: Sistema) {
    setDetailTarget(sistema);
    setSheetOpen(true);
  }

  function openEdit(sistema: Sistema) {
    setEditTarget(sistema);
    setDialogOpen(true);
  }

  async function refreshChamados(sistemaId: string, updated: Chamado[]) {
    setChamados((prev) => [...updated.filter((c) => c.sistema_id === sistemaId), ...prev.filter((c) => c.sistema_id !== sistemaId)]);
  }

  const detailChamados = detailTarget
    ? chamados.filter((c) => c.sistema_id === detailTarget.id)
    : [];

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Sistemas</h1>
          <p className="mt-1 text-[13.5px] text-slate">Sistemas desenvolvidos e em manutenção.</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditTarget(null);
            setDialogOpen(true);
          }}
        >
          <Plus size={15} />
          Novo sistema
        </Button>
      </div>

      <div className="mt-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-dim" />
          <Input
            placeholder="Buscar por sistema ou cliente"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Server}
          title={sistemas.length === 0 ? "Nenhum sistema cadastrado" : "Nenhum resultado"}
          description={
            sistemas.length === 0
              ? "Cadastre o primeiro sistema para começar a acompanhar chamados."
              : "Ajuste a busca para ver outros sistemas."
          }
          actionLabel={sistemas.length === 0 ? "Novo sistema" : undefined}
          onAction={
            sistemas.length === 0
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
                <th className="px-5 py-3 font-medium">Cliente</th>
                <th className="px-5 py-3 font-medium">Sistema</th>
                <th className="px-5 py-3 font-medium">Versão</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Documentação</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sistema) => (
                <tr
                  key={sistema.id}
                  className="cursor-pointer border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                  onClick={() => openDetail(sistema)}
                >
                  <td className="px-5 py-3.5 font-medium text-white">{empresaNome(sistema.cliente_id)}</td>
                  <td className="px-5 py-3.5 text-slate">{sistema.sistema}</td>
                  <td className="px-5 py-3.5 text-slate">{sistema.versao || "—"}</td>
                  <td className="px-5 py-3.5">
                    <StatusSistemaBadge status={sistema.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    {sistema.documentacao_url ? (
                      <a
                        href={sistema.documentacao_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-accent hover:underline"
                      >
                        Acessar
                        <ExternalLink size={12} />
                      </a>
                    ) : (
                      <span className="text-slate-dim">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SistemaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        sistema={editTarget}
        empresas={empresas}
        onSaved={handleSaved}
      />
      <SistemaDetailSheet
        sistema={detailTarget}
        chamados={detailChamados}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        empresas={empresas}
        profiles={profiles}
        currentUser={currentUser}
        onDeleted={handleDeleted}
        onEdit={() => {
          if (detailTarget) {
            setSheetOpen(false);
            openEdit(detailTarget);
          }
        }}
        onChamadosChanged={(updated) => {
          if (detailTarget) refreshChamados(detailTarget.id, updated);
        }}
      />
    </div>
  );
}
