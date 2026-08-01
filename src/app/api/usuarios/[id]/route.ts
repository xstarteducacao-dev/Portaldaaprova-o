import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("perfil")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || profile.perfil !== "administrador") {
    return NextResponse.json(
      { error: "Apenas administradores podem remover usuários." },
      { status: 403 }
    );
  }

  const { id } = await params;
  const admin = createAdminClient();

  const { error } = await admin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json(
      { error: "Não foi possível remover o usuário." },
      { status: 400 }
    );
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
