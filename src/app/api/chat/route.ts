import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { CoreMessage, streamText } from "ai";

let bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: "AKIAV2TFLH22HRXD2BIL",
  secretAccessKey: "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",
});

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: bedrock("anthropic.claude-v2:1"),
    messages,
  });

  return result.toDataStreamResponse();
}
