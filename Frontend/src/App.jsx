
import { useState } from "react";
import { Sidebar } from "./components/ui/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ClientManagement } from "./components/ClientManagement";
import { RevenueWorkspace } from "./components/RevenueWorkspace";
import CashInPage from "./components/CashInPage";
import CashOutPage from "./components/CashOutPage";
import { Toaster } from "sonner";
import NetMarginPage from "./components/NetMarginPage";
import AROutstandingPage from "./components/AROutstandingPage";
import APOutstandingPage from "./components/APOutstandingPage";
import { AlertsAndSignalsPage } from "./components/AlertsAndSignalsPage";
import Reminders from "./components/Reminders";


function App() {
  const [activeTab, setActiveTab] = useState("home");

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return <Dashboard onNavigate={setActiveTab} />;

      case "revenue":
        return <RevenueWorkspace />;

      case "customers":
        return <ClientManagement />;

      case "cash-in":
        return <CashInPage onBack={() => setActiveTab("dashboard")} />;

      case "automations":
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
