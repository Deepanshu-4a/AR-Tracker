import { useState } from "react";
import { toast } from "sonner";

import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
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

import {
  ArrowLeft01Icon as ArrowLeft,
  PencilEdit01Icon as Edit,
  Delete01Icon as Trash2,
  Download01Icon as Download,
  Tick02Icon as Check,
  Cancel01Icon as X,
  Mail01Icon as Send,
} from "hugeicons-react";

export function InvoiceDetail({ invoiceId, onBack }) {
  const [isEditing, setIsEditing] = useState(false);

  /* -----------------------------
     Mock Invoice Data
  ------------------------------ */
  const [invoiceData, setInvoiceData] = useState({
    id: invoiceId,
    customer: "Acme Corporation",
    amount: 962500,
    issueDate: "2024-11-15",
    dueDate: "2024-12-15",
    daysOverdue: 7,
    status: "Unpaid",
    riskScore: 85,
    paymentTerms: "Net 30",
    assignedCollector: "John Smith",
    lastReminderSent: "2024-12-20",
    description:
      "Invoice for Q4 SaaS subscription and enterprise support services.",
    internalNotes: "Client usually delays payment. Escalate after 30 days.",
  });

  /* -----------------------------
     Helpers
  ------------------------------ */
  const agingBucket =
    invoiceData.daysOverdue <= 30
      ? "0–30 Days"
      : invoiceData.daysOverdue <= 60
        ? "31–60 Days"
        : "60+ Days";

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "paid":
        return "bg-green-50 text-green-700 border-green-200";
      case "unpaid":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";
      case "overdue":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const getRiskColor = (score) => {
    if (score >= 80) return "bg-red-50 text-red-700 border-red-200";
    if (score >= 50) return "bg-orange-50 text-orange-700 border-orange-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const handleFieldChange = (field, value) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    toast.success("Invoice updated successfully");
    setIsEditing(false);
  };

  const handleSendReminder = () => {
    toast.success("Payment reminder sent");
    setInvoiceData((prev) => ({
      ...prev,
      lastReminderSent: new Date().toISOString().split("T")[0],
    }));
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
            <h1 className="text-2xl font-semibold">Invoice Details</h1>
            <p className="text-muted-foreground">
              Invoice ID: {invoiceData.id}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditing ? "Cancel" : "Edit"}
          </Button>

          {isEditing && (
            <Button size="sm" onClick={handleSave}>
              <Check className="w-4 h-4 mr-2" />
              Save
            </Button>
          )}

          <Button variant="destructive" size="sm">
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Top Summary (from your simple InvoiceDetail) */}
      <Card>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
          <div>
            <p className="text-xs text-muted-foreground">Client</p>
            <p className="font-semibold">{invoiceData.customer}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Amount</p>
            <p className="font-semibold">
              ${invoiceData.amount.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Due Date</p>
            <p className="font-semibold">
              {new Date(invoiceData.dueDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Aging</p>
            <Badge>{agingBucket}</Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Invoice Info */}
        <Card className="p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-6">Invoice Information</h2>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Issue Date</Label>
                <Input
                  type="date"
                  value={invoiceData.issueDate}
                  disabled={!isEditing}
                  onChange={(e) =>
                    handleFieldChange("issueDate", e.target.value)
                  }
                />
              </div>

              <div>
                <Label>Payment Terms</Label>
                <Select
                  value={invoiceData.paymentTerms}
                  disabled={!isEditing}
                  onValueChange={(v) => handleFieldChange("paymentTerms", v)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 45">Net 45</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Status</Label>
                <Badge className={getStatusColor(invoiceData.status)}>
                  {invoiceData.status}
                </Badge>
              </div>

              <div>
                <Label>Risk</Label>
                <Badge className={getRiskColor(invoiceData.riskScore)}>
                  {invoiceData.riskScore >= 80
                    ? "High Risk"
                    : invoiceData.riskScore >= 50
                      ? "Medium Risk"
                      : "Low Risk"}
                </Badge>
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={invoiceData.description}
                disabled={!isEditing}
                onChange={(e) =>
                  handleFieldChange("description", e.target.value)
                }
              />
            </div>

            <div>
              <Label>Internal Notes</Label>
              <Textarea
                rows={2}
                value={invoiceData.internalNotes}
                disabled={!isEditing}
                onChange={(e) =>
                  handleFieldChange("internalNotes", e.target.value)
                }
              />
            </div>
          </div>
        </Card>

        {/* Actions & History */}
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Reminder History</h3>
            <p className="text-sm text-muted-foreground">
              {invoiceData.lastReminderSent
                ? `Last reminder sent on ${new Date(
                    invoiceData.lastReminderSent,
                  ).toLocaleDateString()}`
                : "No reminders sent yet"}
            </p>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>

            <div className="space-y-3">
              <Button className="w-full" onClick={handleSendReminder}>
                <Send className="w-4 h-4 mr-2" />
                Send Reminder
              </Button>

              <Button
                variant="outline"
                className="w-full hover:bg-green-50"
                onClick={() => {
                  handleFieldChange("status", "Paid");
                  toast.success("Invoice marked as paid");
                }}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark as Paid
              </Button>

              <Button
                variant="outline"
                className="w-full hover:bg-red-50"
                onClick={() => {
                  handleFieldChange("status", "Overdue");
                  toast.success("Invoice marked overdue");
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Mark Overdue
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
