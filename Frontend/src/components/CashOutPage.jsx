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
  TrendingDown,
  Building2,
  CreditCard,
} from "lucide-react";

export default function CashOutPage({ onBack }) {
  const [period, setPeriod] = useState("mtd");
  const [search, setSearch] = useState("");
  const [vendor, setVendor] = useState("all");
  const [method, setMethod] = useState("all");
  const [postedOnly, setPostedOnly] = useState(true);

  /* ------------------  DATA ------------------ */
  const rows = useMemo(
    () => [
      {
        id: "BILL-9012",
        date: "2026-02-03",
        vendor: "AWS",
        method: "ACH",
        account: "Operating (****4821)",
        status: "Posted",
        category: "Cloud",
        amount: 18500,
        source: "Bills",
      },
      {
        id: "BILL-9013",
        date: "2026-02-05",
        vendor: "Stripe",
        method: "Card",
        account: "Corporate Card",
        status: "Posted",
        category: "Payments",
        amount: 9200,
        source: "Card Feed",
      },
      {
        id: "BILL-9014",
        date: "2026-02-07",
        vendor: "Notion",
        method: "Card",
        account: "Corporate Card",
        status: "Pending",
        category: "SaaS",
        amount: 480,
        source: "Subscriptions",
      },
      {
        id: "BILL-9015",
        date: "2026-01-26",
        vendor: "Google Cloud",
        method: "ACH",
        account: "Operating (****4821)",
        status: "Posted",
        category: "Cloud",
        amount: 12400,
        source: "Bills",
      },
    ],
    []
  );

  /* ------------------ DATE LOGIC ------------------ */
  const now = new Date("2026-02-10");
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const quarterStartMonth = Math.floor(now.getMonth() / 3) * 3;
  const startOfQuarter = new Date(now.getFullYear(), quarterStartMonth, 1);

  const inPeriod = (iso) => {
    const d = new Date(iso);
    return period === "mtd"
      ? d >= startOfMonth && d <= now
      : d >= startOfQuarter && d <= now;
  };

  /* ------------------ FILTERING ------------------ */
  const filtered = useMemo(() => {
    return rows
      .filter((r) => inPeriod(r.date))
      .filter((r) => (postedOnly ? r.status === "Posted" : true))
      .filter((r) => (vendor === "all" ? true : r.vendor === vendor))
      .filter((r) => (method === "all" ? true : r.method === method))
      .filter((r) =>
        search
          ? r.id.toLowerCase().includes(search.toLowerCase()) ||
            r.vendor.toLowerCase().includes(search.toLowerCase())
          : true
      );
  }, [rows, period, postedOnly, vendor, method, search]);

  const totals = useMemo(() => {
    const posted = filtered.filter((r) => r.status === "Posted");
    const pending = filtered.filter((r) => r.status !== "Posted");
    return {
      posted: posted.reduce((s, r) => s + r.amount, 0),
      pending: pending.reduce((s, r) => s + r.amount, 0),
      count: filtered.length,
    };
  }, [filtered]);

  const vendors = [...new Set(rows.map((r) => r.vendor))];
  const methods = [...new Set(rows.map((r) => r.method))];

  const formatMoney = (n) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD" });

  const rangeLabel =
    period === "mtd"
      ? `${startOfMonth.toLocaleDateString()} → ${now.toLocaleDateString()}`
      : `${startOfQuarter.toLocaleDateString()} → ${now.toLocaleDateString()}`;

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 border-b bg-background/80 backdrop-blur z-20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-semibold">Cash Out</h1>
                <Badge variant="secondary">
                  {period === "mtd" ? "MTD" : "QTD"}
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                <CalendarDays className="h-4 w-4" />
                {rangeLabel}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mtd">MTD</SelectItem>
                <SelectItem value="qtd">QTD</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Posted Cash Out
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {formatMoney(totals.posted)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {formatMoney(totals.pending)}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm text-muted-foreground">
                Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">
              {totals.count}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="grid md:grid-cols-12 gap-3 p-4">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="Search bills or vendors…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="md:col-span-3">
              <Select value={vendor} onValueChange={setVendor}>
                <SelectTrigger>
                  <SelectValue placeholder="Vendor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All vendors</SelectItem>
                  {vendors.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
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
                  {methods.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-2 flex items-center justify-between border rounded-lg px-3">
              <span className="text-sm">Posted only</span>
              <Switch checked={postedOnly} onCheckedChange={setPostedOnly} />
            </div>
          </CardContent>
        </Card>

        <Separator />

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Cash Out Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm min-w-[900px]">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="px-4 py-3 text-left">Bill</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Vendor</th>
                    <th className="px-4 py-3">Method</th>
                    <th className="px-4 py-3">Category</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium">{r.id}</td>
                      <td className="px-4 py-3">{r.date}</td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                        {r.vendor}
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2">
                        <CreditCard className="h-4 w-4 text-muted-foreground" />
                        {r.method}
                      </td>
                      <td className="px-4 py-3">{r.category}</td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            r.status === "Posted" ? "default" : "secondary"
                          }
                        >
                          {r.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {formatMoney(r.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
