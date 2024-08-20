"use client";

import { useChat } from "ai/react";
import { Chat, MessageBox } from "~/components/Chat";

export default function Page() {
  const { messages, input, setInput, append } = useChat();

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    append({ role: "user", content: input });
  };

  return (
    <Chat onUserInputChange={setInput} onUserMessageSubmit={handleSubmit}>
      <MessageBox from="assistant">Hello, how can I help you?</MessageBox>

      {messages.map((message: any) => (
        <MessageBox key={message.id} from={message.role}>
          {message.content}
        </MessageBox>
      ))}
    </Chat>
  );
}
