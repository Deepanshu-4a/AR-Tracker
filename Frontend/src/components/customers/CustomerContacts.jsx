import { useMemo } from "react";
import { cn } from "../ui/utils";

const mockContacts = [
  {
    name: "Ava Thompson",
    email: "ava.thompson@northpeak.com",
    website: "www.northpeak.com",
    address: "4100 Lakeview Drive, Seattle, WA 98109",
    phone: "+1 (206) 555-0175",
  },
  {
    name: "Noah Patel",
    email: "noah.patel@northpeak.com",
    website: "www.northpeak.com",
    address: "4100 Lakeview Drive, Seattle, WA 98109",
    phone: "+1 (206) 555-0132",
  },
  {
    name: "Mia Chen",
    email: "mia.chen@northpeak.com",
    website: "www.northpeak.com",
    address: "4100 Lakeview Drive, Seattle, WA 98109",
    phone: "+1 (206) 555-0199",
  },
  {
    name: "Ethan Brooks",
    email: "ethan.brooks@northpeak.com",
    website: "www.northpeak.com",
    address: "4100 Lakeview Drive, Seattle, WA 98109",
    phone: "+1 (206) 555-0148",
  },
];

export function CustomerContacts({ contacts: propContacts }) {
  const rows = useMemo(() => {
    if (propContacts?.length) {
      return propContacts.map((r) => ({
        name: r.name ?? "—",
        email: r.email ?? r.info ?? "—",
        website: r.website ?? "www.northpeak.com",
        address: r.address ?? "4100 Lakeview Drive, Seattle, WA 98109",
        phone: r.phone ?? r.phoneNumber ?? "—",
      }));
    }
    return mockContacts;
  }, [propContacts]);

  return (
    <div className="flex flex-col h-full min-w-0">
      <style>
        {`
        .contact-scroll::-webkit-scrollbar {
          height: 8px;
        }

        .contact-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .contact-scroll::-webkit-scrollbar-thumb {
          background: rgba(100,116,139,0.35);
          border-radius: 999px;
        }

        .contact-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(100,116,139,0.55);
        }
        `}
      </style>

      <div className="border border-border rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto contact-scroll scroll-smooth">
          <table className="w-full min-w-[980px] text-sm border-collapse">
            <thead className="bg-muted/40 text-muted-foreground text-[11px] uppercase tracking-wide">
              <tr>
                <Th className="min-w-[170px]">Contact Name</Th>
                <Th className="min-w-[230px]">Email</Th>
                <Th className="min-w-[180px]">Company Website</Th>
                <Th className="min-w-[290px]">Address</Th>
                <Th className="min-w-[160px]">Phone Number</Th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => (
                <tr
                  key={`${r.name}-${i}`}
                  className={cn(
                    "border-t hover:bg-muted/30 transition-colors align-top",
                    i % 2 === 0 ? "bg-white" : "bg-muted/10",
                  )}
                >
                  <Td className="font-medium text-slate-700 break-words whitespace-normal">
                    {r.name ?? "—"}
                  </Td>

                  <Td className="text-slate-700 break-all whitespace-normal">
                    {r.email ?? "—"}
                  </Td>

                  <Td className="text-slate-700 break-all whitespace-normal">
                    {r.website ?? "—"}
                  </Td>

                  <Td className="text-slate-700 break-words whitespace-normal">
                    {r.address ?? "—"}
                  </Td>

                  <Td className="text-slate-700 whitespace-nowrap">
                    {r.phone ?? "—"}
                  </Td>
                </tr>
              ))}

              {rows.length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={5}
                    className="px-4 py-8 text-center text-sm text-muted-foreground"
                  >
                    No contacts available
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

function Th({ children, className }) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left font-medium whitespace-nowrap",
        className,
      )}
    >
      {children}
    </th>
  );
}

function Td({ children, className }) {
  return <td className={cn("px-4 py-3", className)}>{children}</td>;
}