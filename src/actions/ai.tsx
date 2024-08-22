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
import { getMockTimeseriesData } from "~/mock-data";
import { format } from "date-fns";
import { PriceHistoryChartCard } from "~/components/PriceHistoryChartCard";

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

  const aiState = getMutableAIState();

  aiState.update((messages: ServerMessage[]) => [
    ...messages,
    {
      role: "user",
      content: message,
    },
  ]);

  const result = await streamUI({
    model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
    system: `
    You are a stock trading conversation bot and you can help users buy stocks, step by step.
    You and the user can discuss stock prices and the user can adjust the amount of stocks they want to buy, or place an order, in the UI.
    `,
    messages: [...aiState.get()],
    text: ({ content, done }) => {
      if (done) {
        aiState.done((messages: ServerMessage[]) => [
          ...messages,
          {
            role: "assistant",
            content,
          },
        ]);

        return <div>{content}</div>;
      }

      return null;
    },
    tools: {
      getStockPrice: {
        description: `Get the stock price for a company `,
        parameters: z.object({
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
        generate: async function* ({ date, companySymbol }) {
          yield <GenericLoader />;
          let history = getMockTimeseriesData();

          let historySnapshot = history.find(
            (item) => format(item.timestamp, "yyyy-MM-dd") === date
          );

          return (
            <div>
              Value of {companySymbol} on {date} is {historySnapshot?.value}
            </div>
          );
        },
      },
      getStockPriceHistory: {
        description: `Get the stock price history for a company meaning the price of the company over a period of time`,
        parameters: z.object({
          companyName: z.string().describe("The name of the company"),
          companySymbol: z
            .string()
            .describe(
              "The symbol of the company if it doesnt exist use the name and find the symbol"
            )
            .refine((val) => val.toUpperCase()),
          fromDate: z
            .string()
            .describe(
              "The date from which to get the history, the current date is 2024-08-22 so relative dates should always start from today and the expected format is 'yyyy-MM-dd'"
            ),
        }),
        generate: async function* ({ companyName, companySymbol, fromDate }) {
          yield <GenericLoader />;
          let history = getMockTimeseriesData(fromDate);

          return (
            <div>
              <PriceHistoryChartCard data={history} companyName={companyName} />
            </div>
          );
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
      display: "Hello, how can I help you?",
    },
  ],
  actions: {
    submitUserMessage,
  },
});
