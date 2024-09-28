import { CoreMessage, streamText } from "ai";
import { bedrock } from "~/lib/bedrock";

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: bedrock("anthropic.claude-v2:1"),
    messages,
  });

  return result.toDataStreamResponse();
}
