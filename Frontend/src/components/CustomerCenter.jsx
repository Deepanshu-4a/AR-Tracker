import { useState, useMemo } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { Search01Icon as Search } from "hugeicons-react";
import { Users, Plus, Download } from "lucide-react";

export function CustomerCenter() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Mock Data (replace later with API)
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
  }, [searchTerm]);

  const totalAR = customers.reduce((s, c) => s + c.arBalance, 0);
  const avgDays =
    customers.reduce((s, c) => s + c.avgDaysToPay, 0) / customers.length;

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

  return (
    <div className="space-y-6">
      {/* KPI ROW */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="text-2xl font-semibold">{customers.length}</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Total AR Balance</p>
          <p className="text-2xl font-semibold">${totalAR.toLocaleString()}</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-muted-foreground">Avg Days to Pay</p>
          <p className="text-2xl font-semibold">{avgDays.toFixed(0)} days</p>
        </Card>

        <Card className="p-5">
          <p className="text-sm text-muted-foreground">High Risk Customers</p>
          <p className="text-2xl font-semibold">
            {customers.filter((c) => c.risk === "High").length}
          </p>
        </Card>
      </div>

      {/* TOOLBAR */}
      <Card className="p-4 flex justify-between items-center">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Customer
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>New Customer</DropdownMenuItem>
              <DropdownMenuItem>Import Customers</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </Card>

      {/* MAIN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CUSTOMER LIST */}
        <Card className="p-4 lg:col-span-1">
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
                    <AvatarFallback>
                      {getInitials(customer.name)}
                    </AvatarFallback>
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

        {/* CUSTOMER PROFILE PANEL */}
        <Card className="p-6 lg:col-span-2">
          {selectedCustomer ? (
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="invoices">Invoices</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="billing">Billing Profile</TabsTrigger>
              </TabsList>

              <TabsContent value="overview">
                <h3 className="text-lg font-semibold">
                  {selectedCustomer.name}
                </h3>
                <p className="text-muted-foreground">
                  {selectedCustomer.email}
                </p>
                <p className="text-muted-foreground">
                  {selectedCustomer.phone}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">AR Balance</p>
                    <p className="text-xl font-semibold">
                      ${selectedCustomer.arBalance.toLocaleString()}
                    </p>
                  </Card>

                  <Card className="p-4">
                    <p className="text-sm text-muted-foreground">
                      Avg Days to Pay
                    </p>
                    <p className="text-xl font-semibold">
                      {selectedCustomer.avgDaysToPay} days
                    </p>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="invoices">
                <p>Invoice history will go here.</p>
              </TabsContent>

              <TabsContent value="payments">
                <p>Payment history will go here.</p>
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
      </div>
    </div>
  );
}
