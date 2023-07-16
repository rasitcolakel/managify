import { createClient } from "@refinedev/supabase";
import { config } from "src/config";

export const supabaseClient = createClient(
  config.SUPABASE_URL as string,
  config.SUPABASE_KEY as string,
  {
    db: {
      schema: "public",
    },
    auth: {
      persistSession: true,
    },
    realtime: {
      heartbeatIntervalMs: 1000 * 60,
    },
  }
);
