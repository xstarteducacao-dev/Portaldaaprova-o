import { FileBarChart } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function RelatoriosPage() {
  return (
    <ComingSoon
      icon={FileBarChart}
      title="Relatórios"
      description="Exporte dados de receitas, clientes, consultorias, projetos e marketing."
    />
  );
}
