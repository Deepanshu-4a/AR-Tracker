import { useMemo, useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import {
  ChevronLeft,
  ChevronRight,
  Pencil,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  X,
} from "lucide-react";
import { cn } from "../ui/utils";

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

export function RightSidePanel({ vendor }) {
  const [collapsed, setCollapsed] = useState(false);

  // ---------- Safe fallbacks ----------
  const vendorName =
    vendor?.name ||
    vendor?.vendorName ||
    vendor?.businessName ||
    "AANIS TECH SOLUTIONS, LLC";
  const phone = vendor?.phone || "860-221-4444";
  const email = vendor?.email || "aanistechsolutions@gmail.com";
  const openBalance = vendor?.openBalance ?? 18180.03;

  // Recent transactions
  const recentTransactions = useMemo(
    () =>
      vendor?.recentTransactions?.length
        ? vendor.recentTransactions
        : [
            {
              date: "01/31/26",
              type: "Bill",
              method: "",
              amount: 18180.03,
              tone: "neutral",
            },
            {
              date: "01/30/26",
              type: "Bill Pmt",
              method: "-Check",
              amount: 22000.0,
              tone: "neutral",
            },
            {
              date: "12/31/25",
              type: "Bill",
              method: "-Paid",
              amount: 22000.0,
              tone: "positive",
            },
            {
              date: "12/31/25",
              type: "Bill Pmt",
              method: "-Check",
              amount: 17375.0,
              tone: "neutral",
            },
            {
              date: "12/03/25",
              type: "Bill Pmt",
              method: "-Check",
              amount: 23500.0,
              tone: "neutral",
            },
          ],
    [vendor],
  );

  /* ================= NOTES (Vendor tab) ================= */
  const [notes, setNotes] = useState(() => normalizeNotes(vendor?.notes));
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  /* ================= INTERNAL NOTES (Transaction tab) ================= */
  const [internalNotes, setInternalNotes] = useState(() =>
    normalizeNotes(vendor?.internalNotes),
  );
  const [addingInternal, setAddingInternal] = useState(false);
  const [newInternalText, setNewInternalText] = useState("");
  const [editingInternalId, setEditingInternalId] = useState(null);
  const [editInternalText, setEditInternalText] = useState("");

  // Reset when vendor changes
  useEffect(() => {
    setNotes(normalizeNotes(vendor?.notes));
    setAdding(false);
    setNewText("");
    setEditingId(null);
    setEditText("");

    setInternalNotes(normalizeNotes(vendor?.internalNotes));
    setAddingInternal(false);
    setNewInternalText("");
    setEditingInternalId(null);
    setEditInternalText("");
  }, [vendor]);

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

        <Tabs defaultValue="vendor" className="flex flex-col flex-1 min-h-0">
          {/* TAB SWITCHER */}
          <div className="px-6 pt-5 pb-4 border-b border-border/60">
            <TabsList className="grid grid-cols-2 w-full bg-muted rounded-xl p-1">
              <TabsTrigger
                value="vendor"
                className="rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                Vendor
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
          <div className="flex-1 min-h-0 overflow-y-auto px-6 py-6 space-y-6">
            {/* ================= VENDOR TAB ================= */}
            <TabsContent value="vendor" className="space-y-6 text-sm mt-0">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-foreground">
                <span className="text-muted-foreground">›</span>
                <span className="truncate">{vendorName}</span>
              </div>

              {/* SUMMARY */}
              <SectionCard
                title="Summary"
                rightIcon={<Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" />}
                compact
              >
                <Row label="Phone" value={phone} />
                <Row label="Email" value={email} link />
                <Row
                  label="Open balance"
                  value={Number(openBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                  blue
                />
              </SectionCard>

              {/* RECENT TRANSACTION */}
              <SectionCard
                title="Recent transaction"
                rightIcon={
                  <button
                    className="h-7 w-7 rounded-full border border-border/60 bg-background hover:bg-muted transition grid place-items-center"
                    title="Refresh"
                    type="button"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
                  </button>
                }
                compact
              >
                <div className="space-y-2">
                  {recentTransactions.map((t, idx) => (
                    <TxRow key={`${t.date}-${t.type}-${idx}`} tx={t} />
                  ))}
                </div>
              </SectionCard>

              {/* NOTES */}
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
            <TabsContent value="transaction" className="space-y-6 text-sm mt-0">
              <div className="rounded-xl p-5 bg-muted/40 border border-border/50 space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium text-[13px]">Transaction Summary</h4>
                  <Pencil className="w-4 h-4 text-muted-foreground cursor-pointer" />
                </div>

                <Row label="Vendor" value={vendorName} />
                <Row
                  label="Open balance"
                  value={`$${Number(openBalance).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`}
                  highlight
                />
                <Row label="Status" value={vendor?.status || "Active"} />
              </div>

              {/* INTERNAL NOTES  */}
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

/* ================= NOTES CARD  ================= */

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
    <SectionCard
      title={title}
      rightIcon={
        <button
          type="button"
          onClick={startAdd}
          className="h-7 w-7 rounded-full border border-border/60 bg-background hover:bg-muted transition grid place-items-center"
          title={`Add ${title}`}
        >
          <Plus className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      }
      compact
    >
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
    </SectionCard>
  );
}

/* ================= HELPERS ================= */

function SectionCard({ title, rightIcon, children, compact }) {
  return (
    <div className="rounded-2xl border border-border/50 bg-background overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border/50 bg-muted/30">
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground font-medium">
          {title}
        </p>
        {rightIcon}
      </div>

      <div className={cn("px-4 space-y-3", compact ? "py-4" : "py-5")}>
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, highlight, link, blue }) {
  const valueNode = link ? (
    <a
      className="font-medium text-blue-600 hover:underline break-all text-[12px]"
      href={`mailto:${value}`}
      onClick={(e) => {
        if (!String(value || "").includes("@")) e.preventDefault();
      }}
    >
      {value}
    </a>
  ) : (
    <span
      className={cn(
        "font-medium text-[12px]",
        highlight && "text-destructive",
        blue && "text-blue-600",
      )}
    >
      {blue ? `$${value}` : value}
    </span>
  );

  return (
    <div className="flex justify-between gap-3">
      <span className="text-muted-foreground text-[12px]">{label}</span>
      <span className="text-right min-w-0">{valueNode}</span>
    </div>
  );
}

function TxRow({ tx }) {
  const amountStr = Number(tx.amount || 0).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  const isPaid = String(tx.method || "").toLowerCase().includes("paid");

  return (
    <div className="grid grid-cols-[70px_minmax(0,1fr)_86px] items-start gap-2">
      <span className="text-muted-foreground text-[12px] leading-5">
        {tx.date}
      </span>

      <div className="min-w-0">
        <div className="flex flex-wrap items-start gap-x-1 gap-y-0.5 leading-5">
          <span className="text-[12px] font-medium text-foreground">
            {tx.type}
          </span>

          {!!tx.method && (
            <span
              className={cn(
                "text-[12px] font-medium",
                isPaid ? "text-emerald-600" : "text-blue-600",
              )}
            >
              {tx.method}
            </span>
          )}
        </div>
      </div>

      <span className="text-[12px] font-medium text-foreground text-right leading-5">
        {amountStr}
      </span>
    </div>
  );
}