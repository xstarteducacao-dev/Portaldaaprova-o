import { UserCog } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function UsuariosPage() {
  return (
    <ComingSoon
      icon={UserCog}
      title="Usuários"
      description="Equipe com acesso ao painel e permissões por perfil."
    />
  );
}
