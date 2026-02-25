import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";

export function CustomerOverview({ customer }) {
  if (!customer) return null;

  /* ===== MOCK UI DATA ===== */

  const creditLimit = 500000;
  const openInvoices = 14;
  const lastPayment = 24000;
  const oldestInvoiceDays = 67;
  const disputes = 2;

  const overdue = Math.floor(customer.arBalance * 0.28);
  const current = customer.arBalance - overdue;

  const percentUtilization = customer.arBalance / creditLimit;
  const availableCredit = creditLimit - customer.arBalance;

  const riskScore = Math.min(
    100,
    Math.round(
      (overdue / customer.arBalance) * 40 +
        (customer.avgDaysToPay / 90) * 40 +
        percentUtilization * 20,
    ),
  );

  const getRisk = () => {
    if (riskScore >= 75)
      return {
        label: "High Risk",
        tone: "bg-red-50 text-red-600 border-red-200",
      };
    if (riskScore >= 50)
      return {
        label: "Moderate Risk",
        tone: "bg-yellow-50 text-yellow-600 border-yellow-200",
      };
    return {
      label: "Low Risk",
      tone: "bg-green-50 text-green-600 border-green-200",
    };
  };

  const risk = getRisk();

  const aging = {
    current,
    d30: Math.floor(overdue * 0.5),
    d60: Math.floor(overdue * 0.3),
    d90: Math.floor(overdue * 0.2),
  };

  return (
    <div className="space-y-5">
      {/* ================= EXECUTIVE HEADER ================= */}
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">
              {customer.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              {customer.email} • {customer.phone}
            </p>
          </div>

          <Badge className={cn("border px-3 py-1 text-xs", risk.tone)}>
            {risk.label}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <HeaderStat
            label="AR Balance"
            value={`$${customer.arBalance.toLocaleString()}`}
          />
          <HeaderStat
            label="Available Credit"
            value={`$${availableCredit.toLocaleString()}`}
          />
          <HeaderStat
            label="Utilization"
            value={`${Math.round(percentUtilization * 100)}%`}
          />
        </div>
      </Card>

      {/* ================= FINANCIAL SNAPSHOT ================= */}
      <Card className="p-5">
        <SectionTitle title="Financial Snapshot" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <KPI label="Overdue" value={`$${overdue.toLocaleString()}`} danger />
          <KPI
            label="Credit Limit"
            value={`$${creditLimit.toLocaleString()}`}
          />
          <KPI label="Avg Days to Pay" value={`${customer.avgDaysToPay}d`} />
          <KPI label="Open Invoices" value={openInvoices} />
          <KPI label="Disputes" value={disputes} />
          <KPI label="Risk Score" value={`${riskScore}/100`} />
        </div>
      </Card>

      {/* ================= PAYMENT INTELLIGENCE ================= */}
      <Card className="p-5">
        <SectionTitle title="Payment Intelligence" />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <InfoRow
            label="Last Payment"
            value={`$${lastPayment.toLocaleString()} • Jan 12`}
          />
          <InfoRow label="Oldest Invoice" value={`${oldestInvoiceDays} days`} />
          <InfoRow label="Collection Stage" value="Reminder Stage 2" />
          <InfoRow label="Payment Trend" value="Slowing ↓" highlight />
          <InfoRow label="Promise to Pay" value="No Active Promise" />
          <InfoRow label="Customer Since" value="Mar 2021" />
        </div>
      </Card>

      {/* ================= AGING BAR ================= */}
      <Card className="p-5 space-y-4">
        <SectionTitle title="Aging Breakdown" />

        {/* Proportional Bar */}
        <div className="h-3 w-full rounded-full overflow-hidden flex">
          <Segment
            value={aging.current}
            total={customer.arBalance}
            color="bg-green-500"
          />
          <Segment
            value={aging.d30}
            total={customer.arBalance}
            color="bg-yellow-500"
          />
          <Segment
            value={aging.d60}
            total={customer.arBalance}
            color="bg-orange-500"
          />
          <Segment
            value={aging.d90}
            total={customer.arBalance}
            color="bg-red-500"
          />
        </div>

        {/* Legend with Color Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <Legend label="Current" value={aging.current} color="bg-green-500" />
          <Legend label="1–30 Days" value={aging.d30} color="bg-yellow-500" />
          <Legend label="31–60 Days" value={aging.d60} color="bg-orange-500" />
          <Legend
            label="60+ Days"
            value={aging.d90}
            color="bg-red-500"
            highlight
          />
        </div>
      </Card>
    </div>
  );
}

/* ================= SMALL COMPONENTS ================= */

function SectionTitle({ title }) {
  return (
    <p className="text-xs font-semibold text-muted-foreground uppercase mb-4 tracking-wide">
      {title}
    </p>
  );
}

function HeaderStat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-base font-semibold">{value}</p>
    </div>
  );
}

function KPI({ label, value, danger }) {
  return (
    <div className="border rounded-lg p-3 bg-muted/30">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`font-semibold ${danger ? "text-red-600" : ""}`}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div className="flex justify-between border-b pb-2">
      <span className="text-muted-foreground">{label}</span>
      <span className={highlight ? "text-red-600 font-medium" : "font-medium"}>
        {value}
      </span>
    </div>
  );
}

function Segment({ value, total, color }) {
  const width = total ? (value / total) * 100 : 0;
  return <div className={color} style={{ width: `${width}%` }} />;
}

function Legend({ label, value, color, highlight }) {
  return (
    <div className="flex items-start gap-2">
      <div className={`h-2 w-2 rounded-full mt-1 ${color}`} />
      <div>
        <p className="text-muted-foreground">{label}</p>
        <p className={highlight ? "text-red-600 font-medium" : "font-medium"}>
          ${value.toLocaleString()}
        </p>
      </div>
    </div>
  );
}
