"use client";

import { useMemo } from "react";
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

/**
 * ✅ AdditionalInfoTab (matches screenshot)
 *
 * Left side:
 * - CUSTOMER TYPE (dropdown with < Add New > + options)
 * - REP (dropdown)
 *
 * Right side:
 * - CUSTOM FIELDS box (empty state)
 * - "Define Fields" button (bottom-right inside the box)
 *
 * Supports BOTH signatures:
 * 1) Preferred:
 *    <AdditionalInfoTab data={formData.additionalInfo} onDataChange={(next)=>...} />
 *
 * 2) Backward compatible with your modal call:
 *    <AdditionalInfoTab formData={formData} setFormData={setFormData} />
 */
export function AdditionalInfoTab(props) {
  const data = props.data ?? props.formData?.additionalInfo ?? {};
  const onDataChange =
    props.onDataChange ??
    ((next) =>
      props.setFormData?.((prev) => ({ ...prev, additionalInfo: next })));

  const d = useMemo(
    () => ({
      customerType: "retail",
      rep: "none",
      // placeholder for future dynamic custom fields
      customFields: [],
      ...(data || {}),
    }),
    [data],
  );

  const update = (key, value) => onDataChange?.({ ...d, [key]: value });

  // Customer type options from screenshot
  const CUSTOMER_TYPES = [
    { value: "add_new_type", label: "< Add New >" },
    { value: "from_ad", label: "From advertisement" },
    { value: "referral", label: "Referral" },
    { value: "retail", label: "Retail" },
    { value: "wholesale", label: "Wholesale" },
  ];

  // Rep options (keep simple; you can wire to real users later)
  const REPS = [
    { value: "none", label: "—" },
    { value: "rep_1", label: "Rep 1" },
    { value: "rep_2", label: "Rep 2" },
  ];

  const Row = ({ label, children }) => (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] items-center gap-3 min-w-0">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <div className="min-w-0">{children}</div>
    </div>
  );

  const handleDefineFields = () => {
    // placeholder: open future custom-fields builder modal/page
    // For now, just logs.
    console.log("Define Fields clicked");
  };

  return (
    <div className="w-full h-full min-w-0">
      {/* Two columns like QuickBooks */}
      <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-6 h-full min-w-0">
        {/* LEFT FORM */}
        <div className="space-y-4 min-w-0">
          <Row label="CUSTOMER TYPE">
            <Select
              value={d.customerType}
              onValueChange={(v) => {
                if (v === "add_new_type") return; // placeholder behavior
                update("customerType", v);
              }}
            >
              <SelectTrigger className="h-8 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CUSTOMER_TYPES.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>

          <Row label="REP">
            <Select value={d.rep} onValueChange={(v) => update("rep", v)}>
              <SelectTrigger className="h-8 rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REPS.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Row>
        </div>

        {/* RIGHT: CUSTOM FIELDS BOX */}
        <div className="min-w-0">
          <div className="border rounded-lg bg-background h-[420px] relative overflow-hidden">
            <div className="px-4 py-3 border-b bg-muted/10">
              <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                CUSTOM FIELDS
              </p>
            </div>

            {/* Empty state (since no fields yet) */}
            <div className="p-4 text-sm text-muted-foreground">
              {Array.isArray(d.customFields) && d.customFields.length > 0 ? (
                <div className="space-y-3">
                  {d.customFields.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Label className="text-xs w-40">{f.label}</Label>
                      <Input
                        className="h-8"
                        value={f.value ?? ""}
                        onChange={(e) => {
                          const next = [...d.customFields];
                          next[idx] = { ...next[idx], value: e.target.value };
                          update("customFields", next);
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>No custom fields defined.</p>
              )}
            </div>

            {/* Define Fields button bottom-right */}
            <div className="absolute bottom-4 right-4">
              <Button
                variant="outline"
                className="h-8 rounded-lg"
                onClick={handleDefineFields}
              >
                Define Fields
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
