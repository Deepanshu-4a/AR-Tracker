"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULTS = {
  accountNo: "",
  creditLimit: "",
  paymentTerms: "net_30",
  billingRateLevel: "standard",
  printNameOnCheckAs: "",
};

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

const BILLING_RATE_LEVELS = [
  { value: "standard", label: "Standard" },
  { value: "preferred", label: "Preferred" },
  { value: "vip", label: "VIP" },
  { value: "wholesale", label: "Wholesale" },
];


function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-2 min-w-0">
      <Label className="text-[11px] text-muted-foreground leading-4 break-words">
        {label}
      </Label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

const inputCls = "h-8 w-full min-w-0 rounded-xl";
const selectCls = "h-8 w-full min-w-0 rounded-xl";

export function PaymentSettingsTab(props) {
  const data = props.data ?? props.formData?.paymentSettings ?? {};
  const d = { ...DEFAULTS, ...data };

  const update = (key, value) => {
    if (props.onDataChange) {
      props.onDataChange({ ...d, [key]: value });
      return;
    }
    props.setFormData?.((prev) => ({
      ...prev,
      paymentSettings: {
        ...(prev.paymentSettings || {}),
        [key]: value,
      },
    }));
  };

  return (
    <div className="w-full min-w-0">
      {/* Match screenshot: 2 columns, 2 rows on top, plus "Print name on check as" under left column */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-10 gap-y-3 min-w-0">
        {/* LEFT COLUMN */}
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
                if (v === "add_new_terms") return;
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

          <Row label="PRINT NAME ON CHECK AS">
            <Input
              className={inputCls}
              value={d.printNameOnCheckAs}
              onChange={(e) => update("printNameOnCheckAs", e.target.value)}
            />
          </Row>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-2.5 min-w-0">
          <Row label="CREDIT LIMIT">
            <Input
              className={inputCls}
              type="number"
              value={d.creditLimit}
              onChange={(e) => update("creditLimit", e.target.value)}
            />
          </Row>

          <Row label="BILLING RATE LEVEL">
            <Select
              value={d.billingRateLevel}
              onValueChange={(v) => update("billingRateLevel", v)}
            >
              <SelectTrigger className={selectCls}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {BILLING_RATE_LEVELS.map((p) => (
                  <SelectItem key={p.value} value={p.value}>
                    {p.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>
        </div>
      </div>
    </div>
  );
}