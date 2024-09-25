"use client";

import React, { useEffect, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";

export function Chat({
  children,
  onUserMessageSubmit,
  onUserInputChange,
}: {
  children: React.ReactNode;
  onUserMessageSubmit: (
    event: React.FormEvent<HTMLFormElement> | undefined,
  ) => void;
  onUserInputChange?: (input: string) => void;
}) {
  let formRef = useRef<HTMLFormElement>(null);
  let messagesEndRef = useRef<HTMLDivElement>(null);
  let inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }
  }, [children]);

  return (
    <div className="flex flex-col h-dvh w-full bg-white">
      <ScrollArea
        className="flex-1 overflow-y-auto p-4"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="space-y-8">{children}</div>
        <div className="invisible" ref={messagesEndRef} aria-hidden />
      </ScrollArea>

      <div className="p-4">
        <form ref={formRef} className="relative" onSubmit={onUserMessageSubmit}>
          <Textarea
            ref={inputRef}
            placeholder="Type your message..."
            name="message"
            id="message"
            rows={1}
            className="min-h-[48px] rounded-2xl resize-none p-4 border border-neutral-400 shadow-sm pr-16"
            onChange={(e) => onUserInputChange?.(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                e.stopPropagation();

                formRef.current?.requestSubmit();

                if (inputRef.current) {
                  inputRef.current.value = "";
                }
              }
            }}
            autoFocus
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

export function MessageBox({
  children,
  from,
}: {
  children: React.ReactNode;
  from: "user" | "assistant";
}) {
  return (
    <ul className="flex items-start gap-2 justify-start w-full">
      <Avatar className="w-6 h-6 border">
        <AvatarImage
          src={from === "user" ? "/user.jpg" : "/chatbot.png"}
          alt=""
        />
        <AvatarFallback>{from === "user" ? "U" : "CB"}</AvatarFallback>
      </Avatar>
      <li className="text-black text-sm leading-6">{children}</li>
    </ul>
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
