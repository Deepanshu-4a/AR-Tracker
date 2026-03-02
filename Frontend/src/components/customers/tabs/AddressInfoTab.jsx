"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


function Row({ label, children }) {
  return (
    <div className="grid grid-cols-[160px_1fr] items-center gap-4">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function AddressInfoTab({ formData, setFormData }) {
  const d = formData.addressInfo ?? {};

  const update = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      addressInfo: {
        ...(prev.addressInfo ?? {}),
        [key]: value,
      },
    }));
  };

  const inputCls = "h-8 w-full rounded-lg";

  return (
    <div className="space-y-6">
      {/* ================= MAIN FORM ================= */}
      <div className="space-y-3">
        <Row label="COMPANY NAME">
          <Input
            className={inputCls}
            value={d.companyName ?? ""}
            onChange={(e) => update("companyName", e.target.value)}
          />
        </Row>

        <Row label="FULL NAME">
          <div className="grid grid-cols-[110px_1.8fr_90px_1.8fr] gap-3">
            <Select
              value={d.title ?? ""}
              onValueChange={(v) => update("title", v)}
            >
              <SelectTrigger className={inputCls}>
                <SelectValue placeholder="Mr./Ms." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mr.">Mr.</SelectItem>
                <SelectItem value="Ms.">Ms.</SelectItem>
                <SelectItem value="Mrs.">Mrs.</SelectItem>
              </SelectContent>
            </Select>

            <Input
              className={inputCls}
              placeholder="First Name"
              value={d.firstName ?? ""}
              onChange={(e) => update("firstName", e.target.value)}
            />

            <Input
              className={inputCls}
              placeholder="M.I."
              value={d.middleInitial ?? ""}
              onChange={(e) => update("middleInitial", e.target.value)}
            />

            <Input
              className={inputCls}
              placeholder="Last Name"
              value={d.lastName ?? ""}
              onChange={(e) => update("lastName", e.target.value)}
            />
          </div>
        </Row>

        <Row label="JOB TITLE">
          <Input
            className={inputCls}
            value={d.jobTitle ?? ""}
            onChange={(e) => update("jobTitle", e.target.value)}
          />
        </Row>

       
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 pt-2">
          <Row label="MAIN PHONE">
            <Input
              className={inputCls}
              value={d.mainPhone ?? ""}
              onChange={(e) => update("mainPhone", e.target.value)}
            />
          </Row>

          <Row label="FAX">
            <Input
              className={inputCls}
              value={d.fax ?? ""}
              onChange={(e) => update("fax", e.target.value)}
            />
          </Row>

          <Row label="WORK PHONE">
            <Input
              className={inputCls}
              value={d.workPhone ?? ""}
              onChange={(e) => update("workPhone", e.target.value)}
            />
          </Row>

          <Row label="MAIN EMAIL">
            <Input
              className={inputCls}
              value={d.mainEmail ?? ""}
              onChange={(e) => update("mainEmail", e.target.value)}
            />
          </Row>

          <Row label="MOBILE">
            <Input
              className={inputCls}
              value={d.mobile ?? ""}
              onChange={(e) => update("mobile", e.target.value)}
            />
          </Row>

          <Row label="CC EMAIL">
            <Input
              className={inputCls}
              value={d.ccEmail ?? ""}
              onChange={(e) => update("ccEmail", e.target.value)}
            />
          </Row>

          <Row label="WEBSITE">
            <Input
              className={inputCls}
              value={d.website ?? ""}
              onChange={(e) => update("website", e.target.value)}
            />
          </Row>

          <Row label="OTHER 1">
            <Input
              className={inputCls}
              value={d.other1 ?? ""}
              onChange={(e) => update("other1", e.target.value)}
            />
          </Row>
        </div>
      </div>

      {/* ================= ADDRESS DETAILS ================= */}
      <div className="space-y-2">
        <div className="text-xs font-semibold tracking-wide text-muted-foreground">
          ADDRESS DETAILS
        </div>

        <div className="flex gap-2 items-start">
          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground mb-1 block">
              INVOICE/BILL TO
            </Label>
            <div className="flex gap-1 items-start">
              <Textarea
                rows={3}
                className="resize-none rounded-lg text-sm flex-1"
                value={d.billingAddress ?? ""}
                onChange={(e) => update("billingAddress", e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0 mt-0.5"
              >
                ✎
              </Button>
            </div>
          </div>

          <div className="flex items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs px-3 whitespace-nowrap"
              onClick={() => update("shippingAddress", d.billingAddress ?? "")}
            >
              Copy &gt;&gt;
            </Button>
          </div>

          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground mb-1 block">
              SHIP TO
            </Label>

            <Textarea
              rows={3}
              className="resize-none rounded-lg text-sm"
              value={d.shippingAddress ?? ""}
              onChange={(e) => update("shippingAddress", e.target.value)}
            />

            <div className="flex items-center gap-1.5 mt-1.5">
              <input
                type="checkbox"
                checked={d.defaultShipping ?? false}
                onChange={(e) => update("defaultShipping", e.target.checked)}
              />
              <Label className="text-[10px] text-muted-foreground cursor-pointer">
                Default shipping address
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
