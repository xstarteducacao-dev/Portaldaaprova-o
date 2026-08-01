import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.08] px-6 py-12 text-center",
        className
      )}
    >
      <div className="mb-4 flex h-[52px] w-[52px] items-center justify-center rounded-2xl border border-accent/20 bg-accent/[0.08]">
        <Icon className="h-[22px] w-[22px] text-accent" />
      </div>
      <h3 className="mb-1.5 font-display text-[16.5px] text-white">{title}</h3>
      {description && (
        <p className="mb-5 max-w-[340px] text-[13px] text-slate">{description}</p>
      )}
      {actionLabel && (
        <Button variant="outline" size="sm" onClick={onAction} disabled={!onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
