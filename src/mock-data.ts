import { generateId } from "ai";
import { format, subDays } from "date-fns";

const ACCOUNTS = [
  {
    id: generateId(),
    name: "Checking Account",
    accountType: "checking",
    balance: 1000,
  },
  {
    id: generateId(),
    name: "ASK Account",
    accountType: "savings",
    balance: 123000,
  },
  {
    id: generateId(),
    name: "Normal Deposit",
    accountType: "savings",
    balance: 5000,
  },
  {
    id: generateId(),
    name: "My favorite account",
    accountType: "credit",
    balance: 10000,
  },
];

export async function getAccounts({
  type,
  name,
}: {
  type?: string;
  name?: string;
}) {
  return ACCOUNTS.filter(
    (account) =>
      (type && account.accountType === type) ||
      (name && account.name.toLowerCase().includes(name?.toLowerCase())),
  );
}

export async function getAccountsSummary({
  type,
  name,
}: {
  type?: string;
  name?: string;
}) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  let accounts = await getAccounts({ type, name });

  return accounts.reduce(
    (acc, account) => {
      acc[account.accountType] =
        (acc[account.accountType] || 0) + account.balance;
      return acc;
    },
    {} as Record<string, number>,
  );
}

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
      (item) => format(item.timestamp, "yyyy-MM-dd") === fromDate,
    );

    mockTimeseries = mockTimeseries.slice(
      fromDateIndex + 1,
      mockTimeseries.length,
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
      (item) => format(item.timestamp, "yyyy-MM-dd") === fromDate,
    );

    mockTransactions = mockTransactions.slice(
      fromDateIndex + 1,
      mockTransactions.length,
    );
  }

  return mockTransactions;
}
