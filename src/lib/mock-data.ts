import { generateId } from "ai";
import { format, subDays } from "date-fns";

export type Payment = {
  id: string;
  timestamp: string;
  value: number;
  fromAccount: string;
  toAccount: string;
  transferType: "deposit" | "withdrawal";
};

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

async function wait(ms?: number) {
  return new Promise((resolve) =>
    setTimeout(resolve, ms || Math.random() * 1500),
  );
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

export async function getPriceHistory(fromDate?: string) {
  await wait();

  let today = new Date();
  let mockTimeseries = [];

  for (let i = 365; i > 0; i -= 1) {
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

export async function getPaymentTransactions(fromDate?: string) {
  await wait();

  let today = new Date();
  let mockTransactions: Payment[] = [];

  for (let i = 0; i < 370; i++) {
    mockTransactions.push({
      id: generateId(),
      timestamp: format(subDays(today, i), "yyyy-MM-dd"),
      value: Math.random() * 100,
      fromAccount: generateId(),
      toAccount: generateId(),
      transferType: Math.random() > 0.5 ? "deposit" : "withdrawal",
    });
  }

  if (fromDate) {
    let fromDateIndex = mockTransactions.findIndex(
      (item) => item.timestamp === fromDate,
    );

    mockTransactions = mockTransactions.slice(1, fromDateIndex + 1);
  }

  return mockTransactions;
}
