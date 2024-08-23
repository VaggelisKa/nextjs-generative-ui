"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { useState, useMemo } from "react";

// Sample data for the payments
const payments = [
  {
    id: 1,
    date: "2023-07-01",
    from: "Checking Account",
    to: "Savings Account",
    type: "Transfer",
    amount: 500.0,
  },
  {
    id: 2,
    date: "2023-07-02",
    from: "Payroll",
    to: "Checking Account",
    type: "Deposit",
    amount: 2500.0,
  },
  {
    id: 3,
    date: "2023-07-03",
    from: "Checking Account",
    to: "Rent",
    type: "Withdraw",
    amount: 1200.0,
  },
  {
    id: 4,
    date: "2023-07-04",
    from: "Savings Account",
    to: "Investment Account",
    type: "Transfer",
    amount: 1000.0,
  },
  {
    id: 5,
    date: "2023-07-05",
    from: "Checking Account",
    to: "Credit Card Payment",
    type: "Withdraw",
    amount: 300.0,
  },
];

export function PaymentDetails() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) =>
      Object.values(payment).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Payment Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative mb-4">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 max-w-sm"
          />
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.date}</TableCell>
                <TableCell>{payment.from}</TableCell>
                <TableCell>{payment.to}</TableCell>
                <TableCell>{payment.type}</TableCell>
                <TableCell className="text-right">
                  ${payment.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredPayments.length === 0 && (
          <p className="text-center text-muted-foreground mt-4">
            No payments found.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
