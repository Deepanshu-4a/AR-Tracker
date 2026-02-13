import { useState } from "react";
import { Sidebar } from "./components/ui/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ClientManagement } from "./components/ClientManagement";
import { RevenueWorkspace } from "./components/RevenueWorkspace";
import CashInPage from "./components/CashInPage";
import CashOutPage from "./components/CashOutPage";
import NetMarginPage from "./components/NetMarginPage";
import AROutstandingPage from "./components/AROutstandingPage";
import APOutstandingPage from "./components/APOutstandingPage";
import { AlertsAndSignalsPage } from "./components/AlertsAndSignalsPage";
import Reminders from "./components/Reminders";
import { Toaster } from "sonner";
import { Menu } from "lucide-react";

function App() {
  const [activeTab, setActiveTab] = useState("home");

  // 🧠 NEW STATES
  const [sidebarOpen, setSidebarOpen] = useState(true); // mobile
  const [collapsed, setCollapsed] = useState(false); // desktop icon mode

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
        return <ClientManagement />;

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
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar (Hamburger for mobile) */}
        <div className="h-14 border-b flex items-center px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">{renderContent()}</main>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
