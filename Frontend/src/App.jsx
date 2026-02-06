import { useState } from "react"
import { Sidebar } from "./components/ui/Sidebar"
import { Dashboard } from "./components/Dashboard"
function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
 
  const handleLogout = () => {
    console.log("Logging out...")
  }
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard onNavigate={setActiveTab} />;
      case 'clients':
        // return <EmployeeManagement />;
      case 'invoices':
        // return <UserAssignment />;
      case 'analytics':
        // return <Analytics />;
      default:
        return <Dashboard />;
    }
  };
 
  return (  
    <div className="flex h-screen bg-background">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  )
}
 
export default App
 