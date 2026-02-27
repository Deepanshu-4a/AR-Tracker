// ==============================
// CustomerRelationshipSidebar.jsx
// ✅ Same UI vibe as Transactions (Tailwind)
// ✅ TRUE 3-LEVEL TREE: Customer -> Projects -> Jobs (as in screenshot)
// ✅ Indentation + expand/collapse per level
// ✅ Green selected row across full width
// ✅ Header + rows like a grid (NAME | BALAN. | ATT.)
// ==============================
import { useMemo, useState } from "react";
import { cn } from "../ui/utils";

/* ================= MOCK TREE DATA =================
   Customer -> Projects -> Jobs
*/
const SAMPLE_RELATIONSHIPS = [
  {
    id: "C-INNOSOFT",
    type: "customer",
    name: "Innosoft Corporation.",
    balance: 0,
    att: "",
    projects: [],
  },
  {
    id: "C-IRS",
    type: "customer",
    name: "IRS",
    balance: 0,
    att: "",
    projects: [
      {
        id: "P-TEGE",
        type: "project",
        name: "TEGE",
        balance: 0,
        att: "",
        jobs: [
          { id: "J-PH1", type: "job", name: "Phase1", balance: 0, att: "" },
          { id: "J-PH2", type: "job", name: "Phase2", balance: 0, att: "" },
          { id: "J-PH3", type: "job", name: "Phase3", balance: 0, att: "" },
        ],
      },
    ],
  },
  {
    id: "C-KFORCE",
    type: "customer",
    name: "KFORCE",
    balance: 0,
    att: "",
    projects: [
      {
        id: "P-PLUTO",
        type: "project",
        name: "Pluto",
        balance: 0,
        att: "",
        jobs: [],
      },
    ],
  },
  {
    id: "C-MD",
    type: "customer",
    name: "MD",
    balance: 1392.0,
    att: "",
    projects: [
      {
        id: "P-ATR",
        type: "project",
        name: "ATR",
        balance: 816.24,
        att: "",
        jobs: [
          {
            id: "J-TO16",
            type: "job",
            name: "TO#16",
            balance: 53305,
            att: "",
            jobs: [
              // allow deeper nesting if your real data has it
              {
                id: "J-MDHBASE",
                type: "job",
                name: "MDH-Base",
                balance: 53305,
                att: "",
              },
            ],
          },
          {
            id: "J-TO21",
            type: "job",
            name: "TO#21",
            balance: 12769,
            att: "",
            jobs: [
              {
                id: "J-DHSBASE",
                type: "job",
                name: "DHS-Base",
                balance: 12769,
                att: "",
              },
            ],
          },
          {
            id: "J-TO44",
            type: "job",
            name: "TO#44",
            balance: 16935,
            att: "",
            jobs: [
              {
                id: "J-MDSRABASE",
                type: "job",
                name: "MDSRA-Base",
                balance: 85736,
                att: "",
              },
            ],
          },
          {
            id: "J-MDSRAOY1",
            type: "job",
            name: "MDSRA-OY1",
            balance: 83615,
            att: "",
          },
          { id: "J-TO46", type: "job", name: "TO#46", balance: 65685, att: "" },
          {
            id: "J-WDCSBASE",
            type: "job",
            name: "WDCS-Base",
            balance: 65685,
            att: "",
          },
        ],
      },
    ],
  },
];

/* ================= helpers ================= */

