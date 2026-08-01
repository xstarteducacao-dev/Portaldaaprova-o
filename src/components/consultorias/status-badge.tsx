import { Badge } from "@/components/ui/badge";
import type { StatusConsultoria } from "@/types/database.types";

const STATUS_CONFIG: Record<StatusConsultoria, { label: string; variant: "blue" | "green" | "red" }> = {
  agendada: { label: "Agendada", variant: "blue" },
  realizada: { label: "Realizada", variant: "green" },
  cancelada: { label: "Cancelada", variant: "red" },
};

export function ConsultoriaStatusBadge({ status }: { status: StatusConsultoria }) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
