// ✅ components/TopOutstandingInvoices.jsx
import React, { useMemo } from "react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount) => {
  if (typeof amount === "string") return amount;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
};

/** Profit model */
const NET_MARGIN_ASSUMPTION = 0.224; // 22.4%
const DAILY_PROFIT_LEAK_RATE = 0.01; // 1% per day on PROFIT

const calcInvoiceProfitImpact = (
  amount,
  daysOverdue,
  margin = NET_MARGIN_ASSUMPTION,
  dailyProfitLeakRate = DAILY_PROFIT_LEAK_RATE,
) => {
  const expectedProfit = amount * margin;

  const rawProfitLeak = expectedProfit * dailyProfitLeakRate * daysOverdue;
  const profitLeakToDate = Math.min(rawProfitLeak, expectedProfit);

  const remainingProfitIfPaidToday = Math.max(
    expectedProfit - profitLeakToDate,
    0,
  );

  return { expectedProfit, profitLeakToDate, remainingProfitIfPaidToday };
};

const getStatusBadge = (status) => {
  if (status === "overdue")
    return { label: "Overdue", color: "bg-red-100 text-red-700" };
  if (status === "late")
    return { label: "Late", color: "bg-orange-100 text-orange-700" };
  return { label: "Due Soon", color: "bg-yellow-100 text-yellow-700" };
};

export function TopOutstandingInvoices({ setActiveTab, onOpenInvoice }) {
  // ✅ move static data here
  const topOutstandingInvoices = useMemo(
    () => [
      {
        invoiceNo: "INV-2024-1247",
        client: "MegaMart",
        amount: 340000,
        dueDate: "Oct 15, 2024",
        daysOverdue: 67,
        status: "overdue",
      },
      {
        invoiceNo: "INV-2024-1312",
        client: "TechStart Inc",
        amount: 280000,
        dueDate: "Nov 8, 2024",
        daysOverdue: 45,
        status: "overdue",
      },
      {
        invoiceNo: "INV-2024-1456",
        client: "Acme Corp",
        amount: 225000,
        dueDate: "Dec 1, 2024",
        daysOverdue: 22,
        status: "late",
      },
      {
        invoiceNo: "INV-2024-1499",
        client: "RetailHub",
        amount: 190000,
        dueDate: "Dec 10, 2024",
        daysOverdue: 13,
        status: "late",
      },
      
    ],
    [],
  );

  return (
    <Card className="border-border/60 bg-background/70 shadow-sm rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span>Top Outstanding Invoices</span>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-xl border-border/70"
            onClick={() => setActiveTab?.("revenue")}
          >
            View All
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          {topOutstandingInvoices.map((invoice) => {
            const statusBadge = getStatusBadge(invoice.status);

            const {
              expectedProfit,
              profitLeakToDate,
              remainingProfitIfPaidToday,
            } = calcInvoiceProfitImpact(invoice.amount, invoice.daysOverdue);

            return (
              <button
                key={invoice.invoiceNo}
                onClick={() => onOpenInvoice?.(invoice.invoiceNo)}
                className={[
                  "w-full text-left",
                  "p-3 rounded-2xl border border-border/60",
                  "bg-background/70 shadow-sm",
                  "hover:bg-accent/40 hover:shadow-md",
                  "transition-all duration-200",
                  "focus:outline-none focus:ring-2 focus:ring-ring/40",
                ].join(" ")}
                title="Open Invoice Detail"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <p className="font-mono text-sm font-semibold">
                        {invoice.invoiceNo}
                      </p>

                      <Badge
                        variant="secondary"
                        className={`${statusBadge.color} text-xs px-2 py-0.5 border-0`}
                      >
                        {statusBadge.label}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                      <span className="font-medium">{invoice.client}</span>
                      <span>•</span>
                      <span>Due: {invoice.dueDate}</span>
                      <span>•</span>
                      <span className="text-red-600 font-medium">
                        {invoice.daysOverdue} days overdue
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="text-lg font-bold">
                      {formatCurrency(invoice.amount)}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Invoice amount
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="rounded-xl border border-border/60 bg-emerald-50/60 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">
                      Expected profit (if paid)
                    </p>
                    <p className="text-sm font-semibold mt-0.5 text-emerald-700">
                      {formatCurrency(Math.round(expectedProfit))}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-red-50/60 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">
                      Profit lost
                    </p>
                    <p className="text-sm font-semibold mt-0.5 text-red-700">
                      {formatCurrency(Math.round(profitLeakToDate))}
                    </p>
                  </div>

                  <div className="rounded-xl border border-border/60 bg-muted/20 px-3 py-2">
                    <p className="text-[11px] text-muted-foreground">
                      Remaining profit
                    </p>
                    <p className="text-sm font-semibold mt-0.5">
                      {formatCurrency(Math.round(remainingProfitIfPaidToday))}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
