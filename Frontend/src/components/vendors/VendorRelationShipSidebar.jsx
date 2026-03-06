import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "../ui/utils";


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
            { id: "V-001", businessName: "AANIS TECH SOLUTIONS, LLC", openBalance: 18180.03, att: "" },
            { id: "V-002", businessName: "Innosof Corporation.", openBalance: 0, att: "" },
            { id: "V-003", businessName: "VSoft Corporation Inc", openBalance: 0, att: "" },
            { id: "V-004", businessName: "KFORCE", openBalance: 0, att: "" },
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
      ? norm.filter((v) => v._name.toLowerCase().includes(query) || v._id.toLowerCase().includes(query))
      : norm;

    // Sort by name
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
    <div className="rounded-2xl border border-border/60 bg-card shadow-sm overflow-hidden">
      {/* Search */}
      <div className="p-3 border-b border-border/50 bg-muted/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search vendors..."
            className="w-full h-10 pl-9 pr-3 rounded-xl border border-border bg-background text-sm outline-none focus:ring-2 focus:ring-ring/30"
          />
        </div>
      </div>

      {/* Header (table-like) */}
      <div className="grid grid-cols-[minmax(0,1fr)_70px_48px] gap-2 px-3 py-2 border-b border-border/50 bg-muted/30">
        <div className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Name <ChevronDown className="w-3.5 h-3.5 opacity-60" />
        </div>
        <div className="text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Bal.
        </div>
        <div className="text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
          Att.
        </div>
      </div>

      {/* List */}
      <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
        {data.length ? (
          data.map((v) => {
            const active = String(selectedId ?? "") === v._id;
            return (
              <button
                key={v._id}
                type="button"
                onClick={() => pick(v)}
                className={cn(
                  "w-full text-left grid grid-cols-[minmax(0,1fr)_70px_48px] gap-2 px-3 py-2 border-b border-border/40",
                  "hover:bg-muted/30 transition-colors",
                  active && "bg-muted/50",
                )}
              >
                <div className="min-w-0">
                  <div className={cn("truncate text-sm", active ? "font-semibold" : "font-medium")}>
                    {v._name}
                  </div>
                  <div className="text-[11px] text-muted-foreground truncate">
                    {v._id}
                  </div>
                </div>

                <div className="text-right text-sm tabular-nums">
                  {v._bal ? (
                    v._bal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  ) : (
                    <span className="text-muted-foreground">0</span>
                  )}
                </div>

                <div className="text-right text-sm text-muted-foreground">
                  {v._att ? v._att : ""}
                </div>
              </button>
            );
          })
        ) : (
          <div className="p-6 text-sm text-muted-foreground">No vendors found.</div>
        )}
      </div>
    </div>
  );
}