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
  Settings as SettingsLucide,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

import {
  Settings01Icon as Settings,
  Logout01Icon as LogOut,
  UserIcon as UserIconHuge,
} from "hugeicons-react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


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
    name: "Deepanshu Sharma",
    email: "deepanshu@example.com",
    role: "Admin",
  },
}) {
  const [activeIndex, setActiveIndex] = useState(null);

 
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const [handledIds, setHandledIds] = useState(() => new Set());

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

  
  const financialSnapshot = useMemo(
    () => [
      {
        key: "cash_in_mtd",
        label: "Cash In (MTD)",
        value: "$3.2M",
        change: "+4.1%",
        trend: "up",
        icon: DollarSign,
        
        onClick: () => setActiveTab?.("cash-in"), 
      },
      {
        key: "cash_out_mtd",
        label: "Cash Out (MTD)",
        value: "$2.1M",
        change: "+1.9%",
        trend: "up",
        icon: TrendingDown,
       
        onClick: () => setActiveTab("cash-out"),
      },
      {
        key: "net_margin",
        label: "Net Margin",
        value: "22.4%",
        change: "-0.8%",
        trend: "down",
        icon: TrendingUp,
        
        onClick: () => setActiveTab?.("net-margin"),
      },
      {
        key: "ar_outstanding",
        label: "AR Outstanding",
        value: "$18.5M",
        change: "+5.2%",
        trend: "up",
        icon: FileText,
        
         onClick: () => setActiveTab?.("ar-outstanding"),
      },
      {
        key: "ap_outstanding",
        label: "AP Outstanding",
        value: "$6.7M",
        change: "+2.6%",
        trend: "up",
        icon: Clock,
        
        onClick: () => setActiveTab?.("ap-outstanding"),
      },
    ],
    [setActiveTab]
  );

  
  const actionQueue = useMemo(
    () => [
      {
        id: "aq-1",
        type: "Overdue receivable",
        icon: Clock,
        entityType: "Customer",
        entity: "MegaMart",
        impact: 340000,
        recommendation:
          "Send final notice and set escalation if no response in 48h.",
        cta: "Review",
        severity: 5,
        destination: () => {
          setActiveTab?.("revenue");
          onOpenCustomer?.("MegaMart");
        },
      },
      {
        id: "aq-2",
        type: "Reminder automation failed",
        icon: TriangleAlert,
        entityType: "Automation",
        entity: "Collections Reminders",
        impact: 180000,
        recommendation: "Resolve failed run and retry missed sends.",
        cta: "Resolve",
        severity: 4,
        destination: () => {
          setActiveTab?.("automations");
          onOpenAutomations?.();
        },
      },
      {
        id: "aq-3",
        type: "Integration errors",
        icon: PlugZap,
        entityType: "System",
        entity: "Accounting Sync",
        impact: 0,
        recommendation: "Review event logs and reconnect credentials.",
        cta: "Resolve",
        severity: 4,
        destination: () => {
          setActiveTab?.("integrations");
          onOpenIntegrations?.();
        },
      },
      {
        id: "aq-4",
        type: "Users pending role assignment",
        icon: ShieldCheck,
        entityType: "Admin",
        entity: "2 new users",
        impact: 0,
        recommendation: "Assign roles to enable invoice approvals and audits.",
        cta: "Review",
        severity: 3,
        destination: () => {
          setActiveTab?.("admin");
          onOpenAdminUsers?.();
        },
      },
      {
        id: "aq-5",
        type: "Invoice ready to send",
        icon: FileText,
        entityType: "Customer",
        entity: "RetailHub",
        impact: 95000,
        recommendation: "Review invoice details and send to customer.",
        cta: "Approve",
        severity: 3,
        destination: () => {
          setActiveTab?.("revenue");
          onOpenInvoice?.("INV-2024-1502");
        },
        invoiceNo: "INV-2024-1502",
        customerName: "RetailHub",
        amount: 95000,
        dueDate: "Dec 12, 2024",
        status: "Approved",
      },
    ],
    [
      setActiveTab,
      onOpenCustomer,
      onOpenInvoice,
      onOpenIntegrations,
      onOpenAutomations,
      onOpenAdminUsers,
    ]
  );

  const sortedActionQueue = useMemo(() => {
    return [...actionQueue].sort((a, b) => {
      if (b.severity !== a.severity) return b.severity - a.severity;
      return (b.impact || 0) - (a.impact || 0);
    });
  }, [actionQueue]);

  const visibleActionQueue = useMemo(() => {
    return sortedActionQueue.filter((x) => !handledIds.has(x.id));
  }, [sortedActionQueue, handledIds]);

  
  const alertsAndSignals = useMemo(
    () => [
      {
        id: "sig-1",
        title: "Unusual cost spike detected",
        detail: "Vendor Bills increased 18% vs last week.",
        badge: "Signal",
        tone: "warning",
        onClick: () => setActiveTab?.("spend"),
      },
      {
        id: "sig-2",
        title: "Margin below threshold",
        detail: "2 customers dropped below 20% net margin.",
        badge: "Risk",
        tone: "danger",
        onClick: () => setActiveTab?.("margin"),
      },
      {
        id: "sig-3",
        title: "Automation outcomes",
        detail: "3 reminder runs failed in the last 24 hours.",
        badge: "Automation",
        tone: "warning",
        onClick: () => {
          setActiveTab?.("automations");
          onOpenAutomations?.();
        },
      },
      {
        id: "sig-4",
        title: "Recent permission changes",
        detail: "5 permission updates in the last 24 hours.",
        badge: "Admin",
        tone: "info",
        onClick: () => {
          setActiveTab?.("admin");
          onOpenAdminAudit?.();
        },
      },
    ],
    [setActiveTab, onOpenAutomations, onOpenAdminAudit]
  );

  
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
    ],
    []
  );

  const agingData = useMemo(
    () => [
      { name: "0-30 Days", value: 13.9, percentage: 75, count: 45 },
      { name: "31-60 Days", value: 2.8, percentage: 15, count: 12 },
      { name: "60+ Days", value: 1.8, percentage: 10, count: 8 },
    ],
    []
  );

  const COLORS = ["#10b981", "#f59e0b", "#ef4444"];

  const getStatusBadge = (status) => {
    if (status === "overdue")
      return { label: "Overdue", color: "bg-red-100 text-red-700" };
    if (status === "late")
      return { label: "Late", color: "bg-orange-100 text-orange-700" };
    return { label: "Due Soon", color: "bg-yellow-100 text-yellow-700" };
  };

  const AgingTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    const idx = payload[0].payload?.name === "0-30 Days" ? 0 : -1;
    const shiftX = idx === 0 ? 90 : 0;
    const shiftY = idx === 0 ? 10 : 0;

    return (
      <div
        style={{ transform: `translate(${shiftX}px, ${shiftY}px)` }}
        className="text-left rounded-md border bg-background px-3 py-2 shadow-md"
      >
        <p className="text-sm font-semibold">{d?.name}</p>
        <p className="text-xs text-muted-foreground">Amount: ${d?.value}M</p>
        <p className="text-xs text-muted-foreground">Share: {d?.percentage}%</p>
      </div>
    );
  };

  const renderAgingLabel = ({ cx, cy, midAngle, outerRadius, payload }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 25;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#1f2937"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="font-semibold text-sm"
      >
        {`${payload?.percentage ?? 0}%`}
      </text>
    );
  };

  return (
    <div className="min-h-screen w-full">
     
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-orange-600" />
              {selectedAction?.cta || "Review"}: {selectedAction?.type || ""}
            </DialogTitle>
            <DialogDescription>
              Confirm the action, or open the source screen for full drill-down.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            <Card className="border-border/50">
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

                    <p className="mt-3 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/90">
                        {selectedAction?.entity || "—"}
                      </span>{" "}
                      — {selectedAction?.recommendation || "—"}
                    </p>
                  </div>
                </div>

                {/* Extra context for Approve (optional, only shows if present) */}
                {selectedAction?.cta === "Approve" ? (
                  <>
                    <Separator />
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-muted-foreground">Invoice</p>
                        <p className="font-semibold mt-1">
                          {selectedAction?.invoiceNo || "—"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-muted-foreground">Customer</p>
                        <p className="font-semibold mt-1">
                          {selectedAction?.customerName ||
                            selectedAction?.entity ||
                            "—"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-muted-foreground">Amount</p>
                        <p className="font-semibold mt-1">
                          {formatCurrency(
                            selectedAction?.amount ?? selectedAction?.impact ?? 0
                          )}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
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
              You can keep Home fast by confirming here, or drill down for full
              details.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={goToSource} className="rounded-xl">
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

      <div className="space-y-6 p-4 md:p-6 lg:p-8 bg-linear-to-b from-muted/30 via-background to-background">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Dashboard
            </h1>
           
          </div>

          {/* Profile Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-10 gap-2">
                <div className="h-7 w-7 rounded-full bg-orange-50 flex items-center justify-center">
                  <User className="h-4 w-4 text-orange-600" />
                </div>
                <span className="text-sm font-medium">
                  {user?.name || "User"}
                </span>
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-[260px]">
              <DropdownMenuLabel className="py-3">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center">
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

        {/* Row 1: Action Queue + Alerts/Signals */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Action Queue */}
          <Card className="shadow-sm border-border/50 xl:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-orange-600" />
                  <span>Action Queue</span>
                </div>
                
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-2">
                {visibleActionQueue.length === 0 ? (
                  <div className="rounded-lg border bg-background p-6 text-center">
                    <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                      <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="mt-3 font-semibold">All clear</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      No actions require attention right now.
                    </p>
                  </div>
                ) : (
                  visibleActionQueue.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.id}
                        className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 border rounded-lg bg-background hover:bg-accent/40 transition-colors"
                      >
                        <div className="flex items-start gap-3 flex-1 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-orange-600" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold">{item.type}</p>
                              <Badge variant="secondary" className="text-xs">
                                {item.entityType}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={`text-xs ${actionTone(item.cta)}`}
                              >
                                {item.cta}
                              </Badge>

                              {item.impact ? (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-100 text-green-700"
                                >
                                  Impact: {formatCurrency(item.impact)}
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

                            <p className="text-sm text-muted-foreground mt-1 truncate">
                              <span className="font-medium text-foreground/90">
                                {item.entity}
                              </span>{" "}
                              — {item.recommendation}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-xl"
                            onClick={() => openActionDialog(item)}
                          >
                            {item.cta}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <p className="text-xs text-muted-foreground">

                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="rounded-xl"
                  onClick={() => setActiveTab?.("admin")}
                >
                  
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Alerts & Signals */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-600" />
                  <span>Alerts & Signals</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl"
                  onClick={() => setActiveTab?.("alerts-signals")}
                >
                  View
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              {alertsAndSignals.map((a) => (
                <button
                  key={a.id}
                  onClick={a.onClick}
                  className="w-full text-left p-3 border rounded-lg hover:bg-accent/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold truncate">{a.title}</p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {a.detail}
                      </p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={`${badgeTone(a.tone)} text-xs shrink-0`}
                    >
                      {a.badge}
                    </Badge>
                  </div>
                </button>
              ))}

              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                
                  
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 2: Financial Snapshot */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Financial Snapshot</span>
             
            </CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4">
              {financialSnapshot.map((m) => {
                const Icon = m.icon;
                const isUp = m.trend === "up";
                return (
                  <button
                    key={m.key}
                    onClick={m.onClick}
                    className="text-left rounded-2xl border bg-background/60 hover:bg-accent/40 transition-colors p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm text-muted-foreground">
                          {m.label}
                        </p>
                        <p className="text-2xl font-semibold mt-2">{m.value}</p>

                        <div className="flex items-center gap-2 mt-2">
                          {isUp ? (
                            <ArrowUp className="w-4 h-4 text-green-500" />
                          ) : (
                            <ArrowDown className="w-4 h-4 text-red-500" />
                          )}
                          <span
                            className={`text-sm font-medium ${
                              isUp ? "text-green-600" : "text-red-600"
                            }`}
                          >
                            {m.change}
                          </span>
                        </div>

                        <p className="text-xs text-muted-foreground mt-2">
                          {m.hint}
                        </p>
                      </div>

                      <div className="h-10 w-10 rounded-2xl bg-muted/40 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-foreground/70" />
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Row 3: Compact AR views */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Outstanding Invoices */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Top Outstanding Invoices</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 rounded-xl"
                  
                >
                  View All
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-3">
                {topOutstandingInvoices.map((invoice) => {
                  const statusBadge = getStatusBadge(invoice.status);
                  return (
                    <button
                      key={invoice.invoiceNo}
                      onClick={() => onOpenInvoice?.(invoice.invoiceNo)}
                      className="w-full text-left flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      title="Open Invoice Detail"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
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

                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span className="font-medium">{invoice.client}</span>
                          <span>•</span>
                          <span>Due: {invoice.dueDate}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-lg font-bold">
                          {formatCurrency(invoice.amount)}
                        </p>
                        <p className="text-xs text-red-600 font-medium">
                          {invoice.daysOverdue} days overdue
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                Click an invoice to drill into its detail view.
              </div>
            </CardContent>
          </Card>

          {/* ✅ Invoice Aging Distribution (kept as your original code block) */}
          <Card className="shadow-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center justify-between gap-3">
                <span>Invoice Aging Distribution</span>

                <Select defaultValue="current">
                  <SelectTrigger className="w-[120px] h-9 text-sm">
                    <SelectValue placeholder="Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="current">Current</SelectItem>
                    <SelectItem value="quarter">This Quarter</SelectItem>
                    <SelectItem value="year">This Year</SelectItem>
                  </SelectContent>
                </Select>
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <div className="relative flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={220}>
                    <PieChart>
                      <Pie
                        data={agingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
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
                            fill={COLORS[index % COLORS.length]}
                            stroke="hsl(var(--background))"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        content={<AgingTooltip />}
                        cursor={false}
                        offset={18}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                      <p className="text-2xl font-bold">$18.5M</p>
                      <p className="text-xs text-muted-foreground">Total AR</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  {agingData.map((item, index) => (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3.5 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div
                          className="h-4 w-4 rounded-sm flex-shrink-0"
                          style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="text-sm font-medium min-w-[90px]">
                          {item.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center min-w-[60px]">
                          <p className="font-semibold text-base">{item.count}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            invoices
                          </p>
                        </div>

                        <div className="text-right min-w-[70px]">
                          <p className="font-bold text-base">${item.value}M</p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {item.percentage}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                  <div className="text-center py-2">
                    <p className="text-xl font-bold text-green-600">75%</p>
                    <p className="text-xs text-muted-foreground mt-1">Current</p>
                  </div>
                  <div className="text-center border-x py-2">
                    <p className="text-xl font-bold text-orange-600">15%</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      31–60 Days
                    </p>
                  </div>
                  <div className="text-center py-2">
                    <p className="text-xl font-bold text-red-600">10%</p>
                    <p className="text-xs text-muted-foreground mt-1">60+ Days</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Row 4: Admin-first quick links */}
        {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => {
              setActiveTab?.("integrations");
              onOpenIntegrations?.();
            }}
            className="text-left"
          >
            <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlugZap className="h-5 w-5 text-blue-600" />
                  Integrations Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  2 systems connected · 1 error · last sync 12 min ago
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Drill into event logs & data ownership mapping.
                </p>
              </CardContent>
            </Card>
          </button>

          <button
            onClick={() => {
              setActiveTab?.("admin");
              onOpenAdminUsers?.();
            }}
            className="text-left"
          >
            <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Users & Roles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  2 pending role assignments · 8 active users
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Manage permissions and role-based controls.
                </p>
              </CardContent>
            </Card>
          </button>

          <button
            onClick={() => {
              setActiveTab?.("admin");
              onOpenAdminAudit?.();
            }}
            className="text-left"
          >
            <Card className="shadow-sm border-border/50 hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-orange-600" />
                  Audit & Notifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  5 permission changes · 3 automation failures (24h)
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Drill into audit logs and notification settings.
                </p>
              </CardContent>
            </Card>
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default Dashboard;
