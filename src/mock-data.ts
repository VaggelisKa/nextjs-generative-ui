import { format, subDays } from "date-fns";

export function getMockTimeseriesData(fromDate?: string) {
  let today = new Date();
  let mockTimeseries = [];

  for (let i = 365; i > 0; i--) {
    mockTimeseries.push({
      timestamp: format(subDays(today, i), "yyyy-MM-dd"),
      value: Math.random() * 100,
    });
  }

  if (fromDate) {
    let fromDateIndex = mockTimeseries.findIndex(
      (item) => format(item.timestamp, "yyyy-MM-dd") === fromDate
    );

    mockTimeseries = mockTimeseries.slice(
      fromDateIndex + 1,
      mockTimeseries.length
    );
  }

  return mockTimeseries;
}
