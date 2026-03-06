import React, { useMemo } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate, useParams } from "react-router-dom";

import { VendorRegistry } from "./VendorRegistry";
import { VendorDetail } from "./VendorDetail";
import { VendorOperations } from "./VendorOperations";
import { InvoiceDetail } from "../InvoiceDetail";


const mockVendors = [
  {
    businessName: "Alpha Supplies",
    vendorId: "VND-1001",
    netTerms: "Net 30",
    terminationNotice: "30 days",
    status: "Active",
    comments: "Preferred vendor",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "4A Consulting, 4A Ops",
    activeConsultants: 12,
  },
  {
    businessName: "Bright Logistics",
    vendorId: "VND-1002",
    netTerms: "Net 15",
    terminationNotice: "14 days",
    status: "Inactive",
    comments: "On hold",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "Operations",
    activeConsultants: 0,
  },
  {
    businessName: "CloudParts Inc.",
    vendorId: "VND-1003",
    netTerms: "Net 45",
    terminationNotice: "60 days",
    status: "Active",
    comments: "Bulk discounts",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "Engineering, Operations",
    activeConsultants: 4,
  },
];

function VendorLayout({ currentTab }) {
  const navigate = useNavigate();

  const VENDOR_TABS = [
    { id: "registry", label: "Vendor Center", to: "/vendors" },
    { id: "operations", label: "Vendor Operations", to: "/vendors/operations" },
  ];

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
            <button
              key={tab.id}
              onClick={() => navigate(tab.to)}
              className={`pb-3 text-sm font-medium transition-colors ${
                currentTab === tab.id
                  ? "text-orange-600 border-b-2 border-orange-500"
                  : "text-muted-foreground hover:text-foreground hover:cursor-pointer"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* children render below via routes */}
    </div>
  );
}

function VendorCenterPage() {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6">
      <VendorLayout currentTab="registry" />

      <VendorRegistry
        vendors={mockVendors}
        onSelectVendor={(vendor) => {
          // Route to vendor detail, include state so the detail page can render without refetch
          navigate(`/vendors/${vendor.vendorId}/transactions`, { state: { vendor } });
        }}
      />
    </div>
  );
}

function VendorOperationsPage() {
  return (
    <div className="p-6 space-y-6">
      <VendorLayout currentTab="operations" />
      <VendorOperations />
    </div>
  );
}

function VendorDetailWrapper() {
  const { vendorId } = useParams();
  const location = useLocation();

  // Prefer vendor passed from registry navigation; fallback to mock list on refresh
  const vendorFromState = location.state?.vendor;
  const vendor = vendorFromState || mockVendors.find((v) => v.vendorId === vendorId);

  return (
    <div className="py-8">
      <VendorDetail vendor={vendor} />
    </div>
  );
}

function VendorInvoiceWrapper() {
  const { vendorId, invoiceId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <InvoiceDetail
        invoiceId={invoiceId}
        onBack={() => navigate(`/vendors/${vendorId}/transactions`)}
      />
    </div>
  );
}

export function VendorWorkspace() {
  return (
    <Routes>
     
      <Route path="/" element={<VendorCenterPage />} />

     
      <Route path="operations" element={<VendorOperationsPage />} />

      
      <Route path=":vendorId/*" element={<VendorDetailWrapper />} />

     
      <Route path=":vendorId/invoices/:invoiceId" element={<VendorInvoiceWrapper />} />

     
      <Route path="*" element={<Navigate to="/vendors" replace />} />
    </Routes>
  );
}