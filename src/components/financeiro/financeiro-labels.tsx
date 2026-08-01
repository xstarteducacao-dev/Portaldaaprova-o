import { Badge } from "@/components/ui/badge";
import type { FormaPagamento, StatusConta } from "@/types/database.types";

export const STATUS_CONTA_LABELS: Record<StatusConta, string> = {
  em_aberto: "Em aberto",
  pago: "Pago",
  atrasado: "Atrasado",
};

export const FORMA_PAGAMENTO_LABELS: Record<FormaPagamento, string> = {
  pix: "Pix",
  boleto: "Boleto",
  cartao: "Cartão",
  dinheiro: "Dinheiro",
};

const STATUS_VARIANT: Record<StatusConta, "neon" | "green" | "red"> = {
  em_aberto: "neon",
  pago: "green",
  atrasado: "red",
};

export function effectiveStatus(status: StatusConta, vencimento: string): StatusConta {
  if (status === "em_aberto") {
    const today = new Date().toISOString().slice(0, 10);
    if (vencimento < today) return "atrasado";
  }
  return status;
}

export function StatusContaBadge({ status }: { status: StatusConta }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_CONTA_LABELS[status]}</Badge>;
}
