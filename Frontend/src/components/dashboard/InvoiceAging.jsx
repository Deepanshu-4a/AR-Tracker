
import React, { useMemo, useState } from "react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip } from "recharts";

const formatCurrency = (amount) => {
  if (typeof amount === "string") return amount;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
};

const formatMoneyFull = (amount) => {
  if (typeof amount === "string") return amount;
  return `$${Math.round(amount).toLocaleString()}`;
};

/** Profit model */
const NET_MARGIN_ASSUMPTION = 0.224; // 22.4%
const DAILY_PROFIT_LEAK_RATE = 0.01; // 1% per day on PROFIT

const bucketEconomics = (amountDollars, delayDays) => {
  const expectedProfit = amountDollars * NET_MARGIN_ASSUMPTION;
  const costToServe = amountDollars - expectedProfit;

  const rawLeak = expectedProfit * DAILY_PROFIT_LEAK_RATE * delayDays;
  const profitLeak = Math.min(rawLeak, expectedProfit);
  const profitIfCollected = Math.max(expectedProfit - profitLeak, 0);

  return { expectedProfit, costToServe, profitLeak, profitIfCollected };
};

const sumEconomics = (rows, delayKey) => {
  return rows.reduce(
    (acc, r) => {
      const amount = (r.value || 0) * 1_000_000; // value in $M
      const days = r[delayKey] || 0;
      const e = bucketEconomics(amount, days);
      acc.amount += amount;
      acc.expectedProfit += e.expectedProfit;
      acc.costToServe += e.costToServe;
      acc.profitLeak += e.profitLeak;
      acc.profitIfCollected += e.profitIfCollected;
      return acc;
    },
    {
      amount: 0,
      expectedProfit: 0,
      costToServe: 0,
      profitLeak: 0,
      profitIfCollected: 0,
    },
  );
};

