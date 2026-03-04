import { useState } from "react";
import { cn } from "../ui/utils";

import { VendorProfileSidebar } from "./VendorProfileSidebar";

import { RightSidePanel } from "./RightsidePanel";
import { VendorTransactions } from "./VendorTransactions";
import { VendorContacts } from "./VendorContacts";
import { VendorToDos } from "./VendorToDos";



const DETAIL_TABS = [
  { id: "transactions", label: "Transactions" },
 
  
  
  { id: "contacts", label: "Contacts" },
  { id: "todos", label: "ToDo's" },
];

export function VendorDetail({ vendor, onBack }) {
  const [activeTab, setActiveTab] = useState("transactions");
  const [contextCollapsed, setContextCollapsed] = useState(false);

  if (!vendor) return null;

  const renderActiveTab = () => {
    switch (activeTab) {

      case "transactions":
        return <VendorTransactions vendorId={vendor.id} />;

      case "contacts":
        return <VendorContacts vendorId={vendor.id} />;

      case "todos":
        return <VendorToDos vendorId={vendor.id} />;

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
        <VendorProfileSidebar vendor={vendor} onBack={onBack} />

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
            customer={vendor} 
            collapsed={false}
            onToggle={() => setContextCollapsed(true)}
          />
        )}

        {contextCollapsed && (
          <RightSidePanel
            customer={vendor}
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