import { useState } from "react";
import { Sidebar } from "./components/ui/Sidebar";
import { Dashboard } from "./components/Dashboard";
import { ClientManagement } from "./components/ClientManagement";
import { RevenueWorkspace } from "./components/RevenueWorkspace";
import { Toaster } from "sonner";

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

      default:
        return <Dashboard />;
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
