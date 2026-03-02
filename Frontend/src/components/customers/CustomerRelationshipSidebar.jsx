import { useMemo, useState } from "react";
import { cn } from "../ui/utils";

/* ================= MOCK TREE DATA ================= */
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
];

/* ================= TRANSACTIONS LIST ================= */
const SAMPLE_TRANSACTIONS = [
  "Statement Charges",
  "Sales reciepts",
  "Credit Memos",
  "Refunds",
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

function keyOf(node) {
  return `${node.type}:${node.id}`;
}

function flattenTree(customers, expanded) {
  const out = [];

  const pushRow = (node, depth, hasChildren) => {
    out.push({
      ...node,
      depth,
      hasChildren,
      expandKey: keyOf(node),
    });
  };

  const walkJobs = (jobs, depth) => {
    for (const j of jobs || []) {
      const childJobs = j.jobs || [];
      const hasChildren = childJobs.length > 0;
      const k = keyOf(j);

      pushRow(j, depth, hasChildren);
      if (hasChildren && expanded[k]) walkJobs(childJobs, depth + 1);
    }
  };

  for (const c of customers) {
    const hasProjects = (c.projects || []).length > 0;
    const ck = keyOf(c);

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
  const [activeTab, setActiveTab] = useState("customers");

  const base = items?.length ? items : SAMPLE_RELATIONSHIPS;

  const [expanded, setExpanded] = useState(() => {
    const init = {};
    for (const c of base) {
      init[keyOf(c)] = true;
      for (const p of c.projects || []) init[keyOf(p)] = true;
    }
    return init;
  });

  const rows = useMemo(() => flattenTree(base, expanded), [base, expanded]);

  const toggle = (expandKey) =>
    setExpanded((prev) => ({ ...prev, [expandKey]: !prev[expandKey] }));

  return (
    <div className="w-[320px] shrink-0">
      <div className="rounded-2xl border border-border/60 bg-card shadow-lg overflow-hidden">
       
        <div className="border-b border-border/60 bg-muted/20">
          <div className="flex">
            <button
              type="button"
              onClick={() => setActiveTab("customers")}
              className={cn(
                "flex-1 px-3 py-2 text-xs font-semibold border-r border-border/60",
                activeTab === "customers"
                  ? "bg-white text-slate-900"
                  : "bg-muted/10 text-muted-foreground hover:bg-muted/20"
              )}
            >
              Customers & Jobs
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("transactions")}
              className={cn(
                "flex-1 px-3 py-2 text-xs font-semibold",
                activeTab === "transactions"
                  ? "bg-white text-slate-900"
                  : "bg-muted/10 text-muted-foreground hover:bg-muted/20"
              )}
            >
              Transactions
            </button>
          </div>
        </div>

       
        {activeTab === "customers" ? (
          <div className="h-[560px] overflow-y-auto overflow-x-hidden">
            <table className="w-full text-sm table-fixed">
              <thead className="sticky top-0 z-10 bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
                <tr>
                  <Th className="w-[58%] px-2 py-1.5">Name</Th>
                  <Th className="w-[28%] text-right px-2 py-1.5">Balan.</Th>
                  <Th className="w-[14%] text-center px-1 py-1.5">Att.</Th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r, i) => {
                  const isActive = r.id === selectedId;
                  const pad = r.depth === 0 ? 0 : r.depth * 4;

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
                        !isActive && "hover:bg-muted/30"
                      )}
                      onClick={() => onSelect?.(r)}
                      style={{ cursor: "pointer" }}
                    >
                      <Td
                        className={cn(
                          "truncate px-2 py-1",
                          isActive ? "" : "text-slate-700"
                        )}
                      >
                        <div
                          className="flex items-center gap-1.5"
                          style={{ paddingLeft: pad }}
                        >
                          {r.hasChildren ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggle(r.expandKey);
                              }}
                              className={cn(
                                "w-4 h-4 grid place-items-center rounded-sm border text-[10px]",
                                isActive
                                  ? "border-white/30 hover:bg-white/10"
                                  : "border-border hover:bg-muted/40"
                              )}
                              aria-label={
                                expanded[r.expandKey] ? "Collapse" : "Expand"
                              }
                            >
                              {expanded[r.expandKey] ? "▾" : "▸"}
                            </button>
                          ) : (
                            <span className="inline-block w-4" />
                          )}

                          <span
                            className={cn(
                              "truncate leading-tight",
                              r.depth === 0 ? "font-medium" : "font-medium"
                            )}
                          >
                            {r.name ?? "—"}
                          </span>
                        </div>
                      </Td>

                      <Td
                        className={cn(
                          "text-right tabular-nums font-medium px-2 py-1 leading-tight",
                          isActive ? "" : "text-slate-700"
                        )}
                      >
                        {fmtBal(r.balance)}
                      </Td>

                      <Td
                        className={cn(
                          "text-center px-1 py-1 leading-tight",
                          isActive ? "" : "text-slate-700"
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
                      className="px-2 py-4 text-center text-sm text-muted-foreground"
                    >
                      No results
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          
          <div className="h-[560px] overflow-y-auto overflow-x-hidden bg-white">
            <div className="py-2">
              {SAMPLE_TRANSACTIONS.map((label) => (
                <button
                  key={label}
                  type="button"
                  className="w-full text-left px-3 py-1.5 text-sm text-slate-700 hover:bg-muted/20"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===== helpers ===== */

function Th({ children, className }) {
  return (
    <th className={cn("text-left font-medium whitespace-nowrap", className)}>
      {children}
    </th>
  );
}

function Td({ children, className }) {
  return <td className={cn("whitespace-nowrap", className)}>{children}</td>;
}