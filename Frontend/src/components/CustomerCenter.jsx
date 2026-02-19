// ==============================
// CustomerCenter.jsx (UPDATED)
// ==============================
import { useMemo, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search01Icon as Search } from "hugeicons-react";
import { Users, Plus, Download, FileText } from "lucide-react";
import { CreateEstimateModal } from "./CreateEstimateModal";
import { CustomerOverview } from "./CustomerOverview";
import { RightSidePanel } from "./shared/RightSidePanel";
import { CustomerPayments } from "./CustomerPayments"; // <-- new import
import { CreateCustomerModal } from "./customers/CreateCustomerModal";
import { CustomerInvoices } from "./CustomerInvoices"; // <-- adjust path if needed

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
    },
    {
      id: "CL002",
      name: "TechStart Inc",
      arBalance: 280000,
      avgDaysToPay: 32,
      risk: "Medium",
      email: "accounts@techstart.com",
      phone: "+1 555-333-4444",
    },
    {
      id: "CL003",
      name: "Acme Corp",
      arBalance: 225000,
      avgDaysToPay: 12,
      risk: "Low",
      email: "billing@acme.com",
      phone: "+1 555-555-6666",
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
            {/* ✅ NEW CREATE ESTIMATE BUTTON */}
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
        {/* ================= CUSTOMER LIST ================= */}
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

        {/* ================= CUSTOMER PROFILE ================= */}
        <Card className="p-6">
          {selectedCustomer ? (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payments">Payment History</TabsTrigger>
                <TabsTrigger value="billing">Billing Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <CustomerOverview customer={selectedCustomer} />
              </TabsContent>

              {/*  UPDATED: invoices tab now routes to InvoiceDetail via onViewInvoice */}
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
                <p>Billing profile settings here.</p>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex flex-col items-center justify-center h-[500px] text-muted-foreground">
              <Users className="w-8 h-8 mb-2" />
              Select a customer to view details
            </div>
          )}
        </Card>

        {/* ================= RIGHT SIDE PANEL ================= */}
        <RightSidePanel customer={selectedCustomer} />
      </div>

      {/* CREATE CUSTOMER MODAL */}
      <CreateCustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />

     
      <CreateEstimateModal
        open={isEstimateOpen}
        onOpenChange={setIsEstimateOpen}
        customer={selectedCustomer}
      />
    </div>
  );
}
