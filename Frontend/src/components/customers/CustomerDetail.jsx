import { useState } from "react";
import { cn } from "../ui/utils";

import { CustomerProfileSidebar } from "./CustomerProfileSidebar";
import { CustomerEstimates } from "./CustomerEstimates";
import { RightSidePanel } from "../shared/RightSidePanel";
import { CustomerTransactions } from "./CustomerTransactions";
import { CustomerContacts } from "./CustomerContacts";
import { CustomerToDos } from "./CustomerToDos";
import { CustomerPayments } from "./CustomerPayments";
import { CustomerInvoices } from "./CustomerInvoices";

const DETAIL_TABS = [
  { id: "transactions", label: "Transactions" },
  { id: "payment history", label: "Payment History" },
  {id:"invoice history",label:"Invoice History"},
  { id: "estimates", label: "Estimates" },
  { id: "contacts", label: "Contacts" },
  { id: "todos", label: "ToDo's" },
];

export function CustomerDetail({ customer, onBack }) {
  const [activeTab, setActiveTab] = useState("transactions");
  const [contextCollapsed, setContextCollapsed] = useState(false);

  if (!customer) return null;

  const renderActiveTab = () => {
    switch (activeTab) {

      case "estimates":
        return <CustomerEstimates customerId={customer.id} />;

      case "payment history":
        return <CustomerPayments customerId={customer.id}/>;

      case "invoice history":
        return <CustomerInvoices customerId={customer.id}/>;

      case "transactions":
        return <CustomerTransactions customerId={customer.id} />;

      case "contacts":
        return <CustomerContacts customerId={customer.id} />;

      case "todos":
        return <CustomerToDos customerId={customer.id} />;

      default:
        return null;
    }
  };

return (
  <div className="h-full w-full max-w-none px-8">
    <div
      className={cn(
        "grid gap-8 transition-all duration-300",
        contextCollapsed
          ? "grid-cols-[280px_minmax(0,1fr)]"
          : "grid-cols-[280px_minmax(0,1fr)_260px]",
      )}
    >
      {/* ================= LEFT SIDEBAR ================= */}
      <CustomerProfileSidebar customer={customer} onBack={onBack} />

      {/* ================= CENTER ================= */}
      <div className="min-w-0 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex gap-8">
            {DETAIL_TABS.map((tab) => (
              <DetailTab
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
        <div className="flex-1 pt-8">{renderActiveTab()}</div>
      </div>

      {/* ================= RIGHT CONTEXT ================= */}
      {!contextCollapsed && (
        <RightSidePanel
          customer={customer}
          collapsed={false}
          onToggle={() => setContextCollapsed(true)}
        />
      )}

      {contextCollapsed && (
        <RightSidePanel
          customer={customer}
          collapsed={true}
          onToggle={() => setContextCollapsed(false)}
        />
      )}
    </div>
  </div>
);
}

/* ================= TAB ================= */

function DetailTab({ id, label, isActive, onSelect }) {
  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        "relative py-3 text-sm font-medium transition-colors",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      {isActive && (
        <span className="absolute left-0 bottom-0 h-0.5 w-full bg-primary" />
      )}
    </button>
  );
}
