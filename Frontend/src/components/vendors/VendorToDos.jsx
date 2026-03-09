import { useEffect, useMemo, useState } from "react";
import { cn } from "../ui/utils";

/* ─── MOCK DATA  ───────────────────────── */
const mockVendorToDos = [
  {
    done: false,
    priority: "High",
    date: "2026-03-01",
    type: "Compliance",
    owner: "Sarah Lee",
    details:
      "Collect updated W-9 from Alpha Supplies (request latest EIN and address confirmation as well).",
  },
  {
    done: false,
    priority: "Medium",
    date: "2026-03-05",
    type: "Billing",
    owner: "Michael Chen",
    details:
      "Confirm invoice remittance details and verify ACH details with Bright Logistics before processing.",
  },
  {
    done: true,
    priority: "Low",
    date: "2026-02-20",
    type: "Onboarding",
    owner: "Anita Sharma",
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
    owner: r.owner ?? "—",
    details: r.details ?? "—",
  }));
}

const emptyTodo = {
  done: false,
  priority: "Medium",
  date: "",
  type: "Task",
  owner: "",
  details: "",
};

export function VendorToDos({ todos: propToDos }) {
  const baseRows = useMemo(() => {
    const src = propToDos?.length ? propToDos : mockVendorToDos;
    return normalizeIncoming(src);
  }, [propToDos]);

  const [rows, setRows] = useState(baseRows);
  const [showAdd, setShowAdd] = useState(false);
  const [expandedIds, setExpandedIds] = useState(() => new Set());
  const [newTodo, setNewTodo] = useState(emptyTodo);
  const [editingId, setEditingId] = useState(null);
  const [editTodo, setEditTodo] = useState(emptyTodo);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [typeFilter, setTypeFilter] = useState("all");
  const [ownerFilter, setOwnerFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");

  useEffect(() => {
    setRows(baseRows);
  }, [baseRows]);

  function toggleExpanded(id) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const typeOptions = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => {
      const t = String(r.type ?? "").trim();
      if (t) set.add(t);
    });
    if (!set.size) set.add("Task");
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [rows]);

  const ownerOptions = useMemo(() => {
    const set = new Set();
    rows.forEach((r) => {
      const owner = String(r.owner ?? "").trim();
      if (owner && owner !== "—") set.add(owner);
    });
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
      const owner = String(r.owner ?? "—").toLowerCase();
      const isDone = Boolean(r.done);

      const typeOk = typeFilter === "all" || tp === typeFilter;
      const ownerOk = ownerFilter === "all" || owner === ownerFilter;

      const statusOk =
        statusFilter === "all" ||
        (statusFilter === "done" && isDone) ||
        (statusFilter === "open" && !isDone);

      let dateOk = true;
      if (dateFilter !== "all") {
        const d = r.date && r.date !== "—" ? new Date(r.date) : null;
        if (!d || Number.isNaN(d.getTime())) {
          dateOk = false;
        } else {
          const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          if (dateFilter === "overdue") dateOk = d0 < startOfDay;
          if (dateFilter === "today") {
            dateOk = d0.getTime() === startOfDay.getTime();
          }
          if (dateFilter === "next7") {
            dateOk = d0 >= startOfDay && d0 <= next7;
          }
        }
      }

      return typeOk && ownerOk && statusOk && dateOk;
    });
  }, [rows, typeFilter, ownerFilter, statusFilter, dateFilter]);

  function resetAddForm() {
    setNewTodo(emptyTodo);
    setShowAdd(false);
  }

  function handleAddTodo() {
    const details = String(newTodo.details || "").trim();
    if (!details) return;

    const row = {
      id: makeId(),
      done: Boolean(newTodo.done),
      priority: newTodo.priority || "Medium",
      date: String(newTodo.date || "").trim() || "—",
      type: String(newTodo.type || "Task").trim() || "Task",
      owner: String(newTodo.owner || "").trim() || "—",
      details,
    };

    setRows((prev) => [row, ...prev]);
    resetAddForm();
  }

  function toggleDoneById(id) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, done: !r.done } : r)),
    );
  }

  function handleDeleteTodo(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditTodo(emptyTodo);
    }
    setExpandedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDeleteTarget(null);
  }

  function startEdit(todo) {
    setShowAdd(false);
    setEditingId(todo.id);
    setEditTodo({
      done: Boolean(todo.done),
      priority: todo.priority ?? "Medium",
      date: todo.date && todo.date !== "—" ? todo.date : "",
      type: todo.type ?? "Task",
      owner: todo.owner ?? "",
      details: todo.details ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditTodo(emptyTodo);
  }

  function saveEdit(id) {
    const details = String(editTodo.details || "").trim();
    if (!details) return;

    setRows((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              done: Boolean(editTodo.done),
              priority: editTodo.priority || "Medium",
              date: String(editTodo.date || "").trim() || "—",
              type: String(editTodo.type || "Task").trim() || "Task",
              owner: String(editTodo.owner || "").trim() || "—",
              details,
            }
          : r,
      ),
    );

    cancelEdit();
  }

  return (
    <div className="flex flex-col h-full min-w-0 space-y-4">
      <style>
        {`
        .todo-scroll::-webkit-scrollbar {
          height: 8px;
        }

        .todo-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .todo-scroll::-webkit-scrollbar-thumb {
          background: rgba(100,116,139,0.35);
          border-radius: 999px;
        }

        .todo-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100,116,139,0.55);
        }
        `}
      </style>

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

        <Filter label="Owner">
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="border border-border rounded-md px-2 py-1 bg-background text-sm"
          >
            <option value="all">All</option>
            {ownerOptions.map((owner) => (
              <option key={owner} value={owner.toLowerCase()}>
                {owner}
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
            setOwnerFilter("all");
            setStatusFilter("all");
            setDateFilter("all");
          }}
        >
          Clear
        </button>

        <button
          className="ml-auto border border-border rounded-md px-3 py-1 bg-background text-sm hover:cursor-pointer"
          onClick={() => {
            setEditingId(null);
            setShowAdd((v) => !v);
          }}
        >
          + Add
        </button>
      </div>

      {showAdd && (
        <TodoForm
          title="Add To-Do"
          value={newTodo}
          onChange={setNewTodo}
          onPrimary={handleAddTodo}
          primaryLabel="Add"
          onSecondary={resetAddForm}
          secondaryLabel="Cancel"
        />
      )}

      {editingId && (
        <TodoForm
          title="Edit To-Do"
          value={editTodo}
          onChange={setEditTodo}
          onPrimary={() => saveEdit(editingId)}
          primaryLabel="Save"
          onSecondary={cancelEdit}
          secondaryLabel="Cancel"
        />
      )}

      <div className="border border-border rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto todo-scroll scroll-smooth">
          <table className="w-full min-w-[1100px] text-sm border-collapse">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <Th className="min-w-[80px]">Done</Th>
                <Th className="min-w-[120px]">Priority</Th>
                <Th className="min-w-[130px]">Date</Th>
                <Th className="min-w-[130px]">Type</Th>
                <Th className="min-w-[180px]">Owner</Th>
                <Th className="min-w-[320px]">Details</Th>
                <Th className="min-w-[140px]">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((t, i) => {
                const isExpanded = expandedIds.has(t.id);

                return (
                  <tr
                    key={t.id ?? `${t.details}-${t.date}-${i}`}
                    className={cn(
                      "border-t hover:bg-muted/30 transition-colors align-top",
                      i % 2 === 0 ? "bg-white" : "bg-muted/10",
                    )}
                  >
                    <Td>
                      <input
                        type="checkbox"
                        checked={Boolean(t.done)}
                        onChange={() => toggleDoneById(t.id)}
                        className="h-4 w-4 accent-emerald-600"
                        title={t.done ? "Mark as not done" : "Mark as done"}
                      />
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

                    <Td className="text-slate-700 whitespace-nowrap">
                      {t.date ?? "—"}
                    </Td>

                    <Td className="text-slate-700 whitespace-normal break-words">
                      {t.type ?? "Task"}
                    </Td>

                    <Td className="text-slate-700 whitespace-normal break-words">
                      {t.owner ?? "—"}
                    </Td>

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

                    <Td className="whitespace-normal">
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="border border-border rounded-md px-2 py-1 text-xs bg-background hover:bg-muted hover:cursor-pointer"
                          onClick={() => startEdit(t)}
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          className="border border-red-200 text-red-700 rounded-md px-2 py-1 text-xs bg-red-50 hover:bg-red-100 hover:cursor-pointer"
                          onClick={() => setDeleteTarget(t)}
                        >
                          Delete
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}

              {filtered.length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={7}
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

      {deleteTarget && (
        <DeleteConfirmModal
          todo={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteTodo(deleteTarget.id)}
        />
      )}
    </div>
  );
}

function TodoForm({
  title,
  value,
  onChange,
  onPrimary,
  primaryLabel,
  onSecondary,
  secondaryLabel,
}) {
  return (
    <div className="border border-border rounded-2xl p-4 bg-background">
      <div className="mb-3 text-sm font-medium text-slate-700">{title}</div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
        <div className="md:col-span-3">
          <label className="block text-xs uppercase text-muted-foreground mb-1">
            Done
          </label>
          <div className="h-10 flex items-center gap-2 border border-border rounded-xl px-3 bg-background">
            <input
              type="checkbox"
              checked={value.done}
              onChange={(e) =>
                onChange((p) => ({ ...p, done: e.target.checked }))
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
            value={value.priority}
            onChange={(e) =>
              onChange((p) => ({ ...p, priority: e.target.value }))
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
            value={value.date}
            onChange={(e) => onChange((p) => ({ ...p, date: e.target.value }))}
            className="w-full h-10 border border-border rounded-xl px-3 bg-background"
          />
        </div>

        <div className="md:col-span-3">
          <label className="block text-xs uppercase text-muted-foreground mb-1">
            Type
          </label>
          <input
            value={value.type}
            onChange={(e) => onChange((p) => ({ ...p, type: e.target.value }))}
            className="w-full h-10 border border-border rounded-xl px-3 bg-background"
            placeholder="Task"
          />
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 md:grid-cols-12 gap-3">
        <div className="md:col-span-4">
          <label className="block text-xs uppercase text-muted-foreground mb-1">
            Owner
          </label>
          <input
            value={value.owner}
            onChange={(e) => onChange((p) => ({ ...p, owner: e.target.value }))}
            className="w-full h-10 border border-border rounded-xl px-3 bg-background"
            placeholder="e.g., Sarah Lee"
          />
        </div>

        <div className="md:col-span-8">
          <label className="block text-xs uppercase text-muted-foreground mb-1">
            Details
          </label>
          <input
            value={value.details}
            onChange={(e) =>
              onChange((p) => ({ ...p, details: e.target.value }))
            }
            className="w-full h-10 border border-border rounded-xl px-3 bg-background"
            placeholder="e.g., Collect updated W-9"
          />
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <button
          className="border border-border rounded-xl px-4 py-2 bg-background text-sm hover:cursor-pointer"
          onClick={onPrimary}
        >
          {primaryLabel}
        </button>
        <button
          className="border border-border rounded-xl px-4 py-2 bg-background text-sm hover:cursor-pointer"
          onClick={onSecondary}
        >
          {secondaryLabel}
        </button>
      </div>
    </div>
  );
}

function DeleteConfirmModal({ todo, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
        <div className="text-base font-semibold text-slate-800">
          Delete To-Do?
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete this to-do for{" "}
          <span className="font-medium text-slate-700">{todo.owner ?? "—"}</span>
          ?
        </p>

        <div className="mt-3 rounded-xl bg-muted/40 p-3 text-sm text-slate-700 break-words">
          {todo.details ?? "—"}
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className="border border-border rounded-xl px-4 py-2 bg-background text-sm hover:cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="border border-red-200 rounded-xl px-4 py-2 bg-red-50 text-sm text-red-700 hover:bg-red-100 hover:cursor-pointer"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
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