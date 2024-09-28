import "server-only";

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateId } from "ai";
import { createAI, getMutableAIState, streamUI } from "ai/rsc";
import { format } from "date-fns";
import { ReactNode } from "react";
import { z } from "zod";
import { AccountBalancePieChart } from "~/components/account-balance-pie-chart";
import { GenericLoader } from "~/components/GenericLoader";
import { PaymentDetails } from "~/components/PaymentDetails";
import { PriceHistoryChartCard } from "~/components/PriceHistoryChartCard";
import {
  getAccountsSummary,
  getPaymentTransactions,
  getPriceHistory,
} from "~/mock-data";

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
          If the user asks for all accounts the supported types are checking, savings, credit, investment and other.
        `,
        parameters: z.object({
          type: z.array(z.string()),
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

          return (
            <AccountBalancePieChart
              chartData={Object.entries(accounts).map(
                ([accountType, balance]) => ({
                  balance,
                  accountType,
                }),
              )}
            />
          );
        },
      },
      getPaymentTransactions: {
        description: `
          Get the transactions or payment history of the user, the user might also specify a relative
          date as a starting point. For example it could be the last month or the last year. 
        `,
        parameters: z.object({
          fromDate: z
            .string()
            .optional()
            .describe(
              `The date from which to get the history, formatted as yyyy-MM-dd. The current date is ${format(new Date(), "yyyy-MM-dd")} so relative dates should always 
              start from today and the expected format is 'yyyy-MM-dd', if the user doesnt mention a date default it to last year`,
            ),
        }),
        generate: async function* ({ fromDate }) {
          yield <GenericLoader />;

          let payments = await getPaymentTransactions(fromDate);

          return <PaymentDetails payments={payments} />;
        },
      },
      getStockPrice: {
        description: `Get the stock price for a company`,
        parameters: z.object({
          companySymbol: z
            .string()
            .describe(
              "The symbol of the company if it doesnt exist use the name and find the symbol",
            ),
          fromDate: z
            .string()
            .optional()
            .describe(
              `
              The date from which to get the history, formatted as yyyy-MM-dd. The current date is ${format(new Date(), "yyyy-MM-dd")} 
              so relative dates should always start from today and the expected format is 'yyyy-MM-dd', if the user doesnt mention a date default it to ${format(new Date(), "yyyy-MM-dd")}
              `,
            ),
        }),
        generate: async function* ({ fromDate, companySymbol }) {
          yield <GenericLoader />;
          let history = await getPriceHistory(fromDate);

          return (
            <div>
              Value of {companySymbol} on {fromDate} is{" "}
              {history.at(0)?.value.toLocaleString(undefined, {
                style: "currency",
                currency: "USD",
              })}
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
              `
              The date from which to get the history, formatted as yyyy-MM-dd. The current date is ${format(new Date(), "yyyy-MM-dd")} 
              so relative dates should always 
              start from today and the expected format is 'yyyy-MM-dd', if the user doesnt mention a date default it to last year
              `,
            ),
        }),
        generate: async function* ({ companyName, fromDate }) {
          yield <GenericLoader />;
          let history = await getPriceHistory(fromDate);

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

// Create the AI provider with the initial states and allowed actions
export const AI = createAI<AIState, UIState>({
  initialAIState: [],
  initialUIState: [
    {
      id: generateId(),
      role: "system",
      display: "Hello, how can I help you?",
    },
  ],
  actions: {
    submitUserMessage,
  },
});