function fmtBal(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

/**
 * Build a stable "expand key" so customer/project/job can expand independently.
 */
function keyOf(node) {
  return `${node.type}:${node.id}`;
}

/**
 * Flatten 3-level tree into rows:
 * - Customer
 *   - Project
 *     - Job
 * (Jobs may optionally contain nested jobs; handled recursively)
 */
function flattenTree(customers, expanded, query) {
  const q = query.trim().toLowerCase();
  const out = [];

  const pushRow = (node, depth, hasChildren) => {
    out.push({
      ...node,
      depth,
      hasChildren,
      expandKey: keyOf(node),
    });
  };

  const match = (node) =>
    String(node.name ?? "")
      .toLowerCase()
      .includes(q);

  const walkJobs = (jobs, depth) => {
    for (const j of jobs || []) {
      const childJobs = j.jobs || [];
      const hasChildren = childJobs.length > 0;
      const k = keyOf(j);

      if (q) {
        // when searching, just show matches (and their parent path is not required here)
        if (match(j)) pushRow(j, depth, hasChildren);
        walkJobs(childJobs, depth + 1);
      } else {
        pushRow(j, depth, hasChildren);
        if (hasChildren && expanded[k]) walkJobs(childJobs, depth + 1);
      }
    }
  };

  for (const c of customers) {
    const hasProjects = (c.projects || []).length > 0;
    const ck = keyOf(c);

    if (q) {
      if (match(c)) pushRow(c, 0, hasProjects);
      for (const p of c.projects || []) {
        const hasJobs = (p.jobs || []).length > 0;
        if (match(p)) pushRow(p, 1, hasJobs);
        walkJobs(p.jobs || [], 2);
      }
      continue;
    }

    pushRow(c, 0, hasProjects);

    if (hasProjects && expanded[ck]) {
      for (const p of c.projects || []) {
        const hasJobs = (p.jobs || []).length > 0;
        const pk = keyOf(p);

        pushRow(p, 1, hasJobs);

        if (hasJobs && expanded[pk]) {
          walkJobs(p.jobs || [], 2);
        }
      }
    }
  }

  return out;
}

/* ================= component ================= */

export function CustomerRelationshipSidebar({ items, selectedId, onSelect }) {
  const [group, setGroup] = useState("Active Customers");
  const [q, setQ] = useState("");

  const base = items?.length ? items : SAMPLE_RELATIONSHIPS;

  // expand default: customers + projects expanded (like screenshot)
  const [expanded, setExpanded] = useState(() => {
    const init = {};
    for (const c of base) {
      init[keyOf(c)] = true;
      for (const p of c.projects || []) init[keyOf(p)] = true;
    }
    return init;
  });

  const rows = useMemo(
    () => flattenTree(base, expanded, q),
    [base, expanded, q],
  );

  const toggle = (expandKey) =>
    setExpanded((prev) => ({ ...prev, [expandKey]: !prev[expandKey] }));

  return (
    <div className="w-[320px] shrink-0">
      <div className="rounded-2xl border border-border/60 bg-card shadow-lg overflow-hidden">
        {/* Controls (same vibe as app) */}
        <div className="px-4 py-4 border-b border-border/60 bg-muted/30 space-y-3">
          <select
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="w-full h-10 border border-border rounded-md px-2 bg-background text-sm"
          >
            <option>Active Customers</option>
            <option>All Customers</option>
            <option>Inactive Customers</option>
          </select>

          <div className="flex gap-2">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search..."
              className="h-10 flex-1 border border-border rounded-md px-3 bg-background text-sm outline-none"
            />

            <button
              type="button"
              className="h-10 w-10 border border-border rounded-md bg-background hover:bg-muted/40 transition grid place-items-center"
              title="Search"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="11"
                  cy="11"
                  r="7"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M20 20l-3.5-3.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Scrollable grid like your other tables */}
        <div className="h-[560px] overflow-y-auto">
          <table className="w-full text-sm table-fixed">
            <thead className="sticky top-0 z-10 bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
              <tr>
                <Th className="w-[60%]">Name</Th>
                <Th className="w-[30%] text-right">Balan.</Th>
                <Th className="w-[10%] text-center">Att.</Th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => {
                const isActive = r.id === selectedId;

                // indent per depth (customer=0, project=1, job=2, ...)
                const pad = 10 + r.depth * 16;

                return (
                  <tr
                    key={`${r.expandKey}-${i}`}
                    className={cn(
                      "border-t transition-colors",
                      isActive
                        ? "bg-orange-500 text-white"
                        : i % 2 === 0
                          ? "bg-white"
                          : "bg-muted/10",
                      !isActive && "hover:bg-muted/30",
                    )}
                    onClick={() => onSelect?.(r)}
                    style={{ cursor: "pointer" }}
                  >
                    <Td
                      className={cn(
                        "truncate",
                        isActive ? "" : "text-slate-700",
                      )}
                    >
                      <div
                        className="flex items-center gap-2"
                        style={{ paddingLeft: pad }}
                      >
                        {/* caret for expandable nodes */}
                        {r.hasChildren ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggle(r.expandKey);
                            }}
                            className={cn(
                              "w-6 h-6 grid place-items-center rounded-md border",
                              isActive
                                ? "border-white/25 hover:bg-white/10"
                                : "border-border hover:bg-muted/40",
                            )}
                            aria-label={
                              expanded[r.expandKey] ? "Collapse" : "Expand"
                            }
                          >
                            <span className="text-xs leading-none">
                              {expanded[r.expandKey] ? "▾" : "▸"}
                            </span>
                          </button>
                        ) : (
                          <span className="inline-block w-6" />
                        )}

                        <span
                          className={cn(
                            "truncate",
                            r.depth === 0 ? "font-semibold" : "font-medium",
                          )}
                        >
                          {r.name ?? "—"}
                        </span>
                      </div>
                    </Td>

                    <Td
                      className={cn(
                        "text-right tabular-nums font-medium",
                        isActive ? "" : "text-slate-700",
                      )}
                    >
                      {fmtBal(r.balance)}
                    </Td>

                    <Td
                      className={cn(
                        "text-center",
                        isActive ? "" : "text-slate-700",
                      )}
                    >
                      {r.att ?? ""}
                    </Td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={3}
                    className="px-3 py-8 text-center text-sm text-muted-foreground"
                  >
                    No results
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ===== helpers (same style as Transactions/Contacts) ===== */

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
