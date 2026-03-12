"use client";

import { useEffect, useState } from "react";
import { X, Minus, Square } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

import { AddressInfoTab } from "./tabs/AddressInfoTab";
import { PaymentSettingsTab } from "./tabs/PaymentSettingsTab";
import { SalesTaxSettingsTab } from "./tabs/SalesTaxSettingsTab";
import { AdditionalInfoTab } from "./tabs/AdditionalInfoTab";
import { JobInfoTab } from "./tabs/JobInfoTab";

const emptyCustomerForm = {
  customerName: "",
  openingBalance: "",
  asOfDate: "",
  addressInfo: {},
  paymentSettings: {},
  salesTax: {},
  additionalInfo: {},
  jobInfo: {},
};

export function CustomerFormModal({
  open,
  onOpenChange,
  mode = "create",
  initialData = null,
  onSave,
}) {
  const [activeTab, setActiveTab] = useState("address");
  const [isMaximized, setIsMaximized] = useState(false);
  const [formData, setFormData] = useState(emptyCustomerForm);

  useEffect(() => {
    if (!open) return;

    setActiveTab("address");

    if (mode === "edit" && initialData) {
      setFormData({
        customerName:
          initialData.customerName ??
          initialData.businessName ??
          initialData.name ??
          "",
        openingBalance: initialData.openingBalance ?? "",
        asOfDate: initialData.asOfDate ?? "",

        addressInfo: {
          ...(initialData.addressInfo ?? {}),
          companyName:
            initialData.addressInfo?.companyName ??
            initialData.businessName ??
            initialData.customerName ??
            "",
          mainPhone:
            initialData.addressInfo?.mainPhone ??
            initialData.phone ??
            "",
          mainEmail:
            initialData.addressInfo?.mainEmail ??
            initialData.email ??
            "",
          website:
            initialData.addressInfo?.website ??
            initialData.website ??
            "",
        },

        paymentSettings: {
          ...(initialData.paymentSettings ?? {}),
          paymentTerms:
            initialData.paymentSettings?.paymentTerms ??
            initialData.netTerms ??
            initialData.paymentTerms ??
            "",
          printNameOnCheckAs:
            initialData.paymentSettings?.printNameOnCheckAs ??
            initialData.businessName ??
            initialData.customerName ??
            "",
        },

        salesTax: {
          ...(initialData.salesTax ?? {}),
          customerTaxId:
            initialData.salesTax?.customerTaxId ??
            initialData.customerTaxId ??
            initialData.taxId ??
            "",
        },

        additionalInfo: {
          ...(initialData.additionalInfo ?? {}),
        },

        jobInfo: {
          ...(initialData.jobInfo ?? {}),
        },
      });
    } else {
      setFormData(emptyCustomerForm);
    }
  }, [open, mode, initialData]);

  const handleSave = () => {
    const payload = {
      ...initialData,
      ...formData,
      businessName: formData.customerName,
      customerName: formData.customerName,

      phone:
        formData.addressInfo?.mainPhone ??
        initialData?.phone ??
        "",

      email:
        formData.addressInfo?.mainEmail ??
        initialData?.email ??
        "",

      website:
        formData.addressInfo?.website ??
        initialData?.website ??
        "",
    };

    onSave?.(payload);
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
        <div
          className={`
            relative flex items-center px-6 py-3
            bg-orange-500 text-white
            ${isMaximized ? "" : "rounded-t-xl"}
          `}
        >
          <h3 className="absolute left-1/2 -translate-x-1/2 text-sm font-semibold tracking-wide">
            {mode === "edit" ? "Edit Customer" : "New Customer"}
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
              <button className="text-xs text-primary hover:underline cursor-pointer">
                Help
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          <div className="w-60 border-r bg-muted/40 p-3 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm transition ${
                  activeTab === tab.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "hover:bg-muted cursor-pointer"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

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

        <div
          className={`
            flex justify-end gap-3 px-8 py-3 border-t bg-muted/40
            ${isMaximized ? "" : "rounded-b-xl"}
          `}
        >
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="h-9 cursor-pointer"
          >
            Cancel
          </Button>

          <Button onClick={handleSave} className="h-9 cursor-pointer">
            {mode === "edit" ? "Update Customer" : "Save Customer"}
          </Button>
        </div>
      </div>
    </div>
  );
}