"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { streamComponent } from "~/actions/stream";
import { ChatContainer } from "~/components/Chat";

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();
  const [prompt, setPrompt] = useState<string>("");

  return (
    <section className="pt-24">
      <ChatContainer />
    </section>
  );
}
