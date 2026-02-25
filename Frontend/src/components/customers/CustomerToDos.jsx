// ==============================
// CustomerToDos.jsx
// Same styling as CustomerContacts table (no slider, no pagination, no horizontal scrollbar)
// Includes a FILTER BAR (as requested)
// Columns (typical To-Do grid):
// TODO | OWNER | DUE DATE | PRIORITY | STATUS
// ==============================
import { useMemo, useState } from "react";
import { Card } from "../ui/card";
import { CR_STYLES, FilterIcon } from "../customers/CustomerRegistryUtils.jsx";

/* ─── MOCK DATA ─────────────────────────────────────── */
const mockToDos = [
  { todo: "Send invoice follow-up email", owner: "Ava Thompson", dueDate: "2026-02-28", priority: "High", status: "Open" },
  { todo: "Confirm PO number", owner: "Noah Patel", dueDate: "2026-02-26", priority: "Medium", status: "In Progress" },
  { todo: "Update billing address", owner: "Mia Chen", dueDate: "2026-03-03", priority: "Low", status: "Open" },
  { todo: "Resolve payment failure", owner: "Ethan Brooks", dueDate: "2026-02-25", priority: "High", status: "Done" },
];

/* ✅ Columns (match the style you asked for) */
const TODO_COLS = [
  { key: "todo", label: "TO DO", width: "44%" },
  { key: "owner", label: "OWNER", width: "18%" },
  { key: "dueDate", label: "DUE DATE", width: "14%" },
  { key: "priority", label: "PRIORITY", width: "12%" },
  { key: "status", label: "STATUS", width: "12%" },
];

