// ✅ components/FinancialSnapshot.jsx
import React, { useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUp, ArrowDown, DollarSign, TrendingUp, TrendingDown, FileText, Clock } from "lucide-react";

export function FinancialSnapshot({ setActiveTab }) {
  const items = useMemo(
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
        onClick: () => setActiveTab?.("cash-out"),
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
    [setActiveTab],
  );

  return (
    <Card className="border-border/60 bg-background/70 shadow-sm rounded-2xl">
      <CardContent className="p-3">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium">Financial Snapshot</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {items.map((m) => {
            const Icon = m.icon;
            const isUp = m.trend === "up";

            return (
              <button
                key={m.key}
                onClick={m.onClick}
                className={[
                  "group text-left rounded-2xl border border-border/60",
                  "bg-background/70 shadow-sm",
                  "hover:bg-accent/40 hover:shadow-md",
                  "transition-all duration-200",
                  "px-2.5 py-2 h-[64px]",
                  "focus:outline-none focus:ring-2 focus:ring-ring/40",
                ].join(" ")}
              >
                <div className="flex items-center justify-between gap-2 h-full">
                  <div className="min-w-0">
                    <p className="text-[11px] text-muted-foreground leading-tight">
                      {m.label}
                    </p>
                    <p className="text-lg font-semibold leading-tight mt-0.5">
                      {m.value}
                    </p>

                    <div className="flex items-center gap-1 mt-0.5">
                      {isUp ? (
                        <ArrowUp className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-[11px] font-medium leading-tight ${
                          isUp ? "text-emerald-600" : "text-red-600"
                        }`}
                      >
                        {m.change}
                      </span>
                    </div>
                  </div>

                  <div className="h-8 w-8 rounded-xl bg-muted/40 flex items-center justify-center shrink-0 group-hover:bg-muted/55 transition-colors">
                    <Icon className="w-4.5 h-4.5 text-foreground/70" />
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
