

import { useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search01Icon as Search } from "hugeicons-react";
import { InvoiceManagement } from "./InvoiceManagement";
import { PaymentsReceivables } from "./PaymentsReceivables";
import { CustomerBillingProfile } from "./CustomerBillingProfile";

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

  // ✅ add selected customer in Revenue
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
        {/* ✅ ONLY Billing Profile needs customer */}
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
import { Users, Plus, Download, FileText } from "lucide-react";

import { CreateEstimateModal } from "./CreateEstimateModal";
import { CustomerOverview } from "./CustomerOverview";
import { RightSidePanel } from "./shared/RightSidePanel";
import { CustomerPayments } from "./CustomerPayments";
import { CreateCustomerModal } from "./customers/CreateCustomerModal";
import { CustomerInvoices } from "./CustomerInvoices";


import { CustomerRegistry } from "./CustomerRegistry";

export function CustomerCenter({ onViewInvoice }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEstimateOpen, setIsEstimateOpen] = useState(false);

  /* ================= MOCK DATA ================= */
  const customers = [
    {
      id: "CL001",
      name: "MegaMart",
      arBalance: 340000,
      avgDaysToPay: 45,
      risk: "High",
      email: "finance@megamart.com",
      phone: "+1 555-111-2222",
      status: "Active",
      netTerms: "30 days",
      category: "Retail",
      primaryBusinessUnit: "Cyber Infotech, LLC",
      createdAt: "2026-02-10",
    },
    {
      id: "CL002",
      name: "TechStart Inc",
      arBalance: 280000,
      avgDaysToPay: 32,
      risk: "Medium",
      email: "accounts@techstart.com",
      phone: "+1 555-333-4444",
      status: "Active",
      netTerms: "45 days",
      category: "Technology",
      primaryBusinessUnit: "Cyber Infotech, LLC",
      createdAt: "2026-01-22",
    },
    {
      id: "CL003",
      name: "Acme Corp",
      arBalance: 225000,
      avgDaysToPay: 12,
      risk: "Low",
      email: "billing@acme.com",
      phone: "+1 555-555-6666",
      status: "Active",
      netTerms: "15 days",
      category: "Manufacturing",
      primaryBusinessUnit: "Cyber Infotech, LLC",
      createdAt: "2025-12-18",
    },
  ];

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [searchTerm, customers]);

  const getRiskColor = (risk) => {
    if (risk === "High") return "bg-red-100 text-red-700";
    if (risk === "Medium") return "bg-yellow-100 text-yellow-700";
    return "bg-green-100 text-green-700";
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  /* ================= UI ================= */
  return (
    <div className="space-y-6">
      {/* TOOLBAR */}
      <Card className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customers..."
              className="pl-10 h-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={!selectedCustomer}
              onClick={() => setIsEstimateOpen(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Create Estimate
            </Button>

            <Button
              className="bg-orange-500 hover:bg-orange-600"
              onClick={() => setIsCreateOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Customer
            </Button>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
      </Card>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr_1fr] gap-6">
        {/* LEFT: CUSTOMER LIST */}
        <Card className="p-4">
          <h2 className="mb-4 font-semibold">
            Customers ({filteredCustomers.length})
          </h2>

          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className={`p-4 border rounded-lg cursor-pointer transition ${
                  selectedCustomer?.id === customer.id
                    ? "bg-orange-50 border-orange-300"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>{getInitials(customer.name)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <p className="font-medium">{customer.name}</p>
                    <p className="text-xs text-muted-foreground">
                      ${customer.arBalance.toLocaleString()}
                    </p>
                  </div>

                  <Badge className={getRiskColor(customer.risk)}>
                    {customer.risk}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* MIDDLE: PROFILE + NEW TAB */}
        <Card className="p-6">
          {selectedCustomer ? (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
                <TabsTrigger value="billing">Billing Profile</TabsTrigger>

                {/* ✅ NEW TAB */}
                <TabsTrigger value="registry">Customer Registry</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <CustomerOverview customer={selectedCustomer} />
              </TabsContent>

              <TabsContent value="invoices">
                <CustomerInvoices
                  customerId={selectedCustomer.id}
                  customerName={selectedCustomer.name}
                  onViewInvoice={onViewInvoice}
                />
              </TabsContent>

              <TabsContent value="payments">
                <CustomerPayments
                  customerId={selectedCustomer.id}
                  customerName={selectedCustomer.name}
                />
              </TabsContent>

              <TabsContent value="billing">
                <CustomerBillingProfile customer={selectedCustomer} />
              </TabsContent>

              {/* ✅ NEW CONTENT */}
              <TabsContent value="registry">
                <CustomerRegistry customers={customers} />
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
              <Users className="w-8 h-8 mb-2" />
              Select a customer to view details
            </div>
          )}
        </Card>

        {/* RIGHT PANEL */}
        <RightSidePanel customer={selectedCustomer} />
      </div>

      {/* MODALS */}
      <CreateCustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <CreateEstimateModal
        open={isEstimateOpen}
        onOpenChange={setIsEstimateOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}