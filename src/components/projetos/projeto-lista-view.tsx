"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, FolderKanban } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EmptyState } from "@/components/shared/empty-state";
import { PrioridadeBadge, STATUS_LABELS, StatusBadge, TIPO_LABELS, TipoBadge } from "./projeto-labels";
import { ProgressBar } from "./progress-bar";
import { isOverdue } from "./projeto-card";
import type { EmpresaOption, ProfileOption, Projeto } from "./types";
import { cn } from "@/lib/utils";

type SortKey = "nome" | "cliente" | "tipo" | "status" | "prioridade" | "prazo" | "progresso";

const PRIORIDADE_ORDER = { baixa: 0, media: 1, alta: 2, urgente: 3 };

function SortHeader({
  label,
  sortField,
  sortKey,
  sortAsc,
  onToggle,
}: {
  label: string;
  sortField: SortKey;
  sortKey: SortKey;
  sortAsc: boolean;
  onToggle: (field: SortKey) => void;
}) {
  const active = sortKey === sortField;
  return (
    <th
      className="cursor-pointer select-none px-5 py-3 font-medium hover:text-white"
      onClick={() => onToggle(sortField)}
    >
      <div className="flex items-center gap-1">
        {label}
        {active && (sortAsc ? <ArrowUp size={11} /> : <ArrowDown size={11} />)}
      </div>
    </th>
  );
}

export function ProjetoListaView({
  projetos,
  empresas,
  profiles,
  onProjetoClick,
}: {
  projetos: Projeto[];
  empresas: EmpresaOption[];
  profiles: ProfileOption[];
  onProjetoClick: (projeto: Projeto) => void;
}) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("todos");
  const [tipo, setTipo] = useState("todos");
  const [prioridade, setPrioridade] = useState("todos");
  const [responsavelId, setResponsavelId] = useState("todos");
  const [sortKey, setSortKey] = useState<SortKey>("prazo");
  const [sortAsc, setSortAsc] = useState(true);

  const empresaMap = useMemo(() => new Map(empresas.map((e) => [e.id, e.nome])), [empresas]);

  const filtered = useMemo(() => {
    return projetos.filter((p) => {
      if (search && !p.nome.toLowerCase().includes(search.toLowerCase())) return false;
      if (status !== "todos" && p.status !== status) return false;
      if (tipo !== "todos" && p.tipo !== tipo) return false;
      if (prioridade !== "todos" && p.prioridade !== prioridade) return false;
      if (responsavelId !== "todos" && p.responsavel_id !== responsavelId) return false;
      return true;
    });
  }, [projetos, search, status, tipo, prioridade, responsavelId]);

  const sorted = useMemo(() => {
    const dir = sortAsc ? 1 : -1;
    return [...filtered].sort((a, b) => {
      switch (sortKey) {
        case "nome":
          return a.nome.localeCompare(b.nome) * dir;
        case "cliente":
          return (empresaMap.get(a.cliente_id ?? "") ?? "").localeCompare(
            empresaMap.get(b.cliente_id ?? "") ?? ""
          ) * dir;
        case "tipo":
          return TIPO_LABELS[a.tipo].localeCompare(TIPO_LABELS[b.tipo]) * dir;
        case "status":
          return STATUS_LABELS[a.status].localeCompare(STATUS_LABELS[b.status]) * dir;
        case "prioridade":
          return (PRIORIDADE_ORDER[a.prioridade] - PRIORIDADE_ORDER[b.prioridade]) * dir;
        case "prazo":
          return ((a.prazo ?? "9999") > (b.prazo ?? "9999") ? 1 : -1) * dir;
        case "progresso":
          return (a.progresso - b.progresso) * dir;
        default:
          return 0;
      }
    });
  }, [filtered, sortKey, sortAsc, empresaMap]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  }

  return (
    <div>
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Buscar por nome..."
          className="w-[220px]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-[170px]">
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
        <Select value={prioridade} onValueChange={setPrioridade}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Prioridade" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas as prioridades</SelectItem>
            <SelectItem value="baixa">Baixa</SelectItem>
            <SelectItem value="media">Média</SelectItem>
            <SelectItem value="alta">Alta</SelectItem>
            <SelectItem value="urgente">Urgente</SelectItem>
          </SelectContent>
        </Select>
        <Select value={responsavelId} onValueChange={setResponsavelId}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Responsável" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os responsáveis</SelectItem>
            {profiles.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.nome}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title={projetos.length === 0 ? "Nenhum projeto cadastrado" : "Nenhum resultado"}
          description={
            projetos.length === 0
              ? "Crie o primeiro projeto para começar a acompanhar o andamento."
              : "Ajuste os filtros para ver outros projetos."
          }
          className="mt-5"
        />
      ) : (
        <div className="mt-5 overflow-x-auto rounded-2xl border border-white/[0.08] bg-card">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-white/[0.08] text-[11.5px] uppercase tracking-wide text-slate-dim">
                <SortHeader label="Nome" sortField="nome" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort} />
                <SortHeader label="Cliente" sortField="cliente" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort} />
                <SortHeader label="Tipo" sortField="tipo" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort} />
                <SortHeader label="Status" sortField="status" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort} />
                <SortHeader label="Prioridade" sortField="prioridade" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort} />
                <SortHeader label="Prazo" sortField="prazo" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort} />
                <SortHeader label="Progresso" sortField="progresso" sortKey={sortKey} sortAsc={sortAsc} onToggle={toggleSort} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((p) => {
                const overdue = isOverdue(p);
                return (
                  <tr
                    key={p.id}
                    onClick={() => onProjetoClick(p)}
                    className="cursor-pointer border-b border-white/[0.05] transition-colors last:border-0 hover:bg-white/[0.03]"
                  >
                    <td className="px-5 py-3.5 font-medium text-white">{p.nome}</td>
                    <td className="px-5 py-3.5 text-slate">{empresaMap.get(p.cliente_id ?? "") ?? "—"}</td>
                    <td className="px-5 py-3.5">
                      <TipoBadge tipo={p.tipo} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={p.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <PrioridadeBadge prioridade={p.prioridade} />
                    </td>
                    <td className={cn("px-5 py-3.5", overdue ? "font-semibold text-red-400" : "text-slate")}>
                      {p.prazo ? new Date(`${p.prazo}T00:00:00`).toLocaleDateString("pt-BR") : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <ProgressBar value={p.progresso} className="w-20" />
                        <span className="text-[11px] text-slate-dim">{p.progresso}%</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
