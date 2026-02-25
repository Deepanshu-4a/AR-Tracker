// CustomerRelationshipSidebar.jsx
// Matches the screenshot: tree hierarchy, indented children, classic Windows grid UI
import { useMemo, useState } from "react";

const SAMPLE_RELATIONSHIPS = [
  {
    id: "ESG", name: "ESG", balance: 54050, att: "A",
    children: [
      { id: "DOJ", name: "DOJ", balance: 54050, att: "" },
      { id: "EOIR", name: "EOIR", balance: 54050, att: "" },
      { id: "BY", name: "BY", balance: 54050, att: "" },
    ],
  },
  { id: "EXELON", name: "Exelon Business Service Co.", balance: 0, att: "" },
  { id: "GCS", name: "GLOBAL CERTIFICATION SERVICES", balance: 0, att: "" },
  { id: "GSA", name: "GSA MAS IFF", balance: 0, att: "" },
  { id: "INFIC", name: "InfiCare Technologies", balance: 0, att: "" },
  { id: "INNOSOFT", name: "Innosoft Corporation.", balance: 0, att: "" },
  {
    id: "IRIS", name: "RS", balance: 291.66, att: "",
    children: [
      { id: "TEGE", name: "TEGE", balance: 291.66, att: "" },
    ],
  },
  {
    id: "PH_GROUP", name: "Phase1", balance: 0, att: "",
    children: [
      { id: "PH2", name: "Phase2", balance: 0, att: "" },
      { id: "PH3", name: "Phase3", balance: 291.66, att: "" },
    ],
  },
  {
    id: "KFORCE", name: "KFORCE", balance: 0, att: "",
    children: [
      { id: "PLUTO", name: "Pluto", balance: 0, att: "" },
    ],
  },
  {
    id: "MD", name: "MD", balance: 1465.9, att: "",
    children: [
      { id: "ATR", name: "ATR", balance: 890.15, att: "" },
      { id: "TO16", name: "TO#16", balance: 53305, att: "" },
    ],
  },
];

function fmtBal(n) {
  const num = Number(n);
  if (Number.isNaN(num) || num === 0) return "0.00";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
}

function flattenRows(items, expanded) {
  const result = [];
  for (const item of items) {
    const hasChildren = item.children?.length > 0;
    const isExpanded = expanded[item.id];
    result.push({ ...item, depth: 0, hasChildren, isParent: hasChildren });
    if (hasChildren && isExpanded) {
      for (const child of item.children) {
        result.push({ ...child, depth: 1, hasChildren: false, isParent: false });
      }
    }
  }
  return result;
}

