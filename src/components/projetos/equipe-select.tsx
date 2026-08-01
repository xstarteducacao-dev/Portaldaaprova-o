"use client";

import { ChevronDown, Users } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProfileOption } from "./types";

export function EquipeSelect({
  profiles,
  value,
  onChange,
}: {
  profiles: ProfileOption[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  function toggle(id: string) {
    onChange(value.includes(id) ? value.filter((v) => v !== id) : [...value, id]);
  }

  const label =
    value.length === 0
      ? "Selecionar membros"
      : `${value.length} membro${value.length > 1 ? "s" : ""} selecionado${value.length > 1 ? "s" : ""}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-10 w-full items-center justify-between rounded-[9px] border border-white/10 bg-white/[0.04] px-3 py-2 text-left text-sm text-white outline-none focus:border-accent/40"
        >
          <span className="flex items-center gap-2 truncate">
            <Users size={14} className="text-slate-dim" />
            {label}
          </span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-72 w-[--radix-dropdown-menu-trigger-width] overflow-y-auto">
        {profiles.length === 0 ? (
          <div className="px-2 py-1.5 text-[12.5px] text-slate-dim">Nenhum usuário disponível</div>
        ) : (
          profiles.map((p) => (
            <DropdownMenuCheckboxItem
              key={p.id}
              checked={value.includes(p.id)}
              onSelect={(e) => e.preventDefault()}
              onCheckedChange={() => toggle(p.id)}
            >
              {p.nome}
            </DropdownMenuCheckboxItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
