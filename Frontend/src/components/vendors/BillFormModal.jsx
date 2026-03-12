import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const fmtMoney = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const daysBetween = (a, b) => {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
};

const toMMDDYYYY = (iso) => {
  const d = new Date(iso + "T00:00:00");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

const emptyBillLine = () => ({
  id: `${Date.now()}_${Math.random().toString(16).slice(2)}`,
  account: "",
  description: "",
  amount: "",
  customer: "",
  billable: false,
  className: "",
});

export function BillFormModal({ open, onOpenChange, vendorId }) {
  const [formData, setFormData] = useState({
    vendor: vendorId || "",
    billDate: "",
    refNo: "",
    amountDue: "",
    dueDate: "",
    address: "",
    terms: "",
    memo: "",
    lines: [emptyBillLine()],
  });

  if (!open) return null;

  const totalAmount = formData.lines.reduce(
    (sum, line) => sum + Number(line.amount || 0),
    0,
  );

  const updateLine = (id, key, value) => {
    setFormData((prev) => ({
      ...prev,
      lines: prev.lines.map((line) =>
        line.id === id ? { ...line, [key]: value } : line,
      ),
    }));
  };

  const addLine = () => {
    setFormData((prev) => ({
      ...prev,
      lines: [...prev.lines, emptyBillLine()],
    }));
  };

  const removeLine = (id) => {
    setFormData((prev) => ({
      ...prev,
      lines:
        prev.lines.length === 1
          ? prev.lines
          : prev.lines.filter((line) => line.id !== id),
    }));
  };

  const handleSave = () => {
    const payload = {
      ...formData,
      amountDue: formData.amountDue || totalAmount,
    };
    console.log("Bill payload:", payload);
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden rounded-2xl border border-border bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b bg-[#f8fafc] px-6 py-4">
          <div>
            <h2 className="text-lg font-semibold text-[#111827]">Add Bill</h2>
            <p className="text-sm text-[#6b7280]">
              Enter vendor bill details and expense lines
            </p>
          </div>

          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md px-3 py-1.5 text-sm text-[#6b7280] hover:bg-muted cursor-pointer"
          >
            Close
          </button>
        </div>

        <div className="max-h-[calc(90vh-140px)] overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Top form */}
            <div className="rounded-xl border border-border bg-white">
              <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase text-[#6b7280]">
                      Vendor
                    </Label>
                    <Input
                      value={formData.vendor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          vendor: e.target.value,
                        }))
                      }
                      placeholder="Vendor name or ID"
                      className="h-10"
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase text-[#6b7280]">
                      Address
                    </Label>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          address: e.target.value,
                        }))
                      }
                      placeholder="Vendor billing address"
                      className="min-h-[96px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring/30"
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase text-[#6b7280]">
                      Terms
                    </Label>
                    <Input
                      value={formData.terms}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          terms: e.target.value,
                        }))
                      }
                      placeholder="e.g. Net 30"
                      className="h-10"
                    />
                  </div>

                  <div>
                    <Label className="mb-1.5 block text-xs font-semibold uppercase text-[#6b7280]">
                      Memo
                    </Label>
                    <Input
                      value={formData.memo}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          memo: e.target.value,
                        }))
                      }
                      placeholder="Optional internal note"
                      className="h-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1.5 block text-xs font-semibold uppercase text-[#6b7280]">
                        Date
                      </Label>
                      <Input
                        type="date"
                        value={formData.billDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            billDate: e.target.value,
                          }))
                        }
                        className="h-10"
                      />
                    </div>

                    <div>
                      <Label className="mb-1.5 block text-xs font-semibold uppercase text-[#6b7280]">
                        Bill Due
                      </Label>
                      <Input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            dueDate: e.target.value,
                          }))
                        }
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1.5 block text-xs font-semibold uppercase text-[#6b7280]">
                        Ref No
                      </Label>
                      <Input
                        value={formData.refNo}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            refNo: e.target.value,
                          }))
                        }
                        placeholder="Reference number"
                        className="h-10"
                      />
                    </div>

                    <div>
                      <Label className="mb-1.5 block text-xs font-semibold uppercase text-[#6b7280]">
                        Amount Due
                      </Label>
                      <Input
                        type="number"
                        value={formData.amountDue}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            amountDue: e.target.value,
                          }))
                        }
                        placeholder="0.00"
                        className="h-10"
                      />
                    </div>
                  </div>

                  <div className="rounded-xl border border-border bg-[#f8fafc] p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#6b7280]">Calculated total</span>
                      <span className="text-base font-semibold text-[#111827]">
                        ${fmtMoney(totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Line items */}
            <div className="rounded-xl border border-border bg-white overflow-hidden">
              <div className="flex items-center justify-between border-b bg-[#f8fafc] px-5 py-3">
                <div>
                  <h3 className="text-sm font-semibold text-[#111827]">
                    Expense Lines
                  </h3>
                  <p className="text-xs text-[#6b7280]">
                    Add accounts, descriptions, and amounts
                  </p>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  className="h-8 text-xs cursor-pointer"
                  onClick={addLine}
                >
                  + Add Line
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[980px] table-fixed border-collapse">
                  <thead className="bg-white border-b">
                    <tr className="text-[11px] font-semibold uppercase text-[#6b7280]">
                      <th className="px-3 py-2 text-left border-r w-[18%]">Account</th>
                      <th className="px-3 py-2 text-left border-r w-[28%]">Description</th>
                      <th className="px-3 py-2 text-right border-r w-[14%]">Amount</th>
                      <th className="px-3 py-2 text-left border-r w-[18%]">Customer</th>
                      <th className="px-3 py-2 text-center border-r w-[10%]">Billable</th>
                      <th className="px-3 py-2 text-left border-r w-[12%]">Class</th>
                      <th className="px-3 py-2 text-center w-[10%]">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {formData.lines.map((line, idx) => (
                      <tr
                        key={line.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-[#f9fbff]"}
                      >
                        <td className="px-3 py-2 border-r">
                          <Input
                            value={line.account}
                            onChange={(e) =>
                              updateLine(line.id, "account", e.target.value)
                            }
                            placeholder="Expense account"
                            className="h-9 text-sm"
                          />
                        </td>

                        <td className="px-3 py-2 border-r">
                          <Input
                            value={line.description}
                            onChange={(e) =>
                              updateLine(line.id, "description", e.target.value)
                            }
                            placeholder="Description"
                            className="h-9 text-sm"
                          />
                        </td>

                        <td className="px-3 py-2 border-r">
                          <Input
                            type="number"
                            value={line.amount}
                            onChange={(e) =>
                              updateLine(line.id, "amount", e.target.value)
                            }
                            placeholder="0.00"
                            className="h-9 text-sm text-right"
                          />
                        </td>

                        <td className="px-3 py-2 border-r">
                          <Input
                            value={line.customer}
                            onChange={(e) =>
                              updateLine(line.id, "customer", e.target.value)
                            }
                            placeholder="Customer / Project"
                            className="h-9 text-sm"
                          />
                        </td>

                        <td className="px-3 py-2 border-r text-center">
                          <input
                            type="checkbox"
                            checked={line.billable}
                            onChange={(e) =>
                              updateLine(line.id, "billable", e.target.checked)
                            }
                            className="h-4 w-4 accent-orange-500"
                          />
                        </td>

                        <td className="px-3 py-2 border-r">
                          <Input
                            value={line.className}
                            onChange={(e) =>
                              updateLine(line.id, "className", e.target.value)
                            }
                            placeholder="Class"
                            className="h-9 text-sm"
                          />
                        </td>

                        <td className="px-3 py-2 text-center">
                          <button
                            type="button"
                            onClick={() => removeLine(line.id)}
                            className="rounded-md px-2 py-1 text-xs text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t bg-[#f8fafc] px-6 py-4">
          <Button
            variant="outline"
            className="h-9 text-sm cursor-pointer"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            variant="outline"
            className="h-9 text-sm cursor-pointer"
            onClick={handleSave}
          >
            Save & New
          </Button>
          <Button className="h-9 text-sm cursor-pointer" onClick={handleSave}>
            Save Bill
          </Button>
        </div>
      </div>
    </div>
  );
}