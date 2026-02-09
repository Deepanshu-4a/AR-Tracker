import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export function InvoiceForm({ initialData, onSubmit, onCancel }) {
  const [formData, setFormData] = useState(
    initialData || {
      invoiceNumber: "",
      customer: "",
      department: "",
      amount: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: new Date().toISOString().split("T")[0],
      paymentTerms: "Net 30",
      status: "Unpaid",
      description: "",
    },
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Row 1 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="invoiceNumber">Invoice Number</Label>
          <Input
            id="invoiceNumber"
            placeholder="e.g., INV-2024-012"
            value={formData.invoiceNumber}
            onChange={(e) =>
              setFormData({ ...formData, invoiceNumber: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="customer">Client</Label>
          <Input
            id="customer"
            placeholder="e.g., Acme Corporation"
            value={formData.customer}
            onChange={(e) =>
              setFormData({ ...formData, customer: e.target.value })
            }
            required
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Invoice Amount ($)</Label>
          <Input
            id="amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">Department</Label>
          <Select
            value={formData.department}
            onValueChange={(value) =>
              setFormData({ ...formData, department: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Sales">Sales</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Finance">Finance</SelectItem>
              <SelectItem value="Engineering">Engineering</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Row 3 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="issueDate">Issue Date</Label>
          <Input
            id="issueDate"
            type="date"
            value={formData.issueDate}
            onChange={(e) =>
              setFormData({ ...formData, issueDate: e.target.value })
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dueDate">Due Date</Label>
          <Input
            id="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(e) =>
              setFormData({ ...formData, dueDate: e.target.value })
            }
            required
          />
        </div>
      </div>

      {/* Row 4 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Select
            value={formData.paymentTerms}
            onValueChange={(value) =>
              setFormData({ ...formData, paymentTerms: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select terms" />
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

        <div className="space-y-2">
          <Label htmlFor="status">Invoice Status</Label>
          <Select
            value={formData.status}
            onValueChange={(value) =>
              setFormData({ ...formData, status: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Unpaid">Unpaid</SelectItem>
              <SelectItem value="Partially Paid">Partially Paid</SelectItem>
              <SelectItem value="Paid">Paid</SelectItem>
              <SelectItem value="Disputed">Disputed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label htmlFor="description">Internal Notes</Label>
        <Textarea
          id="description"
          placeholder="Payment terms, disputes, client communication notes..."
          className="min-h-[100px]"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" className="bg-orange-500 hover:bg-orange-600">
          {initialData ? "Update Invoice" : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
