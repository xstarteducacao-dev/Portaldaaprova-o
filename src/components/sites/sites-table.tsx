"use client";

import { useMemo, useState } from "react";
import { ExternalLink, Globe, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { createClient } from "@/lib/supabase/client";
import { SiteFormDialog } from "./site-form-dialog";
import { SslBadge, StatusSiteBadge } from "./site-labels";
import type { Database } from "@/types/database.types";

type Site = Database["public"]["Tables"]["sites"]["Row"];
type EmpresaOption = { id: string; nome: string };

export function SitesTable({
  initialSites,
  empresas,
}: {
  initialSites: Site[];
  empresas: EmpresaOption[];
}) {
  const [sites, setSites] = useState<Site[]>(initialSites);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Site | null>(null);
  const [siteToDelete, setSiteToDelete] = useState<Site | null>(null);

  const empresaNome = useMemo(() => {
    const map = new Map(empresas.map((e) => [e.id, e.nome]));
    return (id: string | null) => (id ? map.get(id) ?? "—" : "—");
  }, [empresas]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sites;
    return sites.filter(
      (s) =>
        s.dominio.toLowerCase().includes(term) ||
        empresaNome(s.cliente_id).toLowerCase().includes(term)
    );
  }, [sites, search, empresaNome]);

  function handleSaved(site: Site) {
    setSites((prev) => {
      const exists = prev.some((s) => s.id === site.id);
      return exists ? prev.map((s) => (s.id === site.id ? site : s)) : [site, ...prev];
    });
  }

  async function handleDelete() {
    if (!siteToDelete) return;
    const supabase = createClient();
    const { error } = await supabase.from("sites").delete().eq("id", siteToDelete.id);
    if (error) {
      toast.error("Não foi possível excluir o site", { description: error.message });
      return;
    }
    setSites((prev) => prev.filter((s) => s.id !== siteToDelete.id));
    toast.success("Site excluído");
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Sites</h1>
          <p className="mt-1 text-[13.5px] text-slate">Todos os sites cadastrados e sob sua gestão.</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            setEditTarget(null);
            setDialogOpen(true);
          }}
        >
          <Plus size={15} />
          Novo site
        </Button>
      </div>

      <div className="mt-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-dim" />
          <Input
            placeholder="Buscar por domínio ou cliente"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Globe}
          title={sites.length === 0 ? "Nenhum site cadastrado" : "Nenhum resultado"}
          description={
            sites.length === 0
              ? "Cadastre o primeiro site para começar a acompanhar a gestão."
              : "Ajuste a busca para ver outros sites."
          }
          actionLabel={sites.length === 0 ? "Novo site" : undefined}
          onAction={
            sites.length === 0
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
                <th className="px-5 py-3 font-medium">Domínio</th>
                <th className="px-5 py-3 font-medium">Hospedagem</th>
                <th className="px-5 py-3 font-medium">SSL</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Última atualização</th>
                <th className="px-5 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((site) => (
                <tr
                  key={site.id}
                  className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5 font-medium text-white">{empresaNome(site.cliente_id)}</td>
                  <td className="px-5 py-3.5">
                    <a
                      href={`https://${site.dominio}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-slate hover:text-accent"
                    >
                      {site.dominio}
                      <ExternalLink size={12} />
                    </a>
                  </td>
                  <td className="px-5 py-3.5 text-slate">{site.hospedagem || "—"}</td>
                  <td className="px-5 py-3.5">
                    <SslBadge ssl={site.ssl} />
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusSiteBadge status={site.status} />
                  </td>
                  <td className="px-5 py-3.5 text-slate">
                    {site.ultima_atualizacao
                      ? new Date(`${site.ultima_atualizacao}T00:00:00`).toLocaleDateString("pt-BR")
                      : "—"}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          setEditTarget(site);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil size={14} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setSiteToDelete(site)}>
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SiteFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        site={editTarget}
        empresas={empresas}
        onSaved={handleSaved}
      />
      <ConfirmDialog
        open={Boolean(siteToDelete)}
        onOpenChange={(open) => !open && setSiteToDelete(null)}
        title="Excluir site"
        description={`Tem certeza que deseja excluir "${siteToDelete?.dominio}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        onConfirm={handleDelete}
      />
    </div>
  );
}
