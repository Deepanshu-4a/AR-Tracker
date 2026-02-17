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
  const data = props.data ?? props.formData?.paymentSettings ?? {};
  const onDataChange =
    props.onDataChange ??
    ((next) =>
      props.setFormData?.((prev) => ({ ...prev, paymentSettings: next })));

  const d = useMemo(
    () => ({
      accountNo: "",
      creditLimit: "",
      paymentTerms: "net_30",
      priceLevel: "standard",
      preferredDelivery: "email",
      preferredPaymentMethod: "cash",

      cardNumber: "",
      expMonth: "",
      expYear: "",
      nameOnCard: "",
      billingAddress: "",
      billingZip: "",

      allowOnlineCard: false,
      allowOnlineAch: false,
      ...(data || {}),
    }),
    [data],
  );

  const update = (key, value) => onDataChange?.({ ...d, [key]: value });

  const onlyDigits = (v) => (v || "").replace(/[^\d]/g, "");
  const clampLen = (v, n) => (v || "").slice(0, n);

  const PAYMENT_TERMS = [
    { value: "add_new_terms", label: "< Add New >" },
    { value: "1_10_net_30", label: "1% 10 Net 30" },
    { value: "2_10_net_30", label: "2% 10 Net 30" },
    { value: "consignment", label: "Consignment" },
    { value: "due_on_receipt", label: "Due on receipt" },
    { value: "net_15", label: "Net 15" },
    { value: "net_30", label: "Net 30" },
    { value: "net_33", label: "Net 33" },
    { value: "net_45", label: "Net 45" },
    { value: "net_60", label: "Net 60" },
    { value: "net45_alt", label: "Net45" },
  ];

  // ✅ Updated preferred payment method options to match screenshot
  const PREFERRED_PAYMENT_METHODS = [
    { value: "add_new_pmt", label: "< Add New >" },
    { value: "cash", label: "Cash" },
    { value: "check", label: "Check" },
    { value: "amex", label: "American Express" },
    { value: "discover", label: "Discover" },
    { value: "mastercard", label: "MasterCard" },
    { value: "visa", label: "Visa" },
    { value: "debit_card", label: "Debit Card" },
    { value: "gift_card", label: "Gift Card" },
    { value: "e_check", label: "E-Check" },
  ];

  const Row = ({ label, children }) => (
    <div className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-2 min-w-0">
      <Label className="text-[11px] text-muted-foreground leading-4 break-words">
        {label}
      </Label>
      <div className="min-w-0">{children}</div>
    </div>
  );

  const Panel = ({ title, children }) => (
    <div className="min-w-0 border rounded-xl bg-background overflow-hidden">
      <div className="px-3 py-2 border-b bg-muted/10">
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="p-3 min-w-0">{children}</div>
    </div>
  );

  const inputCls = "h-8 w-full min-w-0 rounded-xl";
  const selectCls = "h-8 w-full min-w-0 rounded-xl";

  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-3 min-w-0">
        <div className="space-y-2.5 min-w-0">
          <Row label="ACCOUNT NO.">
            <Input
              className={inputCls}
              value={d.accountNo}
              onChange={(e) => update("accountNo", e.target.value)}
            />
          </Row>

          <Row label="PAYMENT TERMS">
            <Select
              value={d.paymentTerms}
              onValueChange={(v) => {
                if (v === "add_new_terms") return; // placeholder behavior
                update("paymentTerms", v);
              }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_TERMS.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>

          <Row label="PREFERRED DELIVERY METHOD">
            <Select
              value={d.preferredDelivery}
              onValueChange={(v) => update("preferredDelivery", v)}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="email">E-mail</SelectItem>
                <SelectItem value="print">Print</SelectItem>
                <SelectItem value="email_and_print">E-mail + Print</SelectItem>
                <SelectItem value="portal">Customer Portal</SelectItem>
              </SelectContent>
            </Select>
          </Row>

          <Row label="PREFERRED PAYMENT METHOD">
            <Select
              value={d.preferredPaymentMethod}
              onValueChange={(v) => {
                if (v === "add_new_pmt") return; // placeholder behavior
                update("preferredPaymentMethod", v);
              }}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue placeholder="—" />
              </SelectTrigger>
              <SelectContent>
                {PREFERRED_PAYMENT_METHODS.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>
        </div>

        <div className="space-y-2.5 min-w-0">
          <Row label="CREDIT LIMIT">
            <Input
              className={inputCls}
              type="number"
              value={d.creditLimit}
              onChange={(e) => update("creditLimit", e.target.value)}
            />
          </Row>

          <Row label="PRICE LEVEL">
            <Select
              value={d.priceLevel}
              onValueChange={(v) => update("priceLevel", v)}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
               
              </SelectContent>
            </Select>
          </Row>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 xl:grid-cols-2 gap-5 min-w-0">
        <Panel title="CREDIT CARD INFORMATION">
          <div className="space-y-2.5 min-w-0">
            <Row label="CREDIT CARD NO.">
              <Input
                className={inputCls}
                value={d.cardNumber}
                onChange={(e) =>
                  update("cardNumber", (clampLen(onlyDigits(e.target.value), 19)))
                }
                placeholder="•••• •••• •••• ••••"
              />
            </Row>

            <Row label="EXP. DATE">
              <div className="flex items-center gap-2 min-w-0">
                <Input
                  className="h-8 w-16 min-w-0 rounded-xl"
                  value={d.expMonth}
                  onChange={(e) =>
                    update("expMonth", clampLen(onlyDigits(e.target.value), 2))
                  }
                  placeholder="MM"
                />
                <span className="text-muted-foreground text-sm">/</span>
                <Input
                  className="h-8 w-20 min-w-0 rounded-xl"
                  value={d.expYear}
                  onChange={(e) =>
                    update("expYear", clampLen(onlyDigits(e.target.value), 4))
                  }
                  placeholder="YYYY"
                />
              </div>
            </Row>

            <Row label="NAME ON CARD">
              <Input
                className={inputCls}
                value={d.nameOnCard}
                onChange={(e) => update("nameOnCard", e.target.value)}
              />
            </Row>

            <Row label="ADDRESS">
              <Input
                className={inputCls}
                value={d.billingAddress}
                onChange={(e) => update("billingAddress", e.target.value)}
              />
            </Row>

            <Row label="ZIP / POSTAL CODE">
              <Input
                className={inputCls}
                value={d.billingZip}
                onChange={(e) => update("billingZip", e.target.value)}
              />
            </Row>
          </div>
        </Panel>

        <Panel title="ONLINE PAYMENTS">
          <div className="space-y-2.5 min-w-0">
            <p className="text-sm">Let this customer pay you by:</p>

            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={!!d.allowOnlineCard}
                  onCheckedChange={(v) => update("allowOnlineCard", !!v)}
                />
                <span className="text-sm">Credit Card</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <Checkbox
                  checked={!!d.allowOnlineAch}
                  onCheckedChange={(v) => update("allowOnlineAch", !!v)}
                />
                <span className="text-sm">Bank Transfer (ACH)</span>
              </label>
            </div>

            <div className="pt-1">
              <Button variant="outline" className="h-8 rounded-xl px-4">
                Help
              </Button>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
