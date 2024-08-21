"use server";

import { streamUI } from "ai/rsc";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { z } from "zod";
import { GenericLoader } from "~/components/GenericLoader";

const bedrock = createAmazonBedrock({
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

export async function streamComponent({ prompt }: { prompt: string }) {
  const result = await streamUI({
    prompt,
    model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
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
              `The date asked by the user, The date should always be relative to the current date which is ${new Date()} it should be formatted to 'dd.MM.yyyy'`
            ),
        }),
        generate: async function* ({ companyName, date, companySymbol }) {
          yield <GenericLoader />;
          return <div>{getStockPrice(companyName, companySymbol, date)}</div>;
        },
      },
    },
  });

  return result;
}
