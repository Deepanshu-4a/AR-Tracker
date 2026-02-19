// ==============================
// CustomerPayments.jsx (UPDATED)
// - Status column removed
// ==============================
import { useMemo } from "react";

import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { CreditCard, MoreVertical, Eye, Download, Plus } from "lucide-react";

export function CustomerPayments({ customerId, customerName }) {
  // Mock payments (scoped by customerId)
  const payments = [
    {
      id: "PMT-9001",
      customerId: "CL001",
      date: "2026-01-18",
      amount: 42000,
      method: "ACH",
      appliedTo: ["INV-10212"],
    },
    {
      id: "PMT-9002",
      customerId: "CL001",
      date: "2025-12-28",
      amount: 67000,
      method: "Wire",
      appliedTo: ["INV-10188"],
    },
    {
      id: "PMT-9101",
      customerId: "CL002",
      date: "2026-02-02",
      amount: 15000,
      method: "Card",
      appliedTo: [],
    },
    {
      id: "PMT-9203",
      customerId: "CL003",
      date: "2026-01-10",
      amount: 5000,
      method: "Check",
      appliedTo: ["INV-30110"],
    },
  ];

  const scopedPayments = useMemo(() => {
    return payments.filter((p) => p.customerId === customerId);
  }, [customerId]);

  const totals = useMemo(() => {
    const total = scopedPayments.reduce((s, p) => s + p.amount, 0);
    return { total };
  }, [scopedPayments]);

  const money = (n) =>
    `$${Math.round(n).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;

  const formatDate = (iso) => {
    try {
      return new Date(iso).toLocaleDateString();
    } catch {
      return iso;
    }
  };

  const onRecordPayment = () => {
    alert(`Record payment for ${customerName || customerId}`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Payments for</p>
          <h3 className="text-lg font-semibold">
            {customerName || customerId || "Customer"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={onRecordPayment}
          >
            <Plus className="w-4 h-4 mr-2" />
            Record Payment
          </Button>

          <Button variant="outline" onClick={() => alert("Export payments")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground">Total Received</p>
        <p className="text-xl font-semibold">{money(totals.total)}</p>
      </Card>

      {/* Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-muted-foreground" />
          <p className="font-medium">Payment History</p>
          <span className="text-sm text-muted-foreground">
            ({scopedPayments.length})
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Applied To</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {scopedPayments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6}>
                    <div className="py-10 text-center text-muted-foreground">
                      No payments for this customer yet.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                scopedPayments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">{p.id}</TableCell>
                    <TableCell>{formatDate(p.date)}</TableCell>
                    <TableCell className="text-right">
                      {money(p.amount)}
                    </TableCell>
                    <TableCell>{p.method}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {p.appliedTo?.length ? p.appliedTo.join(", ") : "—"}
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => alert(`View payment: ${p.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() =>
                              alert(`Download receipt: ${p.id}`)
                            }
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
