import { WeatherComponentNested } from "./WeatherComponentNested";

interface WeatherProps {
  location: string;
  weather: string;
  timeOfDay: string;
}

export function WeatherComponent(props: WeatherProps) {
  return (
    <div className="border border-neutral-200 p-4 rounded-lg max-w-fit">
      <WeatherComponentNested />
      The weather in {props.location} is {props.weather} at {props.timeOfDay}
    </div>
  );
}
