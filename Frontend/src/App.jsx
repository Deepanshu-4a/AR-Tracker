import { useEffect, useState } from "react";
import {
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { Sidebar } from "./components/ui/Sidebar";
import { CustomerWorkspace } from "./components/customers/CustomerWorkspace";
import { VendorWorkspace } from "./components/vendors/VendorWorkspace";
import { RevenueWorkspace } from "./components/RevenueWorkspace";

import Dashboard from "./components/dashboard/Dashboard";

import CashInPage from "./components/dashboard/CashInPage";
import CashOutPage from "./components/dashboard/CashOutPage";
import NetMarginPage from "./components/dashboard/NetMarginPage";
import AROutstandingPage from "./components/dashboard/AROutstandingPage";
import APOutstandingPage from "./components/dashboard/APOutstandingPage";
import { AlertsAndSignalsPage } from "./components/dashboard/AlertsAndSignalsPage";
import ActionQueuePage from "./components/dashboard/ActionQueuePage";

import Reminders from "./components/Reminders";
import { Toaster } from "sonner";
import { Menu } from "lucide-react";



function routeToTab(pathname) {
  if (pathname === "/" || pathname.startsWith("/home")) return "home";
  if (pathname.startsWith("/revenue")) return "revenue";
  if (pathname.startsWith("/spend")) return "spend";
  if (pathname.startsWith("/margin")) return "margin";
  if (pathname.startsWith("/customers")) return "customers";
  if (pathname.startsWith("/vendors")) return "vendors";
  if (pathname.startsWith("/insights")) return "insights";
  if (pathname.startsWith("/automations")) return "automations";
  if (pathname.startsWith("/integrations")) return "integrations";
  if (pathname.startsWith("/admin")) return "admin";
  return "home";
}

function tabToRoute(tab) {
  switch (tab) {
    case "home":
      return "/home";
    case "revenue":
      return "/revenue";
    case "spend":
      return "/spend";
    case "margin":
      return "/margin";
    case "customers":
      return "/customers";
    case "vendors":
      return "/vendors";
    case "insights":
      return "/insights";
    case "automations":
      return "/automations";
    case "integrations":
      return "/integrations";
    case "admin":
      return "/admin";
    default:
      return "/home";
  }
}

/* -----------------------------
   Placeholder pages
------------------------------ */

function PlaceholderPage({ title }) {
  return (
    <div className="px-8">
      <div className="rounded-2xl border border-border/60 bg-card p-8 shadow-sm">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This page is not wired yet.
        </p>
      </div>
    </div>
  );
}

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

 
  const activeTab = routeToTab(location.pathname);

 
  const setActiveTab = (tabId) => navigate(tabToRoute(tabId));

  const handleLogout = () => {
    console.log("Logging out...");
  };

  
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

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
            <div className="w-full px-1 py-8">
              <Routes>
                {/* default */}
                <Route path="/" element={<Navigate to="/home" replace />} />

              
                <Route
                  path="/home"
                  element={<Dashboard onLogout={handleLogout} />}
                >
                  
                  <Route path="cash-in" element={<CashInPage />} />
                  <Route path="cash-out" element={<CashOutPage />} />
                  <Route path="net-margin" element={<NetMarginPage />} />
                  <Route
                    path="ar-outstanding"
                    element={<AROutstandingPage />}
                  />
                  <Route
                    path="ap-outstanding"
                    element={<APOutstandingPage />}
                  />
                  <Route
                    path="alerts-signals"
                    element={<AlertsAndSignalsPage />}
                  />
                  <Route path="action-queue" element={<ActionQueuePage />} />
                </Route>

                {/* Main tabs */}
                <Route path="/revenue" element={<RevenueWorkspace />} />
                <Route path="/customers" element={<CustomerWorkspace />} />
                <Route path="/vendors/*" element={<VendorWorkspace />} />
                <Route path="/automations" element={<Reminders />} />

               
                <Route
                  path="/spend"
                  element={<PlaceholderPage title="Spend" />}
                />
                <Route
                  path="/margin"
                  element={<PlaceholderPage title="Margin" />}
                />
                <Route
                  path="/insights"
                  element={<PlaceholderPage title="Insights" />}
                />
                <Route
                  path="/integrations"
                  element={<PlaceholderPage title="Integrations" />}
                />
                <Route
                  path="/admin"
                  element={<PlaceholderPage title="Admin" />}
                />

                {/* fallback */}
                <Route path="*" element={<Navigate to="/home" replace />} />
              </Routes>
            </div>
          </div>
        </div>
      </div>

      <Toaster />
    </div>
  );
}

export default App;
