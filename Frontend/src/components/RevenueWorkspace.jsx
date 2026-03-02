import { useState } from "react";
import { InvoiceManagement } from "./InvoiceManagement";
import { PaymentsReceivables } from "./PaymentsReceivables";
import { CustomerBillingProfile } from "./customers/CustomerBillingProfile";

const CUSTOMERS = [
  { id: "CL001", name: "MegaMart" },
  { id: "CL002", name: "TechStart Inc" },
  { id: "CL003", name: "Acme Corp" },
];

const REVENUE_TABS = [
  { id: "invoices", label: "Invoice Center", Component: InvoiceManagement },
  { id: "payments", label: "Payments & Receivables", Component: PaymentsReceivables },
  { id: "billing", label: "Billing Profile", Component: CustomerBillingProfile },
];

export function RevenueWorkspace() {
  const [activeTab, setActiveTab] = useState("invoices");

  const [selectedCustomerId, setSelectedCustomerId] = useState("CL001");
  const selectedCustomer = CUSTOMERS.find((c) => c.id === selectedCustomerId);

  const ActiveComponent =
    REVENUE_TABS.find((t) => t.id === activeTab)?.Component ?? InvoiceManagement;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Revenue</h1>
        <p className="text-sm text-muted-foreground">Billing and accounts receivable</p>
      </div>

      <div className="border-b border-border">
        <div className="flex gap-6">
          {REVENUE_TABS.map((tab) => (
            <RevenueTab
              key={tab.id}
              id={tab.id}
              label={tab.label}
              isActive={activeTab === tab.id}
              onSelect={setActiveTab}
            />
          ))}
        </div>
      </div>

      <div>
       
        {activeTab === "billing" ? (
          <CustomerBillingProfile customer={selectedCustomer} />
        ) : (
          <ActiveComponent />
        )}
      </div>
    </div>
  );
}

function RevenueTab({ id, label, isActive, onSelect }) {
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