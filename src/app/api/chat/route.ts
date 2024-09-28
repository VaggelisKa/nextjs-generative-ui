import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { CoreMessage, streamText } from "ai";

let bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: "ASIAV2TFLH22NBSRYUQJ",
  secretAccessKey: "YEMouEqTigVZRlZ765gV5tlVtORujvgQMVPy2Las",
  sessionToken:
    "IQoJb3JpZ2luX2VjEP7//////////wEaDGV1LWNlbnRyYWwtMSJHMEUCICGTRKvjQbg41ZBNXgexfj1e0H/noc6xdAwR5y3+iCqQAiEAkoXWg9E/OWuXGrGuXB7iKDlFECvY7SJi/a2bBXvf0j0q6wEIRxABGgw0MDA3MTgyNDk2NTIiDNLculvgkBeFIL4p6SrIAUM1TSiQhRBep1nniYilVoennDMOnjDOc0VZebVqVQ/SdS3MZeAKZWR/glGltk/PPQ8hVSxvMl77x8hJsSrJnbofIF6q8iz1VQiv9zkeYHu799aq99B2RanzFvA9rDimdVu56aIYnT1m4Vh1Qe1aci21qFN7blrIIbt0e/cSWGeqsGivpEW1iBbJnPCHYL69FExB7FP32lunCMUcnRH8aLHUJtb0+Z7UNJy7qBYsQSOSF7M/K7InHl6Qbibgf3yyv/JzWp7FBBhiMLyP4LcGOpgBI+q/kFY2EuvMXNvxyQMKDm8tQDprSETdstjlkgER2r7CPMpWW6+T1AlBeig3jIjtjNHwACYqqUh+QIq9pcsfnUGdX3ayudlXKupyOop7tTCX18UU8kiHouEL89cBG2z+KB2gVywYW3zpBf9PY5r9p7b4wRUCCm8hHkA0Eiqq+3C22pKvdtn8ZcZqKNiFMa2i+mJkWASi98U=",
});

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  const result = await streamText({
    model: bedrock("anthropic.claude-v2:1"),
    messages,
  });

  return result.toDataStreamResponse();
}
