import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  Building2,
  FolderKanban,
  Megaphone,
  Globe,
  Server,
  Wallet,
  FileBarChart,
  UserCog,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  adminOnly?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "CRM", href: "/crm", icon: Users },
  { label: "Consultorias", href: "/consultorias", icon: CalendarCheck },
  { label: "Empresas", href: "/empresas", icon: Building2 },
  { label: "Projetos", href: "/projetos", icon: FolderKanban },
  { label: "Marketing", href: "/marketing", icon: Megaphone },
  { label: "Sites", href: "/sites", icon: Globe },
  { label: "Sistemas", href: "/sistemas", icon: Server },
  { label: "Financeiro", href: "/financeiro", icon: Wallet },
  { label: "Relatórios", href: "/relatorios", icon: FileBarChart },
  { label: "Usuários", href: "/usuarios", icon: UserCog, adminOnly: true },
  { label: "Configurações", href: "/configuracoes", icon: Settings },
];
