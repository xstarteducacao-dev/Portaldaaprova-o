import { createClient } from "@/lib/supabase/server";
import type { PerfilUsuario } from "@/types/database.types";

export async function requireProfile(perfis: PerfilUsuario[]) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { allowed: false as const, profile: null };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, nome, email, telefone, perfil, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile || !perfis.includes(profile.perfil)) {
    return { allowed: false as const, profile: profile ?? null };
  }

  return { allowed: true as const, profile };
}
