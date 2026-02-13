import {
  Home01Icon as Home,
  Coins01Icon as Revenue,
  Wallet02Icon as Spend,
  TradeUpIcon as Margin,
  UserGroupIcon as Customers,
  Building01Icon as Vendors,
  Analytics01Icon as Insights,
  ZapIcon as Automations,
  Plug02Icon as Integrations,
  Settings01Icon as Settings,
  Logout01Icon as LogOut,
} from "hugeicons-react";

import { Menu, ChevronLeft } from "lucide-react";
import Frame771012_63_612 from "../../imports/one";

export function Sidebar({
  activeTab,
  setActiveTab,
  onLogout,
  sidebarOpen,
  setSidebarOpen,
  collapsed,
  setCollapsed,
}) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "revenue", label: "Revenue", icon: Revenue },
    { id: "spend", label: "Spend", icon: Spend },
    { id: "margin", label: "Margin", icon: Margin },
    { id: "customers", label: "Customers", icon: Customers },
    { id: "vendors", label: "Vendors", icon: Vendors },
    { id: "insights", label: "Insights", icon: Insights },
    { id: "automations", label: "Automations", icon: Automations },
    { id: "integrations", label: "Integrations", icon: Integrations },
    { id: "admin", label: "Admin", icon: Settings },
  ];

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <button
        key={item.id}
        onClick={() => setActiveTab(item.id)}
        className={`group w-full flex items-center ${
          collapsed ? "justify-center px-0" : "gap-3 px-4"
        } py-2 rounded-lg transition-all
        ${
          isActive
            ? "bg-orange-50 text-orange-600"
            : "text-slate-600 hover:bg-slate-100"
        }`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        {!collapsed && (
          <span className="text-sm font-medium">{item.label}</span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-50 h-full bg-white border-r 
        transition-all duration-300 ease-in-out flex flex-col
        ${
          sidebarOpen
            ? collapsed
              ? "w-20"
              : "w-64"
            : "w-0 -translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header */}
        <div
          className={`h-16 flex items-center ${
            collapsed ? "justify-center" : "justify-between px-5"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center shrink-0">
                <Frame771012_63_612 />
              </div>

              <div className="leading-tight">
                <h2 className="text-sm font-semibold tracking-tight whitespace-nowrap">
                  SpendIQ
                </h2>
                <p className="text-[11px] text-muted-foreground whitespace-nowrap">
                  AR TRACKER
                </p>
              </div>
            </div>
          )}

          {/* Collapse / Expand Button */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex text-slate-500 hover:text-black transition-colors"
          >
            {collapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 ${
            collapsed ? "px-2" : "px-3"
          } py-6 space-y-1 overflow-y-auto`}
        >
          {navItems.map(renderItem)}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t">
          <button
            onClick={onLogout}
            className={`w-full flex items-center ${
              collapsed ? "justify-center px-0" : "gap-3 px-3"
            } py-2 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors`}
          >
            <LogOut className="w-5 h-5" />
            {!collapsed && <span className="text-sm">Log out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
