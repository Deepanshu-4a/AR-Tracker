// ==============================
// CustomerToDos.jsx (UPDATED)
// ✅ Uses SAME table styling as CustomerTransactions (Tailwind classes + Th/Td helpers)
// ✅ Keeps filter bar (as you already had)
// ✅ No slider, no pagination, no horizontal scrollbar
// ==============================
import { useMemo, useState } from "react";
import { cn } from "../ui/utils";

/* ─── MOCK DATA ─────────────────────────────────────── */
const mockToDos = [
  {
    todo: "Send invoice follow-up email",
    owner: "Ava Thompson",
    dueDate: "2026-02-28",
    priority: "High",
    status: "Open",
  },
  {
    todo: "Confirm PO number",
    owner: "Noah Patel",
    dueDate: "2026-02-26",
    priority: "Medium",
    status: "In Progress",
  },
  {
    todo: "Update billing address",
    owner: "Mia Chen",
    dueDate: "2026-03-03",
    priority: "Low",
    status: "Open",
  },
  {
    todo: "Resolve payment failure",
    owner: "Ethan Brooks",
    dueDate: "2026-02-25",
    priority: "High",
    status: "Done",
  },
];

export function CustomerToDos({ todos: propToDos }) {
  const rows = useMemo(() => {
    if (propToDos?.length) return propToDos;
    return mockToDos;
  }, [propToDos]);

  // -----------------------------
  // Filters
  // -----------------------------
  const [statusFilter, setStatusFilter] = useState("all"); // all | open | in progress | done
  const [priorityFilter, setPriorityFilter] = useState("all"); // all | high | medium | low
  const [dueFilter, setDueFilter] = useState("all"); // all | overdue | today | next7

  const filtered = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
    const next7 = new Date(startOfDay);
    next7.setDate(next7.getDate() + 7);

    return rows.filter((r) => {
      const st = String(r.status ?? "").toLowerCase();
      const pr = String(r.priority ?? "").toLowerCase();

      const statusOk = statusFilter === "all" || st === statusFilter;
      const priorityOk = priorityFilter === "all" || pr === priorityFilter;

      let dueOk = true;
      if (dueFilter !== "all") {
        const d = r.dueDate ? new Date(r.dueDate) : null;
        if (!d || Number.isNaN(d.getTime())) dueOk = false;
        else {
          const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          if (dueFilter === "overdue") dueOk = d0 < startOfDay;
          if (dueFilter === "today")
            dueOk = d0.getTime() === startOfDay.getTime();
          if (dueFilter === "next7") dueOk = d0 >= startOfDay && d0 <= next7;
        }
      }

      return statusOk && priorityOk && dueOk;
    });
  }, [rows, statusFilter, priorityFilter, dueFilter]);

  return (
    <div className="flex flex-col h-full min-w-0 space-y-4">
      {/* ================= FILTER BAR (same vibe as Transactions) ================= */}
      <div className="flex flex-wrap items-center gap-6 border-b border-border pb-4 text-sm">
        <Filter label="Status">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-border rounded-md px-2 py-1 bg-background text-sm"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="in progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </Filter>

        <Filter label="Priority">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="border border-border rounded-md px-2 py-1 bg-background text-sm"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </Filter>

        <Filter label="Due">
          <select
            value={dueFilter}
            onChange={(e) => setDueFilter(e.target.value)}
            className="border border-border rounded-md px-2 py-1 bg-background text-sm"
          >
            <option value="all">All</option>
            <option value="overdue">Overdue</option>
            <option value="today">Today</option>
            <option value="next7">Next 7 days</option>
          </select>
        </Filter>

        <button
          className="border border-border rounded-md px-3 py-1 bg-background text-sm"
          onClick={() => {
            setStatusFilter("all");
            setPriorityFilter("all");
            setDueFilter("all");
          }}
        >
          Clear
        </button>
      </div>

      {/* ================= TABLE (same as Transactions) ================= */}
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <Th className="w-[44%]">To Do</Th>
              <Th className="w-[18%]">Owner</Th>
              <Th className="w-[14%]">Due Date</Th>
              <Th className="w-[12%]">Priority</Th>
              <Th className="w-[12%]">Status</Th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t, i) => (
              <tr
                key={`${t.todo}-${i}`}
                className={cn(
                  "border-t hover:bg-muted/30 transition-colors",
                  i % 2 === 0 ? "bg-white" : "bg-muted/10",
                )}
              >
                <Td className="font-medium text-slate-700 truncate">
                  {t.todo ?? "—"}
                </Td>

                <Td className="text-slate-700 truncate">{t.owner ?? "—"}</Td>

                <Td className="text-slate-700 whitespace-nowrap">
                  {t.dueDate ?? "—"}
                </Td>

                <Td>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      String(t.priority).toLowerCase() === "high" &&
                        "bg-red-100 text-red-700",
                      String(t.priority).toLowerCase() === "medium" &&
                        "bg-yellow-100 text-yellow-700",
                      String(t.priority).toLowerCase() === "low" &&
                        "bg-slate-100 text-slate-700",
                    )}
                  >
                    {t.priority ?? "—"}
                  </span>
                </Td>

                <Td>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      String(t.status).toLowerCase() === "open" &&
                        "bg-blue-100 text-blue-700",
                      String(t.status).toLowerCase() === "in progress" &&
                        "bg-orange-100 text-orange-700",
                      String(t.status).toLowerCase() === "done" &&
                        "bg-emerald-100 text-emerald-700",
                    )}
                  >
                    {t.status ?? "—"}
                  </span>
                </Td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr className="border-t">
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-sm text-muted-foreground"
                >
                  No To-Dos found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= SMALL COMPONENTS (same as Transactions) ================= */

function Filter({ label, children }) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-muted-foreground text-xs uppercase">{label}</span>
      {children}
    </div>
  );
}

function Th({ children, className }) {
  return (
    <th
      className={cn(
        "px-3 py-2 text-left font-medium whitespace-nowrap",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, className }) {
  return (
    <td className={cn("px-3 py-2 whitespace-nowrap", className)}>
      {children}
    </td>
  );
}