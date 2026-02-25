import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

/* ===================================================== */
/* CUSTOMER PROFILE SIDEBAR                             */
/* ===================================================== */

export function CustomerProfileSidebar({ customer, onBack }) {
  if (!customer) return null;

  const initials = customer.name
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  /* ================= LOW RISK MOCK DATA ================= */

  const creditLimit = 500000;
  const openInvoices = 6;
  const disputes = 0;
  const lastPayment = 48000;

  // Low risk profile
  const arBalance = customer.arBalance ?? 120000;
  const avgDaysToPay = customer.avgDaysToPay ?? 24;

  // Only 8% overdue (very healthy)
  const overdue = Math.floor(arBalance * 0.08);

  const percentUtilization = creditLimit > 0 ? arBalance / creditLimit : 0;

  const availableCredit = creditLimit - arBalance;

  /* ================= RISK CALCULATION ================= */

  const overdueRatio = overdue / arBalance;
  const paymentRatio = avgDaysToPay / 90;
  const utilizationRatio = arBalance / creditLimit;

  const riskScore = Math.min(
    100,
    Math.round(overdueRatio * 40 + paymentRatio * 40 + utilizationRatio * 20),
  );

  const risk = {
    label: "Low Risk",
    tone: "bg-emerald-600 text-white",
    bar: "bg-emerald-500",
  };

  const overduePercent = Math.round((overdue / arBalance) * 100);

  return (
    <aside className="sticky top-8">
      <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm space-y-8">
        {/* BACK BUTTON */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="px-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Registry
        </Button>

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg font-semibold bg-muted">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight">
              {customer.name}
            </h2>
            <p className="text-xs text-muted-foreground">
              Customer ID {customer.id}
            </p>
          </div>
        </div>

        {/* ================= ENHANCED RISK PROFILE ================= */}

        <div className="space-y-4">
          <SectionLabel>Risk Profile</SectionLabel>

          <div className="rounded-2xl border-2 border-emerald-500/30 bg-gradient-to-br from-emerald-50 to-white p-6 shadow-md space-y-5">
            {/* Top Section */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-6 w-6 text-emerald-600" />
                <div>
                  <p className="text-xs text-emerald-700 font-medium">
                    Credit Health Status
                  </p>
                  <p className="text-2xl font-semibold text-emerald-700">
                    {riskScore}
                    <span className="text-sm font-normal text-emerald-600">
                      {" "}
                      / 100
                    </span>
                  </p>
                </div>
              </div>

              <Badge className={`px-3 py-1 rounded-full text-xs ${risk.tone}`}>
                {risk.label}
              </Badge>
            </div>

            {/* Score Bar */}
            <div className="h-3 w-full rounded-full bg-emerald-100 overflow-hidden">
              <div
                className={`h-full ${risk.bar}`}
                style={{ width: `${riskScore}%` }}
              />
            </div>

            {/* Summary Line */}
            <p className="text-sm text-emerald-700 font-medium">
              Strong payment behavior and low exposure risk.
            </p>

            {/* Drivers */}
            <div className="grid grid-cols-3 gap-4 text-sm pt-2">
              <RiskDriver label="Avg Days" value={`${avgDaysToPay}d`} />
              <RiskDriver label="Overdue" value={`${overduePercent}%`} />
              <RiskDriver
                label="Utilization"
                value={`${Math.round(percentUtilization * 100)}%`}
              />
            </div>
          </div>
        </div>

        {/* ================= FINANCIAL OVERVIEW ================= */}

        <div className="space-y-4">
          <SectionLabel>Financial Overview</SectionLabel>

          <div className="space-y-3">
            <Metric
              label="AR Balance"
              value={`$${arBalance.toLocaleString()}`}
            />
            <Metric
              label="Available Credit"
              value={`$${availableCredit.toLocaleString()}`}
            />
            <Metric
              label="Credit Limit"
              value={`$${creditLimit.toLocaleString()}`}
            />
            <Metric label="Open Invoices" value={openInvoices} />
            <Metric label="Disputes" value={disputes} />
            <Metric
              label="Last Payment"
              value={`$${lastPayment.toLocaleString()}`}
            />
          </div>
        </div>

        {/* ================= ACCOUNT INFO ================= */}

        <div className="space-y-4">
          <SectionLabel>Account</SectionLabel>

          <div className="space-y-4">
            <InfoRow icon={Mail} label="Email" value={customer.email || "-"} />
            <InfoRow icon={Phone} label="Phone" value={customer.phone || "-"} />
            <InfoRow
              icon={CalendarDays}
              label="Customer Since"
              value="Aug 2020"
            />
          </div>
        </div>

        {/* ================= ORGANIZATION ================= */}

        <div className="space-y-4">
          <SectionLabel>Organization</SectionLabel>

          <div className="space-y-3">
            <Metric label="Segment" value="Enterprise" />
            <Metric label="Account Owner" value="Collections Team" />
            <Metric label="Preferred Channel" value="Email" />
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ===================================================== */
/* SMALL COMPONENTS                                     */
/* ===================================================== */

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className="text-sm font-medium text-right break-words">
        {value}
      </span>
    </div>
  );
}

function RiskDriver({ label, value }) {
  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
