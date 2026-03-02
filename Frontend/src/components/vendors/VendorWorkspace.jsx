import { useState } from "react";
import { InvoiceDetail } from "../InvoiceDetail";

import { VendorRegistry } from "./VendorRegistry";
import { VendorDetail } from "./VendorDetail";
import { VendorOperations } from "./VendorOperations";

const VENDOR_TABS = [
  { id: "registry", label: "Vendor Center" },
  { id: "operations", label: "Vendor Operations" },
];

export function VendorWorkspace() {
  const [activeTab, setActiveTab] = useState("registry");
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);
  const [activeVendor, setActiveVendor] = useState(null);

  // -----------------------------
  // VENDOR DETAIL VIEW
  // -----------------------------
  if (activeTab === "vendor-detail" && activeVendor) {
    return (
      <div className="py-8">
        <VendorDetail
          vendor={activeVendor}
          onBack={() => setActiveTab("registry")}
          onViewInvoice={(invoiceId) => {
            setActiveInvoiceId(invoiceId);
            setActiveTab("invoice-detail");
          }}
        />
      </div>
    );
  }

  // -----------------------------
  // INVOICE DETAIL VIEW
  // -----------------------------
  if (activeTab === "invoice-detail" && activeInvoiceId) {
    return (
      <div className="p-6">
        <InvoiceDetail
          invoiceId={activeInvoiceId}
          onBack={() => setActiveTab("vendor-detail")}
        />
      </div>
    );
  }

  // -----------------------------
  // NORMAL TAB VIEWS
  // -----------------------------
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Vendors</h1>
        <p className="text-sm text-muted-foreground">
          Manage vendors, purchasing, and operations
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {VENDOR_TABS.map((tab) => (
            <VendorTab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onSelect={setActiveTab}
            />
          ))}
        </div>
      </div>

      {activeTab === "registry" && (
        <VendorRegistry
          onSelectVendor={(vendor) => {
            setActiveVendor(vendor);
            setActiveTab("vendor-detail");
          }}
        />
      )}

      {activeTab === "operations" && <VendorOperations />}
    </div>
  );
}

function VendorTab({ id, label, isActive, onSelect }) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={`pb-3 text-sm font-medium transition-colors ${
        isActive
          ? "text-orange-600 border-b-2 border-orange-500"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {label}
    </button>
  );
}