import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "../ui/utils";

const fmtMoney = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const toMMDDYYYY = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso + "T00:00:00");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const mockBills = [
  {
    id: "ATS-00001",
    vendorId: "VND-1001",
    vendorName: "Alpha Supplies",
    type: "Bill",
    refNo: "REF-10001",
    billDate: "2025-01-31",
    dueDate: "2025-03-02",
    terms: "Net 30",
    status: "Closed",
    amount: 21250,
    openBalance: 0,
    address: "1200 Main Street, Suite 400, Dallas, TX 75001",
    memo: "Monthly procurement bill",
    lines: [
      {
        id: "1",
        account: "Office Supplies",
        description: "Bulk office supply order",
        amount: 8500,
        customer: "",
        billable: false,
        className: "Admin",
      },
      {
        id: "2",
        account: "IT Equipment",
        description: "Monitors and docking stations",
        amount: 12750,
        customer: "",
        billable: false,
        className: "IT",
      },
    ],
  },
  {
    id: "ATS-00002",
    vendorId: "VND-1001",
    vendorName: "Alpha Supplies",
    type: "Bill",
    refNo: "REF-10002",
    billDate: "2025-02-28",
    dueDate: "2025-03-30",
    terms: "Net 30",
    status: "Closed",
    amount: 19000,
    openBalance: 0,
    address: "1200 Main Street, Suite 400, Dallas, TX 75001",
    memo: "February vendor bill",
    lines: [
      {
        id: "1",
        account: "Software Expense",
        description: "License renewal",
        amount: 9000,
        customer: "",
        billable: false,
        className: "Ops",
      },
      {
        id: "2",
        account: "Professional Services",
        description: "Consulting support",
        amount: 10000,
        customer: "",
        billable: false,
        className: "Consulting",
      },
    ],
  },
];

