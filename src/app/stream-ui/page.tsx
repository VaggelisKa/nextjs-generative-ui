"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { streamComponent } from "~/actions/stream";

export default function Page() {
  const [component, setComponent] = useState<React.ReactNode>();
  const [prompt, setPrompt] = useState<string>("");

  return (
    <div>
      <input
        className="w-full"
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setComponent(
            await streamComponent({
              prompt,
            })
          );
        }}
      >
        <Button>Stream Component</Button>
      </form>
      <div>{component}</div>
    </div>
  );
}
