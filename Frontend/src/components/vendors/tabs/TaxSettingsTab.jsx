"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

const DEFAULTS = {
  vendorTaxId: "",
  eligibleFor1099: false,
};


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

export function TaxSettingsTab(props) {
  const data = props.data ?? props.formData?.salesTax ?? {};
  const d = { ...DEFAULTS, ...data };

  const update = (key, value) => {
    if (props.onDataChange) {
      props.onDataChange({ ...d, [key]: value });
      return;
    }
    props.setFormData?.((prev) => ({
      ...prev,
      salesTax: {
        ...(prev.salesTax || {}),
        [key]: value,
      },
    }));
  };

  return (
    <div className="w-full min-w-0">
      
      <div className="pb-3 border-b">
        <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
          TAX INFORMATION
        </p>
      </div>

      <div className="pt-4 space-y-3 min-w-0">
        <Row label="VENDOR TAX ID">
          <Input
            className={inputCls}
            value={d.vendorTaxId}
            onChange={(e) => update("vendorTaxId", e.target.value)}
            placeholder=""
          />
        </Row>

        
        <div className="grid grid-cols-[150px_minmax(0,1fr)] items-center gap-2 min-w-0">
          <div />
          <div className="flex items-center gap-2 min-w-0">
            <Checkbox
              checked={!!d.eligibleFor1099}
              onCheckedChange={(v) => update("eligibleFor1099", v === true)}
            />
            <span className="text-sm text-foreground">Vendor eligible for 1099</span>

           
            <span
              className="ml-2 inline-flex items-center justify-center h-4 w-4 rounded-sm bg-muted text-[10px] text-muted-foreground"
              title="Help"
            >
              ?
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}