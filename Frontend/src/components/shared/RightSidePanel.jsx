import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { ChevronLeft, ChevronRight, Pencil } from "lucide-react";

export function RightSidePanel({ customer, invoice, balanceDue, total }) {
  const [collapsed, setCollapsed] = useState(false);

  const mockInvoice = {
    status: invoice?.status || "Sent",
    billingTerms: invoice?.billingTerms || "Net 30",
    dueDate: invoice?.dueDate || "2026-02-15",
    currency: invoice?.currency || "USD",
    auditTrail: invoice?.auditTrail || [
      { ts: "2026-01-10T09:00:00Z" },
      { ts: "2026-01-12T14:30:00Z" },
    ],
  };

  const displayTotal = total ?? 962500;
  const displayBalance = balanceDue ?? 962500;

  /* ================= COLLAPSED ================= */

  if (collapsed) {
    return (
      <div className="sticky top-8 w-[60px] shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="w-full bg-card border border-border rounded-xl shadow-sm p-3 hover:bg-muted transition flex justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  /* ================= EXPANDED ================= */

  return (
    <div className="sticky top-8 h-[calc(100vh-96px)] w-[280px] shrink-0">
      <div className="h-full rounded-2xl border border-border/60 bg-card shadow-lg flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-border/60">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Context Panel
          </p>

          <button
            onClick={() => setCollapsed(true)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <Tabs defaultValue="customer" className="flex flex-col flex-1 min-h-0">
          {/* TAB SWITCHER */}
          <div className="px-6 pt-5 pb-4 border-b border-border/60">
            <TabsList className="grid grid-cols-2 w-full bg-muted rounded-xl p-1">
              <TabsTrigger
                value="customer"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Customer
              </TabsTrigger>

              <TabsTrigger
                value="transaction"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Transaction
              </TabsTrigger>
            </TabsList>
          </div>

          {/* SCROLL AREA */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 space-y-8">
            {/* ================= CUSTOMER TAB ================= */}
            <TabsContent value="customer" className="space-y-8 text-sm mt-0">
              <div className="rounded-xl p-6 bg-muted/40 border border-border/50 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Customer Overview</h4>
                  <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>

                <Row label="Preferred delivery" value="E-mail" />
                <Row
                  label="Open balance"
                  value={`$${displayBalance.toLocaleString()}`}
                  highlight
                />
                <Row label="Credit limit" value="$2,000,000" />
              </div>

              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
                  Recent Transactions
                </h4>

                <div className="space-y-3">
                  <ActivityRow
                    title="Invoice INV-2026-001"
                    subtitle="Jan 10, 2026"
                    amount="$962,500.00"
                  />
                  <ActivityRow
                    title="Payment PMT-44321"
                    subtitle="Jan 18, 2026"
                    amount="$250,000.00"
                    type="positive"
                  />
                  <ActivityRow
                    title="Credit Memo CM-1003"
                    subtitle="Dec 28, 2025"
                    amount="-$12,000.00"
                    type="negative"
                  />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-background border border-border/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Notes</h4>
                  <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>

                <p>Customer prefers ACH payments over wire transfers.</p>
                <p className="text-xs text-muted-foreground">
                  Last reviewed account on Jan 22, 2026.
                </p>
              </div>
            </TabsContent>

            {/* ================= TRANSACTION TAB ================= */}
            <TabsContent value="transaction" className="space-y-8 text-sm mt-0">
              <div className="rounded-2xl p-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Invoice Amount
                </p>

                <p className="text-3xl font-semibold mt-3">
                  ${displayTotal.toLocaleString()}
                </p>

                <div className="mt-5 flex justify-between text-sm">
                  <span className="text-muted-foreground">Balance Due</span>
                  <span className="text-destructive font-medium">
                    ${displayBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
                  Summary
                </h4>

                <div className="space-y-4">
                  <SummaryRow label="Status" value={mockInvoice.status} />
                  <SummaryRow label="Terms" value={mockInvoice.billingTerms} />
                  <SummaryRow
                    label="Created"
                    value={
                      new Date(
                        mockInvoice.auditTrail[0].ts,
                      ).toLocaleDateString() + " by Admin"
                    }
                  />
                  <SummaryRow
                    label="Last Edited"
                    value={
                      new Date(
                        mockInvoice.auditTrail[
                          mockInvoice.auditTrail.length - 1
                        ].ts,
                      ).toLocaleDateString() + " by Admin"
                    }
                  />
                  <SummaryRow
                    label="Due Date"
                    value={new Date(mockInvoice.dueDate).toLocaleDateString()}
                  />
                  <SummaryRow label="Currency" value={mockInvoice.currency} />
                </div>
              </div>

              <div className="p-6 rounded-xl bg-muted/40 border border-border/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Internal Notes</h4>
                  <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>

                <p>
                  Invoice sent via email. Awaiting confirmation from customer’s
                  finance team.
                </p>

                <p className="text-xs text-muted-foreground">
                  Updated Jan 18, 2026
                </p>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={highlight ? "text-destructive font-medium" : "font-medium"}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function ActivityRow({ title, subtitle, amount, type }) {
  return (
    <div className="p-4 rounded-xl border border-border/50 bg-background hover:bg-muted/40 transition cursor-pointer flex justify-between items-center">
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <p
        className={
          type === "positive"
            ? "text-emerald-600 font-medium"
            : type === "negative"
              ? "text-destructive font-medium"
              : "font-medium"
        }
      >
        {amount}
      </p>
    </div>
  );
}
