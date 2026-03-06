import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { cn } from "../ui/utils";


import { VendorRelationshipSidebar } from "./VendorRelationShipSidebar";


import { VendorTransactions } from "./VendorTransactions";

const TX_TABS = [
  { id: "bills", label: "Bills" },
  { id: "billPayments", label: "Bill Payments" },
  { id: "checks", label: "Checks" },
  { id: "ccActivities", label: "Credit Card Activities" },
];

export function VendorOperations() {
  const [selectedVendor, setSelectedVendor] = useState(null);

  
  const [leftTab, setLeftTab] = useState("vendors");

  
  const [txView, setTxView] = useState("bills");

  const handleSelect = (node) => {
    if (node?.type === "vendor") setSelectedVendor(node);
  };

  return (
    <div className="h-full w-full px-8">
      <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-8">
        {/* LEFT SIDEBAR */}
        <div className="min-h-0">
          <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
            <div className="px-3 pt-3">
              <Tabs value={leftTab} onValueChange={setLeftTab}>
                {/* Vendors | Transactions */}
                <TabsList className="grid grid-cols-2 w-full bg-muted rounded-xl p-1">
                  <TabsTrigger
                    value="vendors"
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Vendors
                  </TabsTrigger>
                  <TabsTrigger
                    value="transactions"
                    className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
                  >
                    Transactions
                  </TabsTrigger>
                </TabsList>

                {/* Vendors list */}
                <TabsContent value="vendors" className="mt-3">
                  <div className="px-3 pb-3">
                    <VendorRelationshipSidebar
                      selectedId={selectedVendor?.id ?? selectedVendor?.vendorId}
                      onSelect={handleSelect}
                    />
                  </div>
                </TabsContent>

                {/* Transactions (4 items) */}
                <TabsContent value="transactions" className="mt-3">
                  <div className="px-2 pb-3">
                    <div className="space-y-1">
                      {TX_TABS.map((it) => {
                        const active = it.id === txView;
                        return (
                          <button
                            key={it.id}
                            type="button"
                            onClick={() => setTxView(it.id)}
                            className={cn(
                              "w-full text-left rounded-xl px-3 py-2 text-sm transition-colors",
                              active
                                ? "bg-muted font-medium"
                                : "hover:bg-muted/60",
                            )}
                          >
                            {it.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="min-h-0">
          {leftTab === "vendors" ? (
            selectedVendor ? (
              <VendorOperationsVendorSelected vendor={selectedVendor} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a vendor to view details
              </div>
            )
          ) : (
            <VendorOperationsTransactions view={txView} />
          )}
        </div>
      </div>
    </div>
  );
}


function VendorOperationsVendorSelected({ vendor }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6">
      <div className="text-sm text-muted-foreground">Selected Vendor</div>
      <div className="mt-2 text-lg font-semibold">
        {vendor?.businessName ?? vendor?.name ?? "—"}
      </div>

      <div className="mt-6 text-sm text-muted-foreground">
        Open your existing VendorDetail page here if you want (Transactions/Contacts/Todos).
      </div>
    </div>
  );
}


function VendorOperationsTransactions({ view }) {
  const title =
    view === "bills"
      ? "Bills"
      : view === "billPayments"
        ? "Bill Payments"
        : view === "checks"
          ? "Checks"
          : "Credit Card Activities";

  return (
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">All vendors</p>
      </div>

      <div className="mt-6">
       
        <VendorTransactions view={view} />
      </div>
    </div>
  );
}