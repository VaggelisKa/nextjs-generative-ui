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
import { getMockPaymentTransactions, getMockTimeseriesData } from "~/mock-data";
import { format } from "date-fns";
import { PriceHistoryChartCard } from "~/components/PriceHistoryChartCard";
import { PaymentDetails } from "~/components/PaymentDetails";

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
    You are a helpful banking assistant and you can help users manage their finances.
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
      }

      return <div>{content}</div>;
    },
    tools: {
      getBalance: {
        description: `Get the balance of the account of the user for a specific account or if an account number is not provided you should show the balance for all accounts`,
        parameters: z.object({
          accountNumber: z
            .number()
            .optional()
            .describe(
              "The account number if the user desires the balance on a specific account"
            ),
        }),
        generate: async function* ({ accountNumber }) {
          yield <GenericLoader />;

          if (!accountNumber) {
            return <div>Your balance is $1000</div>;
          }

          return <div>Your balance on account {accountNumber} is $1000</div>;
        },
      },
      getPaymentTransactions: {
        description: `Get the transactions of the user, the user might also ask to get their expense history or income history`,
        parameters: z.object({
          accountNumber: z.string().describe("The account number"),
        }),
        generate: async function* ({}) {
          yield <GenericLoader />;
          let payments = getMockPaymentTransactions();

          console.log("Payments", payments);

          return <PaymentDetails />;
        },
      },
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
            .optional()
            .describe(
              "The date from which to get the history, the current date is 2024-08-22 so relative dates should always start from today and the expected format is 'yyyy-MM-dd', if the user doesnt mention a date consider it undefined"
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
