import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

export function PaymentsReceivables() {
  const [agingFilter, setAgingFilter] = useState("all");
  const [showApply, setShowApply] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState({});

  const [invoices, setInvoices] = useState([
    { id: "INV-001", customer: "Acme Corp", total: 500000, paid: 0, days: 12 },
    {
      id: "INV-002",
      customer: "Globex",
      total: 300000,
      paid: 100000,
      days: 45,
    },
    { id: "INV-003", customer: "Innotech", total: 200000, paid: 0, days: 78 },
  ]);

  const [payments, setPayments] = useState([]);

  const getBucket = (days) => {
    if (days <= 30) return "0–30";
    if (days <= 60) return "31–60";
    if (days <= 90) return "61–90";
    return "90+";
  };

  const getStatus = (inv) => {
    if (inv.paid === 0) return "Unpaid";
    if (inv.paid < inv.total) return "Partial";
    return "Paid";
  };

  const getBalance = (inv) => inv.total - inv.paid;

  const openInvoices = invoices.filter((inv) => getBalance(inv) > 0);

  const filteredInvoices =
    agingFilter === "all"
      ? openInvoices
      : openInvoices.filter((i) => getBucket(i.days) === agingFilter);

  const handleApplyPayment = () => {
    let remaining = Number(paymentAmount);
    if (!remaining) return;

    const allocations = [];

    const updatedInvoices = invoices.map((inv) => {
      if (!selectedInvoices[inv.id] || remaining <= 0) return inv;

      const balance = getBalance(inv);
      const applied = Math.min(balance, remaining);
      remaining -= applied;

      allocations.push({
        invoiceId: inv.id,
        amount: applied,
      });

      return {
        ...inv,
        paid: inv.paid + applied,
      };
    });

    setInvoices(updatedInvoices);

    setPayments([
      ...payments,
      {
        id: `PMT-${String(payments.length + 1).padStart(3, "0")}`,
        date: new Date().toISOString().split("T")[0],
        totalAmount: Number(paymentAmount),
        appliedAmount: Number(paymentAmount) - remaining,
        unappliedAmount: remaining,
        allocations,
      },
    ]);

    setPaymentAmount("");
    setSelectedInvoices({});
    setShowApply(false);
  };

  return (
    <div className="space-y-6">
      {/* AR Aging Buckets */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {["all", "0–30", "31–60", "61–90", "90+"].map((bucket) => (
          <Card
            key={bucket}
            onClick={() => setAgingFilter(bucket)}
            className={`p-4 cursor-pointer ${
              agingFilter === bucket ? "ring-2 ring-orange-400" : ""
            }`}
          >
            <p className="text-sm text-muted-foreground">
              {bucket === "all" ? "All AR" : `${bucket} Days`}
            </p>
            <p className="text-lg font-semibold">
              $
              {openInvoices
                .filter((i) =>
                  bucket === "all" ? true : getBucket(i.days) === bucket,
                )
                .reduce((sum, i) => sum + getBalance(i), 0)
                .toLocaleString()}
            </p>
          </Card>
        ))}
      </div>

      {/* Outstanding Receivables */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Select</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aging</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((inv) => (
              <TableRow key={inv.id}>
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedInvoices[inv.id] || false}
                    onChange={(e) =>
                      setSelectedInvoices({
                        ...selectedInvoices,
                        [inv.id]: e.target.checked,
                      })
                    }
                  />
                </TableCell>
                <TableCell className="font-mono">{inv.id}</TableCell>
                <TableCell>{inv.customer}</TableCell>
                <TableCell>${inv.total.toLocaleString()}</TableCell>
                <TableCell>${inv.paid.toLocaleString()}</TableCell>
                <TableCell>${getBalance(inv).toLocaleString()}</TableCell>
                <TableCell>
                  <Badge>{getStatus(inv)}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{getBucket(inv.days)}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Payments Ledger */}
      <Card className="p-6 space-y-4">
        <div className="flex justify-between">
          <h3 className="font-semibold">Payments</h3>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
            onClick={() => setShowApply(true)}
          >
            Apply Payment
          </Button>
        </div>

        <div className="space-y-2 text-sm">
          {payments.map((p) => (
            <div key={p.id} className="border-b pb-2 flex justify-between">
              <div>
                <div className="font-mono">{p.id}</div>
                <div className="text-muted-foreground">
                  {p.date} · Applied:{" "}
                  {p.allocations.map((a) => a.invoiceId).join(", ")}
                </div>
              </div>
              <div className="text-right">
                <div>${p.totalAmount.toLocaleString()}</div>
                {p.unappliedAmount > 0 && (
                  <div className="text-xs text-muted-foreground">
                    Unapplied: ${p.unappliedAmount.toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Apply Payment Panel */}
      {showApply && (
        <Card className="p-6 space-y-4">
          <h3 className="font-semibold">Apply Payment</h3>

          <Input
            type="number"
            placeholder="Payment Amount"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
          />

          <div className="text-sm text-muted-foreground">
            Select one or more open invoices above. Partial payments supported.
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApplyPayment}>Confirm Payment</Button>
            <Button variant="secondary" onClick={() => setShowApply(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
