import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateText } from "ai";
import { createAI, getMutableAIState } from "ai/rsc";
import { ReactNode } from "react";

// Define the AI state and UI state types
export type ServerMessage = {
  role: "user" | "bot";
  content: string;
};

export type ClientMessage = {
  id: string;
  role: "user" | "bot";
  display: ReactNode;
};

export async function sendMessage(message: string) {
  "use server";

  const history = getMutableAIState();

  history.update([...history.get(), { role: "user", content: message }]);

  let bedrock = createAmazonBedrock({
    region: "eu-central-1",
    accessKeyId: "AKIAV2TFLH22PJILH7OS",
    secretAccessKey: "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",
  });

  const response = await generateText({
    model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
    messages: history.get(),
  });

  history.done([...history.get(), { role: "bot", content: response }]);

  return response;
}

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

// Create the AI provider with the initial states and allowed actions
export const AI = createAI({
  initialAIState: [],
  initialUIState: [],
  actions: {
    sendMessage,
  },
});
