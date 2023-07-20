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
  const { error, data } = await supabaseClient.from("messages").insert({
    chat_id,
    message,
  });
  console.log("sendMessage", { error, data });
  if (error) {
    return false;
  }

  return true;
};
