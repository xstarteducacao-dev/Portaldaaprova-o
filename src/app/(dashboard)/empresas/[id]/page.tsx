import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmpresaDetail } from "@/components/empresas/empresa-detail";

export const dynamic = "force-dynamic";

export default async function EmpresaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: empresa } = await supabase.from("empresas").select("*").eq("id", id).single();

  if (!empresa) {
    notFound();
  }

  const { data: consultorias } = await supabase
    .from("consultorias")
    .select("*")
    .eq("empresa_id", id)
    .order("data_hora", { ascending: false });

  return <EmpresaDetail empresa={empresa} consultorias={consultorias ?? []} />;
}
