import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ComingSoonProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function ComingSoon({ icon: Icon, title, description }: ComingSoonProps) {
  return (
    <div className="flex h-[65vh] flex-col items-center justify-center text-center">
      <div className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/20 bg-accent/[0.08]">
        <Icon className="h-6 w-6 text-accent" />
      </div>
      <h2 className="mb-1.5 font-display text-[19px]">{title}</h2>
      <p className="max-w-[340px] text-[13.5px] text-slate">{description}</p>
      <Button variant="outline" className="mt-6" disabled>
        Em breve
      </Button>
    </div>
  );
}
