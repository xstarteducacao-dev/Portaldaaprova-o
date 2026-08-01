import { createClient } from "@/lib/supabase/server";
import { ConsultoriasTable } from "@/components/consultorias/consultorias-table";

export const dynamic = "force-dynamic";

export default async function ConsultoriasPage() {
  const supabase = await createClient();

  const [{ data: consultorias, error: consultoriasError }, { data: empresas }, { data: profiles }] =
    await Promise.all([
      supabase.from("consultorias").select("*").order("data_hora", { ascending: false }),
      supabase.from("empresas").select("id, nome").order("nome"),
      supabase
        .from("profiles")
        .select("id, nome, perfil")
        .in("perfil", ["consultor", "administrador", "gerente"])
        .order("nome"),
    ]);

  if (consultoriasError) {
    console.error("Erro ao carregar consultorias", consultoriasError.message);
  }

  return (
    <ConsultoriasTable
      initialConsultorias={consultorias ?? []}
      empresas={empresas ?? []}
      consultores={(profiles ?? []).map((p) => ({ id: p.id, nome: p.nome }))}
    />
  );
}
