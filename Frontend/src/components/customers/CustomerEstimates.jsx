// ==============================

// ==============================
import { useMemo, useState } from "react";
import { cn } from "../ui/utils";

/* ─── MOCK DATA ─────────────────────────────────────── */
const mockEstimates = [
  {
    id: "EST-0001",
    customerJob: "MD:ITCD:TO#29:DPSCS-Base",
    className: "—",
    template: "Retail Estimate",
    date: "2025-08-07",
    nameAddress:
      "GLEN HUBBARD\n(443) 846-6149\nGLENT.HUBBARD@MAIL.COM\nBPM043644-FA1-WO-29\nPO# Q00B6600043",
    customerMessage: "—",
    memo: "—",
    markup: 0,
    items: [],
  },
  {
    id: "EST-0002",
    customerJob: "MegaMart:Job-102",
    className: "Retail",
    template: "Retail Estimate",
    date: "2026-02-10",
    nameAddress: "MegaMart\nfinance@megamart.com\n+1 555-111-2222",
    customerMessage: "Thanks for your business.",
    memo: "Initial estimate for Feb work.",
    markup: 250,
    items: [
      { item: "Labor", description: "Implementation work", qty: 10, cost: 120 },
      { item: "Support", description: "Support hours", qty: 4, cost: 90 },
    ],
  },
];

const TEMPLATE_OPTIONS = ["Retail Estimate", "Standard Estimate"];
const CLASS_OPTIONS = ["—", "Retail", "Services", "Internal"];

const emptyEstimate = () => ({
  id: "",
  customerJob: "",
  className: "—",
  template: "Retail Estimate",
  date: new Date().toISOString().slice(0, 10),
  nameAddress: "",
  customerMessage: "—",
  memo: "—",
  markup: 0,
  items: [
    { item: "", description: "", qty: 1, cost: 0 },
    { item: "", description: "", qty: 1, cost: 0 },
  ],
});