function ConfirmModal({
  open,
  title,
  description,
  confirmLabel,
  confirmTone = "danger",
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-5 shadow-2xl">
        <h3 className="text-base font-semibold text-[#111827]">{title}</h3>
        <p className="mt-2 text-sm text-[#6b7280]">{description}</p>

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            variant="outline"
            className="h-9 cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </Button>

          <Button
            className={cn(
              "h-9 cursor-pointer",
              confirmTone === "danger" &&
                "bg-red-600 hover:bg-red-700 text-white",
            )}
            onClick={onConfirm}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function BillDetail() {
  const navigate = useNavigate();
  const { vendorId, billId } = useParams();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showVoidConfirm, setShowVoidConfirm] = useState(false);

  const bill = useMemo(() => {
    return mockBills.find((b) => b.id === billId && b.vendorId === vendorId);
  }, [billId, vendorId]);

  if (!bill) {
    return (
      <div className="p-6">
        <Card className="rounded-2xl border border-border/60 p-8">
          <h2 className="text-lg font-semibold">Bill not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please go back to vendor transactions and try again.
          </p>
          <Button
            className="mt-4 cursor-pointer"
            variant="outline"
            onClick={() => navigate(`/vendors/${vendorId}/transactions`)}
          >
            Back to Transactions
          </Button>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    console.log("Delete bill:", bill.id);
    setShowDeleteConfirm(false);
    navigate(`/vendors/${vendorId}/transactions`);
  };

  const handleVoid = () => {
    console.log("Void bill:", bill.id);
    setShowVoidConfirm(false);
  };

  const handlePrint = () => {
    window.print();
  };

  const handlePayBill = () => {
    console.log("Pay bill:", bill.id);
  };

  const handleScheduleOnlinePayment = () => {
    console.log("Schedule online payment for:", bill.id);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        {/* Top bar */}
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="outline"
            className="h-9 cursor-pointer"
            onClick={() => navigate(`/vendors/${vendorId}/transactions`)}
          >
            Back
          </Button>

          <div className="ml-auto flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="h-9 cursor-pointer"
              onClick={handlePrint}
            >
              Print Bill
            </Button>

            <Button
              variant="outline"
              className="h-9 cursor-pointer"
              onClick={handleScheduleOnlinePayment}
            >
              Schedule Online Payment
            </Button>

            <Button className="h-9 cursor-pointer" onClick={handlePayBill}>
              Pay Bill
            </Button>

            <Button
              variant="outline"
              className="h-9 cursor-pointer border-amber-300 text-amber-700 hover:bg-amber-50"
              onClick={() => setShowVoidConfirm(true)}
            >
              Void Bill
            </Button>

            <Button
              variant="outline"
              className="h-9 cursor-pointer border-red-300 text-red-700 hover:bg-red-50"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Bill
            </Button>
          </div>
        </div>

        {/* Header card */}
        <Card className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="border-b bg-[#f8fafc] px-6 py-4">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold text-[#111827]">
                  Bill {bill.id}
                </h1>
                <p className="mt-1 text-sm text-[#6b7280]">
                  Vendor:{" "}
                  <span className="font-medium text-[#374151]">
                    {bill.vendorName}
                  </span>
                </p>
              </div>

              <div
                className={cn(
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  bill.status === "Closed"
                    ? "bg-slate-100 text-slate-700"
                    : "bg-emerald-100 text-emerald-700",
                )}
              >
                {bill.status}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2">
            <div className="space-y-4">
              <DetailRow label="Vendor" value={bill.vendorName} />
              <DetailRow label="Address" value={bill.address} />
              <DetailRow label="Terms" value={bill.terms} />
              <DetailRow label="Memo" value={bill.memo || "—"} />
            </div>

            <div className="space-y-4">
              <DetailRow label="Type" value={bill.type} />
              <DetailRow label="Ref No" value={bill.refNo || "—"} />
              <DetailRow label="Bill Date" value={toMMDDYYYY(bill.billDate)} />
              <DetailRow label="Due Date" value={toMMDDYYYY(bill.dueDate)} />
              <DetailRow label="Amount" value={`$${fmtMoney(bill.amount)}`} />
              <DetailRow
                label="Open Balance"
                value={`$${fmtMoney(bill.openBalance)}`}
              />
            </div>
          </div>
        </Card>

        {/* Line items */}
        <Card className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="border-b bg-[#f8fafc] px-6 py-4">
            <h2 className="text-sm font-semibold text-[#111827]">Bill Lines</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] border-collapse">
              <thead className="bg-white border-b">
                <tr className="text-[11px] font-semibold uppercase text-[#6b7280]">
                  <th className="px-4 py-3 text-left border-r">Account</th>
                  <th className="px-4 py-3 text-left border-r">Description</th>
                  <th className="px-4 py-3 text-right border-r">Amount</th>
                  <th className="px-4 py-3 text-left border-r">Customer</th>
                  <th className="px-4 py-3 text-center border-r">Billable</th>
                  <th className="px-4 py-3 text-left">Class</th>
                </tr>
              </thead>

              <tbody className="text-sm text-[#111827]">
                {bill.lines.map((line, idx) => (
                  <tr
                    key={line.id}
                    className={idx % 2 === 0 ? "bg-white" : "bg-[#f9fbff]"}
                  >
                    <td className="px-4 py-3 border-r">{line.account || "—"}</td>
                    <td className="px-4 py-3 border-r">
                      {line.description || "—"}
                    </td>
                    <td className="px-4 py-3 border-r text-right tabular-nums">
                      {fmtMoney(line.amount)}
                    </td>
                    <td className="px-4 py-3 border-r">
                      {line.customer || "—"}
                    </td>
                    <td className="px-4 py-3 border-r text-center">
                      {line.billable ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-3">{line.className || "—"}</td>
                  </tr>
                ))}

                <tr className="border-t bg-[#f8fafc]">
                  <td colSpan={2} className="px-4 py-3 text-right font-semibold">
                    Total
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums border-r">
                    {fmtMoney(bill.amount)}
                  </td>
                  <td colSpan={3} />
                </tr>
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <ConfirmModal
        open={showDeleteConfirm}
        title="Delete Bill?"
        description={`This will permanently delete bill ${bill.id}. This action cannot be undone.`}
        confirmLabel="Delete Bill"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
      />

      <ConfirmModal
        open={showVoidConfirm}
        title="Void Bill?"
        description={`This will void bill ${bill.id}. The bill will remain in history but should no longer be active.`}
        confirmLabel="Void Bill"
        onCancel={() => setShowVoidConfirm(false)}
        onConfirm={handleVoid}
      />
    </>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-6 border-b border-dashed border-border/60 pb-3">
      <span className="shrink-0 text-sm text-[#6b7280]">{label}</span>
      <span className="text-right text-sm font-medium text-[#111827] break-words">
        {value}
      </span>
    </div>
  );
}