import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { generateText } from "ai";

const bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const model = bedrock("anthropic.claude-v2:1");

export default async function AiPage() {
  let { text } = await generateText({
    model,
    prompt: "Who are you?",
  });

  return <div>{text}</div>;
}
