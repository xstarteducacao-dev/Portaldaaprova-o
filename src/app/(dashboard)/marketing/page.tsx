import { Megaphone } from "lucide-react";
import { ComingSoon } from "@/components/shared/coming-soon";

export default function MarketingPage() {
  return (
    <ComingSoon
      icon={Megaphone}
      title="Marketing"
      description="Campanhas de tráfego pago, social media, SEO e email marketing."
    />
  );
}
