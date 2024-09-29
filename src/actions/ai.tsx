import "server-only";

import { createAI } from "ai/rsc";
import { ReactNode } from "react";

// Define the AI state and UI state types
export type ServerMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

export type ClientMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  display: ReactNode;
};

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

async function submitUserMessage(message: string): Promise<ClientMessage> {
  "use server";

  return {} as ClientMessage;
}

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: {},
});
