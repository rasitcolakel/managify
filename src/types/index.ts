import { Database } from "./supabase";

type Team = Database["public"]["Tables"]["teams"]["Row"];

export type { Team };
