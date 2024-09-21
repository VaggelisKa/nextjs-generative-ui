"use client";

import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { AI, ClientMessage } from "~/actions/ai";
import { Chat, MessageBox } from "~/components/Chat";

export default function GenUIChatPage() {
  let [messages, setMessages] = useUIState<typeof AI>();
  let { submitUserMessage } = useActions();

  const handleSubmit = async (e: any) => {
    e?.preventDefault();

    let userMessage = e?.target.message.value;

    setMessages((messages: ClientMessage[]) => [
      ...messages,
      { id: generateId(), role: "user", display: userMessage },
    ]);

    let response = await submitUserMessage(userMessage);

    setMessages((messages: ClientMessage[]) => [...messages, response]);
  };

  return (
    <Chat onUserMessageSubmit={handleSubmit}>
      {messages?.map((message: ClientMessage) => (
        <MessageBox key={message.id} from={message.role}>
          {message.display}
        </MessageBox>
      ))}
    </Chat>
  );
}
