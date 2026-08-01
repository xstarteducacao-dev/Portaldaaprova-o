import { createClient } from "@/lib/supabase/server";
import { SistemasList } from "@/components/sistemas/sistemas-list";

export const dynamic = "force-dynamic";

export default async function SistemasPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: sistemas, error: sistemasError },
    { data: chamados, error: chamadosError },
    { data: empresas },
    { data: profiles },
    { data: currentProfile },
  ] = await Promise.all([
    supabase.from("sistemas").select("*").order("created_at", { ascending: false }),
    supabase.from("chamados").select("*").order("created_at", { ascending: false }),
    supabase.from("empresas").select("id, nome").order("nome"),
    supabase.from("profiles").select("id, nome").order("nome"),
    user
      ? supabase.from("profiles").select("id, nome").eq("id", user.id).maybeSingle()
      : Promise.resolve({ data: null }),
  ]);

  if (sistemasError) {
    console.error("Erro ao carregar sistemas", sistemasError.message);
  }
  if (chamadosError) {
    console.error("Erro ao carregar chamados", chamadosError.message);
  }

  return (
    <SistemasList
      initialSistemas={sistemas ?? []}
      initialChamados={chamados ?? []}
      empresas={empresas ?? []}
      profiles={profiles ?? []}
      currentUser={{
        id: currentProfile?.id ?? user?.id ?? "",
        nome: currentProfile?.nome ?? user?.email ?? "Usuário",
      }}
    />
  );
}
