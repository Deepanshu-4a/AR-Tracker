import { useState } from "react";
import { CustomerCenter } from "./CustomerCenter";
import { InvoiceDetail } from "../InvoiceDetail";
import { CustomerRegistry } from "./CustomerRegistry";
import { CustomerDetail } from "./CustomerDetail";

const CUSTOMER_TABS = [
  { id: "center", label: "Customer Center" },
  { id: "registry", label: "Customer Registry" },
];

export function CustomerWorkspace() {
  const [activeTab, setActiveTab] = useState("center");
  const [activeInvoiceId, setActiveInvoiceId] = useState(null);
  const [activeCustomer, setActiveCustomer] = useState(null);

  // -----------------------------
  // CUSTOMER DETAIL VIEW
  // -----------------------------
  if (activeTab === "customer-detail" && activeCustomer) {
    return (
      <div className="px-10 py-8">
        <CustomerDetail
          customer={activeCustomer}
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
          onBack={() => setActiveTab("customer-detail")}
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
        <h1 className="text-2xl font-semibold">Customers</h1>
        <p className="text-sm text-muted-foreground">
          Manage customers, exposure, and collections
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-6">
          {CUSTOMER_TABS.map((tab) => (
            <CustomerTab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onSelect={setActiveTab}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === "center" && (
        <CustomerCenter
          onViewCustomer={(customer) => {
            setActiveCustomer(customer);
            setActiveTab("customer-detail");
          }}
        />
      )}

      {activeTab === "registry" && (
        <CustomerRegistry
          onSelectCustomer={(customer) => {
            setActiveCustomer(customer);
            setActiveTab("customer-detail");
          }}
        />
      )}
    </div>
  );
}

function CustomerTab({ id, label, isActive, onSelect }) {
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
