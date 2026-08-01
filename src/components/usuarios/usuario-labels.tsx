import { Badge } from "@/components/ui/badge";
import type { PerfilUsuario } from "@/types/database.types";

export const PERFIL_LABELS: Record<PerfilUsuario, string> = {
  administrador: "Administrador",
  gerente: "Gerente",
  consultor: "Consultor",
  comercial: "Comercial",
  financeiro: "Financeiro",
  marketing: "Marketing",
  desenvolvedor: "Desenvolvedor",
};

const PERFIL_VARIANT: Record<PerfilUsuario, "red" | "blue" | "green" | "amber" | "neon" | "default"> = {
  administrador: "red",
  gerente: "blue",
  consultor: "green",
  comercial: "amber",
  financeiro: "neon",
  marketing: "blue",
  desenvolvedor: "default",
};

export function PerfilBadge({ perfil }: { perfil: PerfilUsuario }) {
  return <Badge variant={PERFIL_VARIANT[perfil]}>{PERFIL_LABELS[perfil]}</Badge>;
}
