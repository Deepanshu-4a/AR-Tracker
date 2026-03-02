import { useState } from "react";
import { Sidebar } from "./components/ui/Sidebar";
import { CustomerWorkspace } from "./components/customers/CustomerWorkspace";
import { Dashboard } from "./components/dashboard/Dashboard";
import { RevenueWorkspace } from "./components/RevenueWorkspace";
import CashInPage from "./components/dashboard/CashInPage";
import CashOutPage from "./components/dashboard/CashOutPage";
import NetMarginPage from "./components/dashboard/NetMarginPage";
import AROutstandingPage from "./components/dashboard/AROutstandingPage";
import APOutstandingPage from "./components/dashboard/APOutstandingPage";
import { AlertsAndSignalsPage } from "./components/dashboard/AlertsAndSignalsPage";
import Reminders from "./components/Reminders";
import ActionQueuePage from "./components/dashboard/ActionQueuePage";
import { Toaster } from "sonner";
import { Menu } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    console.log("Logging out...");
  };

  const renderContent = () => {
    switch (activeTab) {
      case "home":
        return (
          <Dashboard
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={handleLogout}
          />
        );

      case "revenue":
        return <RevenueWorkspace />;

      case "customers":
        return <CustomerWorkspace />;

      case "action-queue":
        return <ActionQueuePage setActiveTab={setActiveTab} />;

      case "cash-in":
        return <CashInPage onBack={() => setActiveTab("home")} />;

      case "automations":
        return <Reminders />;

      case "cash-out":
        return <CashOutPage onBack={() => setActiveTab("home")} />;

      case "net-margin":
        return <NetMarginPage onBack={() => setActiveTab("home")} />;

      case "ar-outstanding":
        return <AROutstandingPage onBack={() => setActiveTab("home")} />;

      case "alerts-signals":
        return <AlertsAndSignalsPage onBack={() => setActiveTab("home")} />;

      case "ap-outstanding":
        return <APOutstandingPage onBack={() => setActiveTab("home")} />;

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
    <div className="flex h-screen bg-muted/30 overflow-hidden">
      {/* ================= SIDEBAR ================= */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* ================= MAIN AREA ================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="h-14 shrink-0 border-b bg-background flex items-center px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-muted transition"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

 
        {/* Page Container */}
        <div className="flex-1 overflow-hidden">
          <div className="h-full overflow-y-auto">
            <div className="w-full px-1 py-8">{renderContent()}</div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
