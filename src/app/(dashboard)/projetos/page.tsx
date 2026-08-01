import { FolderKanban } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function ProjetosPage() {
  return (
    <ComingSoon
      icon={FolderKanban}
      title="Projetos"
      description="Sites, sistemas, tráfego pago, branding e mais."
    />
  );
}
