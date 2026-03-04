"use client";

import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DEFAULTS = {
  prefillAccount1: "",
  prefillAccount2: "",
  prefillAccount3: "",
};

const selectCls = "h-8 w-full min-w-0 rounded-xl";
const helpLinkCls = "text-xs text-primary hover:underline";

/**
 * Mock chart of accounts (nested)
 *
 */
const MOCK_ACCOUNTS_TREE = [
  { id: "4250", no: "4250", name: "Sales Income", type: "Income" },
  { id: "4260", no: "4260", name: "Shipping and Delivery Income", type: "Income" },
  { id: "4300", no: "4300", name: "Uncategorized Income", type: "Income" },

  {
    id: "5000",
    no: "5000",
    name: "Direct Cost",
    type: "Cost of Goods Sold",
    children: [
      { id: "5010", no: "5010", name: "Direct Labor", type: "Cost of Goods Sold" },
      { id: "5015", no: "5015", name: "Product Labor", type: "Cost of Goods Sold" },
      { id: "5020", no: "5020", name: "Subcontractors", type: "Cost of Goods Sold" },
      { id: "5030", no: "5030", name: "Direct Travel", type: "Cost of Goods Sold" },
      { id: "5040", no: "5040", name: "Other Direct Cost", type: "Cost of Goods Sold" },
      { id: "5000-p", no: "5000", name: "Direct Purchases", type: "Cost of Goods Sold" },
      { id: "51100", no: "51100", name: "Freight and Shipping Costs", type: "Cost of Goods Sold" },
      { id: "52700", no: "52700", name: "Hardware for Resale", type: "Cost of Goods Sold" },
      { id: "53000", no: "53000", name: "Software for Resale", type: "Cost of Goods Sold" },
    ],
  },

  { id: "6000", no: "6000", name: "Fringe Benefits", type: "Expense" },
  { id: "6025", no: "6025", name: "Payroll Tax", type: "Expense" },
  { id: "6050", no: "6050", name: "Medicare", type: "Expense" },
  { id: "6075", no: "6075", name: "941 Taxes ER", type: "Expense" },
  { id: "6100", no: "6100", name: "FUTA", type: "Expense" },
  { id: "6125", no: "6125", name: "SUTA", type: "Expense" },
  { id: "6140", no: "6140", name: "Employee Relocation Exp", type: "Expense" },
];

function labelLeft(a) {
  return `${a.no} · ${a.name}`;
}
function labelRight(a) {
  return a.type || "";
}

/**
 * Flatten tree to a list with depth.
 * depth 0 = normal rows
 * depth 1 = subfields (indented)
 */
function flattenAccounts(tree) {
  const out = [];
  for (const node of tree) {
    out.push({ ...node, depth: 0, isParent: !!node.children?.length });
    if (node.children?.length) {
      for (const child of node.children) {
        out.push({ ...child, depth: 1, parentId: node.id });
      }
    }
  }
  return out;
}

export function AccountSettingsTab(props) {
  const data = props.data ?? props.formData?.accountSettings ?? {};
  const d = { ...DEFAULTS, ...data };

  const update = (key, value) => {
    if (props.onDataChange) {
      props.onDataChange({ ...d, [key]: value });
      return;
    }
    props.setFormData?.((prev) => ({
      ...prev,
      accountSettings: {
        ...(prev.accountSettings || {}),
        [key]: value,
      },
    }));
  };

  const accountsFlat = useMemo(() => flattenAccounts(MOCK_ACCOUNTS_TREE), []);

  const clearAll = () => {
    update("prefillAccount1", "");
    update("prefillAccount2", "");
    update("prefillAccount3", "");
  };

  const renderSelect = (value, onChange) => (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={selectCls}>
        <SelectValue placeholder="—" />
      </SelectTrigger>

      <SelectContent className="max-h-72 overflow-y-auto">
        {accountsFlat.map((a) => {
          const indent = a.depth === 1 ? 14 : 0;

          return (
            <SelectItem key={a.id} value={a.id}>
              <div className="w-full flex items-center justify-between gap-6">
                <div className="min-w-0 flex items-center gap-2">
                  <span className="inline-block" style={{ paddingLeft: indent }} />
                  {a.depth === 1 && (
                    <span className="text-muted-foreground text-xs">↳</span>
                  )}
                  <span className="truncate">{labelLeft(a)}</span>
                </div>

                <span className="shrink-0 text-muted-foreground text-xs">
                  {labelRight(a)}
                </span>
              </div>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );

  return (
    <div className="w-full min-w-0">
      <div className="text-[12px] text-foreground leading-5">
        <p className="font-semibold">
          Tell us which expense accounts to prefill when you enter bills for this
          vendor.
        </p>
        <p className="text-muted-foreground">
          Spending a little time here can save you time later on.
        </p>
        <p className="text-muted-foreground">
          Accounts you select here show up automatically in the accounts field
          when you enter a bill for this vendor.
        </p>
        <p className="text-muted-foreground">
          Example: Bills from the phone company would be assigned to the
          Telephone Utilities expense account.
        </p>
      </div>

      <div className="mt-4 space-y-2.5">
        <div className="w-[320px] max-w-full">
          {renderSelect(d.prefillAccount1, (v) => update("prefillAccount1", v))}
        </div>

        <div className="w-[320px] max-w-full">
          {renderSelect(d.prefillAccount2, (v) => update("prefillAccount2", v))}
        </div>

        <div className="w-[320px] max-w-full">
          {renderSelect(d.prefillAccount3, (v) => update("prefillAccount3", v))}
        </div>

        <div className="pt-1">
          <Button
            type="button"
            variant="outline"
            className="h-8 rounded-xl px-4"
            onClick={clearAll}
          >
            Clear All
          </Button>
        </div>

        <div className="pt-2">
          <button type="button" className={helpLinkCls}>
            How do Account Prefills work with Bank Feeds?
          </button>
        </div>
      </div>
    </div>
  );
}