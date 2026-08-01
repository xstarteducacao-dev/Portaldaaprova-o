"use client";

import { useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { toast } from "sonner";
import { UsuarioFormDialog } from "./usuario-form-dialog";
import { ConvidarUsuarioDialog } from "./convidar-usuario-dialog";
import { PerfilBadge, PERFIL_LABELS } from "./usuario-labels";
import type { Database, PerfilUsuario } from "@/types/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];

function initials(nome: string) {
  const parts = nome.trim().split(/\s+/);
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase() || "U";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR");
}

export function UsuariosList({ initialProfiles }: { initialProfiles: Profile[] }) {
  const [profiles, setProfiles] = useState<Profile[]>(initialProfiles);
  const [search, setSearch] = useState("");
  const [perfilFiltro, setPerfilFiltro] = useState<string>("todos");
  const [editTarget, setEditTarget] = useState<Profile | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Profile | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return profiles.filter((p) => {
      const matchesTerm =
        !term || p.nome.toLowerCase().includes(term) || p.email.toLowerCase().includes(term);
      const matchesPerfil = perfilFiltro === "todos" || p.perfil === perfilFiltro;
      return matchesTerm && matchesPerfil;
    });
  }, [profiles, search, perfilFiltro]);

  function handleSaved(profile: Profile) {
    setProfiles((prev) => prev.map((p) => (p.id === profile.id ? profile : p)));
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    const res = await fetch(`/api/usuarios/${deleteTarget.id}`, { method: "DELETE" });
    if (!res.ok) {
      const result = await res.json().catch(() => ({}));
      toast.error("Não foi possível remover o usuário", { description: result.error });
      return;
    }
    toast.success("Usuário removido");
    setProfiles((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    setDeleteTarget(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white">Usuários</h1>
          <p className="mt-1 text-[13.5px] text-slate">Equipe com acesso ao painel e permissões por perfil.</p>
        </div>
        <Button size="sm" onClick={() => setInviteOpen(true)}>
          <Plus size={15} />
          Convidar usuário
        </Button>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-dim" />
          <Input
            placeholder="Buscar por nome ou e-mail"
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={perfilFiltro} onValueChange={setPerfilFiltro}>
          <SelectTrigger className="w-full sm:w-[220px]">
            <SelectValue placeholder="Perfil" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os perfis</SelectItem>
            {Object.entries(PERFIL_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UserCog}
          title={profiles.length === 0 ? "Nenhum usuário cadastrado" : "Nenhum resultado"}
          description={
            profiles.length === 0
              ? "Nenhum perfil de usuário encontrado."
              : "Ajuste a busca ou o filtro para ver outros usuários."
          }
          className="mt-5"
        />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11.5px] uppercase tracking-wide text-slate-dim">
                <th className="px-5 py-3 font-medium">Usuário</th>
                <th className="px-5 py-3 font-medium">Telefone</th>
                <th className="px-5 py-3 font-medium">Perfil</th>
                <th className="px-5 py-3 font-medium">Desde</th>
                <th className="px-5 py-3 font-medium text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((profile) => (
                <tr
                  key={profile.id}
                  className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(profile.nome)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-white">{profile.nome}</div>
                        <div className="text-[12px] text-slate-dim">{profile.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-slate">{profile.telefone || "—"}</td>
                  <td className="px-5 py-3.5">
                    <PerfilBadge perfil={profile.perfil as PerfilUsuario} />
                  </td>
                  <td className="px-5 py-3.5 text-slate">{formatDate(profile.created_at)}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        aria-label="Editar usuário"
                        className="rounded-lg p-1.5 text-slate hover:bg-white/[0.06] hover:text-white"
                        onClick={() => {
                          setEditTarget(profile);
                          setDialogOpen(true);
                        }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        aria-label="Remover usuário"
                        className="rounded-lg p-1.5 text-slate hover:bg-red-400/10 hover:text-red-400"
                        onClick={() => setDeleteTarget(profile)}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <UsuarioFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        profile={editTarget}
        onSaved={handleSaved}
      />
      <ConvidarUsuarioDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Remover usuário"
        description={`Isso remove permanentemente a conta de "${deleteTarget?.nome}", incluindo o acesso de autenticação. Essa ação não pode ser desfeita.`}
        confirmLabel="Remover"
        onConfirm={handleDelete}
      />
    </div>
  );
}
