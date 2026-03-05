import { ArrowLeft, Building2, Mail, Phone, ShieldCheck } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";


export function VendorProfileSidebar({ vendor, onBack }) {
  if (!vendor) return null;

  
  const vendorName = vendor.businessName ?? vendor.name ?? "—";
  const vendorId = vendor.vendorId ?? vendor.id ?? "—";
  const navigate=useNavigate();
  const initials = String(vendorName)
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join("")
    .toUpperCase();

 
  const totalSpend = vendor.totalSpend ?? 325000;
  const complianceStatus = vendor.complianceStatus ?? "Compliant"; // Compliant | Pending | Non-Compliant

  const statusUI =
    complianceStatus === "Compliant"
      ? { label: "Compliant", tone: "bg-emerald-600 text-white", iconColor: "text-emerald-600" }
      : complianceStatus === "Pending"
        ? { label: "Pending", tone: "bg-amber-500 text-white", iconColor: "text-amber-500" }
        : { label: "Non-Compliant", tone: "bg-rose-600 text-white", iconColor: "text-rose-600" };

  return (
    <aside className="sticky top-8">
      <div className="rounded-2xl border border-border/60 bg-card p-7 shadow-sm space-y-8">
        {/* BACK BUTTON */}
        <Button
          variant="ghost"
          onClick={()=> navigate("/vendors")}
          className="px-0 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Vendor Center
        </Button>

        {/* HEADER */}
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarFallback className="text-lg font-semibold bg-muted">
              {initials || "—"}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <h2 className="truncate text-lg font-semibold tracking-tight">
              {vendorName}
            </h2>
            <p className="text-xs text-muted-foreground">Vendor ID {vendorId}</p>
          </div>
        </div>

        {/* ================= VENDOR LIST ================= */}
        <div className="space-y-4">
              <SectionLabel>Vendor Information</SectionLabel>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
            <InfoRow icon={Building2} label="Type" value={vendor.type || "Supplier"} />
            <InfoRow icon={Mail} label="Email" value={vendor.email || "-"} />
            <InfoRow icon={Phone} label="Phone" value={vendor.phone || "-"} />
            <Metric label="Primary Business Unit" value={vendor.primaryBusinessUnit || "-"} />
          </div>
        </div>

        {/* ================= TOTAL SPEND ================= */}
        <div className="space-y-4">
          <SectionLabel>Total spend</SectionLabel>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-3">
            <Metric label="Total Spend" value={`$${Number(totalSpend).toLocaleString()}`} />
            <Metric label="YTD Spend" value={`$${Number(vendor.ytdSpend ?? 98000).toLocaleString()}`} />
            <Metric label="Open Bills" value={vendor.openBills ?? 4} />
            <Metric label="Payment Terms" value={vendor.netTerms ?? vendor.paymentTerms ?? "Net 30"} />
          </div>
        </div>

        {/* ================= COMPLIANCE STATUS ================= */}
        <div className="space-y-4">
          <SectionLabel>Compliance status</SectionLabel>

          <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldCheck className={`h-5 w-5 ${statusUI.iconColor}`} />
                <div>
                  <p className="text-xs text-muted-foreground">Current Status</p>
                  <p className="text-sm font-medium text-foreground">{statusUI.label}</p>
                </div>
              </div>

              <Badge className={`px-3 py-1 rounded-full text-xs ${statusUI.tone}`}>
                {statusUI.label}
              </Badge>
            </div>

            <div className="space-y-2">
              <Metric label="W-9" value={vendor.w9 ?? "On File"} />
              <Metric label="Insurance" value={vendor.insurance ?? "Active"} />
              <Metric label="Last Review" value={vendor.lastComplianceReview ?? "Jan 2026"} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ===================================================== */
/* SMALL COMPONENTS                                      */
/* ===================================================== */

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
      {children}
    </p>
  );
}

function Metric({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium text-foreground">{value}</span>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground shrink-0">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <span className="text-sm font-medium text-right break-words">{value}</span>
    </div>
  );
}