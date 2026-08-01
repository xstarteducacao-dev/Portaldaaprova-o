import { Badge } from "@/components/ui/badge";
import type { StatusCampanha, TipoCampanha } from "@/types/database.types";

export const TIPO_LABELS: Record<TipoCampanha, string> = {
  google_ads: "Google Ads",
  meta_ads: "Meta Ads",
  landing_pages: "Landing pages",
  social_media: "Social media",
  seo: "SEO",
  email_marketing: "Email marketing",
};

export const STATUS_LABELS: Record<StatusCampanha, string> = {
  planejamento: "Planejamento",
  ativa: "Ativa",
  pausada: "Pausada",
  concluida: "Concluída",
};

const STATUS_VARIANT: Record<StatusCampanha, "default" | "green" | "amber" | "blue"> = {
  planejamento: "blue",
  ativa: "green",
  pausada: "amber",
  concluida: "default",
};

export function TipoCampanhaBadge({ tipo }: { tipo: TipoCampanha }) {
  return <Badge variant="neon">{TIPO_LABELS[tipo]}</Badge>;
}

export function StatusCampanhaBadge({ status }: { status: StatusCampanha }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABELS[status]}</Badge>;
}
