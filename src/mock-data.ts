import { generateId } from "ai";
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

  console.log("From date", fromDate);

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

export function getMockPaymentTransactions(fromDate?: string) {
  let today = new Date();
  let mockTransactions: {
    timestamp: string;
    value: number;
    fromAccount: string;
    toAccount: string;
    transferType: "deposit" | "withdrawal";
  }[] = [];

  for (let i = 0; i < 365; i++) {
    mockTransactions.push({
      timestamp: format(subDays(today, i), "yyyy-MM-dd"),
      value: Math.random() * 100,
      fromAccount: generateId(),
      toAccount: generateId(),
      transferType: Math.random() > 0.5 ? "deposit" : "withdrawal",
    });
  }

  if (fromDate) {
    let fromDateIndex = mockTransactions.findIndex(
      (item) => format(item.timestamp, "yyyy-MM-dd") === fromDate
    );

    mockTransactions = mockTransactions.slice(
      fromDateIndex + 1,
      mockTransactions.length
    );
  }

  return mockTransactions;
}
