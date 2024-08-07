import { streamText } from "ai";

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";

// TODO - move to env and bind to AWS
const bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: "AKIAV2TFLH22PJILH7OS",
  secretAccessKey: "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",
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const result = await streamText({
      model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
      messages,
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error(error);
    return new Response(`Key is ${process.env.AWS_SECRET_ACCESS_KEY}`, {
      status: 500,
    });
  }
}
