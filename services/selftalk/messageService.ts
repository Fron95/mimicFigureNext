// messageService.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey: string = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Message {
  text: string;
  player: string;
  time: string;
  chatroom_id: string;
}

export const sendMessage = async (message: Message, userId: string | null) => {
  const now = new Date();
  const time = now.toISOString();
  const newMessage = { ...message, sent_at: time, user_id: userId };

  const { error } = await supabase.from("selfchatMessages").insert([newMessage]);

  if (error) {
    console.error("Error creating message:", error);
  }
};

export const toggleMessagePlayer = async (message: Message, newPlayer: string) => {
  const { error } = await supabase
    .from("selfchatMessages")
    .update({ player: newPlayer })
    .eq("chatroom_id", message.chatroom_id)
    .eq("text", message.text);

  if (error) {
    console.error("Error updating message player:", error);
  }
};

export const deleteMessage = async (message: Message) => {
  const { error } = await supabase
    .from("selfchatMessages")
    .delete()
    .eq("chatroom_id", message.chatroom_id)
    .eq("text", message.text);

  if (error) {
    console.error("Error deleting message:", error);
  }
};

export const editMessage = async (message: Message, newText: string) => {
  const { error } = await supabase
    .from("selfchatMessages")
    .update({ message: newText })
    .eq("chatroom_id", message.chatroom_id)
    .eq("text", message.text);

  if (error) {
    console.error("Error updating message:", error);
  }
};
