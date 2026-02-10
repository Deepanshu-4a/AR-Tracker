import { useState } from "react";

import {
  Bell,
  Clock,
  CheckCircle2 as CheckCircle,
  X as XCircle,
  AlertCircle,
  Calendar,
  Send,
  Mail,
  MessageSquare,
  Phone,
  TrendingUp,
  Filter,
  Search,
  Sparkles,
} from "lucide-react";

import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";

import { ConfigureRulesSheet } from "../components/ConfigureRulesSheet";
export function Reminders() {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeView, setActiveView] = useState("action");
  const [calendarView, setCalendarView] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [rulesOpen, setRulesOpen] = useState(false);
  // Mock data
  const actionRequiredReminders = [
    {
      id: "1",
      invoiceNumber: "INV-2024-1234",
      clientName: "Acme Corp",
      amount: 250000,
      dueDate: "2024-01-15",
      scheduledDate: "2024-01-22",
      status: "failed",
      channel: "email",
      attemptCount: 2,
      lastAttempt: "2024-02-01",
    },
    {
      id: "2",
      invoiceNumber: "INV-2024-1156",
      clientName: "Tech Solutions Ltd",
      amount: 180000,
      dueDate: "2024-01-10",
      scheduledDate: "2024-02-03",
      status: "not_sent",
      channel: "email",
      attemptCount: 0,
    },
  ];

  const upcomingReminders = [
    {
      id: "3",
      invoiceNumber: "INV-2024-1289",
      clientName: "Global Enterprises",
      amount: 450000,
      dueDate: "2024-02-10",
      scheduledDate: "2024-02-04",
      status: "scheduled",
      channel: "email",
      attemptCount: 1,
      nextAttempt: "2024-02-04",
    },
    {
      id: "4",
      invoiceNumber: "INV-2024-1301",
      clientName: "Retail Hub Inc",
      amount: 320000,
      dueDate: "2024-02-12",
      scheduledDate: "2024-02-05",
      status: "scheduled",
      channel: "sms",
      attemptCount: 0,
      nextAttempt: "2024-02-05",
    },
  ];

  const reminderHistory = [
    {
      id: "5",
      invoiceNumber: "INV-2024-1098",
      clientName: "Manufacturing Co",
      amount: 560000,
      dueDate: "2024-01-20",
      scheduledDate: "2024-01-27",
      status: "sent",
      channel: "email",
      attemptCount: 1,
      lastAttempt: "2024-01-27",
      responseReceived: true,
    },
    {
      id: "6",
      invoiceNumber: "INV-2024-1045",
      clientName: "Services Group",
      amount: 275000,
      dueDate: "2024-01-18",
      scheduledDate: "2024-01-25",
      status: "sent",
      channel: "email",
      attemptCount: 2,
      lastAttempt: "2024-01-30",
      responseReceived: false,
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "sent":
        return "bg-green-100 text-green-800 border-green-200";
      case "failed":
        return "bg-red-100 text-red-800 border-red-200";
      case "not_sent":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getChannelIcon = (channel) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "whatsapp":
        return <MessageSquare className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
    }
  };

  const filterReminders = (reminders) => {
    if (!searchQuery.trim()) return reminders;
    const query = searchQuery.toLowerCase();
    return reminders.filter(
      (reminder) =>
        reminder.invoiceNumber.toLowerCase().includes(query) ||
        reminder.clientName.toLowerCase().includes(query)
    );
  };

  const exportToCSV = () => {
    const data = filterReminders(reminderHistory);
    if (data.length === 0) {
      alert("No data to export");
      return;
    }

    const headers = [
      "Invoice Number",
      "Client Name",
      "Amount",
      "Due Date",
      "Status",
      "Channel",
      "Attempt Count",
      "Last Attempt",
      "Response Received",
    ];

    const rows = data.map((reminder) => [
      reminder.invoiceNumber,
      reminder.clientName,
      `$${reminder.amount}`,
      formatDate(reminder.dueDate),
      reminder.status,
      reminder.channel,
      reminder.attemptCount,
      reminder.lastAttempt ? formatDate(reminder.lastAttempt) : "N/A",
      reminder.responseReceived ? "Yes" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reminders-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString;
      }
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getRemindersForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0];
    return upcomingReminders.filter((reminder) => 
      reminder.scheduledDate === dateStr
    );
  };

  const previousMonth = () => {
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1)
    );
  };

  const nextMonth = () => {
    setCalendarDate(
      new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1)
    );
  };

  const CalendarView = () => {
    const daysInMonth = getDaysInMonth(calendarDate);
    const firstDay = getFirstDayOfMonth(calendarDate);
    const days = [];
    const monthName = calendarDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }

    const dayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold">{monthName}</h2>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={previousMonth}
              className="rounded-xl"
            >
              ← Previous
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setCalendarDate(new Date())}
              className="rounded-xl"
            >
              Today
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={nextMonth}
              className="rounded-xl"
            >
              Next →
            </Button>
          </div>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {dayLabels.map((label) => (
            <div key={label} className="text-center font-semibold text-sm p-2">
              {label}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="aspect-square" />;
            }

            const dateOfDay = new Date(
              calendarDate.getFullYear(),
              calendarDate.getMonth(),
              day
            );
            const remindersOnDay = getRemindersForDate(dateOfDay);
            const isToday =
              dateOfDay.toDateString() === new Date().toDateString();

            return (
              <Card
                key={day}
                className={`aspect-square rounded-xl p-2 flex flex-col cursor-pointer transition-all hover:shadow-md ${
                  isToday ? "border-2 border-primary bg-primary/5" : ""
                }`}
              >
                <div className="font-semibold text-sm mb-1">{day}</div>
                <div className="flex-1 space-y-1 overflow-y-auto">
                  {remindersOnDay.map((reminder) => (
                    <div
                      key={reminder.id}
                      className="text-xs bg-red-100 text-red-800 px-1.5 py-0.5 rounded-full truncate"
                    >
                      {reminder.invoiceNumber}
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const ReminderCard = ({ reminder }) => (
    <Card className="rounded-2xl border bg-background hover:bg-muted/40 transition-all hover:shadow-md">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-base">{reminder.clientName}</h4>
              <Badge
                variant="outline"
                className={`${getStatusColor(reminder.status)} rounded-full text-xs`}
              >
                {reminder.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-mono">
              {reminder.invoiceNumber}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-lg">
              ${(reminder.amount / 1000).toFixed(2)}K
            </p>
            <p className="text-xs text-muted-foreground">
              Due: {formatDate(reminder.dueDate)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {getChannelIcon(reminder.channel)}
              <span className="capitalize text-xs">{reminder.channel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span className="text-xs">Attempt {reminder.attemptCount}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {reminder.status === "failed" && (
              <Button size="sm" variant="outline" className="rounded-xl">
                <Send className="h-3 w-3 mr-1.5" />
                Retry
              </Button>
            )}
            {reminder.status === "not_sent" && (
              <Button size="sm" className="rounded-xl">
                <Send className="h-3 w-3 mr-1.5" />
                Send Reminder
              </Button>
            )}
            {reminder.status === "scheduled" && (
              <Button size="sm" variant="outline" className="rounded-xl">
                Edit
              </Button>
            )}
            {reminder.status === "sent" && reminder.responseReceived && (
              <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 rounded-full">
                <CheckCircle className="h-3 w-3 mr-1" />
                Response
              </Badge>
            )}
          </div>
        </div>
        {(reminder.lastAttempt || reminder.nextAttempt) && (
          <div className="mt-3 pt-3 border-t text-xs text-muted-foreground">
            {reminder.lastAttempt && (
              <span>Last sent: {formatDate(reminder.lastAttempt)}</span>
            )}
            {reminder.nextAttempt && (
              <span>Next: {formatDate(reminder.nextAttempt)}</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Modern background + spacing */}
      <div className="space-y-6 p-4 md:p-6 lg:p-8 bg-gradient-to-b from-muted/30 via-background to-background">
        {/* Header */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
                Reminders
              </h1>
             
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and track payment reminders across all channels
            </p>
          </div>
        </div>
      </div>
      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="rounded-2xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Action Required
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500/15 to-red-500/5 border border-red-500/10 flex items-center justify-center">
              <AlertCircle className="h-5 w-5 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">12</div>
            <p className="text-xs text-muted-foreground mt-1">
              Failed sends or reminders not yet sent
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Scheduled Today
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500/15 to-blue-500/5 border border-blue-500/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">28</div>
            <p className="text-xs text-muted-foreground mt-1">
              Reminders going out today
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Sent This Week
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/10 flex items-center justify-center">
              <Send className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">156</div>
            <p className="text-xs text-muted-foreground mt-1">
              Across all channels
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/50 shadow-sm hover:shadow-md transition-all">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Response Rate
            </CardTitle>
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-emerald-500/5 border border-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold tracking-tight">68%</div>
            <p className="text-xs text-muted-foreground mt-1">
              +12% from last week
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Search and Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by invoice, client..."
            className="pl-9 rounded-xl"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" className="rounded-xl">
          <Filter className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex gap-2 border-b">
        <Button
          variant={activeView === "action" ? "default" : "ghost"}
          onClick={() => setActiveView("action")}
          className="rounded-b-none rounded-t-xl"
        >
          <AlertCircle className="h-4 w-4 mr-2" />
          Action Required ({actionRequiredReminders.length})
        </Button>
        <Button
          variant={activeView === "upcoming" ? "default" : "ghost"}
          onClick={() => setActiveView("upcoming")}
          className="rounded-b-none rounded-t-xl"
        >
          <Calendar className="h-4 w-4 mr-2" />
          Upcoming ({upcomingReminders.length})
        </Button>
        <Button
          variant={activeView === "history" ? "default" : "ghost"}
          onClick={() => setActiveView("history")}
          className="rounded-b-none rounded-t-xl"
        >
          <Clock className="h-4 w-4 mr-2" />
          History
        </Button>
      </div>
      {/* Content Based on Active View */}
      <div className="space-y-3">
        {activeView === "action" && (
          <>
            {filterReminders(actionRequiredReminders).length === 0 ? (
              <Card className="rounded-2xl border bg-background/60 backdrop-blur">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-green-500/15 to-green-500/5 border border-green-500/10 flex items-center justify-center mb-4">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-1">
                    {searchQuery ? "No results found" : "All Clear!"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {searchQuery
                      ? "No reminders match your search criteria"
                      : "No reminders require immediate attention"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-base md:text-lg">
                    Reminders Needing Attention
                  </h3>
                  <Button size="sm" className="rounded-xl">
                    <Send className="h-3 w-3 mr-1.5" />
                    Send All
                  </Button>
                </div>
                {filterReminders(actionRequiredReminders).map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </>
            )}
          </>
        )}

        {activeView === "upcoming" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base md:text-lg">
                Scheduled Reminders
              </h3>
              <Button
                size="sm"
                variant="outline"
                className="rounded-xl"
                onClick={() => setCalendarView(!calendarView)}
              >
                <Calendar className="h-3 w-3 mr-1.5" />
                {calendarView ? "List View" : "View Calendar"}
              </Button>
            </div>
            {calendarView ? (
              <CalendarView />
            ) : (
              <>
                {filterReminders(upcomingReminders).map((reminder) => (
                  <ReminderCard key={reminder.id} reminder={reminder} />
                ))}
              </>
            )}
          </>
        )}

        {activeView === "history" && (
          <>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base md:text-lg">
                Reminder History
              </h3>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-xl"
                  onClick={exportToCSV}
                >
                  Export
                </Button>
              </div>
            </div>
            {filterReminders(reminderHistory).map((reminder) => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
          </>
        )}
      </div>
      {/* Automation Summary Card */}
      <Card className="rounded-2xl bg-muted/50 border">
        <CardHeader>
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-primary/15 to-primary/5 border border-primary/10 flex items-center justify-center">
              <Bell className="h-4 w-4 text-primary" />
            </div>
            Default Reminder Rules
          </CardTitle>
          <CardDescription>
            Automatic reminder cadence applied to all overdue invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-background">
            <span className="text-muted-foreground">First reminder</span>
            <span className="font-medium">7 days after due date</span>
          </div>
          <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-background">
            <span className="text-muted-foreground">Follow-up cadence</span>
            <span className="font-medium">Every 7 days (max 3 attempts)</span>
          </div>
          <div className="flex items-center justify-between text-sm p-3 rounded-xl bg-background">
            <span className="text-muted-foreground">Escalation trigger</span>
            <span className="font-medium">After 21 days overdue</span>
          </div>
          <div className="flex items-center justify-between text-sm pt-2 p-3 rounded-xl bg-background border-t">
            <span className="text-muted-foreground">Status</span>
            <span className="font-medium text-green-600 flex items-center gap-1.5">
              <CheckCircle className="h-3.5 w-3.5" />
              Active
            </span>
          </div>
          <Button variant="outline" onClick={() => setRulesOpen(true)}>
  Configure Rules
</Button>
<ConfigureRulesSheet
  open={rulesOpen}
  onOpenChange={setRulesOpen}
/>
        </CardContent>
      </Card>
    </div>
  );
}

export default Reminders;