import { bedrock } from "@ai-sdk/amazon-bedrock";
import { streamText } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = await streamText({
    model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
    messages,
  });

  return result.toDataStreamResponse();
}
