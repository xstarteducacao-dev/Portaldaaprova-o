import { Badge } from "@/components/ui/badge";
import type { PrioridadeChamado, StatusChamado, StatusSistema } from "@/types/database.types";

export const STATUS_SISTEMA_LABELS: Record<StatusSistema, string> = {
  producao: "Produção",
  desenvolvimento: "Desenvolvimento",
  descontinuado: "Descontinuado",
};

const STATUS_SISTEMA_VARIANT: Record<StatusSistema, "green" | "blue" | "default"> = {
  producao: "green",
  desenvolvimento: "blue",
  descontinuado: "default",
};

export function StatusSistemaBadge({ status }: { status: StatusSistema }) {
  return <Badge variant={STATUS_SISTEMA_VARIANT[status]}>{STATUS_SISTEMA_LABELS[status]}</Badge>;
}

export const PRIORIDADE_CHAMADO_LABELS: Record<PrioridadeChamado, string> = {
  baixa: "Baixa",
  media: "Média",
  alta: "Alta",
  urgente: "Urgente",
};

const PRIORIDADE_CHAMADO_VARIANT: Record<PrioridadeChamado, "default" | "blue" | "amber" | "red"> = {
  baixa: "default",
  media: "blue",
  alta: "amber",
  urgente: "red",
};

export function PrioridadeChamadoBadge({ prioridade }: { prioridade: PrioridadeChamado }) {
  return <Badge variant={PRIORIDADE_CHAMADO_VARIANT[prioridade]}>{PRIORIDADE_CHAMADO_LABELS[prioridade]}</Badge>;
}

export const STATUS_CHAMADO_LABELS: Record<StatusChamado, string> = {
  aberto: "Aberto",
  em_andamento: "Em andamento",
  resolvido: "Resolvido",
  fechado: "Fechado",
};

const STATUS_CHAMADO_VARIANT: Record<StatusChamado, "blue" | "amber" | "green" | "default"> = {
  aberto: "blue",
  em_andamento: "amber",
  resolvido: "green",
  fechado: "default",
};

export function StatusChamadoBadge({ status }: { status: StatusChamado }) {
  return <Badge variant={STATUS_CHAMADO_VARIANT[status]}>{STATUS_CHAMADO_LABELS[status]}</Badge>;
}
