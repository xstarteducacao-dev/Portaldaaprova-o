"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "./nav-items";
import { logoutAction } from "@/lib/actions/auth";

const STORAGE_KEY = "hubtech:sidebar-collapsed";

export function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  });
  function toggle() {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      return next;
    });
  }

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <aside
      className={cn(
        "sticky top-0 z-20 hidden h-screen flex-shrink-0 flex-col border-r border-white/[0.08] bg-card-2 transition-[width] duration-200 md:flex",
        collapsed ? "w-[76px]" : "w-[232px]"
      )}
    >
      <div className="border-b border-white/[0.08] p-[18px]">
        <div className={cn("flex items-center gap-2.5", collapsed && "justify-center")}>
          <div className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-lg bg-bg font-display text-sm font-bold text-accent">
            H
          </div>
          {!collapsed && <span className="font-display text-[17px] font-bold">Hubtech</span>}
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto p-2.5">
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-[10px] border border-transparent px-3 py-2.5 text-[13.5px] font-medium text-slate transition-colors hover:text-white",
                collapsed && "justify-center px-2",
                active && "border-accent/25 bg-royal/[0.14] font-semibold text-white"
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon size={17} className={cn("flex-shrink-0", active && "text-accent")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-0.5 border-t border-white/[0.08] p-2.5">
        <button
          onClick={toggle}
          className={cn(
            "flex items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-slate hover:text-white",
            collapsed && "justify-center px-2"
          )}
        >
          <ChevronLeft size={17} className={cn("flex-shrink-0 transition-transform", collapsed && "rotate-180")} />
          {!collapsed && <span>Recolher</span>}
        </button>
        <form action={logoutAction}>
          <button
            type="submit"
            className={cn(
              "flex w-full items-center gap-3 rounded-[10px] px-3 py-2.5 text-[13.5px] font-medium text-red-400 hover:bg-red-400/10",
              collapsed && "justify-center px-2"
            )}
          >
            <LogOut size={17} className="flex-shrink-0" />
            {!collapsed && <span>Sair</span>}
          </button>
        </form>
      </div>
    </aside>
  );
}
