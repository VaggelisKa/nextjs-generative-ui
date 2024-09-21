import "server-only";

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { createAI } from "ai/rsc";
import { ReactNode } from "react";

// Define the AI state and UI state types
export type ServerMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ClientMessage = {
  id: string;
  role: "user" | "assistant";
  display: ReactNode;
};

let bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: "AKIAV2TFLH22PJILH7OS",
  secretAccessKey: "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",
});

async function submitUserMessage(message: string): Promise<ClientMessage> {
  "use server";

  return {} as ClientMessage;
}

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [],
  actions: {},
});
