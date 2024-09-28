"use client";

import { Button } from "~/components/ui/button";

export default function MainError({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] p-4 mt-12">
      <svg
        className="w-16 h-16 mb-4 text-red-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
      <h2 className="text-lg font-semibold mb-2 text-foreground">
        Oops! Something went wrong
      </h2>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Our chatbot is currently experiencing technical difficulties. Please try
        again later.
      </p>
      <Button onClick={reset} variant="secondary" className="w-full max-w-xs">
        Try Again
      </Button>
    </div>
  );
}
