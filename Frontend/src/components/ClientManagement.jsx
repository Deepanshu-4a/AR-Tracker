import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Progress } from "./ui/progress";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Search01Icon as Search,
  FilterHorizontalIcon as Filter,
  PencilEdit01Icon as Edit,
  Delete01Icon as Trash2,
  DollarCircleIcon as DollarSign,
  Award01Icon as Award,
  Target01Icon as Target,
  Mail01Icon as Mail,
  SmartPhone01Icon as Phone,
  Calendar01Icon as Calendar,
  Briefcase01Icon as Briefcase,
  Download01Icon as Download,
  UserGroupIcon as Users,
  ViewIcon as Eye,
  Mail01Icon as Send,
} from "hugeicons-react";
import { toast } from "sonner@2.0.3";



export function ClientManagement() {
  const [selectedClient, setSelectedClient] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRisk, setFilterRisk] = useState("all");

  const [clients, setClients] = useState([
    {
      id: "CL001",
      name: "MegaMart",
      contact: "John Smith",
      email: "finance@megamart.com",
      phone: "+1 555-111-2222",
      risk: "High",
      riskScore: 85,
      outstanding: 340000,
      avgDaysLate: 45,
      totalInvoices: 12,
      paidOnTime: 3,
    },
    {
      id: "CL002",
      name: "TechStart Inc",
      contact: "Sarah Johnson",
      email: "accounts@techstart.com",
      phone: "+1 555-333-4444",
      risk: "Medium",
      riskScore: 65,
      outstanding: 280000,
      avgDaysLate: 32,
      totalInvoices: 15,
      paidOnTime: 8,
    },
    {
      id: "CL003",
      name: "Acme Corp",
      contact: "Mike Davis",
      email: "billing@acme.com",
      phone: "+1 555-555-6666",
      risk: "Low",
      riskScore: 25,
      outstanding: 225000,
      avgDaysLate: 12,
      totalInvoices: 18,
      paidOnTime: 16,
    },
  ]);

  const [invoices, setInvoices] = useState([
    {
      id: "INV-2024-001",
      clientId: "CL001",
      customer: "MegaMart",
      amount: 962500,
      dueDate: "2024-12-15",
      daysOverdue: 7,
      riskScore: 85,
      lastReminderSent: "2024-12-20",
    },
    {
      id: "INV-2024-002",
      clientId: "CL001",
      customer: "MegaMart",
      amount: 520000,
      dueDate: "2024-11-30",
      daysOverdue: 22,
      riskScore: 92,
      lastReminderSent: "2024-12-15",
    },
    {
      id: "INV-2024-003",
      clientId: "CL003",
      customer: "Acme Corp",
      amount: 1925000,
      dueDate: "2024-11-30",
      daysOverdue: 22,
      riskScore: 92,
      lastReminderSent: "2024-12-15",
    },
    {
      id: "INV-2024-005",
      clientId: "CL002",
      customer: "TechStart Inc",
      amount: 1201200,
      dueDate: "2024-12-20",
      daysOverdue: 2,
      riskScore: 68,
      lastReminderSent: "2024-12-21",
    },
    {
      id: "INV-2024-008",
      clientId: "CL001",
      customer: "MegaMart",
      amount: 1424500,
      dueDate: "2024-11-20",
      daysOverdue: 32,
      riskScore: 95,
      lastReminderSent: "2024-12-10",
    },
  ]);

  const filteredClients = clients.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = filterRisk === "all" || c.risk === filterRisk;
    return matchesSearch && matchesRisk;
  });

  const getRiskColor = (risk) => {
    if (risk === "High") return "bg-red-50 text-red-700 border-red-200";
    if (risk === "Medium")
      return "bg-yellow-50 text-yellow-700 border-yellow-200";
    return "bg-green-50 text-green-700 border-green-200";
  };

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  const getAgingBucket = (daysOverdue) => {
    if (daysOverdue <= 30) return "0–30";
    if (daysOverdue <= 60) return "31–60";
    return "60+";
  };

  const getAgingBadgeClass = (bucket) => {
    switch (bucket) {
      case "0–30":
        return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "31–60":
        return "bg-amber-100 text-amber-800 border-amber-300";
      case "60+":
        return "bg-rose-100 text-rose-800 border-rose-300";
      default:
        return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  const getRiskBadgeClass = (score) => {
    if (score >= 80) return "bg-red-100 text-red-800 border-red-300";
    if (score >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-green-100 text-green-800 border-green-300";
  };



  const totalClients = clients.length;
  const highRisk = clients.filter((c) => c.risk === "High").length;
  const avgRisk = clients.reduce((s, c) => s + c.riskScore, 0) / clients.length;
  const totalOutstanding = clients.reduce((s, c) => s + c.outstanding, 0);

  return (
    <div className="p-6 space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1>Client Management</h1>
          <p className="text-muted-foreground">
            Manage clients, risk exposure, and invoices
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4" />
          Export
        </Button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Clients</p>
              <p className="text-2xl mt-1">{totalClients}</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg">
              <Users className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-2xl mt-1">{highRisk}</p>
            </div>
            <div className="bg-red-50 p-3 rounded-lg">
              <Target className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Avg Risk Score</p>
              <p className="text-2xl mt-1">{avgRisk.toFixed(0)}%</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <Award className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Outstanding</p>
              <p className="text-2xl mt-1">
                ${totalOutstanding.toLocaleString()}
              </p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <DollarSign className="w-6 h-6 text-orange-500" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-center">
          <div className="flex-auto relative min-w-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search clients..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex-shrink-0">
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Risk" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Risk</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button variant="outline" size="sm" className="flex-shrink-0">
            <Filter className="w-4 h-4" />
            More Filters
          </Button>
        </div>
      </Card>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="p-6">
          <h2 className="mb-4">Clients ({filteredClients.length})</h2>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredClients.map((client) => (
              <div
                key={client.id}
                onClick={() => setSelectedClient(client)}
                className={`p-4 border rounded-lg cursor-pointer ${
                  selectedClient?.id === client.id
                    ? "border-orange-200 bg-orange-50"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-orange-100 text-orange-700">
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{client.name}</p>
                    <p className="text-xs text-muted-foreground">{client.id}</p>
                  </div>
                  <Badge className={getRiskColor(client.risk)}>
                    {client.risk}
                  </Badge>
                </div>

                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-muted-foreground">Risk Score</span>
                  <span className="font-medium">{client.riskScore}%</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 lg:col-span-2">
          {selectedClient ? (
            <Tabs defaultValue="overview">
              <div className="flex justify-between mb-4">
                <TabsList>
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="risk">Risk</TabsTrigger>
                  <TabsTrigger value="invoices">Invoices</TabsTrigger>
                </TabsList>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit className="w-4 h-4" />

                  {isEditing ? "Cancel" : "Edit"}
                </Button>
              </div>


              <TabsContent value="overview" className="space-y-6">
                <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-orange-100 text-orange-700 text-xl">
                      {getInitials(selectedClient.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3>{selectedClient.name}</h3>
                    <Badge className={getRiskColor(selectedClient.risk)}>
                      {selectedClient.risk}
                    </Badge>

                    <div className="flex gap-4 mt-2 text-sm">
                      <div className="flex gap-1">
                        <Mail className="w-3 h-3" />

                        {selectedClient.email}
                      </div>
                      <div className="flex gap-1">
                        <Phone className="w-3 h-3" />

                        {selectedClient.phone}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>


              <TabsContent value="risk" className="space-y-6">
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <p className="text-2xl">{selectedClient.riskScore}%</p>
                  <Progress value={selectedClient.riskScore} className="mt-2" />
                </Card>
              </TabsContent>

              <TabsContent value="invoices" className="space-y-4">
                {selectedClient && (
                  <div>
                    <div className="mb-4">
                      <p className="text-sm text-muted-foreground">
                        Client Invoices
                      </p>
                      <p className="text-2xl font-semibold">
                        {
                          invoices.filter(
                            (inv) => inv.clientId === selectedClient.id,
                          ).length
                        }{" "}
                        invoices
                      </p>
                    </div>

                    <div className="border rounded-lg overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Invoice ID</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Due Date</TableHead>
                            <TableHead>Aging</TableHead>
                            <TableHead>Risk</TableHead>
                            <TableHead>Last Reminder</TableHead>
                            <TableHead className="w-24">Actions</TableHead>
                          </TableRow>
                        </TableHeader>

                        <TableBody>
                          {invoices
                            .filter((inv) => inv.clientId === selectedClient.id)
                            .map((invoice) => {
                              const agingBucket = getAgingBucket(
                                invoice.daysOverdue,
                              );
                              return (
                                <TableRow key={invoice.id}>
                                  <TableCell className="font-mono">
                                    {invoice.id}
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    ${invoice.amount.toLocaleString()}
                                  </TableCell>
                                  <TableCell>
                                    {new Date(
                                      invoice.dueDate,
                                    ).toLocaleDateString()}
                                    {invoice.daysOverdue > 0 && (
                                      <div className="text-xs text-red-600">
                                        {invoice.daysOverdue} days overdue
                                      </div>
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={getAgingBadgeClass(
                                        agingBucket,
                                      )}
                                    >
                                      {agingBucket} Days
                                    </Badge>
                                  </TableCell>
                                  <TableCell>
                                    <Badge
                                      variant="outline"
                                      className={getRiskBadgeClass(
                                        invoice.riskScore,
                                      )}
                                    >
                                      {invoice.riskScore >= 80
                                        ? "High Risk"
                                        : invoice.riskScore >= 50
                                          ? "Medium Risk"
                                          : "Low Risk"}
                                    </Badge>
                                  </TableCell>
                                  <TableCell className="text-sm text-muted-foreground">
                                    {invoice.lastReminderSent
                                      ? new Date(
                                          invoice.lastReminderSent,
                                        ).toLocaleDateString()
                                      : "—"}
                                  </TableCell>
                                  <TableCell>
                                    <div className="flex gap-2">
                                      <Button size="sm" variant="outline">
                                        View
                                      </Button>
                                      <Button
                                        size="sm"
                                        className="gap-1 bg-orange-500 hover:bg-orange-600 text-white"
                                        onClick={() =>
                                          toast.success(
                                            "Reminder sent successfully",
                                          )
                                        }
                                      >
                                        <Send className="w-4 h-4" />
                                        Reminder
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                        </TableBody>
                      </Table>

                      {invoices.filter(
                        (inv) => inv.clientId === selectedClient.id,
                      ).length === 0 && (
                        <div className="h-32 flex items-center justify-center text-muted-foreground">
                          No invoices found for this client
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <div className="flex items-center justify-center h-[500px] text-center">
              <Users className="w-8 h-8 mb-2 text-orange-500" />
              <p className="text-muted-foreground">
                Select a client to view details
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
