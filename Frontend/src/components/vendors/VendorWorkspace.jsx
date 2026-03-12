import React, { useMemo, useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { VendorRegistry } from "./VendorRegistry";
import { VendorDetail } from "./VendorDetail";
import { VendorOperations } from "./VendorOperations";
import { InvoiceDetail } from "../InvoiceDetail";
import { BillDetail } from "./BillDetail";

const mockVendors = [
  {
    businessName: "Alpha Supplies",
    vendorId: "VND-1001",
    vendorName: "Alpha Supplies",
    openingBalance: "325000",
    asOfDate: "2026-01-01",
    netTerms: "net_30",
    terminationNotice: "30 days",
    status: "Active",
    comments: "Preferred vendor",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "4A Consulting, 4A Ops",
    activeConsultants: 12,
    type: "Supplier",
    email: "ap@alphasupplies.com",
    phone: "+1 (410) 555-0182",
    ytdSpend: 98000,
    openBills: 4,
    complianceStatus: "Compliant",
    w9: "On File",
    insurance: "Active",
    lastComplianceReview: "Jan 2026",

    addressInfo: {
      companyName: "Alpha Supplies",
      title: "Mr.",
      firstName: "John",
      middleInitial: "A",
      lastName: "Carter",
      jobTitle: "Accounts Payable Manager",
      mainPhone: "+1 (410) 555-0182",
      fax: "+1 (410) 555-0100",
      workPhone: "+1 (410) 555-0183",
      mainEmail: "ap@alphasupplies.com",
      mobile: "+1 (410) 555-0199",
      ccEmail: "finance@alphasupplies.com",
      website: "https://alphasupplies.com",
      other1: "Vendor Portal",
      billingAddress: "1200 Main Street\nSuite 400\nDallas, TX 75001",
      shippingAddress: "1200 Main Street\nSuite 400\nDallas, TX 75001",
      defaultShipping: true,
    },

    paymentSettings: {
      accountNo: "AC-1001",
      creditLimit: "50000",
      paymentTerms: "net_30",
      billingRateLevel: "standard",
      printNameOnCheckAs: "Alpha Supplies",
    },

    salesTax: {
      vendorTaxId: "TX-123456",
      eligibleFor1099: true,
    },

    additionalInfo: {
      vendorType: "suppliers",
      customFields: [],
    },

    accountSettings: {
      prefillAccount1: "5010",
      prefillAccount2: "5030",
      prefillAccount3: "6000",
    },
  },
  {
    businessName: "Bright Logistics",
    vendorId: "VND-1002",
    vendorName: "Bright Logistics",
    openingBalance: "120000",
    asOfDate: "2026-01-01",
    netTerms: "Net 15",
    terminationNotice: "14 days",
    status: "Inactive",
    comments: "On hold",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "Operations",
    activeConsultants: 0,
    type: "Logistics",
    email: "billing@brightlogistics.com",
    phone: "+1 (312) 555-0147",
    ytdSpend: 42000,
    openBills: 1,
    complianceStatus: "Pending",
    w9: "Pending",
    insurance: "Expired",
    lastComplianceReview: "Dec 2025",

    addressInfo: {
      companyName: "Bright Logistics",
      addressLine1: "550 W Adams Street",
      addressLine2: "",
      city: "Chicago",
      state: "IL",
      zipCode: "60661",
      country: "USA",
      email: "billing@brightlogistics.com",
      phone: "+1 (312) 555-0147",
    },

    paymentSettings: {
      paymentTerms: "Net 15",
      preferredPaymentMethod: "Check",
      beneficiaryName: "Bright Logistics",
      bankName: "Chase",
      routingNumber: "071000013",
      accountNumber: "****2291",
    },

    salesTax: {
      taxId: "IL-839201",
      taxCode: "FREIGHT",
      taxRate: "7.50",
    },

    additionalInfo: {
      website: "https://brightlogistics.com",
      notes: "On hold",
      applicableBusinessUnits: "Operations",
    },

    jobInfo: {
      internalOwner: "Operations Team",
      category: "Shipping",
    },
  },
  {
    businessName: "CloudParts Inc.",
    vendorId: "VND-1003",
    vendorName: "CloudParts Inc.",
    openingBalance: "89000",
    asOfDate: "2026-01-01",
    netTerms: "Net 45",
    terminationNotice: "60 days",
    status: "Active",
    comments: "Bulk discounts",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "Engineering, Operations",
    activeConsultants: 4,
    type: "Technology Supplier",
    email: "finance@cloudparts.com",
    phone: "+1 (206) 555-0175",
    ytdSpend: 61000,
    openBills: 2,
    complianceStatus: "Compliant",
    w9: "On File",
    insurance: "Active",
    lastComplianceReview: "Jan 2026",

    addressInfo: {
      companyName: "CloudParts Inc.",
      addressLine1: "4100 Lakeview Drive",
      addressLine2: "",
      city: "Seattle",
      state: "WA",
      zipCode: "98109",
      country: "USA",
      email: "finance@cloudparts.com",
      phone: "+1 (206) 555-0175",
    },

    paymentSettings: {
      paymentTerms: "Net 45",
      preferredPaymentMethod: "Wire",
      beneficiaryName: "CloudParts Inc.",
      bankName: "Wells Fargo",
      routingNumber: "121000248",
      accountNumber: "****7788",
    },

    salesTax: {
      taxId: "WA-667788",
      taxCode: "TECH",
      taxRate: "10.10",
    },

    additionalInfo: {
      website: "https://cloudparts.com",
      notes: "Bulk discounts",
      applicableBusinessUnits: "Engineering, Operations",
    },

    jobInfo: {
      internalOwner: "Engineering Procurement",
      category: "Hardware",
    },
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
          navigate(`/vendors/${vendor.vendorId}/transactions`, {
            state: { vendor },
          });
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

  const vendorFromState = location.state?.vendor;
  const fallbackVendor = mockVendors.find((v) => v.vendorId === vendorId);

  const [vendor, setVendor] = useState(vendorFromState || fallbackVendor);

  useEffect(() => {
    setVendor(vendorFromState || fallbackVendor);
  }, [vendorFromState, fallbackVendor]);

  function handleUpdateVendor(updatedVendor) {
    setVendor(updatedVendor);
  }

  return (
    <div className="py-8">
      <VendorDetail vendor={vendor} onUpdateVendor={handleUpdateVendor} />
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

      <Route
        path=":vendorId/invoices/:invoiceId"
        element={<VendorInvoiceWrapper />}
      />
      <Route path=":vendorId/bills/:billId" element={<BillDetail />} />

      <Route path="*" element={<Navigate to="/vendors" replace />} />
    </Routes>
  );
}
