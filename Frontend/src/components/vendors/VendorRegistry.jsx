
import { useMemo, useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Search01Icon as Search } from "hugeicons-react";
import { Plus } from "lucide-react";
import { cn } from "../ui/utils";
import { CreateVendorModal } from "./CreateVenderModule";
import {
  CR_STYLES,
  FilterIcon,
  pagerBtn,
  getPageButtons,
  PAGE_SIZE,
} from "../customers/CustomerRegistryUtils.jsx";

/* ─── MOCK DATA ─────────────────────────── */
const mockVendors = [
  {
    businessName: "Alpha Supplies",
    vendorId: "VND-1001",
    netTerms: "Net 30",
    terminationNotice: "30 days",
    status: "Active",
    comments: "Preferred vendor",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "4A Consulting, 4A Ops",
    activeConsultants: 12,
  },
  {
    businessName: "Bright Logistics",
    vendorId: "VND-1002",
    netTerms: "Net 15",
    terminationNotice: "14 days",
    status: "Inactive",
    comments: "On hold",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "Operations",
    activeConsultants: 0,
  },
  {
    businessName: "CloudParts Inc.",
    vendorId: "VND-1003",
    netTerms: "Net 45",
    terminationNotice: "60 days",
    status: "Active",
    comments: "Bulk discounts",
    primaryBusinessUnit: "4A Consulting",
    applicableBusinessUnits: "Engineering, Operations",
    activeConsultants: 4,
  },
];


const VENDOR_COLS = [
  { key: "netTerms", label: "Net Terms", w: 140 },
  { key: "terminationNotice", label: "Termination Notice", w: 190 },
  { key: "status", label: "Status", w: 130 },
  { key: "comments", label: "Comments", w: 220 },
  { key: "primaryBusinessUnit", label: "Primary Business Unit", w: 220 },
  { key: "applicableBusinessUnits", label: "Applicable Business Units", w: 240 },
  { key: "activeConsultants", label: "Active Consultants", w: 170 },
];

// Frozen widths (same idea as customer registry, but only 2 frozen cols)
const FROZEN_W = { name: 220, id: 140 };
const FROZEN_LEFT = { name: 0, id: FROZEN_W.name };

export function VendorRegistry({ vendors: propVendors, onSelectVendor }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const baseRows = useMemo(() => {
    if (propVendors?.length) return propVendors;
    return mockVendors;
  }, [propVendors]);

  const searchedRows = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return baseRows;
    return baseRows.filter((r) => {
      const name = String(r.businessName ?? "").toLowerCase();
      const id = String(r.vendorId ?? "").toLowerCase();
      return name.includes(q) || id.includes(q);
    });
  }, [baseRows, searchTerm]);

  
  const [page, setPage] = useState(1);
  const totalRows = searchedRows.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / PAGE_SIZE));
  const startIdx = (page - 1) * PAGE_SIZE;
  const endIdx = Math.min(totalRows, startIdx + PAGE_SIZE);
  const pageRows = searchedRows.slice(startIdx, endIdx);

  useEffect(() => setPage(1), [searchTerm]);
  useEffect(() => setPage((p) => Math.min(p, totalPages)), [totalPages]);

  const goFirst = () => setPage(1);
  const goPrev = () => setPage((p) => Math.max(1, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages, p + 1));
  const goLast = () => setPage(totalPages);

  // table styles 
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

  return (
    <>
      <style>{CR_STYLES}</style>

      <div className="space-y-3">
        
        <div className="w-[46%]">
          <Card className="p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative w-full lg:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by Business Name"
                  className="pl-10 h-10 w-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-end">
                <Button onClick={() => setIsCreateOpen(true)} className="bg-orange-500 hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  New Vendor
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Registry Table container */}
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
          {/* table scroll  */}
          <div
            className="cr-scroll"
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
                  <th style={th(true, FROZEN_W.id, FROZEN_LEFT.id, true)}>
                    Vendor ID <FilterIcon />
                  </th>

                  {VENDOR_COLS.map((c) => (
                    <th key={c.key} style={th(false, c.w)}>
                      {c.label} <FilterIcon />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {pageRows.length === 0 ? (
                  <tr className="cr-row" style={{ background: "#fff" }}>
                    <td
                      colSpan={2 + VENDOR_COLS.length}
                      style={{
                        padding: "28px 12px",
                        textAlign: "center",
                        color: "#64748b",
                        fontSize: 13,
                        borderBottom: "1px solid #eef2f7",
                      }}
                    >
                      No data available in table
                    </td>
                  </tr>
                ) : (
                  pageRows.map((r, ri) => {
                    const absoluteIndex = startIdx + ri;
                    const rowBg = absoluteIndex % 2 === 0 ? "#fff" : "#f9fafb";

                    return (
                      <tr
                        key={r.vendorId || ri}
                        className="cr-row cursor-pointer"
                        style={{ background: rowBg }}
                        onClick={() => onSelectVendor?.(r)}
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
                        >
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <div style={{ width: "100%" }}>
                                  {r.businessName ?? "—"}
                                </div>
                              </TooltipTrigger>
                              <TooltipContent>View details</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </td>

                        <td
                          style={td(
                            true,
                            FROZEN_W.id,
                            FROZEN_LEFT.id,
                            rowBg,
                            { fontSize: 13, color: "#374151" },
                            true,
                          )}
                        >
                          {r.vendorId ?? "—"}
                        </td>

                        {VENDOR_COLS.map((c) => {
                          let content = r[c.key];

                          if (c.key === "status") {
                            const isActive =
                              String(r.status || "").toLowerCase() === "active";
                            content = (
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  padding: "2px 9px",
                                  borderRadius: 20,
                                  fontSize: 11,
                                  fontWeight: 500,
                                  background: isActive ? "#dcfce7" : "#fee2e2",
                                  color: isActive ? "#16a34a" : "#dc2626",
                                }}
                              >
                                {r.status ?? "—"}
                              </span>
                            );
                          }

                          return (
                            <td
                              key={c.key}
                              style={td(false, c.w, undefined, rowBg, {
                                fontSize: 13,
                                color: "#374151",
                              })}
                            >
                              {content ?? "—"}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          
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
      <CreateVendorModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </>
  );
}