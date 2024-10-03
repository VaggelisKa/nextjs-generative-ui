"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Payment } from "~/lib/mock-data";

export function PaymentDetails({ payments }: { payments: Payment[] }) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = useMemo(() => {
    return payments.filter((payment) =>
      Object.values(payment).some((value) =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    );
  }, [searchTerm, payments]);

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
            className="pl-8 w-full"
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
                <TableCell>{payment.timestamp}</TableCell>
                <TableCell>{payment.fromAccount}</TableCell>
                <TableCell>{payment.toAccount}</TableCell>
                <TableCell>{payment.transferType}</TableCell>
                <TableCell className="text-right">
                  ${payment.value.toFixed(2)}
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
