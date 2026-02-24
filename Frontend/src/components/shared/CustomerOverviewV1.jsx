import { Badge } from "../ui/badge";
import { cn } from "../ui/utils";

export function CustomerOverviewV1({ customer }) {
  if (!customer) return null;

  const creditLimit = 500000;
  const openInvoices = 14;
  const lastPayment = 24000;
  const oldestInvoiceDays = 67;
  const disputes = 2;

  const overdue = Math.floor(customer.arBalance * 0.28);
  const current = Math.max(0, customer.arBalance - overdue);

  const utilization = creditLimit ? customer.arBalance / creditLimit : 0;
  const utilizationPct = Math.min(100, Math.round(utilization * 100));
  const availableCredit = Math.max(0, creditLimit - customer.arBalance);

  const riskScore = Math.min(
    100,
    Math.round(
      (customer.arBalance ? overdue / customer.arBalance : 0) * 40 +
        (customer.avgDaysToPay / 90) * 40 +
        utilization * 20,
    ),
  );

  const risk =
    riskScore >= 75
      ? { label: "High Risk", tone: "bg-red-50 text-red-700 border-red-200" }
      : riskScore >= 50
        ? {
            label: "Moderate Risk",
            tone: "bg-amber-50 text-amber-700 border-amber-200",
          }
        : {
            label: "Low Risk",
            tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
          };

  const aging = {
    current,
    d30: Math.floor(overdue * 0.5),
    d60: Math.floor(overdue * 0.3),
    d90: Math.floor(overdue * 0.2),
  };

  const overduePct = customer.arBalance
    ? Math.round((overdue / customer.arBalance) * 100)
    : 0;

  return (
    <div className="space-y-5">
      {/* ================= FINANCIAL OVERVIEW ================= */}
      <section className="rounded-xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
              Financial Overview
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Financial status and receivables health
            </p>
          </div>

          <Badge
            className={cn("rounded-full border px-3 py-1 text-xs", risk.tone)}
          >
            {risk.label}
          </Badge>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <KpiTile
            label="AR Balance"
            value={`$${customer.arBalance.toLocaleString()}`}
          />
          <KpiTile
            label="Available Credit"
            value={`$${availableCredit.toLocaleString()}`}
          />
          <KpiTile label="Utilization" value={`${utilizationPct}%`} />
          <KpiTile label="Open Invoices" value={`${openInvoices}`} />
        </div>
      </section>

      {/* ================= MID GRID ================= */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* RECEIVABLES */}
        <section className="rounded-xl border border-border bg-card p-5">
          <SectionTitle title="Receivables" />

          <div className="mt-4 grid grid-cols-2 gap-3">
            <DataTile
              label="Overdue"
              value={`$${overdue.toLocaleString()}`}
              danger
            />
            <DataTile
              label="Credit Limit"
              value={`$${creditLimit.toLocaleString()}`}
            />
            <DataTile
              label="Avg Days To Pay"
              value={`${customer.avgDaysToPay}d`}
            />
            <DataTile label="Disputes" value={`${disputes}`} />
          </div>

          {/* RISK BAR */}
          <div className="mt-4 rounded-lg border border-border/70 bg-muted/30 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wide text-muted-foreground">
                Risk Score
              </span>
              <span className="font-semibold text-foreground">
                {riskScore}/100
              </span>
            </div>

            <div className="mt-2 h-2 w-full rounded-full bg-muted flex overflow-hidden">
              <div
                className={cn(
                  "h-full",
                  riskScore >= 75
                    ? "bg-red-500"
                    : riskScore >= 50
                      ? "bg-amber-500"
                      : "bg-emerald-500",
                )}
                style={{ width: `${riskScore}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-muted-foreground">
              {overduePct}% of current AR is overdue.
            </p>
          </div>
        </section>

        {/* PAYMENT SIGNALS */}
        <section className="rounded-xl border border-border bg-card p-5">
          <SectionTitle title="Payment Signals" />

          <div className="mt-4 space-y-3">
            <SignalRow
              label="Last Payment"
              value={`$${lastPayment.toLocaleString()} on Jan 12`}
            />
            <SignalRow label="Collection Stage" value="Reminder Stage 2" />
            <SignalRow
              label="Oldest Invoice"
              value={`${oldestInvoiceDays} days`}
              alert
            />
            <SignalRow label="Trend" value="Slowing" alert />
          </div>
        </section>
      </div>

      {/* ================= AGING BREAKDOWN ================= */}
      <section className="rounded-xl border border-border bg-card p-5">
        <SectionTitle title="Aging Breakdown" />

        {/* FIXED FLEX BAR */}
        <div className="mt-4 h-4 w-full overflow-hidden rounded-full bg-muted/60 flex">
          <Segment
            value={aging.current}
            total={customer.arBalance}
            color="bg-emerald-500"
          />
          <Segment
            value={aging.d30}
            total={customer.arBalance}
            color="bg-amber-400"
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

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
          <Legend label="Current" value={aging.current} />
          <Legend label="1-30 days" value={aging.d30} />
          <Legend label="31-60 days" value={aging.d60} />
          <Legend label="61+ days" value={aging.d90} alert />
        </div>
      </section>
    </div>
  );
}

/* ================= SUB COMPONENTS ================= */

function SectionTitle({ title }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {title}
    </p>
  );
}

function KpiTile({ label, value }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 text-base font-semibold">{value}</p>
    </div>
  );
}

function DataTile({ label, value, danger }) {
  return (
    <div className="rounded-lg border border-border/70 bg-background p-3">
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold", danger && "text-red-700")}>
        {value}
      </p>
    </div>
  );
}

function SignalRow({ label, value, alert }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border/70 bg-background px-3 py-2.5">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium", alert && "text-red-700")}>
        {value}
      </span>
    </div>
  );
}

function Segment({ value, total, color }) {
  const width = total ? (value / total) * 100 : 0;

  if (width <= 0) return null;

  return <div className={cn("h-full", color)} style={{ width: `${width}%` }} />;
}

function Legend({ label, value, alert }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={cn("font-medium", alert && "text-red-700")}>
        ${value.toLocaleString()}
      </p>
    </div>
  );
}
