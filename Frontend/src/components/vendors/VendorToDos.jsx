import { useMemo, useState } from "react";
import { cn } from "../ui/utils";

/* ─── MOCK DATA  ───────────────────────── */
const mockVendorToDos = [
  {
    done: false,
    priority: "High",
    date: "2026-03-01",
    type: "Compliance",
    details:
      "Collect updated W-9 from Alpha Supplies (request latest EIN and address confirmation as well).",
  },
  {
    done: false,
    priority: "Medium",
    date: "2026-03-05",
    type: "Billing",
    details:
      "Confirm invoice remittance details and verify ACH details with Bright Logistics before processing.",
  },
  {
    done: true,
    priority: "Low",
    date: "2026-02-20",
    type: "Onboarding",
    details:
      "Add CloudParts Inc. to approved vendor list and share onboarding packet with procurement.",
  },
];

function makeId() {
  return `vdtd_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeIncoming(rows) {
  return (rows || []).map((r) => ({
    id: r.id ?? makeId(),
    done: Boolean(r.done),
    priority: r.priority ?? "Medium",
    date: r.date ?? "—",
    type: r.type ?? "Task",
    details: r.details ?? "—",
  }));
}

export function VendorToDos({ todos: propToDos }) {
  const baseRows = useMemo(() => {
    const src = propToDos?.length ? propToDos : mockVendorToDos;
    return normalizeIncoming(src);
  }, [propToDos]);

  
  const [rows, setRows] = useState(baseRows);

 
  useMemo(() => {
    setRows(baseRows);
  }, [baseRows]);

  const [showAdd, setShowAdd] = useState(false);

 
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  function toggleExpanded(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const [newTodo, setNewTodo] = useState({
    done: false,
    priority: "Medium",
    date: "",
    type: "Task",
    details: "",
  });

 
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // all | open | done
  const [dateFilter, setDateFilter] = useState("all"); // all | overdue | today | next7

  const typeOptions = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => {
      const t = String(r.type ?? "").trim();
      if (t) set.add(t);
    });
    if (!set.size) set.add("Task");
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

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
      const tp = String(r.type ?? "Task").toLowerCase();
      const isDone = Boolean(r.done);

      const typeOk = typeFilter === "all" || tp === typeFilter;

      const statusOk =
        statusFilter === "all" ||
        (statusFilter === "done" && isDone) ||
        (statusFilter === "open" && !isDone);

      let dateOk = true;
      if (dateFilter !== "all") {
        const d = r.date && r.date !== "—" ? new Date(r.date) : null;
        if (!d || Number.isNaN(d.getTime())) dateOk = false;
        else {
          const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          if (dateFilter === "overdue") dateOk = d0 < startOfDay;
          if (dateFilter === "today")
            dateOk = d0.getTime() === startOfDay.getTime();
          if (dateFilter === "next7") dateOk = d0 >= startOfDay && d0 <= next7;
        }
      }

      return typeOk && statusOk && dateOk;
    });
  }, [rows, typeFilter, statusFilter, dateFilter]);

  function handleAddTodo() {
    const details = String(newTodo.details || "").trim();
    if (!details) return;

    const row = {
      id: makeId(),
      done: Boolean(newTodo.done),
      priority: newTodo.priority || "Medium",
      date: String(newTodo.date || "").trim() || "—",
      type: String(newTodo.type || "Task").trim() || "Task",
      details,
    };

    setRows((prev) => [row, ...prev]);

    setNewTodo({
      done: false,
      priority: "Medium",
      date: "",
      type: "Task",
      details: "",
    });
    setShowAdd(false);
  }

  function toggleDoneById(id) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    );
  }

  return (
    <div className="flex flex-col h-full min-w-0 space-y-4">
      {/* ================= FILTER BAR ================= */}
      <div className="flex flex-wrap items-center gap-6 border-b border-border pb-4 text-sm">
        <Filter label="Type">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="border border-border rounded-md px-2 py-1 bg-background text-sm"
          >
            <option value="all">All</option>
            {typeOptions.map((t) => (
              <option key={t} value={t.toLowerCase()}>
                {t}
              </option>
            ))}
          </select>
        </Filter>

        <Filter label="Status">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-border rounded-md px-2 py-1 bg-background text-sm"
          >
            <option value="all">All</option>
            <option value="open">Open</option>
            <option value="done">Done</option>
          </select>
        </Filter>

        <Filter label="Date">
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
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
            setTypeFilter("all");
            setStatusFilter("all");
            setDateFilter("all");
          }}
        >
          Clear
        </button>

        <button
          className="ml-auto border border-border rounded-md px-3 py-1 bg-background text-sm"
          onClick={() => setShowAdd((v) => !v)}
        >
          + Add
        </button>
      </div>

      {/*  */}
      {showAdd && (
        <div className="border border-border rounded-2xl p-4 bg-background">
          {/* Row 1 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
            <div className="md:col-span-3">
              <label className="block text-xs uppercase text-muted-foreground mb-1">
                Done
              </label>
              <div className="h-10 flex items-center gap-2 border border-border rounded-xl px-3 bg-background">
                <input
                  type="checkbox"
                  checked={newTodo.done}
                  onChange={(e) =>
                    setNewTodo((p) => ({ ...p, done: e.target.checked }))
                  }
                  className="h-4 w-4 accent-emerald-600"
                />
                <span className="text-sm text-muted-foreground">Mark done</span>
              </div>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs uppercase text-muted-foreground mb-1">
                Priority
              </label>
              <select
                value={newTodo.priority}
                onChange={(e) =>
                  setNewTodo((p) => ({ ...p, priority: e.target.value }))
                }
                className="w-full h-10 border border-border rounded-xl px-3 bg-background text-sm"
              >
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs uppercase text-muted-foreground mb-1">
                Date
              </label>
              <input
                type="date"
                value={newTodo.date}
                onChange={(e) =>
                  setNewTodo((p) => ({ ...p, date: e.target.value }))
                }
                className="w-full h-10 border border-border rounded-xl px-3 bg-background"
              />
            </div>

            <div className="md:col-span-3">
              <label className="block text-xs uppercase text-muted-foreground mb-1">
                Type
              </label>
              <input
                value={newTodo.type}
                onChange={(e) =>
                  setNewTodo((p) => ({ ...p, type: e.target.value }))
                }
                className="w-full h-10 border border-border rounded-xl px-3 bg-background"
                placeholder="Task"
              />
            </div>
          </div>

          {/* Row 2: DETAILS */}
          <div className="mt-3">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Details
            </label>
            <input
              value={newTodo.details}
              onChange={(e) =>
                setNewTodo((p) => ({ ...p, details: e.target.value }))
              }
              className="w-full h-10 border border-border rounded-xl px-3 bg-background"
              placeholder="e.g., Collect updated W-9"
            />
          </div>

          {/* Actions */}
          <div className="mt-4 flex items-center gap-2">
            <button
              className="border border-border rounded-xl px-4 py-2 bg-background text-sm"
              onClick={handleAddTodo}
            >
              Add
            </button>
            <button
              className="border border-border rounded-xl px-4 py-2 bg-background text-sm"
              onClick={() => {
                setShowAdd(false);
                setNewTodo({
                  done: false,
                  priority: "Medium",
                  date: "",
                  type: "Task",
                  details: "",
                });
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <Th className="w-[10%]">Done</Th>
              <Th className="w-[16%]">Priority</Th>
              <Th className="w-[16%]">Date</Th>
              <Th className="w-[18%]">Type</Th>
              <Th className="w-[40%]">Details</Th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t, i) => {
              const isExpanded = expandedIds.has(t.id);

              return (
                <tr
                  key={t.id ?? `${t.details}-${t.date}-${i}`}
                  className={cn(
                    "border-t hover:bg-muted/30 transition-colors",
                    i % 2 === 0 ? "bg-white" : "bg-muted/10",
                  )}
                >
                  {/* DONE (toggle done/undone) */}
                  <Td>
                    <input
                      type="checkbox"
                      checked={Boolean(t.done)}
                      onChange={() => toggleDoneById(t.id)}
                      className="h-4 w-4 accent-emerald-600"
                      title={t.done ? "Mark as not done" : "Mark as done"}
                    />
                  </Td>

                  {/* PRIORITY */}
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

                  {/* DATE */}
                  <Td className="text-slate-700 whitespace-nowrap">
                    {t.date ?? "—"}
                  </Td>

                  {/* TYPE */}
                  <Td className="text-slate-700 truncate">{t.type ?? "Task"}</Td>

                  {/* DETAILS */}
                  <td className="px-3 py-2 align-top">
                    <div className="flex flex-col gap-1">
                      <div
                        className={cn(
                          "text-slate-700 font-medium break-words whitespace-normal",
                          !isExpanded && "line-clamp-2",
                        )}
                      >
                        {t.details ?? "—"}
                      </div>

                      {String(t.details || "").length > 80 && (
                        <button
                          className="text-xs text-muted-foreground hover:text-foreground w-fit"
                          onClick={() => toggleExpanded(t.id)}
                          type="button"
                        >
                          {isExpanded ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

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
    <td className={cn("px-3 py-2 whitespace-nowrap", className)}>{children}</td>
  );
}