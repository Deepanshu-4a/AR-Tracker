// ✅ App.jsx (add CashIn route via activeTab)
// 1) Import CashInPage
// 2) Add a new tab case "cash-in"
// 3) Pass setActiveTab into Dashboard so clicking Cash In can open it

import { useState } from "react";
import { Sidebar } from "./components/ui/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { Reminders } from "./components/Reminders";
import { InvoiceManagement } from "./components/InvoiceManagement";
import { ClientManagement } from "./components/ClientManagement";
import { Revenue } from "./components/Revenue";
import CashInPage from "./components/CashInPage";
import CashOutPage from "./components/CashOutPage";
import { Toaster } from "sonner";
import NetMarginPage from "./components/NetMarginPage";
import AROutstandingPage from "./components/AROutstandingPage";
import APOutstandingPage from "./components/APOutstandingPage";
import { AlertsAndSignalsPage } from "./components/AlertsAndSignalsPage";
function App() {
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const handleSelectInvoice = (invoiceId) => {
    console.log("Selected invoice:", invoiceId);
  };

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return (
          <Dashboard
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
        );

      case "cash-in":
        return <CashInPage onBack={() => setActiveTab("dashboard")} />;

      case "reminders":
        return <Reminders />;

      case "cash-out":
        return <CashOutPage onBack={() => setActiveTab("dashboard")} />;

      case "net-margin":
        return <NetMarginPage onBack={() => setActiveTab("dashboard")} />;

      case "ar-outstanding":
        return <AROutstandingPage onBack={() => setActiveTab("dashboard")} />;

      case "alerts-signals":
        return (
          <AlertsAndSignalsPage onBack={() => setActiveTab("dashboard")} />
        );

      case "ap-outstanding":
        return <APOutstandingPage onBack={() => setActiveTab("dashboard")} />;

      case "revenue":
        return (
          <Revenue
            onOpenInvoiceCenter={() => console.log("Open Invoice Center")}
            onOpenPayments={() => console.log("Open Payments & Receivables")}
            onOpenRecurring={() =>
              console.log("Open Recurring & Milestone Billing")
            }
          />
        );

      case "clients":
        return <ClientManagement />;

      case "invoices":
        return <InvoiceManagement onSelectInvoice={handleSelectInvoice} />;

      default:
        return (
          <Dashboard
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
      <Toaster />
    </div>
  );
}

export default App;
