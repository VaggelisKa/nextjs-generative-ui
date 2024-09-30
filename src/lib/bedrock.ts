import "server-only";

import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";

export const bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: "AKIAV2TFLH22PJILH7OS",
  secretAccessKey: "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",
});
