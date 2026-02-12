
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
import {
  ArrowLeft,
  Download,
  Search,
  CalendarDays,
  FileText,
  Building2,
  Clock,
  AlertTriangle,
} from "lucide-react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

export default function AROutstandingPage({ onBack }) {
  const [bucket, setBucket] = useState("all"); // all | 0-30 | 31-60 | 61-90 | 90+
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("all");
  const [status, setStatus] = useState("open"); // open | overdue | all
  const [includeDisputed, setIncludeDisputed] = useState(true);

  const formatMoney = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  /* ------------------  AGING SUMMARY ------------------ */
  const aging = useMemo(
    () => [
      { name: "0-30", value: 13.9, pct: 75, count: 45 },
      { name: "31-60", value: 2.8, pct: 15, count: 12 },
      { name: "61-90", value: 1.1, pct: 6, count: 6 },
      { name: "90+", value: 0.7, pct: 4, count: 2 },
    ],
    []
  );

  const COLORS = ["#10b981", "#f59e0b", "#fb7185", "#ef4444"];

  /* ------------------  INVOICES ------------------ */
  const invoices = useMemo(
    () => [
      {
        id: "INV-2026-1201",
        customer: "Acme Corp",
        issueDate: "2026-01-15",
        dueDate: "2026-02-14",
        amount: 225000,
        bucket: "0-30",
        status: "open",
        disputed: false,
        source: "Invoice Center",
      },
      {
        id: "INV-2026-1184",
        customer: "MegaMart",
        issueDate: "2025-11-20",
        dueDate: "2025-12-20",
        amount: 340000,
        bucket: "90+",
        status: "overdue",
        disputed: true,
        source: "Invoice Center",
      },
      {
        id: "INV-2026-1192",
        customer: "Northwind LLC",
        issueDate: "2025-12-10",
        dueDate: "2026-01-09",
        amount: 280000,
        bucket: "31-60",
        status: "overdue",
        disputed: false,
        source: "Invoice Center",
      },
      {
        id: "INV-2026-1210",
        customer: "Initech",
        issueDate: "2026-01-03",
        dueDate: "2026-02-02",
        amount: 95000,
        bucket: "0-30",
        status: "overdue",
        disputed: false,
        source: "Collections",
      },
      {
        id: "INV-2026-1168",
        customer: "Globex",
        issueDate: "2025-12-01",
        dueDate: "2025-12-31",
        amount: 129999,
        bucket: "61-90",
        status: "overdue",
        disputed: false,
        source: "Collections",
      },
      {
        id: "INV-2026-1215",
        customer: "RetailHub",
        issueDate: "2026-01-22",
        dueDate: "2026-02-21",
        amount: 150000,
        bucket: "0-30",
        status: "open",
        disputed: false,
        source: "Invoice Center",
      },
    ],
    []
  );

  const customers = useMemo(
    () => Array.from(new Set(invoices.map((i) => i.customer))).sort(),
    [invoices]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return invoices
      .filter((i) => (bucket === "all" ? true : i.bucket === bucket))
      .filter((i) => (customer === "all" ? true : i.customer === customer))
      .filter((i) => (status === "all" ? true : i.status === status))
      .filter((i) => (includeDisputed ? true : !i.disputed))
      .filter((i) => {
        if (!q) return true;
        return (
          i.id.toLowerCase().includes(q) ||
          i.customer.toLowerCase().includes(q) ||
          i.source.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => b.amount - a.amount);
  }, [invoices, bucket, customer, status, includeDisputed, search]);

  const totals = useMemo(() => {
    const total = filtered.reduce((s, i) => s + i.amount, 0);
    const overdue = filtered
      .filter((i) => i.status === "overdue")
      .reduce((s, i) => s + i.amount, 0);
    const disputed = filtered
      .filter((i) => i.disputed)
      .reduce((s, i) => s + i.amount, 0);
    return { total, overdue, disputed, count: filtered.length };
  }, [filtered]);

  const exportData = () => {
    console.log("Export AR Outstanding", {
      bucket,
      customer,
      status,
      includeDisputed,
      search,
    });
  };

  const openSource = (row) => {
  
    console.log("Open source", row);
  };

  const badgeForInvoice = (inv) => {
    if (inv.disputed) return { label: "Disputed", cls: "bg-purple-100 text-purple-700" };
    if (inv.status === "overdue")
      return { label: "Overdue", cls: "bg-red-100 text-red-700" };
    return { label: "Open", cls: "bg-emerald-100 text-emerald-700" };
  };

  const AgingTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return (
      <div className="rounded-md border bg-background px-3 py-2 shadow-md text-sm">
        <div className="font-semibold">{d.name} days</div>
        <div className="text-xs text-muted-foreground">Amount: ${d.value}M</div>
        <div className="text-xs text-muted-foreground">Invoices: {d.count}</div>
      </div>
    );
  };

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
                  <h1 className="text-xl font-semibold tracking-tight">
                    AR Outstanding
                  </h1>
                  <Badge variant="secondary" className="rounded-full">
                    Aging view
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="h-4 w-4" />
                  <span>As of {new Date("2026-02-10").toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
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
                Total AR (filtered)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{formatMoney(totals.total)}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Based on current filters.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{formatMoney(totals.overdue)}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Past due date.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Disputed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{formatMoney(totals.disputed)}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Marked as disputed.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Invoices
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{totals.count}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Open + overdue in selection.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Aging distribution */}
        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="rounded-2xl lg:col-span-1">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                Aging Distribution
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Click filters below to drill further.
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={aging}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={2}
                    >
                      {aging.map((_, idx) => (
                        <Cell
                          key={idx}
                          fill={COLORS[idx % COLORS.length]}
                          stroke="hsl(var(--background))"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<AgingTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-3 space-y-2">
                {aging.map((a, idx) => (
                  <button
                    key={a.name}
                    onClick={() => setBucket(a.name)}
                    className={`w-full rounded-lg border p-3 text-left hover:bg-muted/30 transition-colors ${
                      bucket === a.name ? "bg-muted/30" : "bg-background"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="h-3 w-3 rounded-sm"
                          style={{ backgroundColor: COLORS[idx] }}
                        />
                        <span className="font-medium">{a.name} days</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {a.pct}% · {a.count}
                      </span>
                    </div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      ${a.value}M outstanding
                    </div>
                  </button>
                ))}

                <Button
                  variant="outline"
                  className="w-full rounded-xl"
                  onClick={() => setBucket("all")}
                >
                  Clear bucket filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Filters + Table */}
          <Card className="rounded-2xl lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold">
                Outstanding Invoices
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                Drill down into invoice / collections sources.
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="grid gap-3 md:grid-cols-12">
                <div className="md:col-span-6 relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    placeholder="Search invoice, customer, source…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <div className="md:col-span-3">
                  <Select value={customer} onValueChange={setCustomer}>
                    <SelectTrigger>
                      <SelectValue placeholder="Customer" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All customers</SelectItem>
                      {customers.map((c) => (
                        <SelectItem key={c} value={c}>
                          {c}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-3">
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-12 flex items-center justify-between gap-3 rounded-xl border px-3 py-2">
                  <div className="text-sm">
                    <div className="font-medium">Include disputed</div>
                    <div className="text-xs text-muted-foreground">
                      Show invoices marked as disputed.
                    </div>
                  </div>
                  <Switch
                    checked={includeDisputed}
                    onCheckedChange={setIncludeDisputed}
                  />
                </div>
              </div>

              <Separator className="my-4" />

              {/* Table */}
              <div className="overflow-x-auto rounded-xl border">
                <table className="min-w-[980px] w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr className="text-left">
                      <th className="px-4 py-3 font-medium">Invoice</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Issue</th>
                      <th className="px-4 py-3 font-medium">Due</th>
                      <th className="px-4 py-3 font-medium">Aging</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium text-right">Amount</th>
                      <th className="px-4 py-3 font-medium">Source</th>
                      <th className="px-4 py-3 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 ? (
                      <tr>
                        <td
                          colSpan={9}
                          className="px-4 py-10 text-center text-muted-foreground"
                        >
                          No invoices match these filters.
                        </td>
                      </tr>
                    ) : (
                      filtered.map((inv) => {
                        const b = badgeForInvoice(inv);
                        return (
                          <tr
                            key={inv.id}
                            className="border-t hover:bg-muted/30 transition-colors"
                          >
                            <td className="px-4 py-3 font-medium flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              {inv.id}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-muted-foreground" />
                                <span>{inv.customer}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">{inv.issueDate}</td>
                            <td className="px-4 py-3">{inv.dueDate}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                {inv.bucket === "90+" ? (
                                  <AlertTriangle className="h-4 w-4 text-red-600" />
                                ) : inv.status === "overdue" ? (
                                  <Clock className="h-4 w-4 text-orange-600" />
                                ) : (
                                  <Clock className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span>{inv.bucket}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge
                                variant="secondary"
                                className={`rounded-full ${b.cls}`}
                              >
                                {b.label}
                              </Badge>
                            </td>
                            <td className="px-4 py-3 text-right tabular-nums">
                              {formatMoney(inv.amount)}
                            </td>
                            <td className="px-4 py-3">{inv.source}</td>
                            <td className="px-4 py-3">
                              <Button
                                variant="outline"
                                size="sm"
                                className="rounded-full"
                                onClick={() => openSource(inv)}
                              >
                                View
                              </Button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 text-xs text-muted-foreground">
                Tip: wire “View” to Invoice Center / Collections detail screens for drill-down.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
