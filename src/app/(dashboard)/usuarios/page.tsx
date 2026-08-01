import { createClient } from "@/lib/supabase/server";
import { requireProfile } from "@/lib/auth-guard";
import { AccessDenied } from "@/components/shared/access-denied";
import { UsuariosList } from "@/components/usuarios/usuarios-list";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const { allowed } = await requireProfile(["administrador"]);

  if (!allowed) {
    return (
      <AccessDenied description="Esta página é exclusiva para administradores. Fale com um administrador do painel se precisar de acesso." />
    );
  }

  const supabase = await createClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  return <UsuariosList initialProfiles={profiles ?? []} />;
}
