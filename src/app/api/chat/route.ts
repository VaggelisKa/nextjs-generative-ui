import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { CoreMessage, streamText } from "ai";

let bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: "AKIAV2TFLH22PJILH7OS",
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
