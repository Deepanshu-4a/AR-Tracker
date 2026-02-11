import { useState, useMemo } from "react";
import { toast } from "sonner";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  PlusSignIcon as Plus,
  Search01Icon as Search,
  Mail01Icon as Send,
  Tick02Icon as Check,
  EyeIcon,
} from "hugeicons-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { InvoiceForm } from "./InvoiceForm";
import { InvoiceDetail } from "./InvoiceDetail";

export function InvoiceManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);

  const [invoices, setInvoices] = useState([
    {
      id: "INV-2024-001",
      customer: "Acme Corporation",
      amount: 962500,
      dueDate: "2024-12-15",
      daysOutstanding: 7,
      status: "Sent",
    },
    {
      id: "INV-2024-002",
      customer: "Global Enterprises",
      amount: 1925000,
      dueDate: "2024-11-30",
      daysOutstanding: 22,
      status: "Overdue",
    },
    {
      id: "INV-2024-003",
      customer: "Innovation Labs",
      amount: 420000,
      dueDate: "2024-12-20",
      daysOutstanding: 0,
      status: "Approved",
    },
    {
      id: "INV-2024-004",
      customer: "CloudFirst Inc",
      amount: 780000,
      dueDate: "2024-12-05",
      daysOutstanding: 0,
      status: "Draft",
    },
  ]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((i) => {
      const matchesSearch =
        i.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        i.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all" || i.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [invoices, searchTerm, statusFilter]);

  const summary = useMemo(() => {
    const sum = (status) =>
      invoices
        .filter((i) => i.status === status)
        .reduce((s, i) => s + i.amount, 0);

    return {
      Draft: sum("Draft"),
      Approved: sum("Approved"),
      Sent: sum("Sent"),
      Overdue: sum("Overdue"),
    };
  }, [invoices]);

  const statusBadgeClass = (status) => {
    switch (status) {
      case "Draft":
        return "border-slate-300 bg-slate-100 text-slate-700";
      case "Approved":
        return "border-blue-300 bg-blue-100 text-blue-700";
      case "Sent":
        return "border-emerald-300 bg-emerald-100 text-emerald-700";
      case "Overdue":
        return "border-rose-300 bg-rose-100 text-rose-700";
      default:
        return "border-slate-300 bg-slate-100 text-slate-700";
    }
  };

  if (selectedInvoiceId) {
    return (
      <InvoiceDetail
        invoiceId={selectedInvoiceId}
        onBack={() => setSelectedInvoiceId(null)}
      />
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Invoice Center</h1>
          <p className="text-sm text-muted-foreground">
            Turn approved work into invoices and cash
          </p>
        </div>

        <Button
          className="bg-orange-500 hover:bg-orange-600 gap-1"
          onClick={() => setIsAddInvoiceOpen(true)}
        >
          <Plus className="w-4 h-4" />
          New Invoice
        </Button>
      </div>

      {/* AR Snapshot */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(summary).map(([label, value]) => (
          <Card key={label} className="p-4">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-xl font-semibold">${value.toLocaleString()}</p>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-[1fr_180px] gap-4 items-center">
          {/* Search (PRIMARY) */}
          <div className="relative w-full">
            <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search invoice # or customer"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="
          h-11
          w-full
          pl-12
          text-base
          bg-slate-50
          border-slate-200
          placeholder:text-slate-400
          focus-visible:ring-2
          focus-visible:ring-orange-500/30
          focus-visible:border-orange-400
        "
            />
          </div>

          {/* Status Filter (SECONDARY) */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-[180px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Sent">Sent</SelectItem>
              <SelectItem value="Overdue">Overdue</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Days Outstanding</TableHead>
              <TableHead className="w-32">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell className="font-mono">{invoice.id}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell className="font-medium">
                  ${invoice.amount.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusBadgeClass(invoice.status)}
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(invoice.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {invoice.daysOutstanding > 0
                    ? `${invoice.daysOutstanding} days`
                    : "—"}
                </TableCell>
                <TableCell>
                  {invoice.status === "Draft" && (
                    <Button size="sm" variant="outline">
                      <Check className="w-4 h-4 mr-1" />
                      Approve
                    </Button>
                  )}

                  {invoice.status === "Approved" && (
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() => toast.success("Invoice sent")}
                    >
                      <Send className="w-4 h-4 mr-1" />
                      Send
                    </Button>
                  )}

                  {(invoice.status === "Sent" ||
                    invoice.status === "Overdue") && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedInvoiceId(invoice.id)}
                    >
                      <EyeIcon className="w-4 h-4 mr-1" />
                      Review
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredInvoices.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No invoices match your filters
          </div>
        )}
      </Card>

      {/* Add Invoice Dialog */}
      <Dialog open={isAddInvoiceOpen} onOpenChange={setIsAddInvoiceOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>New Invoice</DialogTitle>
          </DialogHeader>
          <InvoiceForm
            onSubmit={(data) => {
              setInvoices((prev) => [
                {
                  id: data.invoiceNumber,
                  customer: data.customer,
                  amount: Number(data.amount),
                  dueDate: data.dueDate,
                  daysOutstanding: 0,
                  status: "Draft",
                },
                ...prev,
              ]);
              toast.success("Invoice created");
              setIsAddInvoiceOpen(false);
            }}
            onCancel={() => setIsAddInvoiceOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