export function CustomerEstimates({ estimates: propEstimates }) {
  const base = useMemo(() => {
    if (propEstimates?.length) return propEstimates;
    return mockEstimates;
  }, [propEstimates]);

  // local (temporary) edits + creates
  const [localEstimates, setLocalEstimates] = useState([]);
  const estimates = useMemo(
    () => [...localEstimates, ...base],
    [localEstimates, base],
  );

  const [mode, setMode] = useState("find"); // find | form
  const [activeId, setActiveId] = useState(null);

  // -----------------------------
  // Find filters 
  // -----------------------------
  const [customerJobFilter, setCustomerJobFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [estimateNo, setEstimateNo] = useState("");
  const [amountMin, setAmountMin] = useState("");

  const filtered = useMemo(() => {
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo) : null;
    const min = amountMin ? Number(amountMin) : null;

    return estimates.filter((e) => {
      const cjOk =
        !customerJobFilter ||
        String(e.customerJob || "")
          .toLowerCase()
          .includes(customerJobFilter.toLowerCase());

      const estOk =
        !estimateNo ||
        String(e.id || "").toLowerCase().includes(estimateNo.toLowerCase());

      let dateOk = true;
      if (from || to) {
        const d = e.date ? new Date(e.date) : null;
        if (!d || Number.isNaN(d.getTime())) dateOk = false;
        else {
          const d0 = new Date(d.getFullYear(), d.getMonth(), d.getDate());
          if (from) dateOk = dateOk && d0 >= from;
          if (to) dateOk = dateOk && d0 <= to;
        }
      }

      let amtOk = true;
      if (min != null && !Number.isNaN(min)) {
        amtOk = getEstimateTotal(e) >= min;
      }

      return cjOk && estOk && dateOk && amtOk;
    });
  }, [estimates, customerJobFilter, dateFrom, dateTo, estimateNo, amountMin]);

  // -----------------------------
  // Form state
  // -----------------------------
  const [draft, setDraft] = useState(emptyEstimate());

  const totals = useMemo(() => {
    const subtotal = sumItems(draft.items);
    const markup = Number(draft.markup) || 0;
    return { subtotal, markup, total: subtotal + markup };
  }, [draft.items, draft.markup]);

  function openNew() {
    setActiveId(null);
    setDraft({
      ...emptyEstimate(),
      id: nextEstimateId(estimates),
    });
    setMode("form");
  }

  function openExisting(id) {
    const found = estimates.find((x) => x.id === id);
    if (!found) return;
    setActiveId(id);
    setDraft({
      ...emptyEstimate(),
      ...found,
      // ensure at least one row
      items: found.items?.length ? found.items : [{ item: "", description: "", qty: 1, cost: 0 }],
      markup: Number(found.markup) || 0,
    });
    setMode("form");
  }

  function clearDraft() {
    setDraft((p) => ({
      ...emptyEstimate(),
      id: p.id || nextEstimateId(estimates),
    }));
  }

  function saveDraft({ andNew = false } = {}) {
    const cleaned = normalizeEstimate(draft);

    setLocalEstimates((prev) => {
      const idx = prev.findIndex((x) => x.id === cleaned.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = cleaned;
        return copy;
      }
      // if this ID exists in base data, "override" by adding local copy on top
      return [cleaned, ...prev];
    });

    if (andNew) {
      setActiveId(null);
      setDraft({
        ...emptyEstimate(),
        id: nextEstimateId([cleaned, ...estimates]),
      });
      return;
    }

    setMode("find");
  }

  // -----------------------------
  // UI
  // -----------------------------
  return (
    <div className="flex flex-col h-full min-w-0 space-y-4">
      {/* top bar */}
      <div className="flex items-center gap-2">
        <div className="text-lg font-semibold text-slate-800">Estimates</div>
        <div className="ml-auto flex items-center gap-2">
          {mode === "form" ? (
            <button
              className="border border-border rounded-md px-3 py-1 bg-background text-sm"
              onClick={() => setMode("find")}
            >
              Back to Find
            </button>
          ) : (
            <button
              className="border border-border rounded-md px-3 py-1 bg-background text-sm"
              onClick={openNew}
            >
              + New Estimate
            </button>
          )}
        </div>
      </div>

      {mode === "find" ? (
        <FindEstimatesPanel
          estimates={filtered}
          filters={{
            customerJobFilter,
            setCustomerJobFilter,
            dateFrom,
            setDateFrom,
            dateTo,
            setDateTo,
            estimateNo,
            setEstimateNo,
            amountMin,
            setAmountMin,
          }}
          onReset={() => {
            setCustomerJobFilter("");
            setDateFrom("");
            setDateTo("");
            setEstimateNo("");
            setAmountMin("");
          }}
          onOpen={openExisting}
        />
      ) : (
        <EstimateForm
          draft={draft}
          setDraft={setDraft}
          totals={totals}
          onAddLine={() =>
            setDraft((p) => ({
              ...p,
              items: [...(p.items || []), { item: "", description: "", qty: 1, cost: 0 }],
            }))
          }
          onRemoveLine={(idx) =>
            setDraft((p) => ({
              ...p,
              items: (p.items || []).filter((_, i) => i !== idx),
            }))
          }
          onClear={clearDraft}
          onSaveClose={() => saveDraft({ andNew: false })}
          onSaveNew={() => saveDraft({ andNew: true })}
        />
      )}
    </div>
  );
}

/* ================= FIND PANEL ================= */

