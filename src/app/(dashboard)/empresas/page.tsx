import { createClient } from "@/lib/supabase/server";
import { EmpresasList } from "@/components/empresas/empresas-list";

export const dynamic = "force-dynamic";

export default async function EmpresasPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("empresas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Erro ao carregar empresas", error.message);
  }

  return <EmpresasList initialEmpresas={data ?? []} />;
}
