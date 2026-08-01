import type { StatusProjeto } from "@/types/database.types";

export interface ProjetoKanbanColumnDef {
  status: StatusProjeto;
  title: string;
  color: string;
}

export const PROJETO_KANBAN_COLUMNS: ProjetoKanbanColumnDef[] = [
  { status: "a_fazer", title: "A fazer", color: "#93a0c2" },
  { status: "em_andamento", title: "Em andamento", color: "#4fd8ff" },
  { status: "em_revisao", title: "Em revisão", color: "#fbbf24" },
  { status: "concluido", title: "Concluído", color: "#4ade80" },
];
