import { generateId } from "ai";
import { format, subDays } from "date-fns";

const ACCOUNTS = [
  {
    id: generateId(),
    name: "Checking Account",
    accountType: "checking",
    balance: 100,
  },
  {
    id: generateId(),
    name: "ASK Account",
    accountType: "savings",
    balance: 1200,
  },
  {
    id: generateId(),
    name: "Normal Deposit",
    accountType: "savings",
    balance: 500,
  },
  {
    id: generateId(),
    name: "My favorite account",
    accountType: "credit",
    balance: 100,
  },
  {
    id: generateId(),
    name: "Investment 1",
    accountType: "investment",
    balance: 472,
  },
  {
    id: generateId(),
    name: "Investment 2",
    accountType: "investment",
    balance: 472,
  },
];

const PAYMENTS = [
  {
    id: generateId(),
    date: "2023-07-01",
    from: "Checking Account",
    to: "Savings Account",
    type: "Transfer",
    amount: 500.0,
  },
  {
    id: generateId(),
    date: "2023-07-02",
    from: "Payroll",
    to: "Checking Account",
    type: "Deposit",
    amount: 2500.0,
  },
  {
    id: generateId(),
    date: "2023-07-03",
    from: "Checking Account",
    to: "Rent",
    type: "Withdraw",
    amount: 1200.0,
  },
  {
    id: generateId(),
    date: "2023-07-04",
    from: "Savings Account",
    to: "Investment Account",
    type: "Transfer",
    amount: 1000.0,
  },
  {
    id: generateId(),
    date: "2023-07-05",
    from: "Checking Account",
    to: "Credit Card Payment",
    type: "Withdraw",
    amount: 300.0,
  },
];

async function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getAccounts({
  type,
  name,
}: {
  type?: string[];
  name?: string;
}) {
  return ACCOUNTS.filter(
    (account) =>
      (type && type.includes(account.accountType)) ||
      (name && account.name.toLowerCase().includes(name?.toLowerCase())),
  );
}

export async function getAccountsSummary({
  type,
  name,
}: {
  type?: string[];
  name?: string;
}) {
  await wait(2000);
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
