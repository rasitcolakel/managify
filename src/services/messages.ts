import { Chat } from "src/types";
import { supabaseClient } from "src/utility";

type SendMessageProps = {
  chat_id: Chat["id"];
  message: string;
};

export const sendMessage = async ({
  chat_id,
  message,
}: SendMessageProps): Promise<boolean> => {
  const { error } = await supabaseClient.from("messages").insert({
    chat_id,
    message,
  });

  if (error) {
    return false;
  }

  await supabaseClient
    .from("chatParticipants")
    .update({ updated_at: new Date() })
    .eq("chat_id", chat_id);

  return true;
};

export const readAllMessages = async (
  chat_id: Chat["id"],
  sender_id: string
) => {
  const { data, error } = await supabaseClient
    .from("messages")
    .select("*")
    .eq("chat_id", chat_id)
    .neq("sender_id", sender_id)
    .eq("is_seen", false);

  console.log(data?.length);
  if (data && data.length > 0) {
    const { error: error2 } = await supabaseClient
      .from("messages")
      .update({ is_seen: true })
      .eq("chat_id", chat_id)
      .neq("sender_id", sender_id);
    await new Promise((resolve) => setTimeout(resolve, 10));
    await supabaseClient
      .from("chatParticipants")
      .update({ updated_at: new Date() })
      .eq("chat_id", chat_id);
    if (error2) {
      return false;
    }
  }

  if (error) {
    return false;
  }

  return true;
};