export function InvoiceAging() {
 
  const BILLED_AGING = useMemo(
    () => [
      { name: "0–30 Days", value: 13.9, percentage: 75, count: 45, avgDaysLate: 5 },
      { name: "31–60 Days", value: 2.8, percentage: 15, count: 12, avgDaysLate: 25 },
      { name: "60+ Days", value: 1.8, percentage: 10, count: 8, avgDaysLate: 67 },
    ],
    [],
  );

  const CASH_TIMING = useMemo(
    () => [
      { name: "Next 7 days", value: 4.6, percentage: 25, count: 18, daysToCollect: 3, rangeLabel: "0–7 days" },
      { name: "8–30 days", value: 7.4, percentage: 40, count: 26, daysToCollect: 19, rangeLabel: "8–30 days" },
      { name: "31–60 days", value: 4.1, percentage: 22, count: 13, daysToCollect: 45, rangeLabel: "31–60 days" },
      { name: "60+ days", value: 2.4, percentage: 13, count: 8, daysToCollect: 90, rangeLabel: "60+ days" },
    ],
    [],
  );

  const [agingMode, setAgingMode] = useState("billed");
  const [activeIndex, setActiveIndex] = useState(null);

  
  const COLORS_BILLED = ["#10b981", "#f59e0b", "#ef4444"]; // green, amber, red
  const COLORS_CASH = ["#3b82f6", "#f59e0b", "#a855f7", "#ef4444"]; // blue, amber, purple, red

  const agingData = useMemo(
    () => (agingMode === "billed" ? BILLED_AGING : CASH_TIMING),
    [agingMode, BILLED_AGING, CASH_TIMING],
  );

  const colors = agingMode === "billed" ? COLORS_BILLED : COLORS_CASH;

  const AgingTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;

    const d = payload[0].payload;
    const amount = (d?.value || 0) * 1_000_000;

    const delayDays =
      agingMode === "billed" ? (d?.avgDaysLate || 0) : (d?.daysToCollect || 0);

    const econ = bucketEconomics(amount, delayDays);

    return (
      <div className="rounded-xl border bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
        <p className="text-sm font-semibold">{d?.name}</p>

        <p className="text-xs text-muted-foreground">
          Amount: ${d?.value}M • Share: {d?.percentage}% • Invoices: {d?.count}
        </p>

        <div className="mt-2 space-y-1">
          {agingMode === "cash" ? (
            <p className="text-xs text-muted-foreground">
              Expected receive: {d?.rangeLabel} (avg {delayDays}d)
            </p>
          ) : (
            <p className="text-xs text-muted-foreground">
              Avg lateness: {delayDays} days (profit leakage model)
            </p>
          )}

          <p className="text-xs">
            Cost:{" "}
            <span className="font-medium">
              {formatMoneyFull(econ.costToServe)}
            </span>
          </p>
          <p className="text-xs">
            Expected profit:{" "}
            <span className="font-medium">
              {formatMoneyFull(econ.expectedProfit)}
            </span>
          </p>
          <p className="text-xs text-red-600">
            Profit at risk:{" "}
            <span className="font-semibold">
              {formatMoneyFull(econ.profitLeak)}
            </span>
          </p>
          <p className="text-xs text-emerald-700">
            Profit if collected:{" "}
            <span className="font-semibold">
              {formatMoneyFull(econ.profitIfCollected)}
            </span>
          </p>
        </div>
      </div>
    );
  };

  const renderAgingLabel = ({ cx, cy, midAngle, outerRadius, payload }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 13;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#111827"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-[12px]"
      >
        {`${payload?.percentage ?? 0}%`}
      </text>
    );
  };

  const totals =
    agingMode === "billed"
      ? sumEconomics(BILLED_AGING, "avgDaysLate")
      : sumEconomics(CASH_TIMING, "daysToCollect");

  const headlineLeft =
    agingMode === "billed" ? "Recognized (billed)" : "Expected cash inflow";

  const headlineValue = formatCurrency(totals.amount);

  return (
    <Card className="border-border/60 bg-background/70 shadow-sm rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <span>Invoice Aging</span>
            <span className="text-xs font-normal text-muted-foreground">
              {agingMode === "billed"
                ? "Billed / recognized revenue vs outstanding AR (cash not received yet)"
                : "Cash timing forecast — when money comes in + profit erosion from delays"}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={agingMode === "billed" ? "default" : "outline"}
              size="sm"
              className="h-8 rounded-xl"
              onClick={() => setAgingMode("billed")}
            >
              Billed
            </Button>
            <Button
              variant={agingMode === "cash" ? "default" : "outline"}
              size="sm"
              className="h-8 rounded-xl"
              onClick={() => setAgingMode("cash")}
            >
              Receivables
            </Button>

            <Select defaultValue="current">
              <SelectTrigger className="w-[132px] h-8 text-sm rounded-xl border-border/70">
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* chart */}
          <div className="relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={agingData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="value"
                  label={renderAgingLabel}
                  labelLine
                  onMouseEnter={(_, idx) => setActiveIndex(idx)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {agingData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      stroke="hsl(var(--background))"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip content={<AgingTooltip />} cursor={false} position={{ x: 300, y: 10 }} offset={18} />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-xl font-bold">{headlineValue}</p>
                <p className="text-[11px] text-muted-foreground">
                  {headlineLeft}
                </p>
              </div>
            </div>
          </div>

          {/* list */}
          <div className="space-y-2">
            {agingData.map((item, index) => {
              const amount = (item.value || 0) * 1_000_000;
              const delayDays =
                agingMode === "billed"
                  ? (item.avgDaysLate || 0)
                  : (item.daysToCollect || 0);

              const econ = bucketEconomics(amount, delayDays);

              return (
                <div
                  key={item.name}
                  className="flex items-center justify-between px-3 py-2 rounded-2xl border border-border/60 bg-accent/20 hover:bg-accent/35 transition-colors"
                >
                  <div className="flex items-center gap-2.5 flex-1">
                    <div
                      className="h-3.5 w-3.5 rounded-sm flex-shrink-0"
                      style={{ backgroundColor: colors[index % colors.length] }}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {agingMode === "cash"
                          ? `Receive: ${item.rangeLabel} (avg ${delayDays}d)`
                          : `Avg lateness: ${delayDays}d`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-5 text-[12px]">
                    <div className="text-right min-w-[72px]">
                      <p className="font-bold">${item.value}M</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.percentage}% • {item.count} inv
                      </p>
                    </div>

                    <div className="text-right min-w-[92px]">
                      <p className="font-semibold text-emerald-700">
                        {formatCurrency(Math.round(econ.profitIfCollected))}
                      </p>
                      <p className="text-[11px] text-red-600">
                        -{formatCurrency(Math.round(econ.profitLeak))} risk
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* bottom economics */}
          <div className="grid grid-cols-3 gap-3 pt-3 border-t">
            <div className="rounded-2xl border border-border/60 bg-background/70 p-3">
              <p className="text-[11px] text-muted-foreground">
                Cost (deal economics)
              </p>
              <p className="text-base font-semibold mt-1">
                {formatCurrency(Math.round(totals.costToServe))}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                What you’re “spending” to deliver
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-emerald-50/60 p-3">
              <p className="text-[11px] text-muted-foreground">Expected profit</p>
              <p className="text-base font-semibold mt-1 text-emerald-700">
                {formatCurrency(Math.round(totals.expectedProfit))}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                If collected on-time
              </p>
            </div>

            <div className="rounded-2xl border border-border/60 bg-red-50/60 p-3">
              <p className="text-[11px] text-muted-foreground">
                Profit at risk (delay)
              </p>
              <p className="text-base font-semibold mt-1 text-red-700">
                {formatCurrency(Math.round(totals.profitLeak))}
              </p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Leakage due to late cash receipt
              </p>
            </div>
          </div>

          {/* cash-mode extra */}
          {agingMode === "cash" ? (
            <div className="rounded-2xl border border-border/60 bg-muted/20 p-3">
              <p className="text-[11px] text-muted-foreground">
                Forecast: cash + profit you’ll actually realize
              </p>
              <div className="mt-1 flex items-end justify-between gap-3 flex-wrap">
                <div>
                  <p className="text-sm font-semibold">
                    Expected cash to receive:{" "}
                    {formatCurrency(Math.round(totals.amount))}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    (same as AR total, but staged by timing buckets)
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-sm font-semibold text-emerald-700">
                    Profit if collected as forecast:{" "}
                    {formatCurrency(Math.round(totals.profitIfCollected))}
                  </p>
                  <p className="text-[11px] text-red-600">
                    Profit erosion baked in: -
                    {formatCurrency(Math.round(totals.profitLeak))}
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
