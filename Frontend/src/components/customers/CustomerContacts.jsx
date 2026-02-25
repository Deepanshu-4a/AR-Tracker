// ==============================
// CustomerContacts.jsx
// UPDATED:
// ❌ NO slider
// ❌ NO pagination
// ❌ NO horizontal scrollbar
// Columns: CONTACT NAME | CONTACT INFO
// ==============================
import { useMemo } from "react";
import { CR_STYLES } from "../customers/CustomerRegistryUtils.jsx";

/* ─── MOCK DATA (NO PHONES) ─────────────────────────── */
const mockContacts = [
  { name: "Ava Thompson", info: "ava.thompson@cyberinfotek.com" },
  { name: "Noah Patel", info: "noah.patel@nlbservices.com" },
  { name: "Mia Chen", info: "mia.chen@innovaworks.com" },
  { name: "Ethan Brooks", info: "ethan.brooks@northpeak.com" },
];

/* ✅ TWO COLUMNS — flexible widths so NO horizontal scroll */
const CONTACT_COLS = [
  { key: "name", label: "CONTACT NAME", width: "35%" },
  { key: "info", label: "CONTACT INFO", width: "65%" },
];

export function CustomerContacts({ contacts: propContacts }) {
  const rows = useMemo(() => {
    if (propContacts?.length) return propContacts;
    return mockContacts;
  }, [propContacts]);

  // styles (same theme as CustomerRegistry)
  const th = (w) => ({
    background: "#f4f7fb",
    width: w,
    padding: "11px 12px",
    fontSize: 12,
    fontWeight: 600,
    color: "#64748b",
    textAlign: "left",
    whiteSpace: "nowrap",
    borderBottom: "2px solid #e2e8f0",
    borderRight: "1px solid #e2e8f0",
    boxSizing: "border-box",
  });

  const td = (w, rowBg, extra = {}) => ({
    width: w,
    padding: "10px 12px",
    borderBottom: "1px solid #eef2f7",
    borderRight: "1px solid #eef2f7",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    boxSizing: "border-box",
    background: rowBg,
    ...extra,
  });

  return (
    <>
      <style>{CR_STYLES}</style>

      {/* TABLE ONLY */}
      <div
        style={{
          width: "97%",
          marginLeft: 0,
          marginRight: "auto",
          boxSizing: "border-box",
          border: "1px solid #e2e8f0",
          borderRadius: 8,
          background: "#fff",
          overflow: "hidden", // 🚫 prevents horizontal scroll
          fontFamily: "'DM Sans','Segoe UI',sans-serif",
        }}
      >
        <div
          style={{
            width: "100%",
            overflowX: "hidden", // 🚫 no horizontal scrollbar
            overflowY: "auto",
            maxHeight: 520,
          }}
        >
          <table
            style={{
              borderCollapse: "collapse",
              tableLayout: "fixed",
              width: "100%", // ✅ fit container
            }}
          >
            <thead>
              <tr>
                {CONTACT_COLS.map((c) => (
                  <th key={c.key} style={th(c.width)}>
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => {
                const rowBg = i % 2 === 0 ? "#fff" : "#eaf3ff"; // light blue stripe like image

                return (
                  <tr key={`${r.name}-${i}`} className="cr-row">
                    <td
                      style={td(CONTACT_COLS[0].width, rowBg, {
                        fontSize: 13,
                        fontWeight: 600,
                        color: "#475569",
                      })}
                    >
                      {r.name ?? "—"}
                    </td>

                    <td
                      style={td(CONTACT_COLS[1].width, rowBg, {
                        fontSize: 13,
                        color: "#374151",
                      })}
                    >
                      {r.info ?? "—"}
                    </td>
                  </tr>
                );
              })}

              {/* empty-state row (optional visual like image) */}
              {rows.length === 0 && (
                <tr>
                  <td
                    colSpan={2}
                    style={{
                      padding: "20px",
                      textAlign: "center",
                      color: "#94a3b8",
                      fontSize: 13,
                    }}
                  >
                    No contacts available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}