import { useMemo, useState } from "react";
import { Check, Pencil, Plus, Trash2, X } from "lucide-react";
import { cn } from "../ui/utils";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const mockContacts = [
  {
    id: "1",
    name: "Ava Thompson",
    email: "ava.thompson@northpeak.com",
    website: "www.northpeak.com",
    address: "4100 Lakeview Drive, Seattle, WA 98109",
    phone: "+1 (206) 555-0175",
  },
  {
    id: "2",
    name: "Noah Patel",
    email: "noah.patel@northpeak.com",
    website: "www.northpeak.com",
    address: "4100 Lakeview Drive, Seattle, WA 98109",
    phone: "+1 (206) 555-0132",
  },
  {
    id: "3",
    name: "Mia Chen",
    email: "mia.chen@northpeak.com",
    website: "www.northpeak.com",
    address: "4100 Lakeview Drive, Seattle, WA 98109",
    phone: "+1 (206) 555-0199",
  },
  {
    id: "4",
    name: "Ethan Brooks",
    email: "ethan.brooks@northpeak.com",
    website: "www.northpeak.com",
    address: "4100 Lakeview Drive, Seattle, WA 98109",
    phone: "+1 (206) 555-0148",
  },
];

function makeId() {
  return `contact_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function normalizeContact(r) {
  return {
    id: r.id ?? makeId(),
    name: r.name ?? "—",
    email: r.email ?? r.info ?? "—",
    website: r.website ?? "www.northpeak.com",
    address: r.address ?? "4100 Lakeview Drive, Seattle, WA 98109",
    phone: r.phone ?? r.phoneNumber ?? "—",
  };
}

const emptyForm = {
  name: "",
  email: "",
  website: "",
  address: "",
  phone: "",
};

export function CustomerContacts({ contacts: propContacts }) {
  const initialRows = useMemo(() => {
    if (propContacts?.length) {
      return propContacts.map(normalizeContact);
    }
    return mockContacts.map(normalizeContact);
  }, [propContacts]);

  const [rows, setRows] = useState(initialRows);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const handleChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddContact = () => {
    if (!form.name.trim() || !form.email.trim()) return;

    const newContact = {
      id: makeId(),
      name: form.name.trim(),
      email: form.email.trim(),
      website: form.website.trim() || "—",
      address: form.address.trim() || "—",
      phone: form.phone.trim() || "—",
    };

    setRows((prev) => [newContact, ...prev]);
    setForm(emptyForm);
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setForm(emptyForm);
    setShowAddForm(false);
  };

  const handleStartEdit = (contact) => {
    setEditingId(contact.id);
    setEditForm({
      name: contact.name === "—" ? "" : contact.name,
      email: contact.email === "—" ? "" : contact.email,
      website: contact.website === "—" ? "" : contact.website,
      address: contact.address === "—" ? "" : contact.address,
      phone: contact.phone === "—" ? "" : contact.phone,
    });
  };

  const handleSaveEdit = (id) => {
    if (!editForm.name.trim() || !editForm.email.trim()) return;

    setRows((prev) =>
      prev.map((row) =>
        row.id === id
          ? {
              ...row,
              name: editForm.name.trim(),
              email: editForm.email.trim(),
              website: editForm.website.trim() || "—",
              address: editForm.address.trim() || "—",
              phone: editForm.phone.trim() || "—",
            }
          : row,
      ),
    );

    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm(emptyForm);
  };

  const handleDeleteContact = (id) => {
    setRows((prev) => prev.filter((row) => row.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setEditForm(emptyForm);
    }
    setDeleteTarget(null);
  };

  return (
    <div className="flex flex-col h-full min-w-0 gap-4">
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

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Contacts</h2>
          <p className="text-sm text-muted-foreground">
            Manage customer contact details
          </p>
        </div>

        <Button
          type="button"
          onClick={() => setShowAddForm((prev) => !prev)}
          className="inline-flex items-center gap-2 hover:cursor-pointer"
        >
          {showAddForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showAddForm ? "Close" : "Add Contact"}
        </Button>
      </div>

      {showAddForm && (
        <div className="border border-border rounded-xl bg-white p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              placeholder="Contact name"
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
            <Input
              placeholder="Company website"
              value={form.website}
              onChange={(e) => handleChange("website", e.target.value)}
            />
            <Input
              placeholder="Phone number"
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
            />
            <div className="md:col-span-2">
              <Input
                placeholder="Address"
                value={form.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button
              className="hover:cursor-pointer"
              type="button"
              variant="outline"
              onClick={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="hover:cursor-pointer"
              type="button"
              onClick={handleAddContact}
            >
              Save Contact
            </Button>
          </div>
        </div>
      )}

      <div className="border border-border rounded-xl overflow-hidden bg-white">
        <div className="overflow-x-auto contact-scroll scroll-smooth">
          <table className="w-full min-w-[1160px] text-sm border-collapse">
            <thead className="bg-muted/40 text-muted-foreground text-[11px] uppercase tracking-wide">
              <tr>
                <Th className="min-w-[170px]">Contact Name</Th>
                <Th className="min-w-[230px]">Email</Th>
                <Th className="min-w-[180px]">Company Website</Th>
                <Th className="min-w-[290px]">Address</Th>
                <Th className="min-w-[160px]">Phone Number</Th>
                <Th className="min-w-[120px] text-right">Actions</Th>
              </tr>
            </thead>

            <tbody>
              {rows.map((r, i) => {
                const isEditing = editingId === r.id;

                return (
                  <tr
                    key={r.id}
                    className={cn(
                      "border-t hover:bg-muted/30 transition-colors align-top",
                      i % 2 === 0 ? "bg-white" : "bg-muted/10",
                    )}
                  >
                    <Td className="font-medium text-slate-700 break-words whitespace-normal">
                      {isEditing ? (
                        <Input
                          value={editForm.name}
                          onChange={(e) =>
                            handleEditChange("name", e.target.value)
                          }
                          placeholder="Contact name"
                          className="min-w-[150px]"
                        />
                      ) : (
                        r.name ?? "—"
                      )}
                    </Td>

                    <Td className="text-slate-700 break-all whitespace-normal">
                      {isEditing ? (
                        <Input
                          value={editForm.email}
                          onChange={(e) =>
                            handleEditChange("email", e.target.value)
                          }
                          placeholder="Email"
                          className="min-w-[210px]"
                        />
                      ) : (
                        r.email ?? "—"
                      )}
                    </Td>

                    <Td className="text-slate-700 break-all whitespace-normal">
                      {isEditing ? (
                        <Input
                          value={editForm.website}
                          onChange={(e) =>
                            handleEditChange("website", e.target.value)
                          }
                          placeholder="Website"
                          className="min-w-[160px]"
                        />
                      ) : (
                        r.website ?? "—"
                      )}
                    </Td>

                    <Td className="text-slate-700 break-words whitespace-normal">
                      {isEditing ? (
                        <Input
                          value={editForm.address}
                          onChange={(e) =>
                            handleEditChange("address", e.target.value)
                          }
                          placeholder="Address"
                          className="min-w-[260px]"
                        />
                      ) : (
                        r.address ?? "—"
                      )}
                    </Td>

                    <Td className="text-slate-700 whitespace-nowrap">
                      {isEditing ? (
                        <Input
                          value={editForm.phone}
                          onChange={(e) =>
                            handleEditChange("phone", e.target.value)
                          }
                          placeholder="Phone"
                          className="min-w-[140px]"
                        />
                      ) : (
                        r.phone ?? "—"
                      )}
                    </Td>

                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {isEditing ? (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:cursor-pointer"
                              onClick={() => handleSaveEdit(r.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:cursor-pointer"
                              onClick={handleCancelEdit}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:cursor-pointer"
                              onClick={() => handleStartEdit(r)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:cursor-pointer"
                              onClick={() => setDeleteTarget(r)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })}

              {rows.length === 0 && (
                <tr className="border-t">
                  <td
                    colSpan={6}
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

      {deleteTarget && (
        <DeleteContactConfirmModal
          contact={deleteTarget}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => handleDeleteContact(deleteTarget.id)}
        />
      )}
    </div>
  );
}

function DeleteContactConfirmModal({ contact, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-background p-5 shadow-xl">
        <div className="text-base font-semibold text-slate-800">
          Delete Contact?
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          Are you sure you want to delete this contact for{" "}
          <span className="font-medium text-slate-700">
            {contact.name ?? "—"}
          </span>
          ?
        </p>

        <div className="mt-3 rounded-xl bg-muted/40 p-3 text-sm text-slate-700 break-words space-y-1">
          <div>
            <span className="font-medium">Email:</span> {contact.email ?? "—"}
          </div>
          <div>
            <span className="font-medium">Phone:</span> {contact.phone ?? "—"}
          </div>
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button
            type="button"
            className="border border-border rounded-xl px-4 py-2 bg-background text-sm cursor-pointer"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            type="button"
            className="border border-red-200 rounded-xl px-4 py-2 bg-red-50 text-sm text-red-700 hover:bg-red-100 cursor-pointer"
            onClick={onConfirm}
          >
            Delete
          </button>
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