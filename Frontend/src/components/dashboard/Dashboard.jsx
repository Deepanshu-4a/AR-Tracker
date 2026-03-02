import React, { useMemo, useState } from "react";
import {
  FileText,
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
  User,
  ChevronDown,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  PlugZap,
  BellRing,
  TriangleAlert,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { AlertsAndSignals } from "./AlertsAndSignals";
import { TopOutstandingInvoices } from "./TopOutstandingInvoices";
import {
  Settings01Icon as Settings,
  Logout01Icon as LogOut,
  UserIcon as UserIconHuge,
} from "hugeicons-react";
import { FinancialSnapshot } from "./FinancialSnapshot";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ActionQueue } from "./ActionQueue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvoiceAging } from "./InvoiceAging";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Separator } from "@/components/ui/separator";

import { ResponsiveContainer, Cell, PieChart, Pie, Tooltip } from "recharts";

const formatCurrency = (amount) => {
  if (typeof amount === "string") return amount;
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
};

const badgeTone = (tone) => {
  if (tone === "danger") return "bg-red-100 text-red-700";
  if (tone === "warning") return "bg-orange-100 text-orange-700";
  if (tone === "info") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
};

const actionTone = (cta) => {
  if (cta === "Approve") return "bg-emerald-100 text-emerald-700";
  if (cta === "Resolve") return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-700";
};


const NET_MARGIN_ASSUMPTION = 0.224; // 22.4% from your Net Margin KPI
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

export function Dashboard({
  activeTab,
  setActiveTab,
  onLogout,

  onOpenInvoice,
  onOpenCustomer,
  onOpenIntegrations,
  onOpenAutomations,
  onOpenAdminUsers,
  onOpenAdminAudit,

  user = {
    name: "4A Employee",
    email: "4AEmployee@example.com",
    role: "Admin",
  },
}) {
  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  const openActionDialog = (item) => {
    setSelectedAction(item);
    setActionDialogOpen(true);
  };

  const closeActionDialog = () => {
    setActionDialogOpen(false);
    setSelectedAction(null);
  };

  const markHandled = (id) => {
    setHandledIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const goToSource = () => {
    selectedAction?.destination?.();
    closeActionDialog();
  };

  const runPrimaryAction = () => {
    if (!selectedAction) return;
    markHandled(selectedAction.id);
    closeActionDialog();
  };

  const primaryActionLabel = (cta) => {
    if (cta === "Resolve") return "Resolve";
    if (cta === "Approve") return "Approve";
    return "Mark reviewed";
  };

  const secondaryActionLabel = (item) => {
    if (!item) return "View details";
    if (item.entityType === "Automation") return "Open automations";
    if (item.entityType === "System") return "Open integrations";
    if (item.entityType === "Admin") return "Open admin";
    return "Open revenue";
  };

  const getStatusBadge = (status) => {
    if (status === "overdue")
      return { label: "Overdue", color: "bg-red-100 text-red-700" };
    if (status === "late")
      return { label: "Late", color: "bg-orange-100 text-orange-700" };
    return { label: "Due Soon", color: "bg-yellow-100 text-yellow-700" };
  };

  return (
    <div className="min-h-screen w-full bg-[radial-gradient(90%_120%_at_10%_0%,hsl(var(--muted))_0%,transparent_55%),radial-gradient(90%_120%_at_90%_0%,hsl(var(--muted))_0%,transparent_55%)]">
      {/* Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-[580px] rounded-2xl border-border/60 shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
                <BellRing className="h-5 w-5 text-orange-600" />
              </span>
              <span className="truncate">
                {selectedAction?.cta || "Review"}: {selectedAction?.type || ""}
              </span>
            </DialogTitle>
            <DialogDescription>
              Confirm quickly here, or open the source screen for full
              drill-down.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Card className="border-border/60 shadow-sm">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {selectedAction?.entityType || "Entity"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`text-xs ${actionTone(selectedAction?.cta)}`}
                      >
                        {selectedAction?.cta || "Review"}
                      </Badge>
                      {selectedAction?.impact ? (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-green-100 text-green-700"
                        >
                          Impact: {formatCurrency(selectedAction.impact)}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="text-xs bg-slate-100 text-slate-700"
                        >
                          No direct $ impact
                        </Badge>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="font-medium text-foreground/90">
                        {selectedAction?.entity || "—"}
                      </span>{" "}
                      — {selectedAction?.recommendation || "—"}
                    </p>
                  </div>
                </div>

                {selectedAction?.cta === "Approve" ? (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <p className="text-muted-foreground">Invoice</p>
                        <p className="font-semibold mt-1">
                          {selectedAction?.invoiceNo || "—"}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-semibold mt-1">
                          {selectedAction?.customerName ||
                            selectedAction?.entity ||
                            "—"}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-semibold mt-1">
                          {formatCurrency(
                            selectedAction?.amount ??
                              selectedAction?.impact ??
                              0,
                          )}
                        </p>
                      </div>
                      <div className="rounded-xl border bg-muted/30 p-3">
                        <p className="text-muted-foreground">Status</p>
                        <p className="font-semibold mt-1">
                          {selectedAction?.status || "Ready"}
                        </p>
                      </div>
                    </div>
                  </>
                ) : null}
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              Tip: confirm here to keep Home fast, or drill down for details.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={goToSource}
              className="rounded-xl border-border/70"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              {secondaryActionLabel(selectedAction)}
            </Button>

            <Button onClick={runPrimaryAction} className="rounded-xl">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {primaryActionLabel(selectedAction?.cta)}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Dashboard</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Overview of cash flow, AR/AP, and what needs attention today.
            </p>
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="h-10 gap-2 rounded-2xl border-border/70 bg-background/70 shadow-sm hover:bg-accent/40"
              >
                <div className="h-7 w-7 rounded-full bg-orange-50 flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium max-w-[160px] truncate">
                  {user?.name || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-[280px] rounded-2xl border-border/60 shadow-xl"
            >
              <DropdownMenuLabel className="py-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-2xl bg-orange-50 flex items-center justify-center">
                    <UserIconHuge className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold leading-none truncate">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 truncate">
                      {user?.email || "user@example.com"}
                    </p>
                    {user?.role ? (
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.role}
                      </p>
                    ) : null}
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => setActiveTab?.("settings")}
                className="cursor-pointer"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => onLogout?.()}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Financial Snapshot */}
        <FinancialSnapshot setActiveTab={setActiveTab} />

        {/* MIDDLE: Top Invoices + Aging Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Outstanding Invoices */}
          <TopOutstandingInvoices
            setActiveTab={setActiveTab}
            onOpenInvoice={onOpenInvoice}
          />

          <InvoiceAging />
        </div>

        {/* BOTTOM: Action Queue + Alerts */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          {/* Action Queue */}
          <ActionQueue
            setActiveTab={setActiveTab}
            onOpenCustomer={onOpenCustomer}
            onOpenInvoice={onOpenInvoice}
            onOpenIntegrations={onOpenIntegrations}
            onOpenAutomations={onOpenAutomations}
            onOpenAdminUsers={onOpenAdminUsers}
            onOpenAction={openActionDialog}
          />

          {/* Alerts & Signals */}
          <AlertsAndSignals
            setActiveTab={setActiveTab}
            onOpenAutomations={onOpenAutomations}
            onOpenAdminAudit={onOpenAdminAudit}
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
