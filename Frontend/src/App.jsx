import { useState } from "react"
import { Sidebar } from "./components/ui/Sidebar"
 
function App() {
  const [activeTab, setActiveTab] = useState("dashboard")
 
  const handleLogout = () => {
    console.log("Logging out...")
  }
 
  return (
    <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout}>
     
     <h1 className="bg-amber-50">AR Tracking APP</h1>
    </Sidebar>
  )
}
 
export default App
 