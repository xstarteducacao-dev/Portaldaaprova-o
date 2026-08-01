import { Settings } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ConfiguracoesPage() {
  return (
    <ComingSoon
      icon={Settings}
      title="Configurações"
      description="Dados gerais da empresa e integrações."
    />
  );
}
