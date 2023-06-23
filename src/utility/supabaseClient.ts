import { createClient } from "@refinedev/supabase";
import { config } from "src/config";

export const supabaseClient = createClient(
  config.SUPABASE_URL,
  config.SUPABASE_KEY,
  {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: true,
    },
  }
);
