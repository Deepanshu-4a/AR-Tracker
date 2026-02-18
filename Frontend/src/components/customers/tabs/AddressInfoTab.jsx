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
      defaultShipping: false,
      ...(data || {}),
    }),
    [data],
  );

  const update = (key, value) => onDataChange?.({ ...d, [key]: value });

  const inputCls = "h-8 w-full rounded-lg";

  const Row = ({ label, children }) => (
    <div className="grid grid-cols-[160px_1fr] items-center gap-4">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* ================= MAIN FORM ================= */}
      <div className="space-y-3">
        <Row label="COMPANY NAME">
          <Input
            className={inputCls}
            value={d.companyName}
            onChange={(e) => update("companyName", e.target.value)}
          />
        </Row>

        <Row label="FULL NAME">
          <div className="grid grid-cols-[110px_1.8fr_90px_1.8fr] gap-3">
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
              placeholder="First Name"
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
              placeholder="Last Name"
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

        {/* CONTACT GRID */}
        <div className="grid grid-cols-2 gap-x-10 gap-y-3 pt-2">
          <Row label="MAIN PHONE">
            <Input
              className={inputCls}
              value={d.mainPhone}
              onChange={(e) => update("mainPhone", e.target.value)}
            />
          </Row>

          <Row label="FAX">
            <Input
              className={inputCls}
              value={d.fax}
              onChange={(e) => update("fax", e.target.value)}
            />
          </Row>

          <Row label="WORK PHONE">
            <Input
              className={inputCls}
              value={d.workPhone}
              onChange={(e) => update("workPhone", e.target.value)}
            />
          </Row>

          <Row label="MAIN EMAIL">
            <Input
              className={inputCls}
              value={d.mainEmail}
              onChange={(e) => update("mainEmail", e.target.value)}
            />
          </Row>

          <Row label="MOBILE">
            <Input
              className={inputCls}
              value={d.mobile}
              onChange={(e) => update("mobile", e.target.value)}
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
      <div className="space-y-2">
        <div className="text-xs font-semibold tracking-wide text-muted-foreground">
          ADDRESS DETAILS
        </div>

        <div className="flex gap-2 items-start">
          {/* INVOICE/BILL TO */}
          <div className="flex-1">
            <Label className="text-[10px] text-muted-foreground mb-1 block">
              INVOICE/BILL TO
            </Label>
            <div className="flex gap-1 items-start">
              <Textarea
                rows={3}
                className="resize-none rounded-lg text-sm flex-1"
                value={d.billingAddress}
                onChange={(e) => update("billingAddress", e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7 shrink-0 mt-0.5"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                </svg>
              </Button>
            </div>
          </div>

          {/* COPY BUTTON */}
          <div className="flex items-center mt-6">
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs px-3 whitespace-nowrap"
              onClick={() => update("shippingAddress", d.billingAddress)}
            >
              Copy &gt;&gt;
            </Button>
          </div>

          {/* SHIP TO */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <Label className="text-[10px] text-muted-foreground shrink-0">
                SHIP TO
              </Label>
              <Select>
                <SelectTrigger className="h-6 text-xs flex-1">
                  <SelectValue placeholder="" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-1 items-start">
              <Textarea
                rows={3}
                className="resize-none rounded-lg text-sm flex-1"
                value={d.shippingAddress}
                onChange={(e) => update("shippingAddress", e.target.value)}
              />
              <div className="flex flex-col gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 shrink-0"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                  </svg>
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-1.5">
              <input
                type="checkbox"
                id="defaultShipping"
                className="h-3 w-3"
                checked={d.defaultShipping}
                onChange={(e) => update("defaultShipping", e.target.checked)}
              />
              <Label
                htmlFor="defaultShipping"
                className="text-[10px] text-muted-foreground cursor-pointer"
              >
                Default shipping address
              </Label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
