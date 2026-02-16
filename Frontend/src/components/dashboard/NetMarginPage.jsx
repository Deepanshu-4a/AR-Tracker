
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, Download, Search, CalendarDays, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export default function NetMarginPage({ onBack }) {
  const [period, setPeriod] = useState("mtd"); // mtd | qtd
  const [search, setSearch] = useState("");
  const [segment, setSegment] = useState("all"); // all | enterprise | midmarket | smb
  const [includePending, setIncludePending] = useState(false);

  // Deterministic "today" for demo (replace with new Date())
  const now = new Date("2026-02-10");
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
  const startOfQuarter = new Date(now.getFullYear(), quarterStartMonth, 1);

  const rangeLabel =
    period === "mtd"
      ? `${startOfMonth.toLocaleDateString()} → ${now.toLocaleDateString()}`
      : `${startOfQuarter.toLocaleDateString()} → ${now.toLocaleDateString()}`;

  const formatMoney = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const summary = useMemo(() => {
    
    if (period === "mtd") {
      return {
        revenue: 3200000,
        cogs: 1960000,
        opex: 520000,
        other: 30000,
        marginPct: 22.4,
        deltaPct: -0.8,
      };
    }
    return {
      revenue: 9800000,
      cogs: 6020000,
      opex: 1650000,
      other: 95000,
      marginPct: 21.1,
      deltaPct: +0.3,
    };
  }, [period]);

  /* ------------------ TREND DATA (MOCK) ------------------ */
  const trendData = useMemo(() => {
    if (period === "mtd") {
      return [
        { label: "Feb 1", margin: 23.8 },
        { label: "Feb 3", margin: 22.9 },
        { label: "Feb 5", margin: 22.1 },
        { label: "Feb 7", margin: 21.7 },
        { label: "Feb 9", margin: 22.4 },
      ];
    }
    return [
      { label: "Jan 1", margin: 20.4 },
      { label: "Jan 10", margin: 21.0 },
      { label: "Jan 20", margin: 21.4 },
      { label: "Feb 1", margin: 21.2 },
      { label: "Feb 9", margin: 21.1 },
    ];
  }, [period]);

  /* ------------------ CONTRIBUTION TABLE (MOCK) ------------------ */
  const allRows = useMemo(
    () => [
      {
        id: "CUST-1001",
        customer: "Acme Corp",
        segment: "enterprise",
        revenue: 820000,
        cogs: 520000,
        opex: 105000,
        pending: false,
      },
      {
        id: "CUST-1002",
        customer: "Northwind LLC",
        segment: "midmarket",
        revenue: 540000,
        cogs: 330000,
        opex: 82000,
        pending: false,
      },
      {
        id: "CUST-1003",
        customer: "Globex",
        segment: "smb",
        revenue: 185000,
        cogs: 132000,
        opex: 26000,
        pending: true,
      },
      {
        id: "CUST-1004",
        customer: "Initech",
        segment: "midmarket",
        revenue: 315000,
        cogs: 205000,
        opex: 52000,
        pending: false,
      },
      {
        id: "CUST-1005",
        customer: "RetailHub",
        segment: "enterprise",
        revenue: 690000,
        cogs: 430000,
        opex: 99000,
        pending: false,
      },
    ],
    []
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allRows
      .filter((r) => (includePending ? true : !r.pending))
      .filter((r) => (segment === "all" ? true : r.segment === segment))
      .filter((r) => (q ? r.customer.toLowerCase().includes(q) || r.id.toLowerCase().includes(q) : true))
      .map((r) => {
        const profit = r.revenue - r.cogs - r.opex;
        const marginPct = r.revenue ? (profit / r.revenue) * 100 : 0;
        return { ...r, profit, marginPct };
      })
      .sort((a, b) => b.marginPct - a.marginPct);
  }, [allRows, search, segment, includePending]);

  const totals = useMemo(() => {
    const revenue = rows.reduce((s, r) => s + r.revenue, 0);
    const cogs = rows.reduce((s, r) => s + r.cogs, 0);
    const opex = rows.reduce((s, r) => s + r.opex, 0);
    const profit = revenue - cogs - opex;
    const marginPct = revenue ? (profit / revenue) * 100 : 0;
    return { revenue, cogs, opex, profit, marginPct };
  }, [rows]);

  const exportData = () => {
    console.log("Export net margin", { period, search, segment, includePending });
  };

  const deltaUp = summary.deltaPct >= 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={onBack}>
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl font-semibold tracking-tight">Net Margin</h1>
                  <Badge variant="secondary" className="rounded-full">
                    {period === "mtd" ? "MTD" : "QTD"}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>{rangeLabel}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mtd">MTD</SelectItem>
                  <SelectItem value="qtd">QTD</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={exportData} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Net Margin ({period === "mtd" ? "MTD" : "QTD"})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{summary.marginPct.toFixed(1)}%</div>
              <div className="mt-2 flex items-center gap-2 text-sm">
                <TrendingUp className={`h-4 w-4 ${deltaUp ? "text-emerald-600" : "text-red-600"}`} />
                <span className={`${deltaUp ? "text-emerald-700" : "text-red-700"} font-medium`}>
                  {deltaUp ? "+" : ""}
                  {summary.deltaPct.toFixed(1)}%
                </span>
                <span className="text-muted-foreground">vs previous period</span>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{formatMoney(summary.revenue)}</div>
              <div className="mt-2 text-xs text-muted-foreground">Recognized revenue in period.</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                COGS
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{formatMoney(summary.cogs)}</div>
              <div className="mt-2 text-xs text-muted-foreground">Direct costs linked to revenue.</div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                OpEx + Other
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatMoney(summary.opex + summary.other)}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Operating + miscellaneous costs.</div>
            </CardContent>
          </Card>
        </div>

        {/* Trend */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Net Margin Trend</CardTitle>
            <div className="text-sm text-muted-foreground">
              How margin changed across the selected period.
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData} margin={{ left: 8, right: 16, top: 10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="label" />
                  <YAxis domain={[0, 40]} tickFormatter={(v) => `${v}%`} />
                  <Tooltip formatter={(v) => [`${Number(v).toFixed(1)}%`, "Margin"]} />
                  <Line type="monotone" dataKey="margin" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Contribution Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-6 relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Search customer…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <div className="md:col-span-4">
                <Select value={segment} onValueChange={setSegment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Segment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All segments</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                    <SelectItem value="midmarket">Mid-market</SelectItem>
                    <SelectItem value="smb">SMB</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-xl border px-3 py-2">
                <div className="text-sm">
                  <div className="font-medium">Include pending</div>
                  <div className="text-xs text-muted-foreground">Drafts / accruals</div>
                </div>
                <Switch checked={includePending} onCheckedChange={setIncludePending} />
              </div>
            </div>

            <Separator className="my-4" />

            {/* Totals row */}
            <div className="grid gap-3 md:grid-cols-4">
              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground">Revenue (filtered)</div>
                <div className="mt-1 text-lg font-semibold">{formatMoney(totals.revenue)}</div>
              </div>
              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground">COGS (filtered)</div>
                <div className="mt-1 text-lg font-semibold">{formatMoney(totals.cogs)}</div>
              </div>
              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground">OpEx (filtered)</div>
                <div className="mt-1 text-lg font-semibold">{formatMoney(totals.opex)}</div>
              </div>
              <div className="rounded-xl border bg-muted/20 p-3">
                <div className="text-xs text-muted-foreground">Net Margin (filtered)</div>
                <div className="mt-1 text-lg font-semibold">{totals.marginPct.toFixed(1)}%</div>
              </div>
            </div>

            {/* Table */}
            <div className="mt-4 overflow-x-auto rounded-xl border">
              <table className="min-w-[980px] w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Segment</th>
                    <th className="px-4 py-3 font-medium text-right">Revenue</th>
                    <th className="px-4 py-3 font-medium text-right">COGS</th>
                    <th className="px-4 py-3 font-medium text-right">OpEx</th>
                    <th className="px-4 py-3 font-medium text-right">Profit</th>
                    <th className="px-4 py-3 font-medium text-right">Margin</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-muted-foreground">
                        No rows match your filters.
                      </td>
                    </tr>
                  ) : (
                    rows.map((r) => (
                      <tr key={r.id} className="border-t hover:bg-muted/30 transition-colors">
                        <td className="px-4 py-3 font-medium">{r.customer}</td>
                        <td className="px-4 py-3 capitalize">{r.segment}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatMoney(r.revenue)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatMoney(r.cogs)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatMoney(r.opex)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{formatMoney(r.profit)}</td>
                        <td className="px-4 py-3 text-right tabular-nums">{r.marginPct.toFixed(1)}%</td>
                        <td className="px-4 py-3">
                          <Badge variant={r.pending ? "secondary" : "default"} className="rounded-full">
                            {r.pending ? "Pending" : "Posted"}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => console.log("Open source for", r)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-xs text-muted-foreground">
              Tip: Wire “View” to the source screen (Invoices / COGS postings / Expense allocations) for drill-down.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
