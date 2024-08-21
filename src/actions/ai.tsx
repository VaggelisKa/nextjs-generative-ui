import "server-only";

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateId, generateText, streamText } from "ai";
import {
  createAI,
  createStreamableUI,
  createStreamableValue,
  getMutableAIState,
  streamUI,
} from "ai/rsc";
import { ReactNode } from "react";
import { z } from "zod";
import { GenericLoader } from "~/components/GenericLoader";

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

async function getStockPrice(
  company: string,
  companySymbol: string,
  date?: string
) {
  let options = {
    method: "POST",
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY ?? "",
      "x-rapidapi-host": "yahoo-finance160.p.rapidapi.com",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      stock: companySymbol,
      period: "1mo",
    }),
  };

  console.log(companySymbol);

  let response = await fetch(
    "https://yahoo-finance160.p.rapidapi.com/history",
    options
  );
  let data = (await response.json()) as {
    metadata: { symbol: string };
    records: { date: string; Close: string }[];
  };

  return `The stock price for ${data.metadata.symbol} is ${Number(
    data.records[0].Close
  ).toLocaleString("en-US", { currency: "USD" })} for date ${date}`;
}

async function submitUserMessage(message: string): Promise<ClientMessage> {
  "use server";

  const aiState = getMutableAIState();

  const result = await streamUI({
    model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
    system: `
    You are a stock trading conversation bot and you can help users buy stocks, step by step.
    You and the user can discuss stock prices and the user can adjust the amount of stocks they want to buy, or place an order, in the UI.
    `,
    messages: [
      ...aiState.get(),
      {
        role: "user",
        content: message,
      },
    ],
    text: ({ content, done }) => {
      if (done) {
        aiState.done((messages: ServerMessage[]) => [
          ...messages,
          {
            role: "assistant",
            content,
          },
        ]);
      }

      return null;
    },
    tools: {
      getStockPrice: {
        description: `Get the stock price for a company `,
        parameters: z.object({
          companyName: z.string().describe("The name of the company"),
          companySymbol: z
            .string()
            .describe(
              "The symbol of the company if it doesnt exist use the name and find the symbol"
            ),
          date: z
            .string()
            .optional()
            .describe(
              "The date asked by the user, The date should always be relative to the current date which is 14.08.2024 it should be formatted to 'dd.MM.yyyy'"
            ),
        }),
        generate: async function* ({ companyName, date, companySymbol }) {
          yield <GenericLoader />;
          return <div>{getStockPrice(companyName, companySymbol, date)}</div>;
        },
      },
    },
  });

  return {
    id: generateId(),
    role: "assistant",
    display: result.value,
  };
}

export type AIState = ServerMessage[];
export type UIState = ClientMessage[];

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [
    {
      id: generateId(),
      role: "assistant",
      display: "Hello, how can I help you sir?",
    },
  ],
  actions: {
    submitUserMessage,
  },
});
