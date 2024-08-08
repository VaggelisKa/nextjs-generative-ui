"use server";

import { streamUI } from "ai/rsc";
import { createAmazonBedrock } from "@ai-sdk/amazon-bedrock";
import { z } from "zod";

const bedrock = createAmazonBedrock({
  region: "eu-central-1",
  accessKeyId: "AKIAV2TFLH22PJILH7OS",
  secretAccessKey: "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",
});

const LoadingComponent = () => (
  <div className="animate-pulse p-4">getting weather...</div>
);

const getWeather = async (location: string) => {
  await new Promise((resolve) => setTimeout(resolve, 4000));
  return "82°F️ ☀️";
};

interface WeatherProps {
  location: string;
  weather: string;
  timeOfDay: string;
}

const WeatherComponent = (props: WeatherProps) => (
  <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
    The weather in {props.location} is {props.weather} at {props.timeOfDay}
  </div>
);

export async function streamComponent() {
  const result = await streamUI({
    model: bedrock("anthropic.claude-3-sonnet-20240229-v1:0"),
    prompt:
      "Get the weather for San Francisco during dark hours after midnight",
    text: ({ content }) => <div>{content}</div>,
    tools: {
      getWeather: {
        description: "Get the weather for a location and a time of day",
        parameters: z.object({
          location: z.string(),
          timeOfDay: z.string(),
        }),
        generate: async function* ({ location, timeOfDay }) {
          yield <LoadingComponent />;
          const weather = await getWeather(location);
          return (
            <WeatherComponent
              weather={weather}
              location={location}
              timeOfDay={timeOfDay}
            />
          );
        },
      },
    },
  });

  return result.value;
}
