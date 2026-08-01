import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition-colors",
  {
    variants: {
      variant: {
        default: "bg-white/[0.06] text-slate",
        blue: "bg-royal/[0.14] text-[#8aa6ff]",
        green: "bg-green-400/[0.12] text-green-400",
        amber: "bg-amber-400/[0.12] text-amber-400",
        red: "bg-red-400/[0.12] text-red-400",
        neon: "bg-accent/10 text-accent border border-accent/25",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
