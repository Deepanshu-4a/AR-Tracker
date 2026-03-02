"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULTS = {
  taxCode: "none",
  taxItem: "none",
  resaleNo: "",
};

const TAX_CODES = [
  { value: "none", label: "—" },
  { value: "taxable", label: "Taxable" },
  { value: "non_taxable", label: "Non-taxable" },
  { value: "out_of_state", label: "Out of state" },
];

const TAX_ITEMS = [
  { value: "none", label: "—" },
  { value: "sales_tax", label: "Sales Tax" },
  { value: "vat", label: "VAT" },
  { value: "gst", label: "GST" },
];


function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[110px_minmax(0,1fr)] items-center gap-4 min-w-0">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function SalesTaxSettingsTab(props) {
  const data = props.data ?? props.formData?.salesTax ?? {};
  const d = { ...DEFAULTS, ...data };

  const onDataChange =
    props.onDataChange ??
    ((next) => props.setFormData?.((prev) => ({ ...prev, salesTax: next })));

  const update = (key, value) => onDataChange?.({ ...d, [key]: value });

  const handleAddTaxCode = () => {
    console.log("Add Tax Code clicked");
  };

  return (
    <div className="w-full h-full min-w-0">
      <div className="max-w-[620px] space-y-3">
        <Row label="TAX CODE">
          <div className="flex items-center gap-2 min-w-0">
            <Select value={d.taxCode} onValueChange={(v) => update("taxCode", v)}>
              <SelectTrigger className="h-8 rounded-lg w-full min-w-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TAX_CODES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              className="h-8 w-8 px-0 rounded-lg"
              onClick={handleAddTaxCode}
              aria-label="Add tax code"
              title="Add tax code"
            >
              +
            </Button>
          </div>
        </Row>

        <Row label="TAX ITEM">
          <Select value={d.taxItem} onValueChange={(v) => update("taxItem", v)}>
            <SelectTrigger className="h-8 rounded-lg w-full min-w-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TAX_ITEMS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Row>

        <Row label="RESALE NO.">
          <Input
            className="h-8 rounded-lg w-full min-w-0"
            value={d.resaleNo}
            onChange={(e) => update("resaleNo", e.target.value)}
          />
        </Row>
      </div>
    </div>
  );
}