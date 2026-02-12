import React, { useMemo, useState } from "react";
import {
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  PlugZap,
  Bot,
  Search,
  Filter,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const toneBadge = (tone) => {
  if (tone === "danger") return "bg-red-100 text-red-700";
  if (tone === "warning") return "bg-orange-100 text-orange-700";
  if (tone === "info") return "bg-blue-100 text-blue-700";
  if (tone === "success") return "bg-emerald-100 text-emerald-700";
  return "bg-slate-100 text-slate-700";
};

const typeBadge = (type) => {
  if (type === "Signal") return "bg-orange-100 text-orange-700";
  if (type === "Risk") return "bg-red-100 text-red-700";
  if (type === "Automation") return "bg-yellow-100 text-yellow-700";
  if (type === "System") return "bg-blue-100 text-blue-700";
  if (type === "Admin") return "bg-slate-100 text-slate-700";
  return "bg-slate-100 text-slate-700";
};

const iconFor = (category) => {
  if (category === "Margin") return TrendingDown;
  if (category === "Spend") return TrendingUp;
  if (category === "Automation") return Bot;
  if (category === "Integrations") return PlugZap;
  if (category === "Admin") return ShieldCheck;
  return AlertTriangle;
};

export function AlertsAndSignalsPage({
  onBack,
  setActiveTab,

 
  onOpenAutomations,
  onOpenIntegrations,
  onOpenAdminAudit,
  onOpenCustomer,
  onOpenInvoice,
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("open"); 
  const [category, setCategory] = useState("all"); 
  const [severity, setSeverity] = useState("all"); 
  const [type, setType] = useState("all"); 

  const [selected, setSelected] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Simple local state for ack/resolution (UI-only)
  const [ackIds, setAckIds] = useState(() => new Set());
  const [resolvedIds, setResolvedIds] = useState(() => new Set());

  const signals = useMemo(
    () => [
      {
        id: "sig-1",
        title: "Unusual cost spike detected",
        detail: "Vendor Bills increased 18% vs last week.",
        type: "Signal",
        tone: "warning",
        category: "Spend",
        severity: 4,
        createdAt: "Today · 9:12 AM",
        entityType: "Vendor Bills",
        entity: "Cost Feed",
        recommendedAction: "Review cost feed and identify top drivers.",
        destination: () => setActiveTab?.("spend"),
      },
      {
        id: "sig-2",
        title: "Margin below threshold",
        detail: "2 customers dropped below 20% net margin.",
        type: "Risk",
        tone: "danger",
        category: "Margin",
        severity: 5,
        createdAt: "Today · 8:40 AM",
        entityType: "Customer",
        entity: "2 customers",
        recommendedAction: "Open Margin Diagnostics and review root causes.",
        destination: () => setActiveTab?.("margin"),
      },
      {
        id: "sig-3",
        title: "Automation outcomes: reminder failures",
        detail: "3 reminder runs failed in the last 24 hours.",
        type: "Automation",
        tone: "warning",
        category: "Automation",
        severity: 4,
        createdAt: "Yesterday · 6:18 PM",
        entityType: "Automation",
        entity: "Collections Reminders",
        recommendedAction: "Resolve failures and retry missed sends.",
        destination: () => {
          setActiveTab?.("automations");
          onOpenAutomations?.();
        },
      },
      {
        id: "sig-4",
        title: "Integration errors detected",
        detail: "Accounting Sync is failing intermittently.",
        type: "System",
        tone: "info",
        category: "Integrations",
        severity: 3,
        createdAt: "Yesterday · 1:02 PM",
        entityType: "System",
        entity: "Accounting Sync",
        recommendedAction:
          "Open event logs and reconnect credentials if needed.",
        destination: () => {
          setActiveTab?.("integrations");
          onOpenIntegrations?.();
        },
      },
      {
        id: "sig-5",
        title: "Recent permission changes",
        detail: "5 permission updates in the last 24 hours.",
        type: "Admin",
        tone: "info",
        category: "Admin",
        severity: 2,
        createdAt: "Yesterday · 10:26 AM",
        entityType: "Admin",
        entity: "Audit Log",
        recommendedAction: "Review audit log for unexpected changes.",
        destination: () => {
          setActiveTab?.("admin");
          onOpenAdminAudit?.();
        },
      },

     
      {
        id: "sig-6",
        title: "AR aging worsening",
        detail: "60+ day bucket grew by $0.6M week-over-week.",
        type: "Risk",
        tone: "warning",
        category: "Margin",
        severity: 4,
        createdAt: "2 days ago",
        entityType: "AR",
        entity: "Receivables",
        recommendedAction:
          "Check overdue invoices and start collections workflow.",
        destination: () => setActiveTab?.("revenue"),
      },
    ],
    [setActiveTab, onOpenAutomations, onOpenIntegrations, onOpenAdminAudit],
  );

  const computed = useMemo(() => {
    const withStatus = signals.map((s) => {
      const isResolved = resolvedIds.has(s.id);
      const isAck = ackIds.has(s.id);
      const status = isResolved ? "resolved" : isAck ? "acknowledged" : "open";
      return { ...s, status };
    });

    const q = query.trim().toLowerCase();

    const filtered = withStatus.filter((s) => {
      if (status !== "all" && s.status !== status) return false;
      if (category !== "all" && s.category !== category) return false;
      if (severity !== "all" && String(s.severity) !== String(severity))
        return false;
      if (type !== "all" && s.type !== type) return false;

      if (!q) return true;
      const hay =
        `${s.title} ${s.detail} ${s.entityType} ${s.entity} ${s.category} ${s.type}`.toLowerCase();
      return hay.includes(q);
    });

    const counts = withStatus.reduce(
      (acc, s) => {
        acc.total += 1;
        acc.open += s.status === "open" ? 1 : 0;
        acc.ack += s.status === "acknowledged" ? 1 : 0;
        acc.res += s.status === "resolved" ? 1 : 0;
        return acc;
      },
      { total: 0, open: 0, ack: 0, res: 0 },
    );

    return { filtered, counts };
  }, [signals, query, status, category, severity, type, ackIds, resolvedIds]);

  const openDialog = (item) => {
    setSelected(item);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelected(null);
  };

  const acknowledge = (id) => {
    setAckIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const resolve = (id) => {
    setResolvedIds((prev) => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const goToSource = () => {
    selected?.destination?.();
    closeDialog();
  };

  const StatusPill = ({ value }) => {
    if (value === "open")
      return (
        <Badge variant="secondary" className="bg-red-100 text-red-700 text-xs">
          Open
        </Badge>
      );
    if (value === "acknowledged")
      return (
        <Badge
          variant="secondary"
          className="bg-orange-100 text-orange-700 text-xs"
        >
          Acknowledged
        </Badge>
      );
    return (
      <Badge
        variant="secondary"
        className="bg-emerald-100 text-emerald-700 text-xs"
      >
        Resolved
      </Badge>
    );
  };

  return (
    <div className="min-h-screen w-full">
      {/* Details Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              {selected?.title || "Alert"}
            </DialogTitle>
            <DialogDescription>
              Review details, acknowledge, resolve, or open the source screen.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="border-border/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="secondary"
                        className={`${typeBadge(selected?.type)} text-xs`}
                      >
                        {selected?.type || "Signal"}
                      </Badge>
                      <Badge
                        variant="secondary"
                        className={`${toneBadge(selected?.tone)} text-xs`}
                      >
                        {selected?.category || "Category"}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Severity {selected?.severity ?? "—"}
                      </Badge>
                      {selected?.status ? (
                        <StatusPill value={selected.status} />
                      ) : null}
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground">
                      {selected?.detail || "—"}
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-muted-foreground">Entity</p>
                        <p className="font-semibold mt-1">
                          {selected?.entityType || "—"}{" "}
                          <span className="text-muted-foreground font-normal">
                            ·
                          </span>{" "}
                          {selected?.entity || "—"}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/40 p-3">
                        <p className="text-muted-foreground">Detected</p>
                        <p className="font-semibold mt-1">
                          {selected?.createdAt || "—"}
                        </p>
                      </div>
                    </div>

                    {selected?.recommendedAction ? (
                      <>
                        <Separator className="my-3" />
                        <div className="rounded-lg bg-muted/40 p-3">
                          <p className="text-muted-foreground text-sm">
                            Recommended action
                          </p>
                          <p className="mt-1 font-medium">
                            {selected.recommendedAction}
                          </p>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              Tip: Use acknowledge for “seen & triaged”, resolve once addressed.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={goToSource}
              className="rounded-xl"
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Open source
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                if (!selected) return;
                acknowledge(selected.id);
                closeDialog();
              }}
              className="rounded-xl"
              disabled={!selected || selected?.status !== "open"}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Acknowledge
            </Button>

            <Button
              onClick={() => {
                if (!selected) return;
                resolve(selected.id);
                closeDialog();
              }}
              className="rounded-xl"
              disabled={!selected || selected?.status === "resolved"}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Mark resolved
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="space-y-6 p-4 md:p-6 lg:p-8 bg-linear-to-b from-muted/30 via-background to-background">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Alerts & Signals
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Risk indicators and unusual trends surfaced by the system.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl"
              onClick={() => onBack?.()}
            >
              Back to Home
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-2xl font-semibold mt-1">
                {computed.counts.total}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Open</p>
              <p className="text-2xl font-semibold mt-1">
                {computed.counts.open}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Acknowledged</p>
              <p className="text-2xl font-semibold mt-1">
                {computed.counts.ack}
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-4">
              <p className="text-xs text-muted-foreground">Resolved</p>
              <p className="text-2xl font-semibold mt-1">
                {computed.counts.res}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-orange-600" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-3">
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search alerts, entities, categories..."
                    className="pl-9"
                  />
                </div>
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All status</SelectItem>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="acknowledged">Acknowledged</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>

              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  <SelectItem value="Margin">Margin</SelectItem>
                  <SelectItem value="Spend">Spend</SelectItem>
                  <SelectItem value="Automation">Automation</SelectItem>
                  <SelectItem value="Integrations">Integrations</SelectItem>
                  <SelectItem value="Admin">Admin</SelectItem>
                </SelectContent>
              </Select>

              <div className="grid grid-cols-2 gap-3">
                <Select value={severity} onValueChange={setSeverity}>
                  <SelectTrigger>
                    <SelectValue placeholder="Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All severities</SelectItem>
                    <SelectItem value="5">Severity 5</SelectItem>
                    <SelectItem value="4">Severity 4</SelectItem>
                    <SelectItem value="3">Severity 3</SelectItem>
                    <SelectItem value="2">Severity 2</SelectItem>
                    <SelectItem value="1">Severity 1</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={type} onValueChange={setType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All types</SelectItem>
                    <SelectItem value="Signal">Signal</SelectItem>
                    <SelectItem value="Risk">Risk</SelectItem>
                    <SelectItem value="Automation">Automation</SelectItem>
                    <SelectItem value="System">System</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Showing {computed.filtered.length} items
              </p>

              <Button
                variant="outline"
                className="rounded-xl"
                onClick={() => {
                  setQuery("");
                  setStatus("open");
                  setCategory("all");
                  setSeverity("all");
                  setType("all");
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <Card className="shadow-sm border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Alerts list</span>
              <Badge variant="secondary" className="text-xs">
                Drillable items
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {computed.filtered.length === 0 ? (
              <div className="rounded-lg border bg-background p-6 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
                <p className="mt-3 font-semibold">No matching alerts</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try relaxing filters or searching different terms.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {computed.filtered.map((s) => {
                  const Icon = iconFor(s.category);
                  return (
                    <button
                      key={s.id}
                      onClick={() => openDialog(s)}
                      className="w-full text-left p-3 border rounded-lg bg-background hover:bg-accent/40 transition-colors"
                      title="Open details"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <div className="h-10 w-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                            <Icon className="h-5 w-5 text-orange-600" />
                          </div>

                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-semibold truncate">
                                {s.title}
                              </p>
                              <StatusPill value={s.status} />
                              <Badge
                                variant="secondary"
                                className={`${typeBadge(s.type)} text-xs`}
                              >
                                {s.type}
                              </Badge>
                              <Badge
                                variant="secondary"
                                className={`${toneBadge(s.tone)} text-xs`}
                              >
                                {s.category}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                Sev {s.severity}
                              </Badge>
                            </div>

                            <p className="text-sm text-muted-foreground mt-1">
                              {s.detail}
                            </p>

                            <div className="mt-2 text-xs text-muted-foreground">
                              {s.createdAt} · {s.entityType}:{" "}
                              <span className="font-medium text-foreground/80">
                                {s.entity}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="shrink-0">
                          <ArrowRight className="h-4 w-4 text-muted-foreground mt-1" />
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
              Open items: signals and risk indicators. Use “Acknowledge” when
              triaged; “Mark resolved” when fixed.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default AlertsAndSignalsPage;
