import type { StatusLead } from "@/types/database.types";

export interface KanbanColumnDef {
  status: StatusLead;
  title: string;
  color: string;
}

export const KANBAN_COLUMNS: KanbanColumnDef[] = [
  { status: "novo", title: "Novo lead", color: "#93a0c2" },
  { status: "contato", title: "Primeiro contato", color: "#4fd8ff" },
  { status: "agendada", title: "Consultoria agendada", color: "#2b52ff" },
  { status: "realizada", title: "Consultoria realizada", color: "#8aa6ff" },
  { status: "proposta", title: "Proposta enviada", color: "#fbbf24" },
  { status: "negociacao", title: "Negociação", color: "#fb923c" },
  { status: "cliente", title: "Cliente", color: "#4ade80" },
  { status: "perdido", title: "Perdido", color: "#f87171" },
];
