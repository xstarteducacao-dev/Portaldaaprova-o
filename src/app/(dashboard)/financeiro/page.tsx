import { Wallet } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function FinanceiroPage() {
  return (
    <ComingSoon
      icon={Wallet}
      title="Financeiro"
      description="Receitas, despesas, fluxo de caixa e contas."
    />
  );
}
