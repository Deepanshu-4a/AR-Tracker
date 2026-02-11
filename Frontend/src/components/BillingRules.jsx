import { useState } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";

export function BillingRules() {
  const [rules, setRules] = useState([
    {
      id: "RULE-001",
      name: "Acme Monthly Subscription",
      type: "Recurring",
      frequency: "Monthly",
      triggerConditions: "Last day of each month",
      customer: "Acme Corp",
      contract: "Enterprise SaaS Agreement",
      status: "Active",
      nextRun: "Mar 31, 2026",
      lastRun: "Feb 29, 2026",
    },
    {
      id: "RULE-002",
      name: "Globex Milestone Billing",
      type: "Milestone",
      frequency: "Per Milestone",
      triggerConditions: "Project phase marked complete",
      customer: "Globex",
      contract: "Implementation Services Contract",
      status: "Paused",
      nextRun: "-",
      lastRun: "Jan 10, 2026",
    },
  ]);

  const [selectedRule, setSelectedRule] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingRule, setEditingRule] = useState(null);

  const emptyRule = {
    id: "",
    name: "",
    type: "Recurring",
    frequency: "",
    triggerConditions: "",
    customer: "",
    contract: "",
    status: "Active",
    nextRun: "-",
    lastRun: "-",
  };

  const [formData, setFormData] = useState(emptyRule);

  const openCreate = () => {
    setEditingRule(null);
    setFormData(emptyRule);
    setShowModal(true);
  };

  const openEdit = () => {
    setEditingRule(selectedRule);
    setFormData(selectedRule);
    setShowModal(true);
  };

  const saveRule = () => {
    if (editingRule) {
      setRules(
        rules.map((r) => (r.id === editingRule.id ? { ...formData } : r)),
      );
    } else {
      setRules([...rules, { ...formData, id: `RULE-${rules.length + 1}` }]);
    }
    setShowModal(false);
  };

  const toggleStatus = () => {
    setRules(
      rules.map((r) =>
        r.id === selectedRule.id
          ? {
              ...r,
              status: r.status === "Active" ? "Paused" : "Active",
            }
          : r,
      ),
    );
    setSelectedRule({
      ...selectedRule,
      status: selectedRule.status === "Active" ? "Paused" : "Active",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Rule List */}
      <Card className="p-4 lg:col-span-1">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold">Billing Rules</h3>
          <Button size="sm" onClick={openCreate}>
            + New Rule
          </Button>
        </div>

        <ul className="space-y-2">
          {rules.map((rule) => (
            <li
              key={rule.id}
              onClick={() => setSelectedRule(rule)}
              className={`p-3 rounded-lg cursor-pointer border ${
                selectedRule?.id === rule.id
                  ? "border-orange-300 bg-orange-50"
                  : "hover:bg-slate-50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">{rule.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {rule.customer} • {rule.frequency}
                  </p>
                </div>
                <Badge>{rule.status}</Badge>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Rule Detail */}
      <Card className="p-6 lg:col-span-2">
        {selectedRule ? (
          <>
            <div className="flex justify-between items-start mb-6">
              <h3 className="font-semibold">{selectedRule.name}</h3>
              <Badge>{selectedRule.status}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Billing Type</p>
                <p>{selectedRule.type}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Frequency</p>
                <p>{selectedRule.frequency}</p>
              </div>

              <div className="col-span-2">
                <p className="text-muted-foreground mb-1">Trigger Conditions</p>
                <p>{selectedRule.triggerConditions}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">
                  Associated Customer
                </p>
                <p>{selectedRule.customer}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">
                  Associated Contract
                </p>
                <p>{selectedRule.contract}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Next Invoice</p>
                <p>{selectedRule.nextRun}</p>
              </div>

              <div>
                <p className="text-muted-foreground mb-1">Last Generated</p>
                <p>{selectedRule.lastRun}</p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Button variant="outline" onClick={openEdit}>
                Edit Rule
              </Button>
              <Button variant="outline" onClick={toggleStatus}>
                {selectedRule.status === "Active"
                  ? "Pause Rule"
                  : "Activate Rule"}
              </Button>
            </div>
          </>
        ) : (
          <p className="text-muted-foreground">
            Select a billing rule to view details.
          </p>
        )}
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-50 flex">
          {/* Overlay */}
          <div
            className="flex-1 bg-black/30"
            onClick={() => setShowModal(false)}
          />

          {/* Drawer */}
          <div className="w-full max-w-xl bg-white shadow-xl flex flex-col">
            {/* Header */}
            <div className="p-6 border-b">
              <h3 className="font-semibold text-lg">
                {editingRule ? "Edit Billing Rule" : "New Billing Rule"}
              </h3>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Rule Name */}
              <div>
                <label className="text-sm text-muted-foreground">
                  Rule Name
                </label>
                <Input
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              {/* Two Column Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Billing Type */}
                <div>
                  <label className="text-sm text-muted-foreground">
                    Billing Type
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Recurring">Recurring</option>
                    <option value="Milestone">Milestone</option>
                  </select>
                </div>

                {/* Frequency */}
                <div>
                  <label className="text-sm text-muted-foreground">
                    Frequency
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={formData.frequency}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        frequency: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Annually">Annually</option>
                  </select>
                </div>
              </div>

              {/* Trigger */}
              <div>
                <label className="text-sm text-muted-foreground">
                  Trigger Condition
                </label>
                <select
                  className="w-full border rounded-md p-2"
                  value={formData.triggerConditions}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      triggerConditions: e.target.value,
                    })
                  }
                >
                  {formData.type === "Recurring" ? (
                    <>
                      <option value="">Select</option>
                      <option value="Month End">Month End</option>
                      <option value="Month Start">Month Start</option>
                    </>
                  ) : (
                    <>
                      <option value="">Select</option>
                      <option value="Phase Complete">Phase Complete</option>
                      <option value="Delivery Approved">
                        Delivery Approved
                      </option>
                    </>
                  )}
                </select>
              </div>

              {/* Customer & Contract */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">
                    Customer
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={formData.customer}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        customer: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Acme Corp">Acme Corp</option>
                    <option value="Globex">Globex</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-muted-foreground">
                    Contract
                  </label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={formData.contract}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        contract: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    {formData.customer === "Acme Corp" && (
                      <option value="Enterprise SaaS Agreement">
                        Enterprise SaaS Agreement
                      </option>
                    )}
                    {formData.customer === "Globex" && (
                      <option value="Implementation Services Contract">
                        Implementation Services Contract
                      </option>
                    )}
                  </select>
                </div>
              </div>

              {/* Status */}
              <div>
                <label className="text-sm text-muted-foreground">Status</label>
                <select
                  className="w-full border rounded-md p-2"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">Active</option>
                  <option value="Paused">Paused</option>
                </select>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button onClick={saveRule}>Save Rule</Button>
            </div>
          </div>
        </div>
        
      )}
    </div>
  );
}
