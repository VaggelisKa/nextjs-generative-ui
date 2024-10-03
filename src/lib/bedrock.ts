import "server-only";

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";

export const bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: process.env.BEDROCK_ACCESS_KEY_ID,
  secretAccessKey: process.env.BEDROCK_SECRET_ACCESS_KEY,
});
