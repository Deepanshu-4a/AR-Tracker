import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Card } from "./ui/card";

export function InvoiceForm({
  initialData,
  onSubmit,
  onCancel,
  customers = [],
}) {
  const [formData, setFormData] = useState(
    initialData || {
      invoiceNumber: "",
      customerId: "",
      billingPeriodStart: "",
      billingPeriodEnd: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      paymentTerms: "Net 30",
    },
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit({
      invoiceNumber: formData.invoiceNumber,
      customerId: formData.customerId,
      billingPeriod: {
        start: formData.billingPeriodStart,
        end: formData.billingPeriodEnd,
      },
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      paymentTerms: formData.paymentTerms,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="max-h-[70vh] flex flex-col">
      {/* CONTENT */}
      <div className="flex-1 overflow-auto space-y-4 pr-2">
        {/* Identity */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Invoice Identity</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Invoice Number</Label>
              <Input
                placeholder="INV-2026-012"
                value={formData.invoiceNumber}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    invoiceNumber: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Customer</Label>
              <Select
                value={formData.customerId}
                onValueChange={(value) =>
                  setFormData({ ...formData, customerId: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Billing Period */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Billing Period</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Period Start</Label>
              <Input
                type="date"
                value={formData.billingPeriodStart}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    billingPeriodStart: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Period End</Label>
              <Input
                type="date"
                value={formData.billingPeriodEnd}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    billingPeriodEnd: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
        </Card>

        {/* Dates & Terms */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Invoice Timing</h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Issue Date</Label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    issueDate: e.target.value,
                  })
                }
                required
              />
            </div>

            <div>
              <Label>Due Date</Label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    dueDate: e.target.value,
                  })
                }
                required
              />
            </div>

            <div className="col-span-2">
              <Label>Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    paymentTerms: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                  <SelectItem value="Net 15">Net 15</SelectItem>
                  <SelectItem value="Net 30">Net 30</SelectItem>
                  <SelectItem value="Net 45">Net 45</SelectItem>
                  <SelectItem value="Net 60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* ACTIONS */}
      <div className="pt-4 border-t flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          {initialData ? "Update Draft" : "Create Draft"}
        </Button>
      </div>
    </form>
  );
}
