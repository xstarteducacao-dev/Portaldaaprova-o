import { Badge } from "@/components/ui/badge";
import type { SslStatus, StatusSite } from "@/types/database.types";

export const SSL_LABELS: Record<SslStatus, string> = {
  ativo: "Ativo",
  pendente: "Pendente",
  expirado: "Expirado",
};

export const STATUS_SITE_LABELS: Record<StatusSite, string> = {
  online: "Online",
  manutencao: "Manutenção",
  offline: "Offline",
};

const SSL_VARIANT: Record<SslStatus, "green" | "amber" | "red"> = {
  ativo: "green",
  pendente: "amber",
  expirado: "red",
};

const STATUS_VARIANT: Record<StatusSite, "green" | "amber" | "red"> = {
  online: "green",
  manutencao: "amber",
  offline: "red",
};

export function SslBadge({ ssl }: { ssl: SslStatus }) {
  return <Badge variant={SSL_VARIANT[ssl]}>{SSL_LABELS[ssl]}</Badge>;
}

export function StatusSiteBadge({ status }: { status: StatusSite }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_SITE_LABELS[status]}</Badge>;
}
