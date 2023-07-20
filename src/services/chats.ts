import { supabaseClient } from "src/utility";

export const getChatWithUser = async (user_id: string) => {
  const { data, error } = await supabaseClient.rpc("find_or_create_chat", {
    user_id_finding: user_id,
  });

  if (error) {
    throw error;
  }
  return data;
};
