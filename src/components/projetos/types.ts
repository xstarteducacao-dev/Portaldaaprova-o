import type { Database } from "@/types/database.types";

export type Projeto = Database["public"]["Tables"]["projetos"]["Row"];
export type EmpresaOption = { id: string; nome: string };
export type ProfileOption = { id: string; nome: string };