export function CustomerToDos({ todos: propToDos }) {
  const rows = useMemo(() => {
    if (propToDos?.length) return propToDos;
    return mockToDos;
  }, [propToDos]);

  // -----------------------------
  // Filters (shown in UI)
  // -----------------------------
  const [statusFilter, setStatusFilter] = useState("all"); // all | open | in progress | done
  const [priorityFilter, setPriorityFilter] = useState("all"); // all | high | medium | low
  const [dueFilter, setDueFilter] = useState("all"); // all | overdue | today | next7

  const filtered = useMemo(() => {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const next7 = new Date(startOfDay);
    next7.setDate(next7.getDate() + 7);

    return rows.filter((r) => {
      const st = String(r.status ?? "").toLowerCase();
      const pr = String(r.priority ?? "").toLowerCase();

      const statusOk =
        statusFilter === "all" ||
        st === statusFilter;

      const priorityOk =
        priorityFilter === "all" ||
        pr === priorityFilter;

      let dueOk = true;
      if (dueFilter !== "all") {
        const d = r.dueDate ? new Date(r.dueDate) : null;
        if (!d || Number.isNaN(d.getTime())) dueOk = false;
        else {
          const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          if (dueFilter === "overdue") dueOk = d0 < startOfDay;
          if (dueFilter === "today") dueOk = d0.getTime() === startOfDay.getTime();
          if (dueFilter === "next7") dueOk = d0 >= startOfDay && d0 <= next7;
        }
      }

      return statusOk && priorityOk && dueOk;
    });
  }, [rows, statusFilter, priorityFilter, dueFilter]);

  // -----------------------------
  // Table styling (same as contacts)
  // -----------------------------
  const th = (w) => ({
    background: "#f4f7fb",
    width: w,
    padding: "11px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textAlign: "left",
    whiteSpace: "nowrap",
    borderBottom: "2px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
    boxSizing: "border-box",
  });

  const td = (w, rowBg, extra = {}) => ({
    width: w,
    padding: "10px 12px",
    borderBottom: "1px solid #eef2f7",
    borderRight: "1px solid #eef2f7",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    boxSizing: "border-box",
    background: rowBg,
    ...extra,
  });

  const Pill = ({ label, kind }) => {
    const k = String(kind || "").toLowerCase();

    // Status colors (same vibe as your other pills)
    const statusMap = {
      open: { bg: "#e0f2fe", fg: "#0284c7" },
      "in progress": { bg: "#ffedd5", fg: "#c2410c" },
      done: { bg: "#dcfce7", fg: "#16a34a" },
    };

    // Priority colors
    const prMap = {
      high: { bg: "#fee2e2", fg: "#dc2626" },
      medium: { bg: "#ffedd5", fg: "#c2410c" },
      low: { bg: "#e5e7eb", fg: "#374151" },
    };

    const c = (kind === "status" ? statusMap[k] : prMap[k]) || { bg: "#e5e7eb", fg: "#374151" };

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          padding: "2px 9px",
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 600,
          background: c.bg,
          color: c.fg,
        }}
      >
        {label || "—"}
      </span>
    );
  };

  return (
    <>
      <style>{CR_STYLES}</style>

      <div className="space-y-3">
        {/* FILTER BAR (as requested) */}
        <div style={{ width: "97%" }}>
          <Card className="p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2" style={{ fontSize: 12, fontWeight: 600, color: "#64748b" }}>
                Filters <FilterIcon />
              </div>

              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:flex-wrap">
                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color: "#64748b" }}>Status</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                  >
                    <option value="all">All</option>
                    <option value="open">Open</option>
                    <option value="in progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color: "#64748b" }}>Priority</span>
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                  >
                    <option value="all">All</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span style={{ fontSize: 12, color: "#64748b" }}>Due</span>
                  <select
                    value={dueFilter}
                    onChange={(e) => setDueFilter(e.target.value)}
                    className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                  >
                    <option value="all">All</option>
                    <option value="overdue">Overdue</option>
                    <option value="today">Today</option>
                    <option value="next7">Next 7 days</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="h-10 px-3 rounded-md border border-slate-200 bg-white text-sm"
                    onClick={() => {
                      setStatusFilter("all");
                      setPriorityFilter("all");
                      setDueFilter("all");
                    }}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* TABLE (no horizontal scrollbar) */}
        <div
          style={{
            width: "97%",
            marginLeft: 0,
            marginRight: "auto",
            boxSizing: "border-box",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            background: "#fff",
            overflow: "hidden", // 🚫 prevents horizontal scroll
            fontFamily: "'DM Sans','Segoe UI',sans-serif",
          }}
        >
          <div
            style={{
              width: "100%",
              overflowX: "hidden", // 🚫 no horizontal scrollbar
              overflowY: "auto",
              maxHeight: 520,
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                tableLayout: "fixed",
                width: "100%",
              }}
            >
              <thead>
                <tr>
                  {TODO_COLS.map((c) => (
                    <th key={c.key} style={th(c.width)}>
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {filtered.map((r, i) => {
                  const rowBg = i % 2 === 0 ? "#fff" : "#eaf3ff"; // stripe like your other tables

                  return (
                    <tr key={`${r.todo}-${i}`} className="cr-row">
                      <td
                        style={td(TODO_COLS[0].width, rowBg, {
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#475569",
                        })}
                      >
                        {r.todo ?? "—"}
                      </td>

                      <td style={td(TODO_COLS[1].width, rowBg, { fontSize: 13, color: "#374151" })}>
                        {r.owner ?? "—"}
                      </td>

                      <td style={td(TODO_COLS[2].width, rowBg, { fontSize: 13, color: "#374151" })}>
                        {r.dueDate ?? "—"}
                      </td>

                      <td style={td(TODO_COLS[3].width, rowBg, { fontSize: 13 })}>
                        <Pill label={r.priority} kind="priority" />
                      </td>

                      <td style={td(TODO_COLS[4].width, rowBg, { fontSize: 13 })}>
                        <Pill label={r.status} kind="status" />
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={TODO_COLS.length} style={{ padding: 20, textAlign: "center", color: "#94a3b8", fontSize: 13 }}>
                      No To-Dos found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}