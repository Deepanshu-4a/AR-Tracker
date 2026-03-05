import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Check,
  X,
} from "lucide-react";

/* ================= NOTES UTILS ================= */

function makeId() {
  return `note_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeNotes(input) {
  if (!input) return [];

  if (Array.isArray(input)) {
    return input
      .map((n) => ({
        id: n.id ?? makeId(),
        text: String(n.text ?? n.note ?? "").trim(),
        ts: n.ts ?? n.updatedAt ?? n.createdAt ?? new Date().toISOString(),
      }))
      .filter((n) => n.text.length > 0);
  }

  const s = String(input).trim();
  if (!s) return [];
  return [{ id: makeId(), text: s, ts: new Date().toISOString() }];
}

function formatTs(ts) {
  try {
    const d = new Date(ts);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleString();
  } catch {
    return "";
  }
}

/* ================= MAIN ================= */

export function RightSidePanel({ customer, invoice, balanceDue, total }) {
  const [collapsed, setCollapsed] = useState(false);

  const mockInvoice = {
    status: invoice?.status || "Sent",
    billingTerms: invoice?.billingTerms || "Net 30",
    dueDate: invoice?.dueDate || "2026-02-15",
    currency: invoice?.currency || "USD",
    auditTrail: invoice?.auditTrail || [
      { ts: "2026-01-10T09:00:00Z" },
      { ts: "2026-01-12T14:30:00Z" },
    ],
  };

  const displayTotal = total ?? 962500;
  const displayBalance = balanceDue ?? 962500;

  /* ================= NOTES (Customer tab) ================= */
  const [notes, setNotes] = useState(() => normalizeNotes(customer?.notes));
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ================= INTERNAL NOTES (Transaction tab) ================= */
  const [internalNotes, setInternalNotes] = useState(() =>
    normalizeNotes(invoice?.internalNotes ?? customer?.internalNotes),
  );
  const [addingInternal, setAddingInternal] = useState(false);
  const [newInternalText, setNewInternalText] = useState("");
  const [editingInternalId, setEditingInternalId] = useState(null);
  const [editInternalText, setEditInternalText] = useState("");

  // Reset when customer/invoice changes
  useEffect(() => {
    setNotes(normalizeNotes(customer?.notes));
    setAdding(false);
    setNewText("");
    setEditingId(null);
    setEditText("");

    setInternalNotes(
      normalizeNotes(invoice?.internalNotes ?? customer?.internalNotes),
    );
    setAddingInternal(false);
    setNewInternalText("");
    setEditingInternalId(null);
    setEditInternalText("");
  }, [customer, invoice]);

  /* ===== Notes actions ===== */
  function startAdd() {
    setAdding(true);
    setNewText("");
    setEditingId(null);
  }
  function cancelAdd() {
    setAdding(false);
    setNewText("");
  }
  function addNote() {
    const text = String(newText || "").trim();
    if (!text) return;
    const now = new Date().toISOString();
    setNotes((prev) => [{ id: makeId(), text, ts: now }, ...prev]);
    setAdding(false);
    setNewText("");
  }
  function startEdit(note) {
    setEditingId(note.id);
    setEditText(note.text);
    setAdding(false);
  }
  function cancelEdit() {
    setEditingId(null);
    setEditText("");
  }
  function saveEdit(id) {
    const text = String(editText || "").trim();
    if (!text) return;
    const now = new Date().toISOString();
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, text, ts: now } : n)));
    setEditingId(null);
    setEditText("");
  }
  function deleteNote(id) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingId === id) cancelEdit();
  }

  /* ===== Internal notes actions ===== */
  function startAddInternal() {
    setAddingInternal(true);
    setNewInternalText("");
    setEditingInternalId(null);
  }
  function cancelAddInternal() {
    setAddingInternal(false);
    setNewInternalText("");
  }
  function addInternalNote() {
    const text = String(newInternalText || "").trim();
    if (!text) return;
    const now = new Date().toISOString();
    setInternalNotes((prev) => [{ id: makeId(), text, ts: now }, ...prev]);
    setAddingInternal(false);
    setNewInternalText("");
  }
  function startEditInternal(note) {
    setEditingInternalId(note.id);
    setEditInternalText(note.text);
    setAddingInternal(false);
  }
  function cancelEditInternal() {
    setEditingInternalId(null);
    setEditInternalText("");
  }
  function saveEditInternal(id) {
    const text = String(editInternalText || "").trim();
    if (!text) return;
    const now = new Date().toISOString();
    setInternalNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, text, ts: now } : n)),
    );
    setEditingInternalId(null);
    setEditInternalText("");
  }
  function deleteInternalNote(id) {
    setInternalNotes((prev) => prev.filter((n) => n.id !== id));
    if (editingInternalId === id) cancelEditInternal();
  }

  /* ================= COLLAPSED ================= */

  if (collapsed) {
    return (
      <div className="sticky top-8 w-[60px] shrink-0">
        <button
          onClick={() => setCollapsed(false)}
          className="w-full bg-card border border-border rounded-xl shadow-sm p-3 hover:bg-muted transition flex justify-center"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      </div>
    );
  }

  /* ================= EXPANDED ================= */

  return (
    <div className="sticky top-8 h-[calc(100vh-96px)] w-[280px] shrink-0">
      <div className="h-full rounded-2xl border border-border/60 bg-card shadow-lg flex flex-col overflow-hidden">
        {/* HEADER */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-border/60">
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            Context Panel
          </p>

          <button
            onClick={() => setCollapsed(true)}
            className="text-muted-foreground hover:text-foreground transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <Tabs defaultValue="customer" className="flex flex-col flex-1 min-h-0">
          {/* TAB SWITCHER */}
          <div className="px-6 pt-5 pb-4 border-b border-border/60">
            <TabsList className="grid grid-cols-2 w-full bg-muted rounded-xl p-1">
              <TabsTrigger
                value="customer"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Customer
              </TabsTrigger>

              <TabsTrigger
                value="transaction"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Transaction
              </TabsTrigger>
            </TabsList>
          </div>

          {/* SCROLL AREA */}
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-8 space-y-8">
            {/* ================= CUSTOMER TAB ================= */}
            <TabsContent value="customer" className="space-y-8 text-sm mt-0">
              <div className="rounded-xl p-6 bg-muted/40 border border-border/50 space-y-4">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Customer Overview</h4>
                  <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>

                <Row label="Preferred delivery" value="E-mail" />
                <Row
                  label="Open balance"
                  value={`$${displayBalance.toLocaleString()}`}
                  highlight
                />
                <Row label="Credit limit" value="$2,000,000" />
              </div>

              <div className="space-y-4">
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
                  Recent Transactions
                </h4>

                <div className="space-y-3">
                  <ActivityRow
                    title="Invoice INV-2026-001"
                    subtitle="Jan 10, 2026"
                    amount="$962,500.00"
                  />
                  <ActivityRow
                    title="Payment PMT-44321"
                    subtitle="Jan 18, 2026"
                    amount="$250,000.00"
                    type="positive"
                  />
                  <ActivityRow
                    title="Credit Memo CM-1003"
                    subtitle="Dec 28, 2025"
                    amount="-$12,000.00"
                    type="negative"
                  />
                </div>
              </div>

              {/* NOTES (CRUD) */}
              <NotesCard
                title="Notes"
                items={notes}
                adding={adding}
                newText={newText}
                setNewText={setNewText}
                startAdd={startAdd}
                cancelAdd={cancelAdd}
                addItem={addNote}
                editingId={editingId}
                editText={editText}
                setEditText={setEditText}
                startEdit={startEdit}
                cancelEdit={cancelEdit}
                saveEdit={saveEdit}
                deleteItem={deleteNote}
              />
            </TabsContent>

            {/* ================= TRANSACTION TAB ================= */}
            <TabsContent value="transaction" className="space-y-8 text-sm mt-0">
              <div className="rounded-2xl p-8 bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20">
                <p className="text-xs uppercase tracking-wide text-muted-foreground">
                  Invoice Amount
                </p>

                <p className="text-3xl font-semibold mt-3">
                  ${displayTotal.toLocaleString()}
                </p>

                <div className="mt-5 flex justify-between text-sm">
                  <span className="text-muted-foreground">Balance Due</span>
                  <span className="text-destructive font-medium">
                    ${displayBalance.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="space-y-5">
                <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
                  Summary
                </h4>

                <div className="space-y-4">
                  <SummaryRow label="Status" value={mockInvoice.status} />
                  <SummaryRow label="Terms" value={mockInvoice.billingTerms} />
                  <SummaryRow
                    label="Created"
                    value={
                      new Date(mockInvoice.auditTrail[0].ts).toLocaleDateString() +
                      " by Admin"
                    }
                  />
                  <SummaryRow
                    label="Last Edited"
                    value={
                      new Date(
                        mockInvoice.auditTrail[mockInvoice.auditTrail.length - 1].ts,
                      ).toLocaleDateString() + " by Admin"
                    }
                  />
                  <SummaryRow
                    label="Due Date"
                    value={new Date(mockInvoice.dueDate).toLocaleDateString()}
                  />
                  <SummaryRow label="Currency" value={mockInvoice.currency} />
                </div>
              </div>

              {/* INTERNAL NOTES (CRUD) */}
              <NotesCard
                title="Internal Notes"
                items={internalNotes}
                adding={addingInternal}
                newText={newInternalText}
                setNewText={setNewInternalText}
                startAdd={startAddInternal}
                cancelAdd={cancelAddInternal}
                addItem={addInternalNote}
                editingId={editingInternalId}
                editText={editInternalText}
                setEditText={setEditInternalText}
                startEdit={startEditInternal}
                cancelEdit={cancelEditInternal}
                saveEdit={saveEditInternal}
                deleteItem={deleteInternalNote}
              />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}

/* ================= NOTES CARD ================= */

function NotesCard({
  title,
  items,
  adding,
  newText,
  setNewText,
  startAdd,
  cancelAdd,
  addItem,
  editingId,
  editText,
  setEditText,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteItem,
}) {
  return (
    <div className="p-6 rounded-xl bg-background border border-border/50 space-y-3">
      <div className="flex justify-between items-center">
        <h4 className="font-medium">{title}</h4>

        <button
          type="button"
          onClick={startAdd}
          className="h-7 w-7 rounded-full border border-border/60 bg-background hover:bg-muted transition grid place-items-center"
          title={`Add ${title}`}
        >
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      </div>

      {/* Add form */}
      {adding && (
        <div className="rounded-xl border border-border/60 bg-muted/20 p-3 space-y-2">
          <textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            className="w-full min-h-[72px] resize-none rounded-lg border border-border bg-background px-2 py-2 text-[12px] leading-5"
            placeholder="Write a note…"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-[12px] hover:bg-muted transition"
            >
              <Check className="w-3.5 h-3.5" />
              Save
            </button>
            <button
              type="button"
              onClick={cancelAdd}
              className="inline-flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-[12px] hover:bg-muted transition"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Notes list */}
      {items.length ? (
        <div className="space-y-3">
          {items.map((n) => {
            const isEditing = editingId === n.id;

            return (
              <div
                key={n.id}
                className="rounded-xl border border-border/60 bg-background p-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    {isEditing ? (
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="w-full min-h-[72px] resize-none rounded-lg border border-border bg-background px-2 py-2 text-[12px] leading-5"
                      />
                    ) : (
                      <p className="text-[12px] text-foreground break-words leading-5">
                        {n.text}
                      </p>
                    )}

                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {formatTs(n.ts)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          type="button"
                          onClick={() => saveEdit(n.id)}
                          className="h-7 w-7 rounded-lg border border-border/60 bg-background hover:bg-muted transition grid place-items-center"
                          title="Save"
                        >
                          <Check className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="h-7 w-7 rounded-lg border border-border/60 bg-background hover:bg-muted transition grid place-items-center"
                          title="Cancel"
                        >
                          <X className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => startEdit(n)}
                          className="h-7 w-7 rounded-lg border border-border/60 bg-background hover:bg-muted transition grid place-items-center"
                          title="Edit"
                        >
                          <Pencil className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteItem(n.id)}
                          className="h-7 w-7 rounded-lg border border-border/60 bg-background hover:bg-muted transition grid place-items-center"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-muted-foreground" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        !adding && <p className="text-[12px] text-muted-foreground italic">—</p>
      )}
    </div>
  );
}

/* ================= HELPERS ================= */

function Row({ label, value, highlight }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={highlight ? "text-destructive font-medium" : "font-medium"}
      >
        {value}
      </span>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex justify-between items-start">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}

function ActivityRow({ title, subtitle, amount, type }) {
  return (
    <div className="p-4 rounded-xl border border-border/50 bg-background hover:bg-muted/40 transition cursor-pointer flex justify-between items-center">
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>

      <p
        className={
          type === "positive"
            ? "text-emerald-600 font-medium"
            : type === "negative"
              ? "text-destructive font-medium"
              : "font-medium"
        }
      >
        {amount}
      </p>
    </div>
  );
}