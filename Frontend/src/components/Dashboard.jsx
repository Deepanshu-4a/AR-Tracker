import {
  FileText,
  Clock,
  AlertTriangle,
  ArrowUp,
  ArrowDown,
} from "lucide-react";

export function Dashboard() {
  const kpiData = [
    {
      label: "Total AR",
      value: "$18.5M",
      change: "+5.2%",
      trend: "up",
      icon: FileText, // replaced Invoice01Icon
      bgColor: "bg-blue-100",
      color: "text-blue-600",
    },
    {
      label: "Current (0-30)",
      value: "$13.9M",
      change: "+2.1%",
      trend: "up",
      icon: FileText, // you can pick another icon here
      bgColor: "bg-green-100",
      color: "text-green-600",
    },
    {
      label: "Overdue (30+)",
      value: "$4.7M",
      change: "-8.3%",
      trend: "down",
      icon: Clock, // replaced Clock
      bgColor: "bg-yellow-100",
      color: "text-yellow-600",
    },
    {
      label: "At Risk",
      value: "$960K",
      change: "+12.4%",
      trend: "up",
      icon: AlertTriangle, // replaced AlertTriangle
      bgColor: "bg-red-100",
      color: "text-red-600",
    },
  ];

  return (
    <div className="min-h-screen w-full">
      <div className="space-y-6 p-4 md:p-6 lg:p-8 bg-linear-to-b from-muted/30 via-background to-background">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Dashboard
              </h1>
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Welcome Back! Here's What's Happening today
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiData.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="bg-white border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-semibold mt-2">{stat.value}</p>
                    <div className="flex items-center gap-2 mt-2">
                      {stat.trend === "up" ? (
                        <ArrowUp className="w-4 h-4 text-green-500" />
                      ) : (
                        <ArrowDown className="w-4 h-4 text-red-500" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          stat.trend === "up"
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`${stat.bgColor} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
