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
  SlidersHorizontal,
  TrendingUp,
  CalendarDays,
  Building2,
  CreditCard,
} from "lucide-react";


export default function CashInPage({ onBack }) {
  const [period, setPeriod] = useState("mtd"); // mtd | qtd
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState("all");
  const [method, setMethod] = useState("all");
  const [postedOnly, setPostedOnly] = useState(true);

 
  const allRows = useMemo(
    () => [
      {
        id: "RCPT-10091",
        date: "2026-02-03",
        customer: "Acme Corp",
        method: "ACH",
        account: "Operating (**** 4821)",
        status: "Posted",
        invoice: "INV-88210",
        amount: 24850.0,
        source: "Receipts",
      },
      {
        id: "RCPT-10092",
        date: "2026-02-04",
        customer: "Northwind LLC",
        method: "Wire",
        account: "Operating (**** 4821)",
        status: "Posted",
        invoice: "INV-88256",
        amount: 80500.0,
        source: "Bank Feed",
      },
      {
        id: "RCPT-10093",
        date: "2026-02-06",
        customer: "Globex",
        method: "Card",
        account: "Merchant (**** 1134)",
        status: "Pending",
        invoice: "INV-88301",
        amount: 1299.99,
        source: "Payments",
      },
      {
        id: "RCPT-10094",
        date: "2026-01-21",
        customer: "Acme Corp",
        method: "ACH",
        account: "Operating (**** 4821)",
        status: "Posted",
        invoice: "INV-87880",
        amount: 15000.0,
        source: "Receipts",
      },
      {
        id: "RCPT-10095",
        date: "2026-01-28",
        customer: "Initech",
        method: "Check",
        account: "Lockbox (**** 9071)",
        status: "Posted",
        invoice: "INV-87944",
        amount: 4200.0,
        source: "Receipts",
      },
    ],
    []
  );

  
  const now = new Date("2026-02-10T12:00:00");
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
  const startOfQuarter = new Date(now.getFullYear(), quarterStartMonth, 1);

  const inSelectedPeriod = (isoDate) => {
    const d = new Date(isoDate + "T00:00:00");
    if (period === "mtd") return d >= startOfMonth && d <= now;
    return d >= startOfQuarter && d <= now;
  };

  const filteredRows = useMemo(() => {
    return allRows
      .filter((r) => inSelectedPeriod(r.date))
      .filter((r) => (postedOnly ? r.status === "Posted" : true))
      .filter((r) => (customer === "all" ? true : r.customer === customer))
      .filter((r) => (method === "all" ? true : r.method === method))
      .filter((r) => {
        const q = search.trim().toLowerCase();
        if (!q) return true;
        return (
          r.id.toLowerCase().includes(q) ||
          r.customer.toLowerCase().includes(q) ||
          r.invoice.toLowerCase().includes(q) ||
          r.source.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [allRows, period, postedOnly, customer, method, search]);

  const totals = useMemo(() => {
    const posted = filteredRows.filter((r) => r.status === "Posted");
    const pending = filteredRows.filter((r) => r.status !== "Posted");
    const postedSum = posted.reduce((s, r) => s + r.amount, 0);
    const pendingSum = pending.reduce((s, r) => s + r.amount, 0);
    return {
      postedSum,
      pendingSum,
      count: filteredRows.length,
      postedCount: posted.length,
    };
  }, [filteredRows]);

  const uniqueCustomers = useMemo(() => {
    return Array.from(new Set(allRows.map((r) => r.customer))).sort();
  }, [allRows]);

  const uniqueMethods = useMemo(() => {
    return Array.from(new Set(allRows.map((r) => r.method))).sort();
  }, [allRows]);

  const formatMoney = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const periodLabel = period === "mtd" ? "MTD" : "QTD";
  const rangeLabel =
    period === "mtd"
      ? `${startOfMonth.toLocaleDateString()} → ${now.toLocaleDateString()}`
      : `${startOfQuarter.toLocaleDateString()} → ${now.toLocaleDateString()}`;

   const handleBack = () => {
    if (onBack) return onBack();
  };

  const onExport = () => {
   
    console.log("Export", { period, search, customer, method, postedOnly });
  };

  const onOpenSource = (row) => {
   
    console.log("Open source", row);
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
                    Cash In
                  </h1>
                  <Badge variant="secondary" className="rounded-full">
                    {periodLabel}
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

              <Button variant="outline" onClick={onExport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Summary */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Posted Cash In ({periodLabel})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div className="text-2xl font-semibold">
                  {formatMoney(totals.postedSum)}
                </div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <TrendingUp className="h-4 w-4" />
                  <span>{totals.postedCount} receipts</span>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Excludes pending/unposted items (toggle below).
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending / Unposted ({periodLabel})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">
                {formatMoney(totals.pendingSum)}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Items that haven’t been posted/reconciled yet.
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{totals.count}</div>
              <div className="mt-2 text-xs text-muted-foreground">
                Filtered list for {periodLabel}.
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mt-4 rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-12">
              <div className="md:col-span-5">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by receipt, customer, invoice, source…"
                    className="pl-9"
                  />
                </div>
              </div>

              <div className="md:col-span-3">
                <Select value={customer} onValueChange={setCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="Customer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All customers</SelectItem>
                    {uniqueCustomers.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <Select value={method} onValueChange={setMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All methods</SelectItem>
                    {uniqueMethods.map((m) => (
                      <SelectItem key={m} value={m}>
                        {m}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 flex items-center justify-between gap-3 rounded-xl border px-3 py-2">
                <div className="text-sm">
                  <div className="font-medium">Posted only</div>
                  <div className="text-xs text-muted-foreground">
                    Hide pending
                  </div>
                </div>
                <Switch checked={postedOnly} onCheckedChange={setPostedOnly} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Separator className="my-6" />

        {/* Table */}
        <Card className="rounded-2xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-semibold">
              Cash In Transactions
            </CardTitle>
            <div className="text-sm text-muted-foreground">
              Drill into source screen from each transaction.
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border">
              <table className="min-w-[980px] w-full text-sm">
                <thead className="bg-muted/40">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-medium">Receipt</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Method</th>
                    <th className="px-4 py-3 font-medium">Account</th>
                    <th className="px-4 py-3 font-medium">Invoice</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                    <th className="px-4 py-3 font-medium">Source</th>
                    <th className="px-4 py-3 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-10 text-center text-muted-foreground"
                      >
                        No transactions match these filters.
                      </td>
                    </tr>
                  ) : (
                    filteredRows.map((r) => (
                      <tr
                        key={r.id}
                        className="border-t hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium">{r.id}</td>
                        <td className="px-4 py-3">{r.date}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{r.customer}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span>{r.method}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{r.account}</td>
                        <td className="px-4 py-3">{r.invoice}</td>
                        <td className="px-4 py-3">
                          <Badge
                            variant={
                              r.status === "Posted" ? "default" : "secondary"
                            }
                            className="rounded-full"
                          >
                            {r.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3 text-right tabular-nums">
                          {formatMoney(r.amount)}
                        </td>
                        <td className="px-4 py-3">{r.source}</td>
                        <td className="px-4 py-3">
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-full"
                            onClick={() => onOpenSource(r)}
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

            <div className="mt-4 flex flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
              <div>
                Showing <span className="font-medium">{filteredRows.length}</span>{" "}
                transactions for <span className="font-medium">{periodLabel}</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full">
                  Posted: {formatMoney(totals.postedSum)}
                </Badge>
                <Badge variant="secondary" className="rounded-full">
                  Pending: {formatMoney(totals.pendingSum)}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer note */}
        <div className="mt-6 text-xs text-muted-foreground">
          Tip: Connect the “View” button to the correct source route based on
          <span className="font-medium"> source</span> (Receipts/Bank Feed/Payments),
          so the page matches your “clickable metric → drill-down” requirement.
        </div>
      </div>
    </div>
  );
}
