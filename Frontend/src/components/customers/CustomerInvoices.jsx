import { useMemo } from "react";

import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { FileText, MoreVertical, Send, Eye, Download } from "lucide-react";

export function CustomerInvoices({ customerId, customerName, onViewInvoice }) {
  /* ================= MOCK DATA ================= */

  // Invoices are relational (tagged with project + job)
  const invoices = [
    {
      id: "INV-10234",
      customerId: "CL001",
      projectId: "P1001",
      jobId: "J1001",
      period: "Jan 2026",
      amount: 125000,
      status: "Sent",
    },
    {
      id: "INV-10212",
      customerId: "CL001",
      projectId: "P1001",
      jobId: "J1002",
      period: "Dec 2025",
      amount: 98000,
      status: "Sent",
    },
    {
      id: "INV-10188",
      customerId: "CL001",
      projectId: "P1002",
      jobId: "J1003",
      period: "Nov 2025",
      amount: 67000,
      status: "Draft",
    },
    {
      id: "INV-20201",
      customerId: "CL002",
      projectId: "P2001",
      jobId: "J2001",
      period: "Jan 2026",
      amount: 54000,
      status: "Sent",
    },
    {
      id: "INV-30110",
      customerId: "CL003",
      projectId: "P3001",
      jobId: "J3001",
      period: "Jan 2026",
      amount: 22000,
      status: "Draft",
    },
  ];

  /* ================= FILTER BY CUSTOMER ================= */

  const scopedInvoices = useMemo(() => {
    return invoices.filter((inv) => inv.customerId === customerId);
  }, [customerId]);

  /* ================= TOTALS ================= */

  const totals = useMemo(() => {
    const total = scopedInvoices.reduce((s, i) => s + i.amount, 0);

    const sent = scopedInvoices
      .filter((i) => i.status === "Sent")
      .reduce((s, i) => s + i.amount, 0);

    const draft = scopedInvoices
      .filter((i) => i.status === "Draft")
      .reduce((s, i) => s + i.amount, 0);

    return { total, sent, draft };
  }, [scopedInvoices]);

  /* ================= HELPERS ================= */

  const statusBadge = (s) => {
    const map = {
      Draft: "bg-slate-100 text-slate-700",
      Sent: "bg-purple-100 text-purple-700",
    };
    return map[s] ?? "bg-muted text-muted-foreground";
  };

  const money = (n) =>
    `$${Math.round(n).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    })}`;

  /* ================= UI ================= */

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Invoices for</p>
          <h3 className="text-lg font-semibold">
            {customerName || customerId || "Customer"}
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => alert("Export invoices")}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Draft Invoices</p>
          <p className="text-xl font-semibold">{money(totals.draft)}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Sent Invoices</p>
          <p className="text-xl font-semibold">{money(totals.sent)}</p>
        </Card>

        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-semibold">{money(totals.total)}</p>
        </Card>
      </div>

      {/* Invoice Table */}
      <Card className="p-0 overflow-hidden">
        <div className="p-4 border-b flex items-center gap-2">
          <FileText className="w-4 h-4 text-muted-foreground" />
          <p className="font-medium">Invoice History</p>
          <span className="text-sm text-muted-foreground">
            ({scopedInvoices.length})
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Job</TableHead>
                <TableHead>Billing Period</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {scopedInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7}>
                    <div className="py-10 text-center text-muted-foreground">
                      No invoices for this customer yet.
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                scopedInvoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.id}</TableCell>

                    <TableCell>{inv.projectId}</TableCell>

                    <TableCell>{inv.jobId}</TableCell>

                    <TableCell>{inv.period}</TableCell>

                    <TableCell className="text-right">
                      {money(inv.amount)}
                    </TableCell>

                    <TableCell>
                      <Badge className={statusBadge(inv.status)}>
                        {inv.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => onViewInvoice?.(inv.id)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => alert(`Send: ${inv.id}`)}
                            disabled={inv.status === "Sent"}
                          >
                            <Send className="w-4 h-4 mr-2" />
                            Send
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => alert(`Download PDF: ${inv.id}`)}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download PDF
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
