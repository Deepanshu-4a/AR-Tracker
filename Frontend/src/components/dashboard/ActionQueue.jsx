
import React, { useMemo, useState } from "react";
import {
  Clock,
  TriangleAlert,
  PlugZap,
  ShieldCheck,
  FileText,
  BellRing,
  CheckCircle2,
} from "lucide-react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const actionTone = (cta) => {
  if (cta === "Approve") return "bg-emerald-100 text-emerald-700";
  if (cta === "Resolve") return "bg-orange-100 text-orange-700";
  return "bg-slate-100 text-slate-700";
};

const formatCurrency = (amount) => {
  if (!amount) return "$0";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(0)}K`;
  return `$${amount}`;
};

export function ActionQueue({
  setActiveTab,
  onOpenCustomer,
  onOpenInvoice,
  onOpenIntegrations,
  onOpenAutomations,
  onOpenAdminUsers,
  onOpenAction,
}) {
  const [handledIds, setHandledIds] = useState(() => new Set());

  const actions = useMemo(
    () => [
      {
        id: "aq-1",
        type: "Overdue receivable",
        icon: Clock,
        entityType: "Customer",
        entity: "MegaMart",
        impact: 340000,
        recommendation:
          "Send final notice and escalate if no response in 48 hours.",
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
        recommendation: "Reconnect credentials and reprocess events.",
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
        recommendation: "Assign roles to enable approvals and audits.",
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
        recommendation: "Review invoice and send to customer.",
        cta: "Approve",
        severity: 3,
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

  const visibleActions = useMemo(() => {
    return actions
      .filter((a) => !handledIds.has(a.id))
      .sort((a, b) =>
        b.severity !== a.severity
          ? b.severity - a.severity
          : (b.impact || 0) - (a.impact || 0),
      );
  }, [actions, handledIds]);

  return (
    <Card className="xl:col-span-2 border-border/60 bg-background/70 shadow-sm rounded-2xl">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50">
              <BellRing className="h-4.5 w-4.5 text-orange-600" />
            </span>
            <span>Action Queue</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-xl border-border/70"
            onClick={() => setActiveTab?.("action-queue")}
          >
            View All
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <div className="space-y-2">
          {visibleActions.length === 0 ? (
            <div className="rounded-2xl border border-border/60 bg-background/70 p-5 text-center shadow-sm">
              <div className="mx-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="mt-2 font-semibold">All clear</p>
              <p className="mt-1 text-sm text-muted-foreground">
                No actions require attention right now.
              </p>
            </div>
          ) : (
            visibleActions.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.id}
                  className="flex flex-col md:flex-row md:items-center justify-between gap-2 px-3 py-2.5 rounded-2xl border border-border/60 bg-background/70 shadow-sm hover:bg-accent/40 transition"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <div className="h-9 w-9 rounded-2xl bg-orange-50 flex items-center justify-center shrink-0">
                      <Icon className="h-4.5 w-4.5 text-orange-600" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-semibold text-sm">{item.type}</p>
                        <Badge variant="secondary" className="text-[11px]">
                          {item.entityType}
                        </Badge>
                        <Badge
                          variant="secondary"
                          className={`text-[11px] ${actionTone(item.cta)}`}
                        >
                          {item.cta}
                        </Badge>

                        {item.impact ? (
                          <Badge
                            variant="secondary"
                            className="text-[11px] bg-green-100 text-green-700"
                          >
                            Impact: {formatCurrency(item.impact)}
                          </Badge>
                        ) : null}
                      </div>

                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        <span className="font-medium text-foreground/90">
                          {item.entity}
                        </span>{" "}
                        — {item.recommendation}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl h-8 px-3"
                    onClick={() => onOpenAction?.(item)}
                  >
                    {item.cta}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
