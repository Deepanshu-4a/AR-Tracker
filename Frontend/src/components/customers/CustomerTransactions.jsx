import { useState, useMemo } from "react";
import { cn } from "../ui/utils";

export function CustomerTransactions() {
  const [dateFilter, setDateFilter] = useState("This Week");

  /* ================= MOCK DATA ================= */

  const transactions = [
    {
      number: "INV-10421",
      date: "02/14/2026",
      dueDate: "03/16/2026",
      aging: "Current",
      amount: 28000,
      balance: 28000,
    },
    {
      number: "INV-10407",
      date: "01/30/2026",
      dueDate: "02/28/2026",
      aging: "15 Days",
      amount: 46000,
      balance: 32000,
    },
    {
      number: "INV-10392",
      date: "01/10/2026",
      dueDate: "02/09/2026",
      aging: "45 Days",
      amount: 18500,
      balance: 18500,
    },
    {
      number: "INV-10375",
      date: "12/18/2025",
      dueDate: "01/17/2026",
      aging: "60+ Days",
      amount: 72000,
      balance: 72000,
    },
    {
      number: "INV-10360",
      date: "12/02/2025",
      dueDate: "01/01/2026",
      aging: "Paid",
      amount: 15000,
      balance: 0,
    },
    {
      number: "INV-10344",
      date: "11/21/2025",
      dueDate: "12/21/2025",
      aging: "90+ Days",
      amount: 9400,
      balance: 9400,
    },
    {
      number: "INV-10320",
      date: "11/02/2025",
      dueDate: "12/02/2025",
      aging: "Paid",
      amount: 52000,
      balance: 0,
    },
  ];

  /* ================= KPI CALCULATIONS ================= */

  const kpis = useMemo(() => {
    const totalInvoiced = transactions.reduce((sum, t) => sum + t.amount, 0);
    const openBalance = transactions.reduce((sum, t) => sum + t.balance, 0);
    const overdueBalance = transactions
      .filter((t) => t.aging.includes("Days"))
      .reduce((sum, t) => sum + t.balance, 0);
    const collected = totalInvoiced - openBalance;

    return {
      totalInvoiced,
      openBalance,
      overdueBalance,
      collected,
    };
  }, [transactions]);

  return (
    <div className="flex flex-col h-full min-w-0 space-y-8">
      {/* ================= KPI STRIP ================= */}
      <div className="grid grid-cols-4 gap-4">
        <KPI label="Total Invoiced" value={kpis.totalInvoiced} />

        <KPI label="Open Balance" value={kpis.openBalance} tone="primary" />

        <KPI
          label="Overdue Balance"
          value={kpis.overdueBalance}
          tone="danger"
        />

        <KPI label="Collected" value={kpis.collected} tone="success" />
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap items-center gap-6 border-b border-border pb-4 text-sm">
        <Filter label="Show">
          <Select value="Invoices" />
        </Filter>

        <Filter label="Filter By">
          <Select value="All Invoices" />
        </Filter>

        <Filter label="Date">
          <Select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          />
        </Filter>

        <span className="text-muted-foreground text-xs">
          02/15/2026 - 02/21/2026
        </span>
      </div>

      {/* ================= TABLE ================= */}
      <div className="border border-border rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <Th>Num</Th>
              <Th>Date</Th>
              <Th>Due Date</Th>
              <Th>Aging</Th>
              <Th className="text-right">Amount</Th>
              <Th className="text-right">Open Balance</Th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t, i) => (
              <tr
                key={i}
                className={cn(
                  "border-t hover:bg-muted/30 transition-colors",
                  i % 2 === 0 ? "bg-white" : "bg-muted/10",
                )}
              >
                <Td>{t.number}</Td>
                <Td>{t.date}</Td>
                <Td>{t.dueDate}</Td>

                <Td>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      t.aging === "Paid" && "bg-emerald-100 text-emerald-700",
                      t.aging === "Current" && "bg-blue-100 text-blue-700",
                      t.aging === "15 Days" && "bg-yellow-100 text-yellow-700",
                      t.aging === "45 Days" && "bg-orange-100 text-orange-700",
                      t.aging === "60+ Days" && "bg-red-100 text-red-600",
                      t.aging === "90+ Days" && "bg-red-200 text-red-700",
                    )}
                  >
                    {t.aging}
                  </span>
                </Td>

                <Td className="text-right font-medium tabular-nums">
                  ${t.amount.toLocaleString()}
                </Td>

                <Td className="text-right font-semibold tabular-nums">
                  ${t.balance.toLocaleString()}
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= KPI COMPONENT ================= */

function KPI({ label, value, tone }) {
  return (
    <div
      className={cn(
        "rounded-2xl p-5 border transition-all hover:-translate-y-0.5 hover:shadow-md duration-200",
        tone === "primary" && "bg-primary/5 border-primary/20",
        tone === "danger" && "bg-destructive/5 border-destructive/20",
        tone === "success" && "bg-emerald-500/5 border-emerald-500/20",
        !tone && "bg-card border-border",
      )}
    >
      <p className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </p>

      <p
        className={cn(
          "text-2xl font-semibold mt-2 tabular-nums",
          tone === "primary" && "text-primary",
          tone === "danger" && "text-destructive",
          tone === "success" && "text-emerald-600",
        )}
      >
        ${value.toLocaleString()}
      </p>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function Filter({ label, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs uppercase">{label}</span>
      {children}
    </div>
  );
}

function Select({ value, onChange }) {
  return (
    <select
      onChange={onChange}
      className="border border-border rounded-md px-2 py-1 bg-background text-sm"
    >
      <option>{value}</option>
      <option>This Month</option>
      <option>Last 30 Days</option>
      <option>This Year</option>
    </select>
  );
}

function Th({ children, className }) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-left font-medium whitespace-nowrap",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, className }) {
  return (
    <td className={cn("px-3 py-2 whitespace-nowrap", className)}>{children}</td>
  );
}
