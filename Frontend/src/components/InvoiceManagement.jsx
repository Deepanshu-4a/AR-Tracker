import { useState } from "react";
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
  PencilEdit01Icon as Edit,
  Delete01Icon as Trash2,
  ViewIcon as Eye,
  Mail01Icon as Send,
} from "hugeicons-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { InvoiceForm } from "./InvoiceForm";
import { InvoiceDetail } from "./InvoiceDetail";


/* -----------------------------
   Invoice Management (Aging)
------------------------------ */

export function InvoiceManagement({ onSelectInvoice }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [agingFilter, setAgingFilter] = useState("all");
  const [isAddInvoiceOpen, setIsAddInvoiceOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(null);


 

  const [invoices, setInvoices] = useState([
    {
      id: "INV-2024-001",
      customer: "Acme Corporation",
      amount: 962500,
      dueDate: "2024-12-15",
      daysOverdue: 7,
      riskScore: 85,
      lastReminderSent: "2024-12-20",
    },
    {
      id: "INV-2024-003",
      customer: "Global Enterprises",
      amount: 1925000,
      dueDate: "2024-11-30",
      daysOverdue: 22,
      riskScore: 92,
      lastReminderSent: "2024-12-15",
    },
    {
      id: "INV-2024-005",
      customer: "Innovation Labs",
      amount: 1201200,
      dueDate: "2024-12-20",
      daysOverdue: 2,
      riskScore: 68,
      lastReminderSent: "2024-12-21",
    },
    {
      id: "INV-2024-008",
      customer: "CloudFirst Inc",
      amount: 1424500,
      dueDate: "2024-11-20",
      daysOverdue: 32,
      riskScore: 95,
      lastReminderSent: "2024-12-10",
    },
  ]);

  /* -----------------------------
     Helpers
  ------------------------------ */

  const getAgingBucket = (daysOverdue) => {
    if (daysOverdue <= 30) return "0–30";
    if (daysOverdue <= 60) return "31–60";
    return "60+";
  };

  const getAgingBadgeClass = (bucket) => {
    switch (bucket) {
      case "0–30":
        return "bg-green-50 text-green-700 border-green-200";
      case "31–60":
        return "bg-orange-50 text-orange-700 border-orange-200";
      case "60+":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRiskBadgeClass = (score) => {
    if (score >= 80) return "bg-red-50 text-red-700 border-red-200";
    if (score >= 50) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch =
      invoice.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.id.toLowerCase().includes(searchTerm.toLowerCase());

    const bucket = getAgingBucket(invoice.daysOverdue);
    const matchesAging = agingFilter === "all" || bucket === agingFilter;

    return matchesSearch && matchesAging;
  });

  const handleSendReminder = (id) => {
    toast.success("Reminder sent successfully");
  };

  /* -----------------------------
     Render
  ------------------------------ */

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
          <h1>Invoice Management</h1>
          <p className="text-muted-foreground">
            Track unpaid invoices, aging, and risk exposure
          </p>
        </div>

        <Button
          className="bg-orange-500 hover:bg-orange-600 gap-1"
          onClick={() => setIsAddInvoiceOpen(true)}
        >
          <Plus className="w-4 h-4" />
          Add Invoice
        </Button>
      </div>

      <Dialog open={isAddInvoiceOpen} onOpenChange={setIsAddInvoiceOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Add New Invoice</DialogTitle>
          </DialogHeader>

          <InvoiceForm
            onSubmit={(data) => {
              const today = new Date();

              const due = new Date(data.dueDate);

              const daysOverdue =
                due < today
                  ? Math.floor((today - due) / (1000 * 60 * 60 * 24))
                  : 0;

              const newInvoice = {
                id: data.invoiceNumber || `INV-${Date.now()}`,

                customer: data.customer,

                amount: Number(data.amount),

                dueDate: data.dueDate,

                daysOverdue,

                riskScore: daysOverdue > 60 ? 90 : daysOverdue > 30 ? 70 : 40,

                lastReminderSent: null,
              };

              setInvoices((prev) => [newInvoice, ...prev]);

              toast.success("Invoice created successfully");

              setIsAddInvoiceOpen(false);
            }}
            onCancel={() => setIsAddInvoiceOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search invoices or clients..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={agingFilter} onValueChange={setAgingFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Aging bucket" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Aging</SelectItem>
              <SelectItem value="0–30">0–30 Days</SelectItem>
              <SelectItem value="31–60">31–60 Days</SelectItem>
              <SelectItem value="60+">60+ Days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>
      

      {/* Invoice Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Aging</TableHead>
              <TableHead>Risk</TableHead>
              <TableHead>Last Reminder</TableHead>
              <TableHead className="w-24">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredInvoices.map((invoice) => {
              const agingBucket = getAgingBucket(invoice.daysOverdue);

              return (
                <TableRow key={invoice.id}>
                  <TableCell className="font-mono">{invoice.id}</TableCell>
                  <TableCell>{invoice.customer}</TableCell>
                  <TableCell className="font-medium">
                    ${invoice.amount.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.dueDate).toLocaleDateString()}
                    {invoice.daysOverdue > 0 && (
                      <div className="text-xs text-red-600">
                        {invoice.daysOverdue} days overdue
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge className={getAgingBadgeClass(agingBucket)}>
                      {agingBucket} Days
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getRiskBadgeClass(invoice.riskScore)}>
                      {invoice.riskScore >= 80
                        ? "High Risk"
                        : invoice.riskScore >= 50
                          ? "Medium Risk"
                          : "Low Risk"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {invoice.lastReminderSent
                      ? new Date(invoice.lastReminderSent).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedInvoiceId(invoice.id)}
                      >
                        View
                      </Button>
                      <Button
                        size="sm"
                        className="gap-1 bg-orange-500 hover:bg-orange-600 text-white"
                        onClick={() => handleSendReminder(invoice.id)}
                      >
                        <Send className="w-4 h-4" />
                        Reminder
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {filteredInvoices.length === 0 && (
          <div className="h-32 flex items-center justify-center text-muted-foreground">
            No invoices found
          </div>
        )}
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-green-600">
            $
            {filteredInvoices
              .filter((i) => i.daysOverdue <= 30)
              .reduce((s, i) => s + i.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">0–30 Days</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-orange-600">
            $
            {filteredInvoices
              .filter((i) => i.daysOverdue > 30 && i.daysOverdue <= 60)
              .reduce((s, i) => s + i.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">31–60 Days</p>
        </Card>

        <Card className="p-4 text-center">
          <p className="text-2xl font-semibold text-red-600">
            $
            {filteredInvoices
              .filter((i) => i.daysOverdue > 60)
              .reduce((s, i) => s + i.amount, 0)
              .toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">60+ Days</p>
        </Card>
      </div>
    </div>
  );
  
}
