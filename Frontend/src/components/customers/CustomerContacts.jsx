
import { useMemo } from "react";
import { cn } from "../ui/utils";

const mockContacts = [
  { name: "Ava Thompson", info: "ava.thompson@cyberinfotek.com" },
  { name: "Noah Patel", info: "noah.patel@nlbservices.com" },
  { name: "Mia Chen", info: "mia.chen@innovaworks.com" },
  { name: "Ethan Brooks", info: "ethan.brooks@northpeak.com" },
];

export function CustomerContacts({ contacts: propContacts }) {
  const rows = useMemo(() => {
    if (propContacts?.length) return propContacts;
    return mockContacts;
  }, [propContacts]);

  return (
    <div className="flex flex-col h-full min-w-0">
     
      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed">
          <thead className="bg-muted/40 text-muted-foreground text-xs uppercase tracking-wide">
            <tr>
              <Th className="w-[35%]">Contact Name</Th>
              <Th className="w-[65%]">Contact Info</Th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r, i) => (
              <tr
                key={`${r.name}-${i}`}
                className={cn(
                  "border-t hover:bg-muted/30 transition-colors",
                  i % 2 === 0 ? "bg-white" : "bg-muted/10",
                )}
              >
                <Td className="font-medium text-slate-700 truncate">
                  {r.name ?? "—"}
                </Td>
                <Td className="text-slate-700 truncate">{r.info ?? "—"}</Td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr className="border-t">
                <td
                  colSpan={2}
                  className="px-3 py-8 text-center text-sm text-muted-foreground"
                >
                  No contacts available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}



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
    <td className={cn("px-3 py-2 whitespace-nowrap", className)}>
      {children}
    </td>
  );
}