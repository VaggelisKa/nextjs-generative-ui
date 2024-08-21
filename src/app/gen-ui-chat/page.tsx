"use client";

import { generateId } from "ai";
import { useActions, useUIState } from "ai/rsc";
import { FormEvent, ReactNode, useId, useState } from "react";
import { set } from "zod";
import { AI, ClientMessage, UIState } from "~/actions/ai";
import { streamComponent } from "~/actions/stream";
import { Chat, MessageBox } from "~/components/Chat";

export default function GenUIChatPage() {
  let uuid = useId();
  let [userMessage, setUserMessage] = useState("");
  let [messages, setMessages] = useUIState<typeof AI>();
  let { submitUserMessage } = useActions();

  const handleSubmit = async (e: FormEvent<HTMLFormElement> | undefined) => {
    e?.preventDefault();

    setMessages((messages: ClientMessage[]) => [
      ...messages,
      { id: generateId(), role: "user", display: userMessage },
    ]);

    let response = await submitUserMessage(userMessage);

    setMessages((messages: ClientMessage[]) => [...messages, response]);
  };

  return (
    <Chat onUserInputChange={setUserMessage} onUserMessageSubmit={handleSubmit}>
      {messages?.map((message: ClientMessage) => (
        <MessageBox key={uuid + Math.random()} from={message.role}>
          {message.display}
        </MessageBox>
      ))}
    </Chat>
  );
}
