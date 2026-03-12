import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BillFormModal } from "./BillFormModal";
import { useNavigate } from "react-router-dom";
const fmtMoney = (n) =>
  Number(n || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const daysBetween = (a, b) => {
  const da = new Date(a + "T00:00:00");
  const db = new Date(b + "T00:00:00");
  return Math.round((db - da) / (1000 * 60 * 60 * 24));
};

const toMMDDYYYY = (iso) => {
  const d = new Date(iso + "T00:00:00");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
};

export function VendorTransactions({ vendorId }) {
  const [show, setShow] = useState("bills");
  const [filterBy, setFilterBy] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedNum, setSelectedNum] = useState("ATS-00002");
  const [billModalOpen, setBillModalOpen] = useState(false);
  const navigate = useNavigate();
  const rows = useMemo(
    () => [
      {
        type: "Bill",
        num: "ATS-00001",
        date: "2025-01-31",
        dueDate: "2025-03-02",
        amount: 21250,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00002",
        date: "2025-02-28",
        dueDate: "2025-03-30",
        amount: 19000,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00003",
        date: "2025-03-31",
        dueDate: "2025-04-30",
        amount: 21000,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00004",
        date: "2025-04-30",
        dueDate: "2025-05-30",
        amount: 22000,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00005",
        date: "2025-05-31",
        dueDate: "2025-06-30",
        amount: 21000,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00006",
        date: "2025-06-30",
        dueDate: "2025-07-30",
        amount: 20000,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00007",
        date: "2025-07-31",
        dueDate: "2025-08-30",
        amount: 18000,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00008",
        date: "2025-08-31",
        dueDate: "2025-09-30",
        amount: 21000,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00009",
        date: "2025-09-30",
        dueDate: "2025-10-30",
        amount: 21750,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00010",
        date: "2025-10-31",
        dueDate: "2025-11-30",
        amount: 23500,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00011",
        date: "2025-11-30",
        dueDate: "2025-12-30",
        amount: 17375,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
      {
        type: "Bill",
        num: "ATS-00012",
        date: "2025-12-31",
        dueDate: "2026-01-30",
        amount: 22000,
        openBalance: 0,
        status: "closed",
        kind: "bills",
      },
    ],
    [],
  );

  const nowISO = "2026-01-30";

  const filtered = useMemo(() => {
    const now = new Date(nowISO + "T00:00:00");
    const cutoff90 = new Date(now);
    cutoff90.setDate(cutoff90.getDate() - 90);
    const ytd = new Date(now.getFullYear(), 0, 1);

    return rows
      .filter((r) => (show === "all" ? true : r.kind === show))
      .filter((r) => {
        if (filterBy === "all") return true;
        return filterBy === "open"
          ? r.status === "open"
          : r.status === "closed";
      })
      .filter((r) => {
        if (dateFilter === "all") return true;
        const d = new Date(r.date + "T00:00:00");
        if (dateFilter === "90") return d >= cutoff90 && d <= now;
        if (dateFilter === "ytd") return d >= ytd && d <= now;
        return true;
      });
  }, [rows, show, filterBy, dateFilter]);

  const data = useMemo(
    () =>
      filtered.map((r) => ({
        ...r,
        aging: Math.max(0, daysBetween(r.dueDate, nowISO)),
      })),
    [filtered],
  );

  return (
    <>
      <Card className="border border-border/60 rounded-xl bg-white overflow-hidden">
        <div className="flex flex-wrap items-center gap-4 px-4 py-3 bg-[#f3f4f6] border-b">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-[#6b7280] uppercase">
              Show
            </span>
            <Select value={show} onValueChange={setShow}>
              <SelectTrigger className="h-8 w-[140px] bg-white text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bills">Bills</SelectItem>
                <SelectItem value="payments">Payments</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-[#6b7280] uppercase">
              Filter By
            </span>
            <Select value={filterBy} onValueChange={setFilterBy}>
              <SelectTrigger className="h-8 w-[160px] bg-white text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Bills</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-[#6b7280] uppercase">
              Date
            </span>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="h-8 w-[120px] bg-white text-[12px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="90">Last 90 days</SelectItem>
                <SelectItem value="ytd">YTD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            className="ml-auto h-8 rounded-md text-[12px] cursor-pointer"
            onClick={() => setBillModalOpen(true)}
          >
            + Add Bill
          </Button>

          <div className="text-[11px] text-[#6b7280]">
            Vendor:{" "}
            <span className="font-medium text-[#374151]">
              {vendorId || "—"}
            </span>
          </div>
        </div>

        <div className="max-h-[520px] overflow-y-auto overflow-x-hidden">
          <table className="w-full table-fixed border-collapse">
            <thead className="sticky top-0 z-10 bg-white border-b">
              <tr className="text-[11px] font-semibold text-[#6b7280] uppercase">
                <th className="px-4 py-2 text-left border-r w-[14%]">Type</th>
                <th className="px-4 py-2 text-left border-r w-[18%]">Num</th>
                <th className="px-4 py-2 text-left border-r w-[14%]">Date</th>
                <th className="px-4 py-2 text-left border-r w-[18%]">
                  Due Date
                </th>
                <th className="px-4 py-2 text-left border-r w-[14%]">Aging</th>
                <th className="px-4 py-2 text-right border-r w-[14%]">
                  Amount
                </th>
                <th className="px-4 py-2 text-right w-[14%]">Open Balance</th>
              </tr>
            </thead>

            <tbody className="text-[12px] text-[#111827]">
              {data.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-10 text-center text-sm text-muted-foreground"
                  >
                    No transactions found for these filters.
                  </td>
                </tr>
              ) : (
                data.map((r, idx) => {
                  const isSelected = r.num === selectedNum;
                  const zebra = idx % 2 === 0 ? "bg-white" : "bg-[#f7fbff]";

                  return (
                    <tr
                      key={r.num}
                      onClick={() => {
                        setSelectedNum(r.num);
                        if (r.type === "Bill") {
                          navigate(`/vendors/${vendorId}/bills/${r.num}`);
                        }
                      }}
                      className={[
                        "border-b cursor-pointer select-none",
                        zebra,
                        "hover:bg-[#e8f2ff] transition-colors",
                        isSelected ? "bg-[#cfe5ff] hover:bg-[#cfe5ff]" : "",
                      ].join(" ")}
                    >
                      <td className="px-4 py-3 border-r truncate">{r.type}</td>
                      <td className="px-4 py-3 border-r font-medium truncate">
                        {r.num}
                      </td>
                      <td className="px-4 py-3 border-r whitespace-nowrap">
                        {toMMDDYYYY(r.date)}
                      </td>
                      <td className="px-4 py-3 border-r whitespace-nowrap">
                        {toMMDDYYYY(r.dueDate)}
                      </td>
                      <td className="px-4 py-3 border-r whitespace-nowrap">
                        {r.aging ? r.aging : ""}
                      </td>
                      <td className="px-4 py-3 border-r text-right tabular-nums whitespace-nowrap">
                        {fmtMoney(r.amount)}
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums whitespace-nowrap">
                        {fmtMoney(r.openBalance)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center gap-3 px-4 py-3 bg-[#f3f4f6] border-t">
          <Button variant="outline" className="h-9 rounded-md text-[12px]">
            Manage Transactions
          </Button>
          <Button variant="outline" className="h-9 rounded-md text-[12px]">
            Run Reports
          </Button>
          <Button variant="outline" className="h-9 rounded-md text-[12px]">
            Schedule Online Payment
          </Button>

          <div className="ml-auto text-[11px] text-[#6b7280]">
            Selected:{" "}
            <span className="font-medium text-[#374151]">
              {selectedNum || "—"}
            </span>
          </div>
        </div>
      </Card>

      <BillFormModal
        open={billModalOpen}
        onOpenChange={setBillModalOpen}
        vendorId={vendorId}
      />
    </>
  );
}
