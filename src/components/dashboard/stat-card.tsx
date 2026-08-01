import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
}

export function StatCard({ icon: Icon, label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/[0.08] bg-card p-[18px] px-5">
      <div className="mb-3.5 flex items-start justify-between">
        <div className="flex h-[34px] w-[34px] items-center justify-center rounded-[9px] border border-accent/25 bg-accent/10">
          <Icon size={16} className="text-accent" />
        </div>
      </div>
      <div className="mb-1 font-display text-[22px] font-bold text-white">{value}</div>
      <div className="text-[12.5px] text-slate">{label}</div>
    </div>
  );
}