export function CustomerRelationshipSidebar({
  items,
  selectedId,
  onSelect,
  height = 580,
}) {
  const [group, setGroup] = useState("Active Customers");
  const [q, setQ] = useState("");
  const [expanded, setExpanded] = useState(() => {
    // Start with all parents expanded to match screenshot
    const init = {};
    SAMPLE_RELATIONSHIPS.forEach((r) => { if (r.children?.length) init[r.id] = true; });
    return init;
  });

  const base = items?.length ? items : SAMPLE_RELATIONSHIPS;

  const rows = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (query) {
      // Flat search
      const flat = [];
      for (const r of base) {
        if (String(r.name).toLowerCase().includes(query))
          flat.push({ ...r, depth: 0, hasChildren: false, isParent: false });
        if (r.children) {
          for (const c of r.children) {
            if (String(c.name).toLowerCase().includes(query))
              flat.push({ ...c, depth: 1, hasChildren: false, isParent: false });
          }
        }
      }
      return flat;
    }
    return flattenRows(base, expanded);
  }, [base, q, expanded]);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const border = "#b0b0b0";
  const grid = "#d0d0d0";
  const headerBg = "#e8e8e8";
  const selectGreen = "#3a7a10";

  return (
    <div
      style={{
        width: 300,
        border: `1px solid ${border}`,
        background: "#f0f0f0",
        boxSizing: "border-box",
        fontFamily: "Tahoma, Arial, sans-serif",
        fontSize: 11,
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
      }}
    >
      {/* Controls */}
      <div style={{ padding: "5px 5px 4px" }}>
        <select
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          style={{
            width: "100%",
            height: 22,
            border: `1px solid ${border}`,
            background: "#fff",
            outline: "none",
            padding: "0 4px",
            fontSize: 11,
            fontFamily: "Tahoma, Arial, sans-serif",
          }}
        >
          <option>Active Customers</option>
          <option>All Customers</option>
          <option>Inactive Customers</option>
        </select>

        <div style={{ display: "flex", gap: 4, marginTop: 4 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder=""
            style={{
              flex: 1,
              height: 21,
              border: `1px solid ${border}`,
              background: "#fff",
              outline: "none",
              padding: "0 4px",
              fontSize: 11,
              fontFamily: "Tahoma, Arial, sans-serif",
            }}
          />
          <button
            type="button"
            style={{
              width: 24,
              height: 21,
              border: `1px solid ${border}`,
              background: "#e8e8e8",
              cursor: "pointer",
              display: "grid",
              placeItems: "center",
              padding: 0,
            }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
              <circle cx="10" cy="10" r="6.5" stroke="#444" strokeWidth="2.2" />
              <path d="M18 18l-3-3" stroke="#444" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Column Headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 78px 32px",
          background: headerBg,
          borderTop: `1px solid ${border}`,
          borderBottom: `1px solid ${border}`,
          fontWeight: 700,
          color: "#222",
          fontSize: 11,
          userSelect: "none",
        }}
      >
        <div style={{ padding: "3px 6px", borderRight: `1px solid ${grid}` }}>NAME</div>
        <div style={{ padding: "3px 6px", textAlign: "right", borderRight: `1px solid ${grid}` }}>BALAN.</div>
        <div style={{ padding: "3px 4px", textAlign: "center" }}>ATT.</div>
      </div>

      {/* Body */}
      <div
        style={{
          height,
          overflowY: "auto",
          overflowX: "hidden",
          background: "#fff",
        }}
      >
        {rows.map((r) => {
          const isActive = r.id === selectedId;
          const indent = r.depth === 1 ? 16 : 0;
          const bullet = r.isParent ? "»" : r.depth === 1 ? "»" : "»";
          // parent rows get » prefix, children also get » (matching screenshot)
          const prefix = r.depth === 0 && !r.isParent ? "»" : r.depth === 1 ? "»" : "»";

          return (
            <div
              key={r.id}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 78px 32px",
                alignItems: "center",
                minHeight: 18,
                borderBottom: `1px solid ${grid}`,
                background: isActive ? selectGreen : "#fff",
                color: isActive ? "#fff" : "#111",
                cursor: "pointer",
                fontSize: 11,
              }}
              onClick={() => {
                if (r.isParent) toggleExpand(r.id);
                onSelect?.(r);
              }}
            >
              {/* Name cell */}
              <div
                style={{
                  padding: "2px 4px 2px",
                  paddingLeft: 4 + indent,
                  borderRight: `1px solid ${isActive ? "rgba(255,255,255,0.3)" : grid}`,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                }}
              >
                <span style={{ color: isActive ? "#cfe8b0" : "#555", fontWeight: 700, fontSize: 10 }}>
                  {prefix}
                </span>
                <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{r.name}</span>
              </div>

              {/* Balance cell */}
              <div
                style={{
                  padding: "2px 5px",
                  textAlign: "right",
                  borderRight: `1px solid ${isActive ? "rgba(255,255,255,0.3)" : grid}`,
                  fontVariantNumeric: "tabular-nums",
                  letterSpacing: "0.02em",
                }}
              >
                {fmtBal(r.balance)}
              </div>

              {/* ATT cell */}
              <div style={{ padding: "2px 4px", textAlign: "center" }}>
                {r.att ?? ""}
              </div>
            </div>
          );
        })}

        {rows.length === 0 && (
          <div style={{ padding: 8, color: "#666", fontSize: 11 }}>No results</div>
        )}
      </div>
    </div>
  );
}

// ─── Demo wrapper so you can see it standalone ───────────────────────────────
export default function App() {
  const [selected, setSelected] = useState("ESG");
  return (
    <div style={{ display: "flex", height: "100vh", alignItems: "flex-start", padding: 16, background: "#d4d0c8" }}>
      <CustomerRelationshipSidebar
        selectedId={selected}
        onSelect={(r) => setSelected(r.id)}
      />
    </div>
  );
}