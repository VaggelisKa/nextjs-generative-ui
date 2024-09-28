"use client";

import { generateId } from "ai";
import { useChat } from "ai/react";

import { FormEvent } from "react";
import { Chat, MessageBox } from "~/components/Chat";

export default function GenAiChatPage() {
  const { messages, input, setInput, append } = useChat({
    initialMessages: [
      {
        id: generateId(),
        role: "system",
        content: "Hello, how can I help you?",
      },
    ],
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    append({ role: "user", content: input });
  };

  return (
    <Chat onUserInputChange={setInput} onUserMessageSubmit={handleSubmit}>
      {messages.map((message) => (
        <MessageBox key={message.id} from={message.role}>
          {message.content}
        </MessageBox>
      ))}
    </Chat>
  );
}
