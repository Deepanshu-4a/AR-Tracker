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

import Frame771012_63_612 from "../../imports/one";

export function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const primaryNav = [
    { id: "home", label: "Home", icon: Home },
    { id: "revenue", label: "Revenue", icon: Revenue },
    { id: "spend", label: "Spend", icon: Spend },
    { id: "margin", label: "Margin", icon: Margin },
    { id: "customers", label: "Customers", icon: Customers },
    { id: "vendors", label: "Vendors", icon: Vendors },
    { id: "insights", label: "Insights", icon: Insights },
    { id: "automations", label: "Automations", icon: Automations },
  ];

  const systemNav = [
    { id: "integrations", label: "Integrations", icon: Integrations },
    { id: "admin", label: "Admin", icon: Settings },
  ];

  const renderItem = (item) => {
    const Icon = item.icon;
    const isActive = activeTab === item.id;

    return (
      <li key={item.id}>
        <button
          onClick={() => setActiveTab(item.id)}
          className={`group w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all
            ${
              isActive
                ? "bg-orange-50 text-orange-600 border border-orange-200"
                : "text-slate-600 hover:bg-slate-50"
            }`}
        >
          <Icon className="w-5 h-5" />
          <span className="text-sm font-medium">{item.label}</span>
        </button>
      </li>
    );
  };

  return (
    <div className="w-64 bg-white border-r border-border flex flex-col">
      {/* Brand Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10">
            <Frame771012_63_612 />
          </div>
          <div>
            <h2 className="font-semibold tracking-tight">SpendIQ</h2>
            <p className="text-xs text-muted-foreground">
              Financial Control Tower
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto">
        <ul className="space-y-1">{primaryNav.map(renderItem)}</ul>

        <div className="mt-6 pt-4 border-t border-border">
          <ul className="space-y-1">{systemNav.map(renderItem)}</ul>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Log out</span>
        </button>
      </div>
    </div>
  );
}
