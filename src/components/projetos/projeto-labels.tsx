import { Badge } from "@/components/ui/badge";
import type { PrioridadeProjeto, StatusProjeto, TipoProjeto } from "@/types/database.types";

export const TIPO_LABELS: Record<TipoProjeto, string> = {
  site: "Site",
  landing_page: "Landing page",
  sistema: "Sistema",
  trafego_pago: "Tráfego pago",
  branding: "Branding",
  social_media: "Social media",
  consultoria: "Consultoria",
  seo: "SEO",
  automacao: "Automação",
};

export const STATUS_LABELS: Record<StatusProjeto, string> = {
  a_fazer: "A fazer",
  em_andamento: "Em andamento",
  em_revisao: "Em revisão",
  concluido: "Concluído",
};

export const PRIORIDADE_CONFIG: Record<
  PrioridadeProjeto,
  { label: string; variant: "default" | "blue" | "amber" | "red" }
> = {
  baixa: { label: "Baixa", variant: "default" },
  media: { label: "Média", variant: "blue" },
  alta: { label: "Alta", variant: "amber" },
  urgente: { label: "Urgente", variant: "red" },
};

export function TipoBadge({ tipo }: { tipo: TipoProjeto }) {
  return <Badge variant="neon">{TIPO_LABELS[tipo]}</Badge>;
}

export function PrioridadeBadge({ prioridade }: { prioridade: PrioridadeProjeto }) {
  const config = PRIORIDADE_CONFIG[prioridade];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

export function StatusBadge({ status }: { status: StatusProjeto }) {
  const variant =
    status === "concluido" ? "green" : status === "em_revisao" ? "amber" : status === "em_andamento" ? "blue" : "default";
  return <Badge variant={variant}>{STATUS_LABELS[status]}</Badge>;
}
