import { useMemo, useState } from "react";
import { cn } from "../ui/utils";

function fmtBal(n) {
  const num = Number(n);
  if (Number.isNaN(num)) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function VendorRelationshipSidebar({
  vendors,
  selectedId,
  onSelect,
}) {
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const list =
      vendors?.length
        ? vendors
        : [
            {
              id: "V-001",
              businessName: "AANIS TECH SOLUTIONS, LLC",
              openBalance: 18180.03,
              att: "",
            },
            {
              id: "V-002",
              businessName: "Innosof Corporation.",
              openBalance: 0,
              att: "",
            },
            {
              id: "V-003",
              businessName: "VSoft Corporation Inc",
              openBalance: 0,
              att: "",
            },
            {
              id: "V-004",
              businessName: "KFORCE",
              openBalance: 0,
              att: "",
            },
          ];

    const norm = list.map((v) => {
      const id = String(v.vendorId ?? v.id ?? "");
      const name = String(v.businessName ?? v.name ?? "—");
      const bal = Number(v.openBalance ?? v.balance ?? 0);
      const att = v.att ?? v.attachment ?? "";
      return { ...v, _id: id, _name: name, _bal: bal, _att: att };
    });

    const query = q.trim().toLowerCase();
    const filtered = query
      ? norm.filter(
          (v) =>
            v._name.toLowerCase().includes(query) ||
            v._id.toLowerCase().includes(query),
        )
      : norm;

    filtered.sort((a, b) => a._name.localeCompare(b._name));
    return filtered;
  }, [vendors, q]);

  function pick(v) {
    onSelect?.({
      type: "vendor",
      id: v._id,
      vendorId: v.vendorId ?? v.id,
      ...v,
    });
  }

  return (
    <div className="w-[300px] shrink-0">
      <div className="rounded-2xl border border-border/60 bg-card shadow-lg overflow-hidden">
        <div className="h-[760px] overflow-y-auto overflow-x-hidden">
          <div className="p-3 pb-0">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search vendors..."
              className="w-full rounded-2xl border border-border bg-background px-3 py-2.5 text-xs outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="p-3">
            <div className="rounded-2xl border border-border/60 overflow-hidden bg-white shadow-sm">
              <table className="w-full text-xs table-fixed">
                <thead className="bg-muted/30 text-muted-foreground text-[11px] uppercase tracking-wide">
                  <tr>
                    <Th className="w-[60%] px-3 py-2">Name</Th>
                    <Th className="w-[26%] text-right px-2 py-2">Balan.</Th>
                    <Th className="w-[14%] text-center px-2 py-2">Att.</Th>
                  </tr>
                </thead>

                <tbody>
                  {data.map((v, i) => {
                    const isActive = String(selectedId ?? "") === v._id;

                    return (
                      <tr
                        key={v._id}
                        className={cn(
                          "border-t transition-colors",
                          isActive
                            ? "bg-orange-500 text-white"
                            : i % 2 === 0
                              ? "bg-white"
                              : "bg-muted/10",
                          !isActive && "hover:bg-muted/30",
                        )}
                        onClick={() => pick(v)}
                        style={{ cursor: "pointer" }}
                      >
                        <Td
                          className={cn(
                            "px-3 py-2",
                            isActive ? "" : "text-slate-700",
                          )}
                        >
                          <div className="min-w-0">
                            <div className="truncate font-medium leading-tight text-[11px]">
                              {v._name}
                            </div>
                            <div
                              className={cn(
                                "truncate text-[10px] leading-tight mt-0.5",
                                isActive
                                  ? "text-white/80"
                                  : "text-muted-foreground",
                              )}
                            >
                              {v._id}
                            </div>
                          </div>
                        </Td>

                        <Td
                          className={cn(
                            "text-right tabular-nums font-medium px-2 py-2 leading-tight text-[11px]",
                            isActive ? "" : "text-slate-700",
                          )}
                        >
                          {fmtBal(v._bal)}
                        </Td>

                        <Td
                          className={cn(
                            "text-center px-2 py-2 leading-tight text-[11px]",
                            isActive ? "" : "text-slate-700",
                          )}
                        >
                          {v._att ?? ""}
                        </Td>
                      </tr>
                    );
                  })}

                  {data.length === 0 && (
                    <tr className="border-t">
                      <td
                        colSpan={3}
                        className="px-3 py-6 text-center text-xs text-muted-foreground"
                      >
                        No vendors found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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