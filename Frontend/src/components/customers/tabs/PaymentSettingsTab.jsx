"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


export function PaymentSettingsTab(props) {
  // --- Support BOTH signatures ---
  const data =
    props.data ??
    props.formData?.paymentSettings ??
    {};

  const onDataChange =
    props.onDataChange ??
    ((next) =>
      props.setFormData?.((prev) => ({
        ...prev,
        paymentSettings: next,
      })));

  const d = useMemo(() => {
    // defaults to avoid uncontrolled inputs
    return {
      accountNo: "",
      creditLimit: "",
      paymentTerms: "net_30",
      priceLevel: "standard",
      preferredDelivery: "email",
      preferredPaymentMethod: "none",

      cardNumber: "",
      expMonth: "",
      expYear: "",
      nameOnCard: "",
      billingAddress: "",
      billingZip: "",

      allowOnlineCard: false,
      allowOnlineAch: false,

      ...(data || {}),
    };
  }, [data]);

  const update = (key, value) => {
    const next = { ...d, [key]: value };
    onDataChange?.(next);
  };

  const onlyDigits = (v) => (v || "").replace(/[^\d]/g, "");
  const clampLen = (v, n) => (v || "").slice(0, n);

  return (
    <div className="space-y-6">
      {/* ===== Top grid (2 columns like screenshot) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-10 gap-y-6">
        {/* Left column */}
        <div className="space-y-4">
          <div className="grid grid-cols-[160px_1fr] items-center gap-3">
            <Label className="text-xs text-muted-foreground">ACCOUNT NO.</Label>
            <Input
              className="h-9"
              value={d.accountNo}
              onChange={(e) => update("accountNo", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-3">
            <Label className="text-xs text-muted-foreground">PAYMENT TERMS</Label>
            <Select
              value={d.paymentTerms}
              onValueChange={(v) => update("paymentTerms", v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select terms" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="due_on_receipt">Due on receipt</SelectItem>
                <SelectItem value="net_15">Net 15</SelectItem>
                <SelectItem value="net_30">Net 30</SelectItem>
                <SelectItem value="net_45">Net 45</SelectItem>
                <SelectItem value="net_60">Net 60</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-3">
            <Label className="text-xs text-muted-foreground">
              PREFERRED DELIVERY METHOD
            </Label>
            <Select
              value={d.preferredDelivery}
              onValueChange={(v) => update("preferredDelivery", v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select delivery" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="print">Print</SelectItem>
                <SelectItem value="email_and_print">E-mail + Print</SelectItem>
                <SelectItem value="portal">Customer Portal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-3">
            <Label className="text-xs text-muted-foreground">
              PREFERRED PAYMENT METHOD
            </Label>
            <Select
              value={d.preferredPaymentMethod}
              onValueChange={(v) => update("preferredPaymentMethod", v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">—</SelectItem>
                <SelectItem value="ach">Bank Transfer (ACH)</SelectItem>
                <SelectItem value="card">Credit Card</SelectItem>
                <SelectItem value="check">Check</SelectItem>
                <SelectItem value="wire">Wire</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          <div className="grid grid-cols-[160px_1fr] items-center gap-3">
            <Label className="text-xs text-muted-foreground">CREDIT LIMIT</Label>
            <Input
              className="h-9"
              type="number"
              value={d.creditLimit}
              onChange={(e) => update("creditLimit", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-[160px_1fr] items-center gap-3">
            <Label className="text-xs text-muted-foreground">PRICE LEVEL</Label>
            <Select
              value={d.priceLevel}
              onValueChange={(v) => update("priceLevel", v)}
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select price level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="preferred">Preferred</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="wholesale">Wholesale</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* ===== Two panels row (Credit Card Information + Online Payments) ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CREDIT CARD INFORMATION */}
        <div className="border rounded-md bg-background">
          <div className="px-4 py-3 border-b">
            <p className="text-xs font-semibold tracking-wide">
              CREDIT CARD INFORMATION
            </p>
          </div>

          <div className="p-4 space-y-4">
            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="text-xs text-muted-foreground">CREDIT CARD NO.</Label>
              <Input
                className="h-9"
                value={d.cardNumber}
                onChange={(e) =>
                  update("cardNumber", clampLen(onlyDigits(e.target.value), 19))
                }
                placeholder="•••• •••• •••• ••••"
              />
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="text-xs text-muted-foreground">EXP. DATE</Label>
              <div className="flex gap-2">
                <Input
                  className="h-9 w-20"
                  value={d.expMonth}
                  onChange={(e) =>
                    update("expMonth", clampLen(onlyDigits(e.target.value), 2))
                  }
                  placeholder="MM"
                />
                <span className="text-muted-foreground self-center">/</span>
                <Input
                  className="h-9 w-24"
                  value={d.expYear}
                  onChange={(e) =>
                    update("expYear", clampLen(onlyDigits(e.target.value), 4))
                  }
                  placeholder="YYYY"
                />
              </div>
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="text-xs text-muted-foreground">NAME ON CARD</Label>
              <Input
                className="h-9"
                value={d.nameOnCard}
                onChange={(e) => update("nameOnCard", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="text-xs text-muted-foreground">ADDRESS</Label>
              <Input
                className="h-9"
                value={d.billingAddress}
                onChange={(e) => update("billingAddress", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-[140px_1fr] items-center gap-3">
              <Label className="text-xs text-muted-foreground">ZIP / POSTAL CODE</Label>
              <Input
                className="h-9"
                value={d.billingZip}
                onChange={(e) => update("billingZip", e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* ONLINE PAYMENTS */}
        <div className="border rounded-md bg-background">
          <div className="px-4 py-3 border-b">
            <p className="text-xs font-semibold tracking-wide">ONLINE PAYMENTS</p>
          </div>

          <div className="p-4 space-y-4">
            <p className="text-sm">Let this customer pay you by:</p>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={!!d.allowOnlineCard}
                  onCheckedChange={(v) => update("allowOnlineCard", !!v)}
                />
                <span className="text-sm">Credit Card</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={!!d.allowOnlineAch}
                  onCheckedChange={(v) => update("allowOnlineAch", !!v)}
                />
                <span className="text-sm">Bank Transfer (ACH)</span>
              </label>
            </div>

            <div className="pt-2">
              <Button variant="outline" className="h-9">
                Help
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
