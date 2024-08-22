"use client";

import { Avatar, AvatarImage, AvatarFallback } from "~/components/ui/avatar";
import { Textarea } from "~/components/ui/textarea";
import { Button } from "~/components/ui/button";
import React from "react";

export function Chat({
  children,
  onUserMessageSubmit,
  onUserInputChange,
}: {
  children: React.ReactNode;
  onUserMessageSubmit: (
    event: React.FormEvent<HTMLFormElement> | undefined
  ) => void;
  onUserInputChange: (input: string) => void;
}) {
  return (
    <div className="flex flex-col md:mt-24 min-h-[100dvh] md:min-h-0 md:h-[700px] md:w-[500px] bg-background rounded-2xl shadow-lg">
      <header className="flex items-center gap-4 px-6 py-4 border-b">
        <Avatar className="w-10 h-10 border">
          <AvatarImage src="/chatbot.png" alt="" />
          <AvatarFallback>CB</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">Chatbot</div>
          <div className="text-sm text-muted-foreground">Online</div>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-6 space-y-4">{children}</div>

      <div className="border-t p-4">
        <form className="relative" onSubmit={onUserMessageSubmit}>
          <Textarea
            placeholder="Type your message..."
            name="message"
            id="message"
            rows={1}
            className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
            onChange={(e) => onUserInputChange(e.target.value)}
          />
          <Button
            type="submit"
            size="icon"
            className="absolute w-8 h-8 top-3 right-3"
          >
            <ArrowUpIcon className="w-4 h-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  );
}

function ArrowUpIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m5 12 7-7 7 7" />
      <path d="M12 19V5" />
    </svg>
  );
}

export function MessageBox({
  children,
  from,
}: {
  children: React.ReactNode;
  from: "user" | "assistant";
}) {
  if (from === "user") {
    return (
      <div className="flex items-start gap-4 justify-end">
        <div className="bg-primary rounded-lg p-4 max-w-[70%] text-primary-foreground">
          {children}
        </div>
        <Avatar className="w-8 h-8 border">
          <AvatarImage src="/user.jpg" alt="" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4 w-full">
      <Avatar className="w-8 h-8 border">
        <AvatarImage src="/chatbot.png" alt="" />
        <AvatarFallback>YO</AvatarFallback>
      </Avatar>
      <div className="bg-muted rounded-lg p-4 max-w-[80%]">{children}</div>
    </div>
  );
}
