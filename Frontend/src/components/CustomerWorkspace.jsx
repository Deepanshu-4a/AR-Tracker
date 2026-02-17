import { useState } from "react";
import { CustomerCenter } from "./CustomerCenter";
import { CustomerSegments } from "./CustomerSegments";
import { CustomerCollections } from "./CustomerCollections";
import { CustomerCredit } from "./CustomerCredit";

const CUSTOMER_TABS = [
  {
    id: "center",
    label: "Customer Center",
    Component: CustomerCenter,
  },
  {
    id: "segments",
    label: "Segments & Risk",
    Component: CustomerSegments,
  },
  {
    id: "collections",
    label: "Collections",
    Component: CustomerCollections,
  },
  {
    id: "credit",
    label: "Credit & Exposure",
    Component: CustomerCredit,
  },
];

export function CustomerWorkspace() {
  const [activeTab, setActiveTab] = useState("center");

  const ActiveComponent =
    CUSTOMER_TABS.find((t) => t.id === activeTab)?.Component ?? CustomerCenter;

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

      {/* Active Tab Content */}
      <ActiveComponent />
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
