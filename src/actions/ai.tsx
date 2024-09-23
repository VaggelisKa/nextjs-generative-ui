import "server-only";

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { format } from "date-fns";
import { ReactNode } from "react";
import { z } from "zod";
import { GenericLoader } from "~/components/GenericLoader";
import { PaymentDetails } from "~/components/PaymentDetails";
import { PriceHistoryChartCard } from "~/components/PriceHistoryChartCard";
import {
  getAccountsSummary,
  getMockPaymentTransactions,
  getMockTimeseriesData,
} from "~/mock-data";

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
    You are a helpful banking assistant and you can help users manage their finances. If the user asks anything outside of 
    the banking space please respond with "I am sorry, I don't know how to help you with that."
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
      getSpecificAccountBalance: {
        description: `
          Get the balance (could also be referred to as summary) of the accounts owned by a user. 
          The user must specify the name of the types of account or the type of the account itself.
          If the user provides both options do not use the tool twice, just combine the two options.
        `,
        parameters: z.object({
          type: z.string().optional(),
          name: z
            .string()
            .optional()
            .describe(
              "Either the name of the account or anything that the users mention to distinguish those accounts, e.g my favorite account",
            ),
        }),
        generate: async function* ({ name, type }) {
          yield <GenericLoader />;

          let accounts = await getAccountsSummary({ name, type });

          return <pre>accounts: {JSON.stringify(accounts, null, 2)}</pre>;
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
              "The symbol of the company if it doesnt exist use the name and find the symbol",
            ),
          date: z
            .string()
            .optional()
            .describe(
              "The date asked by the user, The date should always be relative to the current date which is 14.08.2024 it should be formatted to 'dd.MM.yyyy'",
            ),
        }),
        generate: async function* ({ date, companySymbol }) {
          yield <GenericLoader />;
          let history = getMockTimeseriesData();

          let historySnapshot = history.find(
            (item) => format(item.timestamp, "yyyy-MM-dd") === date,
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
              "The symbol of the company if it doesnt exist use the name and find the symbol",
            )
            .refine((val) => val.toUpperCase()),
          fromDate: z
            .string()
            .optional()
            .describe(
              "The date from which to get the history, the current date is 2024-08-22 so relative dates should always start from today and the expected format is 'yyyy-MM-dd', if the user doesnt mention a date consider it undefined",
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
