"use client";

import { useMemo } from "react";
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

export function AddressInfoTab(props) {
  const data = props.data ?? props.formData?.addressInfo ?? {};
  const onDataChange =
    props.onDataChange ??
    ((next) => props.setFormData?.((prev) => ({ ...prev, addressInfo: next })));

  const d = useMemo(
    () => ({
      companyName: "",
      title: "",
      firstName: "",
      middleInitial: "",
      lastName: "",
      jobTitle: "",
      mainPhone: "",
      workPhone: "",
      mobile: "",
      fax: "",
      mainEmail: "",
      ccEmail: "",
      website: "",
      other1: "",
      billingAddress: "",
      shippingAddress: "",
      shipOption: "same",
      defaultShipping: false,
      ...(data || {}),
    }),
    [data],
  );

  const update = (key, value) => onDataChange?.({ ...d, [key]: value });

  const Row = ({ label, children }) => (
    <div className="grid grid-cols-[140px_minmax(0,1fr)] items-center gap-2">
      <Label className="text-[11px] text-muted-foreground leading-4">
        {label}
      </Label>
      {children}
    </div>
  );

  const inputCls = "h-8 w-full rounded-lg";

  return (
    <div className="space-y-4">
      {/* ================= TOP TWO COLUMN ================= */}
      {/* ================= TOP TWO COLUMN BALANCED ================= */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {/* LEFT COLUMN */}
        <div className="space-y-2">
          <Row label="COMPANY NAME">
            <Input
              className={inputCls}
              value={d.companyName}
              onChange={(e) => update("companyName", e.target.value)}
            />
          </Row>

          <Row label="FULL NAME">
            <div className="grid grid-cols-4 gap-2">
              <Select value={d.title} onValueChange={(v) => update("title", v)}>
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
                placeholder="First"
                value={d.firstName}
                onChange={(e) => update("firstName", e.target.value)}
              />

              <Input
                className={inputCls}
                placeholder="M.I."
                value={d.middleInitial}
                onChange={(e) => update("middleInitial", e.target.value)}
              />

              <Input
                className={inputCls}
                placeholder="Last"
                value={d.lastName}
                onChange={(e) => update("lastName", e.target.value)}
              />
            </div>
          </Row>

          <Row label="JOB TITLE">
            <Input
              className={inputCls}
              value={d.jobTitle}
              onChange={(e) => update("jobTitle", e.target.value)}
            />
          </Row>

          <Row label="MAIN PHONE">
            <Input
              className={inputCls}
              value={d.mainPhone}
              onChange={(e) => update("mainPhone", e.target.value)}
            />
          </Row>

          <Row label="WORK PHONE">
            <Input
              className={inputCls}
              value={d.workPhone}
              onChange={(e) => update("workPhone", e.target.value)}
            />
          </Row>

          <Row label="MOBILE">
            <Input
              className={inputCls}
              value={d.mobile}
              onChange={(e) => update("mobile", e.target.value)}
            />
          </Row>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-2">
          <Row label="FAX">
            <Input
              className={inputCls}
              value={d.fax}
              onChange={(e) => update("fax", e.target.value)}
            />
          </Row>

          <Row label="MAIN EMAIL">
            <Input
              className={inputCls}
              value={d.mainEmail}
              onChange={(e) => update("mainEmail", e.target.value)}
            />
          </Row>

          <Row label="CC EMAIL">
            <Input
              className={inputCls}
              value={d.ccEmail}
              onChange={(e) => update("ccEmail", e.target.value)}
            />
          </Row>

          <Row label="WEBSITE">
            <Input
              className={inputCls}
              value={d.website}
              onChange={(e) => update("website", e.target.value)}
            />
          </Row>

          <Row label="OTHER 1">
            <Input
              className={inputCls}
              value={d.other1}
              onChange={(e) => update("other1", e.target.value)}
            />
          </Row>
        </div>
      </div>
{/* ================= ADDRESS DETAILS ================= */}
<div className="border rounded-lg p-3 space-y-4">
  <div className="text-[11px] font-semibold tracking-wide text-muted-foreground">
    ADDRESS DETAILS
  </div>

  <div className="grid grid-cols-2 gap-6 items-start">
    {/* BILLING */}
    <div className="space-y-2">
      <Label className="text-[11px] text-muted-foreground">
        INVOICE / BILL TO
      </Label>

      <Textarea
        rows={3}
        className="rounded-lg w-full"
        value={d.billingAddress}
        onChange={(e) => update("billingAddress", e.target.value)}
      />
    </div>

    {/* SHIPPING */}
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <Label className="text-[11px] text-muted-foreground">
          SHIP TO
        </Label>

        <Select
          value={d.shipOption}
          onValueChange={(v) => update("shipOption", v)}
        >
          <SelectTrigger className="h-8 w-28 rounded-lg">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="same">Same</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Textarea
        rows={3}
        className="rounded-lg w-full"
        value={d.shippingAddress}
        onChange={(e) => update("shippingAddress", e.target.value)}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={!!d.defaultShipping}
            onChange={(e) => update("defaultShipping", e.target.checked)}
          />
          Default shipping address
        </label>

        <Button
          variant="outline"
          className="h-8 px-4 rounded-lg"
          onClick={() =>
            update("shippingAddress", d.billingAddress)
          }
        >
          Copy →
        </Button>
      </div>
    </div>
  </div>
</div>
    </div>
  );
}
