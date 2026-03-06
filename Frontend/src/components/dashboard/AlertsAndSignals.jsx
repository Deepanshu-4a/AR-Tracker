
import React, { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const badgeTone = (tone) => {
  if (tone === "danger") return "bg-red-100 text-red-700";
  if (tone === "warning") return "bg-orange-100 text-orange-700";
  if (tone === "info") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
};

export function AlertsAndSignals({
  setActiveTab,
  onOpenAutomations,
  onOpenAdminAudit,
}) {
  const navigate=useNavigate();
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
    [setActiveTab, onOpenAutomations, onOpenAdminAudit],
  );

  return (
    <Card className="border-border/60 bg-background/70 shadow-sm rounded-2xl">
      <CardHeader className="py-3">
        <CardTitle className="flex items-center justify-between text-base">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-orange-50">
              <AlertTriangle className="h-4.5 w-4.5 text-orange-600" />
            </span>
            <span>Alerts & Signals</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-xl border-border/70 cursor-pointer"
            onClick={() => navigate("/home/alerts-signals") }
          >
            View All
          </Button>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0 pb-3">
        <div className="space-y-2.5">
          {alertsAndSignals.map((a) => (
            <button
              key={a.id}
              onClick={a.onClick}
              className={[
                "w-full text-left",
                "px-3 py-2.5",
                "rounded-2xl border border-border/60",
                "bg-background/70 shadow-sm",
                "hover:bg-accent/40 hover:shadow-md",
                "transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-ring/40",
              ].join(" ")}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-sm truncate">{a.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {a.detail}
                  </p>
                </div>

                <Badge
                  variant="secondary"
                  className={`${badgeTone(a.tone)} text-[11px] shrink-0`}
                >
                  {a.badge}
                </Badge>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
