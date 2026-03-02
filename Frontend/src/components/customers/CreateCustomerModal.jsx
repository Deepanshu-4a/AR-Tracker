"use client";

import { useState } from "react";
import { X, Minus, Square } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { AddressInfoTab } from "./tabs/AddressInfoTab";
import { PaymentSettingsTab } from "./tabs/PaymentSettingsTab";
import { SalesTaxSettingsTab } from "./tabs/SalesTaxSettingsTab";
import { AdditionalInfoTab } from "./tabs/AdditionalInfoTab";
import { JobInfoTab } from "./tabs/JobInfoTab";

export function CreateCustomerModal({ open, onOpenChange }) {
  const [activeTab, setActiveTab] = useState("address");
  const [isMaximized, setIsMaximized] = useState(false);

  const [formData, setFormData] = useState({
    customerName: "",
    openingBalance: "",
    asOfDate: "",
    addressInfo: {},
    paymentSettings: {},
    salesTax: {},
    additionalInfo: {},
    jobInfo: {},
  });

  const handleSave = () => {
    console.log("Customer Data:", formData);
    onOpenChange(false);
  };

  if (!open) return null;

  const tabs = [
    { key: "address", label: "Address Info" },
    { key: "payment", label: "Payment Settings" },
    { key: "tax", label: "Sales Tax Settings" },
    { key: "additional", label: "Additional Info" },
    { key: "job", label: "Job Info" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`
          bg-card
          shadow-2xl
          flex flex-col
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
            New Customer
          </h3>

          <div className="ml-auto flex items-center gap-2">
            <button className="size-8 flex items-center justify-center rounded-md hover:bg-white/20 transition">
              <Minus size={14} />
            </button>

            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="size-8 flex items-center justify-center rounded-md hover:bg-white/20 transition"
            >
              <Square size={13} />
            </button>

            <button
              onClick={() => onOpenChange(false)}
              className="size-8 flex items-center justify-center rounded-md hover:bg-red-500/80 transition"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ===== TOP SECTION ===== */}
        <div className="px-8 py-3 border-b">
          <div className="grid grid-cols-12 gap-4 items-end">
            <div className="col-span-6">
              <Label className="text-xs">Customer Name</Label>
              <Input
                className="h-8"
                value={formData.customerName}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customerName: e.target.value,
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
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content*/}
          <div className="flex-1 p-6 bg-card overflow-hidden">
            <div
              className={activeTab === "address" ? "block h-full" : "hidden"}
            >
              <AddressInfoTab formData={formData} setFormData={setFormData} />
            </div>

            <div
              className={activeTab === "payment" ? "block h-full" : "hidden"}
            >
              <PaymentSettingsTab
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            <div className={activeTab === "tax" ? "block h-full" : "hidden"}>
              <SalesTaxSettingsTab
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            <div
              className={activeTab === "additional" ? "block h-full" : "hidden"}
            >
              <AdditionalInfoTab
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            <div className={activeTab === "job" ? "block h-full" : "hidden"}>
              <JobInfoTab formData={formData} setFormData={setFormData} />
            </div>
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <div
          className={`
            flex justify-end gap-3 px-8 py-3 border-t bg-muted/40
            ${isMaximized ? "" : "rounded-b-xl"}
          `}
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9"
          >
            Cancel
          </Button>

          <Button onClick={handleSave} className="h-9">
            Save Customer
          </Button>
        </div>
      </div>
    </div>
  );
}
