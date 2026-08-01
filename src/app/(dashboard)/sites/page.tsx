import { Globe } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function SitesPage() {
  return (
    <ComingSoon
      icon={Globe}
      title="Sites"
      description="Todos os sites cadastrados e sob sua gestão."
    />
  );
}
