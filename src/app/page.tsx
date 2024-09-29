import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Next.js + AWS bedrock showcase",
};

export default function LandingPage() {
  return (
    <nav className="flex flex-col items-start justify-center gap-4 p-4">
      <h1>Next.js + AWS bedrock showcase</h1>

      <ol className="list-decimal list-inside space-y-1">
        <li>
          <Link className="text-blue-500 underline" href="/gen-ai-chat">
            Generative AI Chat
          </Link>
        </li>

        <li>
          <Link className="text-blue-500 underline" href="/gen-ui-chat">
            Generative UI Chat
          </Link>
        </li>
      </ol>
    </nav>
  );
}
