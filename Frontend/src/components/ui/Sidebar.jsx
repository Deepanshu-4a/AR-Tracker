import {
  DashboardSquare01Icon as LayoutDashboard,
  UserGroupIcon as Users,
  Invoice01Icon as Receipt,
  Settings01Icon as Settings,
  Logout01Icon as LogOut,
  TradeUpIcon as TrendingUp,
} from "hugeicons-react";
 
import Frame771012_63_612 from "../../imports/one";
 
export function Sidebar({ activeTab, setActiveTab, onLogout }) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clients", label: "Clients", icon: Users },
    { id: "invoices", label: "Invoices", icon: Receipt },
    { id: "reminders", label: "Reminders", icon: TrendingUp },
  ];
 
  return (
    <div className="w-64 bg-white border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-[40px] h-[40px]">
            <Frame771012_63_612 />
          </div>
          <div>
            <h2 className="font-semibold">AR TRACKER</h2>
            <p className="text-sm text-muted-foreground">Administrator</p>
            
          </div>
        </div>
      </div>
 
     <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-orange-50 text-orange-600 border border-orange-200'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-sm">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>'
 
      {/* Footer */}
      <div className="p-4 border-t border-border">
        <button
          onClick={() => setActiveTab("settings")}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
            activeTab === "settings"
              ? "bg-orange-50 text-orange-600 border border-orange-200"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>
 
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors mt-1"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Log Out</span>
        </button>
      </div>
    </div>
  );
}
 
 