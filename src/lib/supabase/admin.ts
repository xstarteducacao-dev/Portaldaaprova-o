import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

// ATENÇÃO: este cliente usa a service role key e ignora o RLS. NUNCA importe este
// arquivo em Client Components ou em qualquer código que possa ser enviado ao navegador.
// Uso permitido apenas em Route Handlers, Server Actions e Server Components.
export function createAdminClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
