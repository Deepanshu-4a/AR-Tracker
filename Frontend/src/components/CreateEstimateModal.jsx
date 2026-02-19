"use client";

import { useState, useEffect, useMemo } from "react";
import { X, Square, Trash2, Plus } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

const createEmptyLine = () => ({
  id: crypto.randomUUID(),
  item: "",
  description: "",
  qty: 1,
  rate: 0,
});

export function CreateEstimateModal({ open, onOpenChange, customer }) {
  const [isMaximized, setIsMaximized] = useState(false);

  const [estimateData, setEstimateData] = useState({
    customerJob: "",
    class: "",
    template: "Retail Estimate",
    date: "",
    estimateNumber: "",
    address: "",
    taxRate: 0,
  });

  const [lines, setLines] = useState([createEmptyLine()]);

  /* ================= SYNC CUSTOMER ================= */

  useEffect(() => {
    if (customer) {
      setEstimateData((prev) => ({
        ...prev,
        customerJob: customer.name,
      }));
    }
  }, [customer]);

  /* ================= CALCULATIONS ================= */

  const subtotal = useMemo(() => {
    return lines.reduce(
      (sum, line) => sum + Number(line.qty || 0) * Number(line.rate || 0),
      0,
    );
  }, [lines]);

  const taxAmount = useMemo(() => {
    return subtotal * (Number(estimateData.taxRate || 0) / 100);
  }, [subtotal, estimateData.taxRate]);

  const total = subtotal + taxAmount;

  /* ================= LINE HANDLERS ================= */

  const updateLine = (id, field, value) => {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, [field]: value } : line)),
    );
  };

  const addLine = () => {
    setLines((prev) => [...prev, createEmptyLine()]);
  };

  const removeLine = (id) => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  };

  /* ================= SAVE ================= */

  const handleSave = () => {
    const payload = {
      ...estimateData,
      lines,
      subtotal,
      taxAmount,
      total,
    };

    console.log("ESTIMATE PAYLOAD:", payload);
    onOpenChange(false);
  };

  const handleSaveNew = () => {
    handleSave();
    setLines([createEmptyLine()]);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-card shadow-2xl flex flex-col ${
          isMaximized
            ? "w-screen h-screen rounded-none"
            : "w-[1300px] h-[92vh] rounded-xl"
        }`}
      >
        {/* ================= HEADER ================= */}
        <div
          className={`relative flex items-center px-6 py-3 bg-orange-500 text-white ${
            isMaximized ? "" : "rounded-t-xl"
          }`}
        >
          <h3 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold">
            Create Estimate
          </h3>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="size-8 flex items-center justify-center rounded-md hover:bg-white/20"
            >
              <Square size={14} />
            </button>

            <button
              onClick={() => onOpenChange(false)}
              className="size-8 flex items-center justify-center rounded-md hover:bg-red-500/80"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ================= TOP CONTROL STRIP ================= */}
        <div className="px-8 py-4 border-b bg-muted/30">
          <div className="grid grid-cols-12 gap-6 items-end">
            <div className="col-span-4">
              <Label className="text-xs uppercase text-muted-foreground">
                Customer : Job
              </Label>
              <Select
                value={estimateData.customerJob}
                onValueChange={(value) =>
                  setEstimateData((prev) => ({
                    ...prev,
                    customerJob: value,
                  }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MegaMart">MegaMart</SelectItem>
                  <SelectItem value="TechStart Inc">TechStart Inc</SelectItem>
                  <SelectItem value="Acme Corp">Acme Corp</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <Label className="text-xs uppercase text-muted-foreground">
                Class
              </Label>
              <Select
                value={estimateData.class}
                onValueChange={(value) =>
                  setEstimateData((prev) => ({
                    ...prev,
                    class: value,
                  }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retail">Retail</SelectItem>
                  <SelectItem value="Wholesale">Wholesale</SelectItem>
                  <SelectItem value="Service">Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-3">
              <Label className="text-xs uppercase text-muted-foreground">
                Template
              </Label>
              <Select
                value={estimateData.template}
                onValueChange={(value) =>
                  setEstimateData((prev) => ({
                    ...prev,
                    template: value,
                  }))
                }
              >
                <SelectTrigger className="h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Retail Estimate">
                    Retail Estimate
                  </SelectItem>
                  <SelectItem value="Service Estimate">
                    Service Estimate
                  </SelectItem>
                  <SelectItem value="Professional Estimate">
                    Professional Estimate
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* ================= ESTIMATE META ================= */}
        <div className="px-8 py-6 border-b">
          <div className="grid grid-cols-12 gap-6">
            <div className="col-span-6">
              <h1 className="text-3xl font-semibold mb-6">Estimate</h1>

              <div className="grid grid-cols-6 gap-4">
                <div className="col-span-3">
                  <Label className="text-xs">Date</Label>
                  <Input
                    type="date"
                    value={estimateData.date}
                    onChange={(e) =>
                      setEstimateData((p) => ({
                        ...p,
                        date: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="col-span-3">
                  <Label className="text-xs">Estimate #</Label>
                  <Input
                    value={estimateData.estimateNumber}
                    onChange={(e) =>
                      setEstimateData((p) => ({
                        ...p,
                        estimateNumber: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>
            </div>

            <div className="col-span-6">
              <Label className="text-xs">Name / Address</Label>
              <textarea
                className="w-full h-28 rounded-md border bg-background p-3 text-sm resize-none"
                value={estimateData.address}
                onChange={(e) =>
                  setEstimateData((p) => ({
                    ...p,
                    address: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* ================= LINE ITEMS ================= */}
        <div className="flex-1 p-8 overflow-auto">
          <div className="border rounded-lg overflow-hidden">
            <div className="grid grid-cols-12 bg-muted px-4 py-2 text-xs font-semibold">
              <div className="col-span-2">Item</div>
              <div className="col-span-4">Description</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Rate</div>
              <div className="col-span-1 text-right">Total</div>
              <div className="col-span-1"></div>
            </div>

            {lines.map((line) => {
              const lineTotal = Number(line.qty) * Number(line.rate);

              return (
                <div
                  key={line.id}
                  className="grid grid-cols-12 px-4 py-2 items-center border-t"
                >
                  <div className="col-span-2">
                    <Input
                      value={line.item}
                      onChange={(e) =>
                        updateLine(line.id, "item", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-span-4">
                    <Input
                      value={line.description}
                      onChange={(e) =>
                        updateLine(line.id, "description", e.target.value)
                      }
                    />
                  </div>

                  <div className="col-span-2 text-right">
                    <Input
                      type="number"
                      value={line.qty}
                      onChange={(e) =>
                        updateLine(line.id, "qty", e.target.value)
                      }
                      className="text-right"
                    />
                  </div>

                  <div className="col-span-2 text-right">
                    <Input
                      type="number"
                      value={line.rate}
                      onChange={(e) =>
                        updateLine(line.id, "rate", e.target.value)
                      }
                      className="text-right"
                    />
                  </div>

                  <div className="col-span-1 text-right font-medium">
                    ${lineTotal.toFixed(2)}
                  </div>

                  <div className="col-span-1 flex justify-end">
                    <button
                      onClick={() => removeLine(line.id)}
                      className="text-muted-foreground hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <Button
            onClick={addLine}
            variant="outline"
            className="mt-4 flex items-center gap-2"
          >
            <Plus size={14} />
            Add Line
          </Button>

          {/* ================= TOTALS ================= */}
          <div className="mt-8 w-96 ml-auto space-y-3">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center">
              <span>Tax %</span>
              <Input
                type="number"
                value={estimateData.taxRate}
                onChange={(e) =>
                  setEstimateData((p) => ({
                    ...p,
                    taxRate: e.target.value,
                  }))
                }
                className="w-24 text-right"
              />
            </div>

            <div className="flex justify-between">
              <span>Tax Amount</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg border-t pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div
          className={`flex justify-end gap-3 px-8 py-4 border-t bg-muted/40 ${
            isMaximized ? "" : "rounded-b-xl"
          }`}
        >
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>

          <Button variant="secondary" onClick={handleSaveNew}>
            Save & New
          </Button>

          <Button
            onClick={handleSave}
            className="bg-orange-500 hover:bg-orange-600"
          >
            Save & Close
          </Button>
        </div>
      </div>
    </div>
  );
}
