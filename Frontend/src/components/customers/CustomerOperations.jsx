// ==============================
// CustomerOperations.jsx
// ONLY Customer & Jobs tab
// ==============================
import { useState } from "react";
import { cn } from "../ui/utils";

import { CustomerRelationshipSidebar } from "./CustomerRelationshipSidebar";

const OPERATIONS_TABS = [
  { id: "customer-jobs", label: "Customer & Jobs" },
];

export function CustomerOperations() {
  const [activeTab, setActiveTab] = useState("customer-jobs");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "customer-jobs":
        return <CustomerRelationshipSidebar />;

      default:
        return null;
    }
  };

  return (
    <div className="h-full w-full max-w-none px-8">
      {/* Tabs */}
      <div className="border-b border-border">
        <div className="flex gap-8">
          {OPERATIONS_TABS.map((tab) => (
            <OperationsTab
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
      <div className="pt-8">{renderActiveTab()}</div>
    </div>
  );
}

/* ================= TAB ================= */

function OperationsTab({ id, label, isActive, onSelect }) {
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