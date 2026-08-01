import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, perfil")
    .eq("id", user.id)
    .maybeSingle();

  const nome = profile?.nome ?? user.email ?? "Usuário";
  const perfil = profile?.perfil ?? "consultor";

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={perfil === "administrador"} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar nome={nome} perfil={perfil} />
        <main className="flex-1 overflow-y-auto px-5 py-7 md:px-8">{children}</main>
      </div>
    </div>
  );
}
