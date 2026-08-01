import { createClient } from "@/lib/supabase/server";
import { SitesTable } from "@/components/sites/sites-table";

export const dynamic = "force-dynamic";

export default async function SitesPage() {
  const supabase = await createClient();

  const [{ data: sites, error }, { data: empresas }] = await Promise.all([
    supabase.from("sites").select("*").order("created_at", { ascending: false }),
    supabase.from("empresas").select("id, nome").order("nome"),
  ]);

  if (error) {
    console.error("Erro ao carregar sites", error.message);
  }

  return <SitesTable initialSites={sites ?? []} empresas={empresas ?? []} />;
}
