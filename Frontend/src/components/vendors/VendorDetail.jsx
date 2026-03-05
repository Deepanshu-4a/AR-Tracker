import React, { useMemo, useState } from "react";
import { cn } from "../ui/utils";
import { Outlet, useNavigate, useParams, useLocation, Routes, Route, Navigate } from "react-router-dom";

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

export function VendorDetail({ vendor }) {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [contextCollapsed, setContextCollapsed] = useState(false);

  if (!vendor) {

    return (
      <div className="px-8">
        <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
          <h2 className="text-lg font-semibold">Vendor not found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please return to Vendor Center and re-open the vendor.
          </p>
          <button
            className="mt-4 text-sm font-medium text-orange-600"
            onClick={() => navigate("/vendors")}
          >
            Back to Vendor Center
          </button>
        </div>
      </div>
    );
  }

  const goTab = (tabId) => navigate(`/vendors/${vendorId}/${tabId}`);

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
        {/* LEFT SIDEBAR */}
        <VendorProfileSidebar vendor={vendor} />

        {/* CENTER */}
        <div className="min-w-0 flex flex-col">
          {/* Tabs */}
          <div className="border-b border-border">
            <div className="flex gap-8">
              {DETAIL_TABS.map((tab) => (
                <DetailTab
                  key={tab.id}
                  id={tab.id}
                  label={tab.label}
                  onSelect={goTab}
                />
              ))}
            </div>
          </div>

          {/* Nested Routes */}
          <div className="flex-1 pt-8">
            <Routes>
              <Route index element={<Navigate to="transactions" replace />} />
              <Route path="transactions" element={<VendorTransactions vendorId={vendor.vendorId ?? vendor.id} />} />
              <Route path="contacts" element={<VendorContacts vendorId={vendor.vendorId ?? vendor.id} />} />
              <Route path="todos" element={<VendorToDos vendorId={vendor.vendorId ?? vendor.id} />} />
              <Route path="*" element={<Navigate to="transactions" replace />} />
            </Routes>
          </div>
        </div>

        {/* RIGHT CONTEXT */}
        {!contextCollapsed ? (
          <RightSidePanel
            customer={vendor}
            collapsed={false}
            onToggle={() => setContextCollapsed(true)}
          />
        ) : (
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

function DetailTab({ id, label, onSelect }) {
  const { vendorId } = useParams();
  const location = useLocation();

  const isActive = useMemo(() => {
    const base = `/vendors/${vendorId}/`;
    return location.pathname === `${base}${id}`;
  }, [location.pathname, vendorId, id]);

  return (
    <button
      onClick={() => onSelect(id)}
      className={cn(
        "relative py-3 text-sm font-medium transition-colors",
        isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
      {isActive && (
        <span className="absolute left-0 bottom-0 h-0.5 w-full bg-primary" />
      )}
    </button>
  );
}