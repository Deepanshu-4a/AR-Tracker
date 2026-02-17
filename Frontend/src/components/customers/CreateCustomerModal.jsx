"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "../ui/dialog";
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

  const [formData, setFormData] = useState({
    customerName: "",
    openingBalance: "",
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

  const tabs = [
    { key: "address", label: "Address Info" },
    { key: "payment", label: "Payment Settings" },
    { key: "tax", label: "Sales Tax Settings" },
    { key: "additional", label: "Additional Info" },
    { key: "job", label: "Job Info" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          !w-[95vw]
          !max-w-[1400px]
          p-0
        "
      >
        {/* ===== HEADER ===== */}
        <DialogHeader className="px-8 py-4 border-b">
          <DialogTitle>New Customer</DialogTitle>
        </DialogHeader>

        {/* ===== TOP BASIC INFO ===== */}
        <div className="px-8 py-6 border-b bg-muted/30">
          <div className="grid grid-cols-2 gap-12">
            <div className="space-y-2">
              <Label>Customer Name</Label>
              <Input
                value={formData.customerName}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customerName: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Opening Balance</Label>
              <Input
                type="number"
                value={formData.openingBalance}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    openingBalance: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </div>

        {/* ===== BODY ===== */}
        <div className="flex min-h-[600px]">
          {/* ===== LEFT SIDEBAR ===== */}
          <div className="w-72 border-r bg-muted/40 p-6 space-y-2">
            {tabs.map((tab) => (
              <Button
                key={tab.key}
                variant={activeTab === tab.key ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => setActiveTab(tab.key)}
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* ===== RIGHT CONTENT ===== */}
          <div className="flex-1 p-8">
            {activeTab === "address" && (
              <AddressInfoTab formData={formData} setFormData={setFormData} />
            )}

            {activeTab === "payment" && (
              <PaymentSettingsTab
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {activeTab === "tax" && (
              <SalesTaxSettingsTab
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {activeTab === "additional" && (
              <AdditionalInfoTab
                formData={formData}
                setFormData={setFormData}
              />
            )}

            {activeTab === "job" && (
              <JobInfoTab formData={formData} setFormData={setFormData} />
            )}
          </div>
        </div>

        {/* ===== FOOTER ===== */}
        <DialogFooter className="px-8 py-4 border-t bg-muted/30">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button onClick={handleSave}>Save Customer</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
