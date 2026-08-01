import { createClient } from "@/lib/supabase/server";
import { ProjetosView } from "@/components/projetos/projetos-view";

export const dynamic = "force-dynamic";

export default async function ProjetosPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: projetos, error: projetosError }, { data: empresas }, { data: profiles }, { data: currentProfile }] =
    await Promise.all([
      supabase.from("projetos").select("*").order("created_at", { ascending: false }),
      supabase.from("empresas").select("id, nome").order("nome"),
      supabase.from("profiles").select("id, nome").order("nome"),
      user
        ? supabase.from("profiles").select("id, nome").eq("id", user.id).maybeSingle()
        : Promise.resolve({ data: null }),
    ]);

  if (projetosError) {
    console.error("Erro ao carregar projetos", projetosError.message);
  }

  return (
    <ProjetosView
      initialProjetos={projetos ?? []}
      empresas={empresas ?? []}
      profiles={profiles ?? []}
      currentUser={{
        id: currentProfile?.id ?? user?.id ?? "",
        nome: currentProfile?.nome ?? user?.email ?? "Usuário",
      }}
    />
  );
}
