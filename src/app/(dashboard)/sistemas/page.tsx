import { Server } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function SistemasPage() {
  return (
    <ComingSoon
      icon={Server}
      title="Sistemas"
      description="Sistemas desenvolvidos e em manutenção."
    />
  );
}
