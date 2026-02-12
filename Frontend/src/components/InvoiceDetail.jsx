import { useState } from "react";
import { toast } from "sonner";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

import {
  ArrowLeft01Icon as ArrowLeft,
  Mail01Icon as Send,
  Tick02Icon as Check,
  Cancel01Icon as Void,
} from "hugeicons-react";

export function InvoiceDetail({ invoiceId, onBack }) {
  /* -----------------------------
     Mock Invoice Data (v1)
  ------------------------------ */
  const [invoice, setInvoice] = useState({
    id: invoiceId,
    status: "Approved", // Draft | Approved | Sent | Paid | Void
    customer: "Acme Corporation",
    billingTerms: "Net 30",
    issueDate: "2026-11-15",
    dueDate: "2026-12-15",
    currency: "USD",
    lineItems: [
      {
        id: "LI-1",
        description: "Enterprise SaaS Subscription",
        source: "Milestone",
        quantity: 1,
        rate: 750000,
      },
      {
        id: "LI-2",
        description: "Premium Support",
        source: "Time",
        quantity: 40,
        rate: 5300,
      },
    ],
    adjustments: [],
    payments: [
      {
        id: "PMT-1",
        date: "2026-12-10",
        amount: 250000,
        method: "Wire",
        reference: "WIRE-44321",
      },
    ],
    auditTrail: [
      { ts: "2026-11-15", event: "Invoice created" },
      { ts: "2026-11-16", event: "Invoice approved" },
      { ts: "2026-11-18", event: "Invoice sent to customer" },
    ],
  });

  /* -----------------------------
     Derived Values
  ------------------------------ */
  const subtotal = invoice.lineItems.reduce(
    (s, i) => s + i.quantity * i.rate,
    0,
  );

  const adjustmentTotal = invoice.adjustments.reduce((s, a) => s + a.amount, 0);

  const paymentsTotal = invoice.payments.reduce((s, p) => s + p.amount, 0);

  const total = subtotal + adjustmentTotal;
  const balanceDue = total - paymentsTotal;

  /* -----------------------------
     Actions
  ------------------------------ */
  const approveInvoice = () => {
    setInvoice((p) => ({
      ...p,
      status: "Approved",
      auditTrail: [
        ...p.auditTrail,
        { ts: new Date().toISOString(), event: "Invoice approved" },
      ],
    }));
    toast.success("Invoice approved");
  };

  const sendInvoice = () => {
    setInvoice((p) => ({
      ...p,
      status: "Sent",
      auditTrail: [
        ...p.auditTrail,
        { ts: new Date().toISOString(), event: "Invoice sent" },
      ],
    }));
    toast.success("Invoice sent");
  };

  const voidInvoice = () => {
    setInvoice((p) => ({
      ...p,
      status: "Void",
      auditTrail: [
        ...p.auditTrail,
        { ts: new Date().toISOString(), event: "Invoice voided" },
      ],
    }));
    toast.error("Invoice voided");
  };

  /* -----------------------------
     Render
  ------------------------------ */
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div>
            <h1 className="text-2xl font-semibold">{invoice.id}</h1>
            <Badge>{invoice.status}</Badge>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-semibold">${total.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            Due {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Customer & Billing Terms */}
      <Card className="p-6">
        <h2 className="font-semibold mb-4">Customer & Billing</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <Label>Customer</Label>
            <p>{invoice.customer}</p>
          </div>
          <div>
            <Label>Terms</Label>
            <p>{invoice.billingTerms}</p>
          </div>
          <div>
            <Label>Issue Date</Label>
            <p>{invoice.issueDate}</p>
          </div>
          <div>
            <Label>Currency</Label>
            <p>{invoice.currency}</p>
          </div>
        </div>
      </Card>

      {/* Line Items */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Rate</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.lineItems.map((li) => (
              <TableRow key={li.id}>
                <TableCell>{li.description}</TableCell>
                <TableCell>{li.source}</TableCell>
                <TableCell>{li.quantity}</TableCell>
                <TableCell>${li.rate.toLocaleString()}</TableCell>
                <TableCell>
                  ${(li.quantity * li.rate).toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Totals */}
      <Card className="p-6">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span>Adjustments</span>
            <span>${adjustmentTotal.toLocaleString()}</span>
          </div>
          <div className="flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>${total.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-rose-600">
            <span>Balance Due</span>
            <span>${balanceDue.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      {/* Payments */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Payments</h3>
        {invoice.payments.map((p) => (
          <div key={p.id} className="flex justify-between text-sm">
            <span>
              {p.date} · {p.method}
            </span>
            <span>${p.amount.toLocaleString()}</span>
          </div>
        ))}
      </Card>

      {/* Audit Trail */}
      <Card className="p-6">
        <h3 className="font-semibold mb-4">Audit Trail</h3>
        <ul className="text-sm space-y-2">
          {invoice.auditTrail.map((a, i) => (
            <li key={i}>
              {new Date(a.ts).toLocaleDateString()} — {a.event}
            </li>
          ))}
        </ul>
      </Card>

      {/* Actions */}
      <div className="flex gap-3 justify-end">
        {invoice.status === "Draft" && (
          <Button onClick={approveInvoice}>
            <Check className="w-4 h-4 mr-2" />
            Approve Invoice
          </Button>
        )}

        {invoice.status === "Approved" && (
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={sendInvoice}
          >
            <Send className="w-4 h-4 mr-2" />
            Send Invoice
          </Button>
        )}

        {invoice.status === "Sent" && (
          <Button variant="destructive" onClick={voidInvoice}>
            <Void className="w-4 h-4 mr-2" />
            Void Invoice
          </Button>
        )}
      </div>
    </div>
  );
}
