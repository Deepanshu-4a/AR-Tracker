import { ArrowLeft, Building2, CalendarDays, Mail, Phone } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

export function CustomerProfileSidebar({ customer, onBack }) {
  const initials = customer.name
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();

  const arBalance = customer.arBalance || 340000;
  const creditLimit = 500000;
  const utilization = Math.round((arBalance / creditLimit) * 100);

  return (
    <aside className="sticky top-8">
      <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm">
        {/* Back */}
        <Button
          variant="ghost"
          onClick={onBack}
          className="px-0 text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Registry
        </Button>

        {/* Profile Header */}
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

        {/* Status */}
        <div className="mt-4 flex gap-2">
          <Badge className="rounded-full bg-muted text-foreground text-xs px-3 py-1">
            B2B Account
          </Badge>
          <Badge className="rounded-full bg-emerald-100 text-emerald-700 text-xs px-3 py-1">
            Active
          </Badge>
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-border" />

        {/* Financial Snapshot */}
        <div className="space-y-4">
          <SectionLabel>Financial</SectionLabel>

          <Metric label="AR Balance" value={`$${arBalance.toLocaleString()}`} />
          <Metric
            label="Credit Limit"
            value={`$${creditLimit.toLocaleString()}`}
          />
          <Metric
            label="Utilization"
            value={`${utilization}%`}
            highlight={utilization > 70}
          />
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-border" />

        {/* Account Details */}
        <div className="space-y-4">
          <SectionLabel>Account</SectionLabel>

          <InfoRow icon={Mail} label="Email" value={customer.email || "-"} />
          <InfoRow icon={Phone} label="Phone" value={customer.phone || "-"} />
          <InfoRow
            icon={CalendarDays}
            label="Customer Since"
            value="Aug 2020"
          />
        </div>

        {/* Divider */}
        <div className="my-6 h-px bg-border" />

        {/* Organization */}
        <div className="space-y-4">
          <SectionLabel>Organization</SectionLabel>

          <InfoRow icon={Building2} label="Segment" value="Enterprise" />
          <Metric label="Account Owner" value="Collections Team" />
          <Metric label="Preferred Channel" value="Email" />
        </div>
      </div>
    </aside>
  );
}

/* ========================== */
/* Small Components           */
/* ========================== */

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function Metric({ label, value, highlight }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span
        className={`text-sm font-medium ${
          highlight ? "text-destructive" : "text-foreground"
        }`}
      >
        {value}
      </span>
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