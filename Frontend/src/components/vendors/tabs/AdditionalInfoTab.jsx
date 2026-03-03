"use client";

import { useEffect, useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* =========================================================
   DIRECT DEPOSIT POPUP
========================================================= */

const DD_INITIAL = {
  bankName: "",
  routingNo: "",
  accountNo: "",
  accountType: "",
  sendConfirmation: false,
  email: "",
};

function DirectDepositModal({ open, onClose }) {
  const [useDD, setUseDD] = useState(true);
  const [ddData, setDdData] = useState(DD_INITIAL);

  // reset fields every time modal opens
  useEffect(() => {
    if (!open) return;
    setUseDD(true);
    setDdData(DD_INITIAL);
  }, [open]);

  if (!open) return null;

  const update = (k, v) =>
    setDdData((p) => ({
      ...p,
      [k]: v,
    }));

  return (
    <div className="fixed inset-0 z-[70] bg-black/35 flex items-center justify-center">
      <div className="w-[720px] bg-white border rounded-sm shadow-2xl">
        {/* HEADER */}
        <div className="h-8 bg-slate-800 text-white flex items-center justify-between px-3">
          <span className="text-sm font-medium">Direct Deposit</span>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            ✕
          </button>
        </div>

        <div className="grid grid-cols-[1fr_120px]">
          {/* LEFT CONTENT */}
          <div className="p-4 space-y-3">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={useDD}
                onCheckedChange={(v) => setUseDD(!!v)}
              />
              <span>Use Direct Deposit for:</span>
            </label>

            <p className="text-[12px] font-semibold text-muted-foreground">
              BANK ACCOUNT INFO
            </p>

            <div className="grid grid-cols-[140px_1fr_120px_1fr] gap-2 items-center">
              <Label className="text-[12px]">Bank Name</Label>
              <Input
                className="h-7 rounded-sm"
                value={ddData.bankName}
                onChange={(e) => update("bankName", e.target.value)}
              />

              <Label className="text-[12px]">Routing No.</Label>
              <Input
                className="h-7 rounded-sm"
                value={ddData.routingNo}
                onChange={(e) => update("routingNo", e.target.value)}
              />

              <Label className="text-[12px]">Account No.</Label>
              <Input
                className="h-7 rounded-sm"
                value={ddData.accountNo}
                onChange={(e) => update("accountNo", e.target.value)}
              />

              <Label className="text-[12px]">Account Type</Label>
              <Select
                value={ddData.accountType}
                onValueChange={(v) => update("accountType", v)}
              >
                <SelectTrigger className="h-7 rounded-sm">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="checking">Checking</SelectItem>
                  <SelectItem value="savings">Savings</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={ddData.sendConfirmation}
                  onCheckedChange={(v) =>
                    update("sendConfirmation", !!v)
                  }
                />
                <span>Send vendor confirmation of direct deposits to</span>
              </label>

              <Input
                className="mt-2 h-7 rounded-sm w-[420px]"
                value={ddData.email}
                onChange={(e) => update("email", e.target.value)}
              />
            </div>

            <p className="text-[12px] text-muted-foreground leading-5">
              This e-mail address is used throughout for this vendor.
              You can add or change it here or in the E-mail field in the Edit
              Vendor window.
            </p>

            <p className="text-[12px] text-muted-foreground leading-5">
              By clicking OK, I certify that deposits will not be routed ultimately
              to a <span className="text-blue-600">foreign bank account.</span>
            </p>
          </div>

          {/* RIGHT BUTTON COLUMN */}
          <div className="border-l bg-muted/20 p-3 flex flex-col gap-2">
            <Button className="h-8">OK</Button>
            <Button variant="outline" className="h-8" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="outline" className="h-8">
              Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   ADDITIONAL INFO TAB
========================================================= */

export function AdditionalInfoTab(props) {
  const data = props.data ?? props.formData?.additionalInfo ?? {};
  const onDataChange =
    props.onDataChange ??
    ((next) =>
      props.setFormData?.((prev) => ({ ...prev, additionalInfo: next })));

  const [openDD, setOpenDD] = useState(false);


  const d = useMemo(
    () => ({
      vendorType: "",
      customFields: [],
      ...(data || {}),
    }),
    [data],
  );

  const update = (key, value) => onDataChange?.({ ...d, [key]: value });

  const VENDOR_TYPES = [
    { value: "add_new_type", label: "< Add New >" },
    { value: "consultant", label: "Consultant" },
    { value: "service_providers", label: "Service Providers" },
    { value: "suppliers", label: "Suppliers" },
    { value: "supplies", label: "Supplies" },
    { value: "tax_agency", label: "Tax agency" },
  ];

  const Row = ({ label, children }) => (
    <div className="grid grid-cols-[120px_minmax(0,1fr)] items-center gap-3 min-w-0">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      <div className="min-w-0">{children}</div>
    </div>
  );

  return (
    <>
      <div className="w-full h-full min-w-0">
        <div className="grid grid-cols-1 lg:grid-cols-[420px_minmax(0,1fr)] gap-6 h-full min-w-0">
          {/* LEFT */}
          <div className="space-y-4 min-w-0">
            <Row label="VENDOR TYPE">
              <Select
                value={d.vendorType}
                onValueChange={(v) => {
                  if (v === "add_new_type") return;
                  update("vendorType", v);
                }}
              >
                <SelectTrigger className="h-8 rounded-lg">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {VENDOR_TYPES.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Row>

            {/* DIRECT DEPOSIT BUTTON */}
            <div className="pl-[123px]">
              <Button
                variant="outline"
                className="h-8 rounded-lg px-4"
                onClick={() => setOpenDD(true)}
              >
                Direct Deposit
              </Button>
            </div>
          </div>

          {/* RIGHT CUSTOM FIELDS */}
          <div className="min-w-0">
            <div className="border rounded-lg bg-background h-[420px] relative overflow-hidden">
              <div className="px-4 py-3 border-b bg-muted/10">
                <p className="text-[11px] font-semibold tracking-wide text-muted-foreground">
                  CUSTOM FIELDS
                </p>
              </div>

              <div className="absolute bottom-4 right-4">
                <Button variant="outline" className="h-8 rounded-lg">
                  Define Fields
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DirectDepositModal open={openDD} onClose={() => setOpenDD(false)} />
    </>
  );
}