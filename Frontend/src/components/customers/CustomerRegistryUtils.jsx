
/* ─── MOCK DATA  ───────────────────────────────────── */
export const mockCustomers = [
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
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
    primaryBU: "4A Consulting",
    appBU: "—",
    placements: 3,
    currency: "USD",
  },
];
export const CR_STYLES = `
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
`;
export const SCROLL_COLS = [
  { key: "phone", label: "Contact Number", w: 150 },
  { key: "netTerms", label: "Net Terms", w: 120 },
  { key: "termNotice", label: "Termination Notice", w: 160 },
  { key: "status", label: "Status", w: 110 },
  { key: "category", label: "Category", w: 130 },
  { key: "addInfo", label: "Additional Info", w: 140 },
  { key: "primaryBU", label: "Primary Business Unit", w: 190 },
  { key: "appBU", label: "Applicable Business Units", w: 200 },
  { key: "currency", label: "Currency", w: 110 },
];

export const FilterIcon = () => (
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

/* frozen widths */
export const FROZEN_W = { name: 200, id: 110, menu: 40, email: 260 };
export const FROZEN_LEFT = {
  name: 0,
  id: FROZEN_W.name,
  menu: FROZEN_W.name + FROZEN_W.id,
  email: FROZEN_W.name + FROZEN_W.id + FROZEN_W.menu,
};

export const PAGE_SIZE = 10;

/* pagination helpers */
export function pagerBtn(disabled) {
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

export function getPageButtons(current, total) {
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