function FindEstimatesPanel({ estimates, filters, onReset, onOpen }) {
  const {
    customerJobFilter,
    setCustomerJobFilter,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    estimateNo,
    setEstimateNo,
    amountMin,
    setAmountMin,
  } = filters;

  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* filters header ) */}
      <div className="p-3 border-b border-border bg-muted/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
          <div className="md:col-span-5">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Customer:Job
            </label>
            <input
              value={customerJobFilter}
              onChange={(e) => setCustomerJobFilter(e.target.value)}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
              placeholder="Search customer/job..."
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Date (From)
            </label>
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Date (To)
            </label>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Estimate #
            </label>
            <input
              value={estimateNo}
              onChange={(e) => setEstimateNo(e.target.value)}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
              placeholder="e.g., EST-0002"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Amount (Min)
            </label>
            <input
              value={amountMin}
              onChange={(e) => setAmountMin(e.target.value)}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
              placeholder="e.g., 500"
              inputMode="numeric"
            />
          </div>

          <div className="md:col-span-6 flex items-end gap-2">
            <button
              className="border border-border rounded-md px-3 py-1 bg-background text-sm"
              onClick={onReset}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* results table */}
      <div className="overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <Th className="w-[14%]">Date</Th>
              <Th className="w-[16%]">Estimate #</Th>
              <Th className="w-[44%]">Customer:Job</Th>
              <Th className="w-[18%]">Amount</Th>
              <Th className="w-[8%]"> </Th>
            </tr>
          </thead>
          <tbody>
            {estimates.map((e, i) => (
              <tr
                key={e.id}
                className={cn(
                  "border-t hover:bg-muted/30 transition-colors",
                  i % 2 === 0 ? "bg-white" : "bg-muted/10",
                )}
              >
                <Td className="text-slate-700 whitespace-nowrap">{e.date || "—"}</Td>
                <Td className="font-medium text-slate-700 truncate">{e.id}</Td>
                <Td className="text-slate-700 truncate">{e.customerJob || "—"}</Td>
                <Td className="text-slate-700 whitespace-nowrap">
                  {formatMoney(getEstimateTotal(e))}
                </Td>
                <Td className="text-right">
                  <button
                    className="border border-border rounded-md px-2 py-1 bg-background text-xs"
                    onClick={() => onOpen(e.id)}
                  >
                    Open
                  </button>
                </Td>
              </tr>
            ))}

            {estimates.length === 0 && (
              <tr className="border-t">
                <td
                  colSpan={5}
                  className="px-3 py-8 text-center text-sm text-muted-foreground"
                >
                  No estimates found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ================= ESTIMATE FORM ================= */

function EstimateForm({
  draft,
  setDraft,
  totals,
  onAddLine,
  onRemoveLine,
  onClear,
  onSaveClose,
  onSaveNew,
}) {
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      {/* header ribbon (like QB toolbar area) */}
      <div className="p-3 border-b border-border bg-muted/10 flex items-center gap-2">
        <div className="text-base font-semibold text-slate-800">Estimate</div>
        <div className="ml-auto flex items-center gap-2">
          <button
            className="border border-border rounded-md px-3 py-1 bg-background text-sm"
            onClick={onSaveClose}
          >
            Save & Close
          </button>
          <button
            className="border border-border rounded-md px-3 py-1 bg-background text-sm"
            onClick={onSaveNew}
          >
            Save & New
          </button>
          <button
            className="border border-border rounded-md px-3 py-1 bg-background text-sm"
            onClick={onClear}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="p-3 space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
          <div className="md:col-span-6">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Customer:Job
            </label>
            <input
              value={draft.customerJob}
              onChange={(e) =>
                setDraft((p) => ({ ...p, customerJob: e.target.value }))
              }
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
              placeholder="Select / type customer:job"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Class
            </label>
            <select
              value={draft.className}
              onChange={(e) => setDraft((p) => ({ ...p, className: e.target.value }))}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
            >
              {CLASS_OPTIONS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Template
            </label>
            <select
              value={draft.template}
              onChange={(e) => setDraft((p) => ({ ...p, template: e.target.value }))}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
            >
              {TEMPLATE_OPTIONS.map((x) => (
                <option key={x} value={x}>
                  {x}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Date
            </label>
            <input
              type="date"
              value={draft.date}
              onChange={(e) => setDraft((p) => ({ ...p, date: e.target.value }))}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Estimate #
            </label>
            <input
              value={draft.id}
              onChange={(e) => setDraft((p) => ({ ...p, id: e.target.value }))}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
            />
          </div>

          <div className="md:col-span-8">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Name / Address
            </label>
            <textarea
              value={draft.nameAddress}
              onChange={(e) =>
                setDraft((p) => ({ ...p, nameAddress: e.target.value }))
              }
              className="w-full border border-border rounded-md px-2 py-1 bg-background min-h-[70px]"
              placeholder="Name / Address block"
            />
          </div>
        </div>

       
        <div className="border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm table-fixed">
            <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <Th className="w-[18%]">Item</Th>
                <Th className="w-[46%]">Description</Th>
                <Th className="w-[10%]">Qty</Th>
                <Th className="w-[12%]">Cost</Th>
                <Th className="w-[14%]">Total</Th>
              </tr>
            </thead>

            <tbody>
              {(draft.items || []).map((row, idx) => {
                const qty = Number(row.qty) || 0;
                const cost = Number(row.cost) || 0;
                const lineTotal = qty * cost;

                return (
                  <tr
                    key={idx}
                    className={cn(
                      "border-t",
                      idx % 2 === 0 ? "bg-white" : "bg-muted/10",
                    )}
                  >
                    <Td>
                      <input
                        value={row.item}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            items: p.items.map((it, i) =>
                              i === idx ? { ...it, item: e.target.value } : it,
                            ),
                          }))
                        }
                        className="w-full border border-border rounded-md px-2 py-1 bg-background"
                        placeholder="Item"
                      />
                    </Td>

                    <Td>
                      <input
                        value={row.description}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            items: p.items.map((it, i) =>
                              i === idx
                                ? { ...it, description: e.target.value }
                                : it,
                            ),
                          }))
                        }
                        className="w-full border border-border rounded-md px-2 py-1 bg-background"
                        placeholder="Description"
                      />
                    </Td>

                    <Td>
                      <input
                        value={row.qty}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            items: p.items.map((it, i) =>
                              i === idx
                                ? { ...it, qty: clampNumber(e.target.value) }
                                : it,
                            ),
                          }))
                        }
                        className="w-full border border-border rounded-md px-2 py-1 bg-background text-right"
                        inputMode="numeric"
                      />
                    </Td>

                    <Td>
                      <input
                        value={row.cost}
                        onChange={(e) =>
                          setDraft((p) => ({
                            ...p,
                            items: p.items.map((it, i) =>
                              i === idx
                                ? { ...it, cost: clampNumber(e.target.value) }
                                : it,
                            ),
                          }))
                        }
                        className="w-full border border-border rounded-md px-2 py-1 bg-background text-right"
                        inputMode="decimal"
                      />
                    </Td>

                    <Td className="text-slate-700 whitespace-nowrap">
                      <div className="flex items-center justify-between gap-2">
                        <span className="ml-auto">{formatMoney(lineTotal)}</span>
                        <button
                          className="border border-border rounded-md px-2 py-1 bg-background text-xs"
                          onClick={() => onRemoveLine(idx)}
                          title="Remove line"
                        >
                          ✕
                        </button>
                      </div>
                    </Td>
                  </tr>
                );
              })}

              {(draft.items || []).length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={5}
                    className="px-3 py-8 text-center text-sm text-muted-foreground"
                  >
                    No line items
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="p-2 border-t border-border flex items-center justify-between">
            <button
              className="border border-border rounded-md px-3 py-1 bg-background text-sm"
              onClick={onAddLine}
            >
              + Add Line
            </button>
            <div className="text-xs text-muted-foreground">
             
            </div>
          </div>
        </div>

        {/* bottom area  */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 text-sm">
          <div className="md:col-span-6">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Customer Message
            </label>
            <input
              value={draft.customerMessage}
              onChange={(e) =>
                setDraft((p) => ({ ...p, customerMessage: e.target.value }))
              }
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
              placeholder="Customer message..."
            />
          </div>

          <div className="md:col-span-6">
            <label className="block text-xs uppercase text-muted-foreground mb-1">
              Memo
            </label>
            <input
              value={draft.memo}
              onChange={(e) => setDraft((p) => ({ ...p, memo: e.target.value }))}
              className="w-full border border-border rounded-md px-2 py-1 bg-background"
              placeholder="Memo..."
            />
          </div>

          <div className="md:col-span-6" />

          <div className="md:col-span-6">
            <div className="border border-border rounded-xl p-3 bg-muted/5">
              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground text-xs uppercase">
                  Subtotal
                </span>
                <span className="text-slate-700">{formatMoney(totals.subtotal)}</span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-muted-foreground text-xs uppercase">
                  Markup
                </span>
                <input
                  value={draft.markup}
                  onChange={(e) =>
                    setDraft((p) => ({ ...p, markup: clampNumber(e.target.value) }))
                  }
                  className="w-[140px] border border-border rounded-md px-2 py-1 bg-background text-right"
                  inputMode="decimal"
                />
              </div>

              <div className="flex items-center justify-between py-1 border-t border-border mt-2 pt-2">
                <span className="text-muted-foreground text-xs uppercase">
                  Total
                </span>
                <span className="font-semibold text-slate-800">
                  {formatMoney(totals.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================= HELPERS ================= */

function sumItems(items) {
  if (!Array.isArray(items)) return 0;
  let s = 0;
  for (const r of items) {
    const qty = Number(r?.qty) || 0;
    const cost = Number(r?.cost) || 0;
    s += qty * cost;
  }
  return s;
}

function getEstimateTotal(e) {
  const subtotal = sumItems(e.items || []);
  const markup = Number(e.markup) || 0;
  return subtotal + markup;
}

function nextEstimateId(all) {
  // find max EST-xxxx, return next
  const nums = (all || [])
    .map((x) => String(x.id || ""))
    .map((id) => {
      const m = id.match(/EST-(\d+)/i);
      return m ? Number(m[1]) : null;
    })
    .filter((n) => typeof n === "number" && !Number.isNaN(n));
  const max = nums.length ? Math.max(...nums) : 0;
  const next = String(max + 1).padStart(4, "0");
  return `EST-${next}`;
}

function normalizeEstimate(d) {
  const items = (d.items || [])
    .map((r) => ({
      item: String(r.item || "").trim(),
      description: String(r.description || "").trim(),
      qty: Number(r.qty) || 0,
      cost: Number(r.cost) || 0,
    }))
    // keep rows that have something meaningful
    .filter((r) => r.item || r.description || r.qty !== 0 || r.cost !== 0);

  return {
    ...d,
    id: String(d.id || "").trim() || "EST-0000",
    customerJob: String(d.customerJob || "").trim(),
    className: d.className || "—",
    template: d.template || "Retail Estimate",
    date: d.date || new Date().toISOString().slice(0, 10),
    nameAddress: String(d.nameAddress || ""),
    customerMessage: String(d.customerMessage || "—"),
    memo: String(d.memo || "—"),
    markup: Number(d.markup) || 0,
    items,
  };
}

function clampNumber(v) {
  // allow empty, digits, dot
  const s = String(v ?? "");
  if (s === "") return "";
  const cleaned = s.replace(/[^\d.]/g, "");
  // prevent multiple dots
  const parts = cleaned.split(".");
  if (parts.length <= 2) return cleaned;
  return parts[0] + "." + parts.slice(1).join("");
}

function formatMoney(n) {
  const num = Number(n) || 0;
  return num.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
}

/* ================= SMALL COMPONENTS ================= */

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
  return <td className={cn("px-3 py-2 align-top", className)}>{children}</td>;
}