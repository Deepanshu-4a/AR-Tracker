"use client";

import { useState } from "react";
import { X, Minus, Square } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox"; 

import { AddressInfoTab } from "./tabs/AddressInfoTab";
import { PaymentSettingsTab } from "./tabs/PaymentSettingsTab";
import { TaxSettingsTab } from "./tabs/TaxSettingsTab";
import { AdditionalInfoTab } from "./tabs/AdditionalInfoTab";
import { AccountSettingsTab } from "./tabs/AccountSettingsTab";

export function CreateVendorModal({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("address");
  const [isMaximized, setIsMaximized] = useState(false);

  const [formData, setFormData] = useState({
    vendorName: "",
    openingBalance: "",
    asOfDate: "",
    isInactive: false, 
    addressInfo: {},
    paymentSettings: {},
    salesTax: {},
    additionalInfo: {},
    jobInfo: {},
  });

  const handleSave = () => {
    console.log("Vendor Data:", formData);
    onOpenChange(false);
  };

  if (!open) return null;

  const tabs = [
    { key: "address", label: "Address Info" },
    { key: "payment", label: "Payment Settings" },
    { key: "tax", label: "Tax Settings" },
    { key: "account", label: "Account Settings" },
    { key: "additional", label: "Additional Info" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`
          bg-card shadow-2xl flex flex-col
          ${
            isMaximized
              ? "w-screen h-screen rounded-none"
              : "w-[1100px] h-[85vh] rounded-xl"
          }
        `}
      >
        {/* ===== HEADER ===== */}
        <div
          className={`
            relative flex items-center px-6 py-3
            bg-orange-500 text-white
            ${isMaximized ? "" : "rounded-t-xl"}
          `}
        >
          <h3 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-wide">
            New Vendor
          </h3>

          <div className="ml-auto flex items-center gap-2">
            <button className="size-8 flex items-center justify-center rounded-md hover:bg-white/20 transition hover:cursor-pointer">
              <Minus size={14} />
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="size-8 flex items-center justify-center rounded-md hover:bg-white/20 transition hover:cursor-pointer"
            >
              <Square size={13} />
            </button>

            <button
              onClick={() => onOpenChange(false)}
              className="size-8 flex items-center justify-center rounded-md hover:bg-red-500/80 transition hover:cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ===== TOP SECTION ===== */}
        <div className="px-8 py-3 border-b">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-6">
              <Label className="text-xs">Vendor Name</Label>
              <Input
                className="h-8"
                value={formData.vendorName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    vendorName: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-span-3">
              <Label className="text-xs">Opening Balance</Label>
              <Input
                type="number"
                className="h-8"
                value={formData.openingBalance}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    openingBalance: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-span-2">
              <Label className="text-xs">As Of</Label>
              <Input
                type="date"
                className="h-8"
                value={formData.asOfDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    asOfDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="col-span-1 flex items-center">
              <button className="text-xs text-primary hover:underline">
                Help
              </button>
            </div>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-60 border-r bg-muted/40 p-3 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 bg-card overflow-hidden">
            <div className={activeTab === "address" ? "block h-full" : "hidden"}>
              <AddressInfoTab formData={formData} setFormData={setFormData} />
            </div>

            <div className={activeTab === "payment" ? "block h-full" : "hidden"}>
              <PaymentSettingsTab
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            <div className={activeTab === "tax" ? "block h-full" : "hidden"}>
              <TaxSettingsTab formData={formData} setFormData={setFormData} />
            </div>

            <div className={activeTab === "account" ? "block h-full" : "hidden"}>
              <AccountSettingsTab formData={formData} setFormData={setFormData} />
            </div>

            <div
              className={activeTab === "additional" ? "block h-full" : "hidden"}
            >
              <AdditionalInfoTab
                formData={formData}
                setFormData={setFormData}
              />
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div
          className={`
            flex items-center justify-between gap-3 px-8 py-3 border-t bg-muted/40
            ${isMaximized ? "" : "rounded-b-xl"}
          `}
        >
          <div className="flex items-center gap-2">
            <Checkbox
              id="vendor-inactive"
              checked={!!formData.isInactive}
              onCheckedChange={(v) =>
                setFormData((prev) => ({
                  ...prev,
                  isInactive: v === true,
                }))
              }
            />
            <Label htmlFor="vendor-inactive" className="text-sm">
              Vendor is inactive
            </Label>
          </div>

          {/* Buttons (right side) */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-9 cursor-pointer"
            >
              Cancel
            </Button>

            <Button onClick={handleSave} className="h-9 cursor-pointer">
              Save Vendor
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}