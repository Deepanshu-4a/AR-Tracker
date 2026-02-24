// ==============================
// CustomerRegistry.jsx (UPDATED)
// ==============================
import { useMemo, useRef, useCallback, useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search01Icon as Search } from "hugeicons-react";
import { Plus, Download } from "lucide-react";
import { CreateCustomerModal } from "./customers/CreateCustomerModal";

/* ─── MOCK DATA (UPDATED) ───────────────────────────────────── */
const mockCustomers = [
  {
    id: "CLN-001",
    name: "MegaMart",
    email: "finance@megamart.com",
    phone: "+1 555-111-2222",
    netTerms: "30 days",
    termNotice: "—",
    status: "Active",
    category: "Retail",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
  {
    id: "CLN-002",
    name: "TechStart Inc",
    email: "accounts@techstart.com",
    phone: "+1 555-333-4444",
    netTerms: "45 days",
    termNotice: "—",
    status: "Active",
    category: "Technology",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 1,
    currency: "USD",
  },
  {
    id: "CLN-003",
    name: "Acme Corp",
    email: "billing@acme.com",
    phone: "+1 555-555-6666",
    netTerms: "15 days",
    termNotice: "—",
    status: "Active",
    category: "Manufacturing",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 2,
    currency: "USD",
  },
  {
    id: "CLN-004",
    name: "MegaMart",
    email: "finance@megamart.com",
    phone: "+1 555-111-2222",
    netTerms: "30 days",
    termNotice: "—",
    status: "Active",
    category: "Retail",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
  {
    id: "CLN-005",
    name: "MegaMart",
    email: "finance@megamart.com",
    phone: "+1 555-111-2222",
    netTerms: "30 days",
    termNotice: "—",
    status: "Active",
    category: "Retail",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
  {
    id: "CLN-006",
    name: "MegaMart",
    email: "finance@megamart.com",
    phone: "+1 555-111-2222",
    netTerms: "30 days",
    termNotice: "—",
    status: "Active",
    category: "Retail",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
  {
    id: "CLN-007",
    name: "MegaMart",
    email: "finance@megamart.com",
    phone: "+1 555-111-2222",
    netTerms: "30 days",
    termNotice: "—",
    status: "Active",
    category: "Retail",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
  {
    id: "CLN-008",
    name: "MegaMart",
    email: "finance@megamart.com",
    phone: "+1 555-111-2222",
    netTerms: "30 days",
    termNotice: "—",
    status: "Active",
    category: "Retail",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
  {
    id: "CLN-009",
    name: "MegaMart",
    email: "finance@megamart.com",
    phone: "+1 555-111-2222",
    netTerms: "30 days",
    termNotice: "—",
    status: "Active",
    category: "Retail",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
  {
    id: "CLN-010",
    name: "MegaMart",
    email: "finance@megamart.com",
    phone: "+1 555-111-2222",
    netTerms: "30 days",
    termNotice: "—",
    status: "Active",
    category: "Retail",
    addInfo: "—",
    primaryBU: "Cyber Infotech, LLC",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
];

const SCROLL_COLS = [
  { key: "phone", label: "Contact Number", w: 150 },
  { key: "netTerms", label: "Net Terms", w: 120 },
  { key: "termNotice", label: "Termination Notice", w: 160 },
  { key: "status", label: "Status", w: 110 },
  { key: "category", label: "Category", w: 130 },
  { key: "addInfo", label: "Additional Info", w: 140 },
  { key: "primaryBU", label: "Primary Business Unit", w: 190 },
  { key: "appBU", label: "Applicable Business Units", w: 200 },
  { key: "placements", label: "Active Placements", w: 160 },
  { key: "currency", label: "Currency", w: 110 },
];

const FilterIcon = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 12 12"
    fill="none"
    style={{ marginLeft: 3, display: "inline", verticalAlign: "middle" }}
  >
    <path
      d="M1 2h10M3 6h6M5 10h2"
      stroke="#94a3b8"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const PlacementIcon = ({ count }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
    <div
      style={{
        width: 26,
        height: 20,
        borderRadius: 3,
        background: count > 0 ? "#3b82f6" : "#93c5fd",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
        <rect
          x="1"
          y="2"
          width="12"
          height="10"
          rx="1.5"
          stroke="white"
          strokeWidth="1.3"
        />
        <path d="M1 5h12" stroke="white" strokeWidth="1.3" />
        <path
          d="M4.5 2V1M9.5 2V1"
          stroke="white"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        {count > 0 && (
          <text x="4" y="10" fill="white" fontSize="5" fontWeight="bold">
            {count}
          </text>
        )}
      </svg>
    </div>
    <div
      style={{
        width: 20,
        height: 20,
        borderRadius: 3,
        background: "#3b82f6",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
        <circle cx="6" cy="4" r="2.2" stroke="white" strokeWidth="1.2" />
        <path
          d="M1.5 10c0-2.485 2.015-4.5 4.5-4.5s4.5 2.015 4.5 4.5"
          stroke="white"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  </div>
);

/* frozen widths */
const FROZEN_W = { name: 200, id: 110, menu: 40, email: 260 };
const FROZEN_LEFT = {
  name: 0,
  id: FROZEN_W.name,
  menu: FROZEN_W.name + FROZEN_W.id,
  email: FROZEN_W.name + FROZEN_W.id + FROZEN_W.menu,
};

const PAGE_SIZE = 10;

export function CustomerRegistry({
  customers: propCustomers,
  onSelectCustomer,
}) {
  // ✅ bring CustomerCenter toolbar features in here (search + create)
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const baseRows = useMemo(() => {
    if (!propCustomers?.length) return mockCustomers;

    return propCustomers.map((c, i) => {
      const base = mockCustomers[i % mockCustomers.length];
      return {
        ...base,
        id: `CLN-0${String(i + 1).padStart(2, "0")}`,
        name: c.name || base.name,
        email: c.email || base.email,
      };
    });
  }, [propCustomers]);

  // ✅ Filter state (kept as-is)
  const [activeFilter, setActiveFilter] = useState("all");

  // ✅ Apply filters (kept as-is)
  const filteredRows = useMemo(() => {
    if (activeFilter === "with")
      return baseRows.filter((r) => (r.placements ?? 0) > 0);
    if (activeFilter === "without")
      return baseRows.filter((r) => (r.placements ?? 0) === 0);
    return baseRows;
  }, [baseRows, activeFilter]);

  // ✅ Search is applied on top of existing filters (doesn't remove anything)
  const searchedRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return filteredRows;
    return filteredRows.filter((r) => {
      const name = String(r.name ?? "").toLowerCase();
      const id = String(r.id ?? "").toLowerCase();
      const email = String(r.email ?? "").toLowerCase();
      return name.includes(q) || id.includes(q) || email.includes(q);
    });
  }, [filteredRows, searchTerm]);

  // pagination (10/page)
  const [page, setPage] = useState(1);
  const totalRows = searchedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = Math.min(totalRows, startIdx + PAGE_SIZE);
  const pageRows = searchedRows.slice(startIdx, endIdx);

  // reset/ clamp page when filter/search changes or row counts change
  useEffect(() => {
    setPage(1);
  }, [activeFilter, searchTerm]);
  useEffect(() => {
    setPage((p) => Math.min(p, totalPages));
  }, [totalPages]);

  // horizontal scroll + slider sync
  const scrollRef = useRef(null);
  const sliderRef = useRef(null);
  const busy = useRef(false);

  const syncSliderFromScroll = useCallback(() => {
    const el = scrollRef.current;
    const sl = sliderRef.current;
    if (!el || !sl || busy.current) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    busy.current = true;
    sl.value = maxScroll > 0 ? String((el.scrollLeft / maxScroll) * 1000) : "0";
    busy.current = false;
  }, []);

  const syncScrollFromSlider = useCallback((e) => {
    const el = scrollRef.current;
    if (!el || busy.current) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    busy.current = true;
    el.scrollLeft = (Number(e.target.value) / 1000) * maxScroll;
    busy.current = false;
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // reset horizontal position on page/filter/search change
    busy.current = true;
    el.scrollLeft = 0;
    if (sliderRef.current) sliderRef.current.value = "0";
    busy.current = false;

    const ro = new ResizeObserver(() => syncSliderFromScroll());
    ro.observe(el);
    return () => ro.disconnect();
  }, [page, activeFilter, searchTerm, syncSliderFromScroll]);

  // styles
  const frozenEdge = {
    borderRight: "2px solid #dde3ed",
    boxShadow: "3px 0 6px -1px rgba(0,0,0,0.07)",
  };

  const th = (frozen, w, left, isLastFrozen = false) => ({
    position: frozen ? "sticky" : "relative",
    left: frozen ? left : undefined,
    zIndex: frozen ? 30 : 2,
    background: "#f4f7fb",
    minWidth: w,
    maxWidth: w,
    width: w,
    padding: "11px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textAlign: "left",
    whiteSpace: "nowrap",
    borderBottom: "2px solid #e2e8f0",
    borderRight: isLastFrozen ? "none" : "1px solid #e2e8f0",
    boxSizing: "border-box",
    ...(isLastFrozen ? frozenEdge : {}),
  });

  const td = (frozen, w, left, rowBg, extra = {}, isLastFrozen = false) => ({
    position: frozen ? "sticky" : "relative",
    left: frozen ? left : undefined,
    zIndex: frozen ? 20 : 1,
    background: frozen ? rowBg : "inherit",
    minWidth: w,
    maxWidth: w,
    width: w,
    padding: "10px 12px",
    borderBottom: "1px solid #eef2f7",
    borderRight: isLastFrozen ? "none" : "1px solid #eef2f7",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    boxSizing: "border-box",
    verticalAlign: "middle",
    ...extra,
    ...(isLastFrozen ? frozenEdge : {}),
  });

  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setPage(totalPages);

  return (
    <>
      <style>{`
        .cr-scroll::-webkit-scrollbar { display: none; }
        .cr-scroll { scrollbar-width: none; -ms-overflow-style: none; }

        /* ✅ hover works on frozen cols too */
        .cr-row:hover { background: #eff6ff !important; }
        .cr-row:hover td { background: #eff6ff !important; }

        .cr-range {
          -webkit-appearance: none; appearance: none;
          width: 100%; height: 5px; border-radius: 3px;
          background: #d1d9e6; outline: none; cursor: pointer; display: block;
        }
        .cr-range::-webkit-slider-thumb {
          -webkit-appearance: none; appearance: none;
          width: 60px; height: 5px; border-radius: 3px;
          background: #94a3b8; cursor: pointer; transition: background .15s;
        }
        .cr-range::-moz-range-thumb {
          width: 60px; height: 5px; border-radius: 3px;
          background: #94a3b8; border: none; cursor: pointer;
        }
        .cr-range:hover::-webkit-slider-thumb { background: #475569; }
        .cr-range:hover::-moz-range-thumb     { background: #475569; }

        /* ✅ filter tabs (kept; you haven't rendered them yet) */
        .cr-tabs{
          display:flex;
          gap:28px;
          align-items:flex-end;
          padding:14px 16px 0;
          background:#f8fafc;
          border-bottom:1px solid #e2e8f0;
        }

        .cr-tab{
          position:relative;
          padding:10px 0 12px;
          font-size:14px;
          font-weight:500;
          color:#64748b;
          cursor:pointer;
          background:transparent;
          border:none;
          outline:none;
          transition:color .15s ease;
        }

        .cr-tab:hover{ color:#0f172a; }
        .cr-tab.active{ color:#ea580c; }
        .cr-tab.active::after{
          content:"";
          position:absolute;
          left:0;
          bottom:-1px;
          width:100%;
          height:2px;
          background:#f97316;
          border-radius:2px;
        }
      `}</style>

      <div className="space-y-3">
        <div className=" w-[46%]">
          <Card className="p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search customers..."
                  className="pl-10 h-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Button
                  className="bg-orange-500 hover:bg-orange-600"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Customer
                </Button>
              </div>
            </div>
          </Card>
        </div>
        {/* ✅ REGISTRY TABLE (your existing registry, unchanged) */}
        <div
          style={{
            width: "97%",
            marginLeft: 0,
            marginRight: "auto",
            boxSizing: "border-box",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            background: "#fff",
            overflow: "hidden",
            fontFamily: "'DM Sans','Segoe UI',sans-serif",
            display: "flex",
            flexDirection: "column",
            minWidth: 0,
          }}
        >
          {/* table scroll */}
          <div
            ref={scrollRef}
            className="cr-scroll"
            onScroll={syncSliderFromScroll}
            style={{
              width: "100%",
              overflowX: "auto",
              overflowY: "auto",
              maxHeight: 520,
              position: "relative",
            }}
          >
            <table
              style={{
                borderCollapse: "collapse",
                tableLayout: "fixed",
                width: "max-content",
                minWidth: "100%",
              }}
            >
              <thead>
                <tr>
                  <th style={th(true, FROZEN_W.name, FROZEN_LEFT.name)}>
                    Business Name <FilterIcon />
                  </th>
                  <th style={th(true, FROZEN_W.id, FROZEN_LEFT.id)}>
                    Client ID <FilterIcon />
                  </th>
                  <th style={th(true, FROZEN_W.menu, FROZEN_LEFT.menu)}></th>
                  <th style={th(true, FROZEN_W.email, FROZEN_LEFT.email, true)}>
                    Email <FilterIcon />
                  </th>

                  {SCROLL_COLS.map((c) => (
                    <th key={c.key} style={th(false, c.w)}>
                      {c.label} <FilterIcon />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pageRows.map((r, ri) => {
                  const absoluteIndex = startIdx + ri;
                  const rowBg = absoluteIndex % 2 === 0 ? "#fff" : "#f9fafb";

                  return (
                    <tr
                      key={r.id}
                      className="cr-row cursor-pointer"
                      style={{ background: rowBg }}
                      onClick={() => onSelectCustomer?.(r)}
                    >
                      <td
                        style={td(
                          true,
                          FROZEN_W.name,
                          FROZEN_LEFT.name,
                          rowBg,
                          {
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#475569",
                            letterSpacing: "-0.01em",
                          },
                        )}
                        title={r.name}
                      >
                        {r.name}
                      </td>

                      <td
                        style={td(true, FROZEN_W.id, FROZEN_LEFT.id, rowBg, {
                          fontSize: 13,
                          color: "#374151",
                        })}
                      >
                        {r.id}
                      </td>

                      <td
                        style={td(
                          true,
                          FROZEN_W.menu,
                          FROZEN_LEFT.menu,
                          rowBg,
                          { padding: "0 4px" },
                        )}
                      >
                        <button
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#94a3b8",
                            fontSize: 18,
                            padding: "0 4px",
                            lineHeight: 1,
                          }}
                        >
                          ⋮
                        </button>
                      </td>

                      <td
                        style={td(
                          true,
                          FROZEN_W.email,
                          FROZEN_LEFT.email,
                          rowBg,
                          { fontSize: 13, color: "#374151" },
                          true,
                        )}
                        title={r.email}
                      >
                        {r.email}
                      </td>

                      {SCROLL_COLS.map((c) => {
                        let content = r[c.key];

                        if (c.key === "status") {
                          content = (
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                padding: "2px 9px",
                                borderRadius: 20,
                                fontSize: 11,
                                fontWeight: 500,
                                background:
                                  r.status === "Active" ? "#dcfce7" : "#fee2e2",
                                color:
                                  r.status === "Active" ? "#16a34a" : "#dc2626",
                              }}
                            >
                              {r.status}
                            </span>
                          );
                        }

                        if (c.key === "placements")
                          content = <PlacementIcon count={r.placements} />;

                        return (
                          <td
                            key={c.key}
                            style={td(false, c.w, undefined, rowBg, {
                              fontSize: 13,
                              color: "#374151",
                            })}
                          >
                            {content}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* slider */}
          <div
            style={{
              padding: "8px 16px 5px",
              borderTop: "1px solid #e8edf3",
              background: "#f4f7fb",
            }}
          >
            <input
              ref={sliderRef}
              type="range"
              min={0}
              max={1000}
              step={1}
              defaultValue={0}
              className="cr-range"
              onChange={syncScrollFromSlider}
            />
          </div>

          {/* footer + pagination */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "7px 16px 9px",
              background: "#f4f7fb",
              fontSize: 12,
              color: "#64748b",
              flexWrap: "wrap",
              gap: 6,
            }}
          >
            <span>
              {totalRows === 0 ? "0–0" : `${startIdx + 1}–${endIdx}`} of{" "}
              {totalRows}
            </span>

            <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
              <button
                onClick={goFirst}
                disabled={page === 1}
                style={pagerBtn(page === 1)}
              >
                «
              </button>
              <button
                onClick={goPrev}
                disabled={page === 1}
                style={pagerBtn(page === 1)}
              >
                ‹
              </button>

              {getPageButtons(page, totalPages).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  style={{
                    ...pagerBtn(false),
                    background: p === page ? "#3b82f6" : "#fff",
                    color: p === page ? "#fff" : "#374151",
                    fontWeight: p === page ? 700 : 400,
                  }}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={goNext}
                disabled={page === totalPages}
                style={pagerBtn(page === totalPages)}
              >
                ›
              </button>
              <button
                onClick={goLast}
                disabled={page === totalPages}
                style={pagerBtn(page === totalPages)}
              >
                »
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ✅ MODAL (Create Customer) */}
      <CreateCustomerModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}

/* pagination helpers */
function pagerBtn(disabled) {
  return {
    width: 27,
    height: 27,
    borderRadius: 5,
    border: "1px solid #dde3ed",
    background: "#fff",
    color: "#374151",
    fontSize: 12,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.5 : 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };
}

function getPageButtons(current, total) {
  const maxBtns = 6;
  if (total <= maxBtns) return Array.from({ length: total }, (_, i) => i + 1);

  const half = Math.floor(maxBtns / 2);
  let start = Math.max(1, current - half);
  let end = start + maxBtns - 1;

  if (end > total) {
    end = total;
    start = end - maxBtns + 1;
  }

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
