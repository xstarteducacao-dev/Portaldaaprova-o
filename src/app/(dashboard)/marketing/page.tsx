import { createClient } from "@/lib/supabase/server";
import { CampanhasList } from "@/components/marketing/campanhas-list";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  const supabase = await createClient();

  const [{ data: campanhas, error }, { data: empresas }] = await Promise.all([
    supabase.from("campanhas").select("*").order("created_at", { ascending: false }),
    supabase.from("empresas").select("id, nome").order("nome"),
  ]);

  if (error) {
    console.error("Erro ao carregar campanhas", error.message);
  }

  return <CampanhasList initialCampanhas={campanhas ?? []} empresas={empresas ?? []} />;
}
