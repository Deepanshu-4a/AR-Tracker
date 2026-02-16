import React, { useMemo, useState } from "react";
import {
  BellRing,
  Clock,
  PlugZap,
  ShieldCheck,
  TriangleAlert,
  FileText,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

const formatCurrency = (amount) => {
  if (!amount) return "$0";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
};

const actionTone = (cta) => {
  if (cta === "Approve") return "bg-emerald-100 text-emerald-700";
  if (cta === "Resolve") return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-700";
};

const severityTone = (s) => {
  if (s >= 5) return "bg-red-100 text-red-700";
  if (s === 4) return "bg-orange-100 text-orange-700";
  if (s === 3) return "bg-yellow-100 text-yellow-800";
  return "bg-slate-100 text-slate-700";
};

const iconForType = (t) => {
  if (t === "Customer") return Clock;
  if (t === "Automation") return TriangleAlert;
  if (t === "System") return PlugZap;
  if (t === "Admin") return ShieldCheck;
  return FileText;
};

export default function ActionQueuePage({
  setActiveTab,
  onOpenInvoice,
  onOpenCustomer,
  onOpenIntegrations,
  onOpenAutomations,
  onOpenAdminUsers,
  onOpenAdminAudit,
}) {
  // ✅ static for now (same items as dashboard)
  const actions = useMemo(
    () => [
      {
        id: "aq-1",
        type: "Overdue receivable",
        iconType: "Customer",
        entityType: "Customer",
        entity: "MegaMart",
        impact: 340000,
        recommendation: "Send final notice and set escalation if no response in 48h.",
        cta: "Review",
        severity: 5,
        owner: "Collections",
        createdAt: "Today",
        destination: () => {
          setActiveTab?.("revenue");
          onOpenCustomer?.("MegaMart");
        },
      },
      {
        id: "aq-2",
        type: "Reminder automation failed",
        iconType: "Automation",
        entityType: "Automation",
        entity: "Collections Reminders",
        impact: 180000,
        recommendation: "Resolve failed run and retry missed sends.",
        cta: "Resolve",
        severity: 4,
        owner: "Ops",
        createdAt: "24h ago",
        destination: () => {
          setActiveTab?.("automations");
          onOpenAutomations?.();
        },
      },
      {
        id: "aq-3",
        type: "Integration errors",
        iconType: "System",
        entityType: "System",
        entity: "Accounting Sync",
        impact: 0,
        recommendation: "Review event logs and reconnect credentials.",
        cta: "Resolve",
        severity: 4,
        owner: "IT",
        createdAt: "2 days ago",
        destination: () => {
          setActiveTab?.("integrations");
          onOpenIntegrations?.();
        },
      },
      {
        id: "aq-4",
        type: "Users pending role assignment",
        iconType: "Admin",
        entityType: "Admin",
        entity: "2 new users",
        impact: 0,
        recommendation: "Assign roles to enable invoice approvals and audits.",
        cta: "Review",
        severity: 3,
        owner: "Admin",
        createdAt: "This week",
        destination: () => {
          setActiveTab?.("admin");
          onOpenAdminUsers?.();
        },
      },
      {
        id: "aq-5",
        type: "Invoice ready to send",
        iconType: "Customer",
        entityType: "Customer",
        entity: "RetailHub",
        impact: 95000,
        recommendation: "Review invoice details and send to customer.",
        cta: "Approve",
        severity: 3,
        owner: "Billing",
        createdAt: "Today",
        invoiceNo: "INV-2024-1502",
        destination: () => {
          setActiveTab?.("revenue");
          onOpenInvoice?.("INV-2024-1502");
        },
      },
    ],
    [
      setActiveTab,
      onOpenCustomer,
      onOpenInvoice,
      onOpenIntegrations,
      onOpenAutomations,
      onOpenAdminUsers,
    ],
  );

  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("all");
  const [groupBy, setGroupBy] = useState("none");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return actions.filter((a) => {
      const matchesQuery =
        !q ||
        a.type.toLowerCase().includes(q) ||
        a.entityType.toLowerCase().includes(q) ||
        a.entity.toLowerCase().includes(q) ||
        (a.invoiceNo || "").toLowerCase().includes(q);

      const matchesSeverity =
        severity === "all" ? true : String(a.severity) === severity;

      return matchesQuery && matchesSeverity;
    });
  }, [actions, query, severity]);

  const grouped = useMemo(() => {
    if (groupBy === "none") return { All: filtered };

    const map = {};
    for (const a of filtered) {
      const k = groupBy === "owner" ? a.owner : a.entityType;
      map[k] = map[k] || [];
      map[k].push(a);
    }
    return map;
  }, [filtered, groupBy]);

  const totalImpact = useMemo(
    () => filtered.reduce((acc, a) => acc + (a.impact || 0), 0),
    [filtered],
  );

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50">
              <BellRing className="h-5 w-5 text-orange-600" />
            </span>
            Action Queue
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Full list of actions requiring attention, with owners, severity, impact, and next steps.
          </p>
        </div>

        <Button
          variant="outline"
          className="rounded-xl"
          onClick={() => setActiveTab?.("dashboard")}
        >
          Back to Dashboard
        </Button>
      </div>

      {/* Filters */}
      <Card className="border-border/60 bg-background/70 shadow-sm rounded-2xl">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by type, entity, invoice #..."
                className="pl-9 rounded-xl"
              />
            </div>

            <div className="md:col-span-3">
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="rounded-xl">
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Severity" />
                  </div>
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All severities</SelectItem>
                  <SelectItem value="5">Severity 5</SelectItem>
                  <SelectItem value="4">Severity 4</SelectItem>
                  <SelectItem value="3">Severity 3</SelectItem>
                  <SelectItem value="2">Severity 2</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-3">
              <Select value={groupBy} onValueChange={setGroupBy}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Group by" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="none">No grouping</SelectItem>
                  <SelectItem value="owner">Group by owner</SelectItem>
                  <SelectItem value="entityType">Group by entity type</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                Showing: {filtered.length} items
              </Badge>
              <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                Total impact: {formatCurrency(totalImpact)}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: click an item to open the source screen.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* List */}
      <div className="space-y-4">
        {Object.entries(grouped).map(([groupName, list]) => (
          <Card
            key={groupName}
            className="border-border/60 bg-background/70 shadow-sm rounded-2xl"
          >
            <CardHeader className="py-3">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{groupName}</span>
                <Badge variant="secondary" className="text-xs">
                  {list.length} items
                </Badge>
              </CardTitle>
            </CardHeader>

            <CardContent className="pt-0 pb-4 space-y-2.5">
              {list.map((a) => {
                const Icon = iconForType(a.iconType);
                return (
                  <button
                    key={a.id}
                    onClick={() => a.destination?.()}
                    className={[
                      "w-full text-left",
                      "px-3 py-3",
                      "rounded-2xl border border-border/60",
                      "bg-background/70 shadow-sm",
                      "hover:bg-accent/40 hover:shadow-md",
                      "transition-all duration-200",
                      "focus:outline-none focus:ring-2 focus:ring-ring/40",
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="h-9 w-9 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                          <Icon className="h-4.5 w-4.5 text-orange-600" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="font-semibold text-sm">{a.type}</p>

                            <Badge variant="secondary" className="text-[11px]">
                              {a.entityType}
                            </Badge>

                            <Badge
                              variant="secondary"
                              className={`text-[11px] ${actionTone(a.cta)}`}
                            >
                              {a.cta}
                            </Badge>

                            <Badge
                              variant="secondary"
                              className={`text-[11px] ${severityTone(a.severity)}`}
                            >
                              Sev {a.severity}
                            </Badge>

                            {a.impact ? (
                              <Badge
                                variant="secondary"
                                className="text-[11px] bg-green-100 text-green-700"
                              >
                                Impact: {formatCurrency(a.impact)}
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-[11px] bg-slate-100 text-slate-700"
                              >
                                No direct $ impact
                              </Badge>
                            )}

                            {a.invoiceNo ? (
                              <Badge variant="secondary" className="text-[11px]">
                                {a.invoiceNo}
                              </Badge>
                            ) : null}
                          </div>

                          <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                            <span className="font-medium text-foreground/90">
                              {a.entity}
                            </span>{" "}
                            — {a.recommendation}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
                            <span>Owner: {a.owner}</span>
                            <span>•</span>
                            <span>Created: {a.createdAt}</span>
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 flex items-center gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            a.destination?.();
                          }}
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Open
                        </Button>

                        <Button
                          type="button"
                          size="sm"
                          className="h-8 rounded-xl"
                          onClick={(e) => {
                            e.stopPropagation();
                            // ✅ static demo: mark as done could later call API
                            alert(`Marked as handled: ${a.id}`);
                          }}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-2" />
                          Mark done
                        </Button>
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
