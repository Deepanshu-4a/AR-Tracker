import { useEffect, useMemo, useState } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const initialProfiles = {
  CL001: {
    paymentTerms: "Net 30",
    billingCycle: "Monthly",
    currency: "USD",
    taxRate: "18",
    deliveryChannel: "Email",
    autoSend: true,
    reminderCadence: "D-3, D+1, D+7",
  },
  CL002: {
    paymentTerms: "Net 45",
    billingCycle: "Monthly",
    currency: "USD",
    taxRate: "12",
    deliveryChannel: "Portal",
    autoSend: false,
    reminderCadence: "D+1, D+5",
  },
  CL003: {
    paymentTerms: "Due on Receipt",
    billingCycle: "Quarterly",
    currency: "USD",
    taxRate: "10",
    deliveryChannel: "Email + Portal",
    autoSend: true,
    reminderCadence: "D-1, D+3",
  },
};

const initialRules = [
  {
    id: "BR-001",
    customerId: "CL001",
    name: "Monthly Subscription Invoice",
    type: "Recurring",
    frequency: "Monthly",
    condition: "Month End",
    action: "Auto-generate Invoice",
    status: "Active",
    nextRun: "2026-03-31",
    lastRun: "2026-02-29",
    lastResult: "Success",
  },
  {
    id: "BR-002",
    customerId: "CL001",
    name: "Overdue Escalation",
    type: "Collection",
    frequency: "Daily",
    condition: "Days Overdue >= 30",
    action: "Escalate to Manager",
    status: "Active",
    nextRun: "2026-02-21",
    lastRun: "2026-02-20",
    lastResult: "Success",
  },
  {
    id: "BR-003",
    customerId: "CL002",
    name: "Milestone Billing Rule",
    type: "Milestone",
    frequency: "Per Milestone",
    condition: "Phase Complete",
    action: "Create Draft Invoice",
    status: "Paused",
    nextRun: "-",
    lastRun: "2026-01-10",
    lastResult: "Paused",
  },
];

const emptyRule = (customerId) => ({
  id: "",
  customerId,
  name: "",
  type: "Recurring",
  frequency: "Monthly",
  condition: "",
  action: "Auto-generate Invoice",
  status: "Active",
  nextRun: "-",
  lastRun: "-",
  lastResult: "Not Run",
});

export function CustomerBillingRules({ customer }) {
  const [profiles, setProfiles] = useState(initialProfiles);
  const [rules, setRules] = useState(initialRules);
  const [selectedRuleId, setSelectedRuleId] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [formData, setFormData] = useState(emptyRule(customer?.id || ""));
  const [editingRuleId, setEditingRuleId] = useState(null);

  useEffect(() => {
    if (!customer) return;
    const customerRules = rules.filter((rule) => rule.customerId === customer.id);
    setSelectedRuleId(customerRules[0]?.id || null);
    setShowEditor(false);
    setEditingRuleId(null);
    setFormData(emptyRule(customer.id));
  }, [customer, rules]);

  const profile = profiles[customer?.id] || {
    paymentTerms: "Net 30",
    billingCycle: "Monthly",
    currency: "USD",
    taxRate: "0",
    deliveryChannel: "Email",
    autoSend: false,
    reminderCadence: "D+1",
  };

  const customerRules = useMemo(() => {
    if (!customer) return [];
    return rules.filter((rule) => rule.customerId === customer.id);
  }, [rules, customer]);

  const selectedRule = customerRules.find((rule) => rule.id === selectedRuleId);

  const setProfileField = (field, value) => {
    setProfiles((prev) => ({
      ...prev,
      [customer.id]: {
        ...(prev[customer.id] || profile),
        [field]: value,
      },
    }));
  };

  const openCreate = () => {
    setEditingRuleId(null);
    setFormData(emptyRule(customer.id));
    setShowEditor(true);
  };

  const openEdit = () => {
    if (!selectedRule) return;
    setEditingRuleId(selectedRule.id);
    setFormData(selectedRule);
    setShowEditor(true);
  };

  const saveRule = () => {
    if (!formData.name.trim()) return;

    if (editingRuleId) {
      setRules((prev) =>
        prev.map((rule) =>
          rule.id === editingRuleId ? { ...formData, id: editingRuleId } : rule,
        ),
      );
      setSelectedRuleId(editingRuleId);
    } else {
      const id = `BR-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      setRules((prev) => [...prev, { ...formData, id, customerId: customer.id }]);
      setSelectedRuleId(id);
    }

    setShowEditor(false);
  };

  const toggleRuleStatus = () => {
    if (!selectedRule) return;
    const nextStatus = selectedRule.status === "Active" ? "Paused" : "Active";
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === selectedRule.id ? { ...rule, status: nextStatus } : rule,
      ),
    );
  };

  const deleteRule = () => {
    if (!selectedRule) return;
    setRules((prev) => prev.filter((rule) => rule.id !== selectedRule.id));
    setSelectedRuleId(null);
  };

  if (!customer) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">
          Select a customer to configure billing rules.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      <Card className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Billing Profile Defaults</h3>
          <Badge variant="outline">{customer.name}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Payment Terms</Label>
            <Select
              value={profile.paymentTerms}
              onValueChange={(value) => setProfileField("paymentTerms", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Due on Receipt">Due on Receipt</SelectItem>
                <SelectItem value="Net 15">Net 15</SelectItem>
                <SelectItem value="Net 30">Net 30</SelectItem>
                <SelectItem value="Net 45">Net 45</SelectItem>
                <SelectItem value="Net 60">Net 60</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Billing Cycle</Label>
            <Select
              value={profile.billingCycle}
              onValueChange={(value) => setProfileField("billingCycle", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
                <SelectItem value="Quarterly">Quarterly</SelectItem>
                <SelectItem value="Annually">Annually</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Currency</Label>
            <Select
              value={profile.currency}
              onValueChange={(value) => setProfileField("currency", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="GBP">GBP</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Tax Rate (%)</Label>
            <Input
              type="number"
              value={profile.taxRate}
              onChange={(e) => setProfileField("taxRate", e.target.value)}
            />
          </div>

          <div>
            <Label>Delivery Channel</Label>
            <Select
              value={profile.deliveryChannel}
              onValueChange={(value) =>
                setProfileField("deliveryChannel", value)
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Email">Email</SelectItem>
                <SelectItem value="Portal">Portal</SelectItem>
                <SelectItem value="Email + Portal">Email + Portal</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Reminder Cadence</Label>
            <Input
              value={profile.reminderCadence}
              onChange={(e) =>
                setProfileField("reminderCadence", e.target.value)
              }
              placeholder="D-3, D+1, D+7"
            />
          </div>
        </div>

        <div className="flex items-center justify-between border rounded-lg p-3">
          <div>
            <p className="text-sm font-medium">Auto-send invoices</p>
            <p className="text-xs text-muted-foreground">
              Send invoice immediately after generation.
            </p>
          </div>
          <Switch
            checked={profile.autoSend}
            onCheckedChange={(checked) => setProfileField("autoSend", checked)}
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-5">
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Rules</h3>
            <Button size="sm" onClick={openCreate}>
              + New Rule
            </Button>
          </div>

          {customerRules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No billing rules configured for this customer.
            </p>
          ) : (
            <ul className="space-y-2">
              {customerRules.map((rule) => (
                <li
                  key={rule.id}
                  onClick={() => setSelectedRuleId(rule.id)}
                  className={`p-3 rounded-lg border cursor-pointer ${
                    selectedRuleId === rule.id
                      ? "bg-orange-50 border-orange-300"
                      : "hover:bg-muted/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium">{rule.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {rule.type} - {rule.frequency}
                      </p>
                    </div>
                    <Badge variant="outline">{rule.status}</Badge>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 space-y-4">
          {showEditor ? (
            <>
              <h3 className="font-semibold">
                {editingRuleId ? "Edit Billing Rule" : "Create Billing Rule"}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label>Rule Name</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder="Rule name"
                  />
                </div>

                <div>
                  <Label>Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Recurring">Recurring</SelectItem>
                      <SelectItem value="Milestone">Milestone</SelectItem>
                      <SelectItem value="Collection">Collection</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Frequency</Label>
                  <Select
                    value={formData.frequency}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, frequency: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                      <SelectItem value="Quarterly">Quarterly</SelectItem>
                      <SelectItem value="Per Milestone">Per Milestone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2">
                  <Label>IF Condition</Label>
                  <Input
                    value={formData.condition}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        condition: e.target.value,
                      }))
                    }
                    placeholder="Days Overdue >= 30"
                  />
                </div>

                <div className="col-span-2">
                  <Label>THEN Action</Label>
                  <Select
                    value={formData.action}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, action: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto-generate Invoice">
                        Auto-generate Invoice
                      </SelectItem>
                      <SelectItem value="Create Draft Invoice">
                        Create Draft Invoice
                      </SelectItem>
                      <SelectItem value="Send Email Reminder">
                        Send Email Reminder
                      </SelectItem>
                      <SelectItem value="Escalate to Manager">
                        Escalate to Manager
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-2">
                <Button onClick={saveRule}>Save Rule</Button>
                <Button variant="outline" onClick={() => setShowEditor(false)}>
                  Cancel
                </Button>
              </div>
            </>
          ) : !selectedRule ? (
            <p className="text-sm text-muted-foreground">
              Select a rule to view details.
            </p>
          ) : (
            <>
              <div className="flex items-start justify-between">
                <h3 className="font-semibold">{selectedRule.name}</h3>
                <Badge variant="outline">{selectedRule.status}</Badge>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <Info label="Type" value={selectedRule.type} />
                <Info label="Frequency" value={selectedRule.frequency} />
                <Info label="IF" value={selectedRule.condition} />
                <Info label="THEN" value={selectedRule.action} />
                <Info label="Next Run" value={selectedRule.nextRun} />
                <Info label="Last Run" value={selectedRule.lastRun} />
                <Info label="Last Result" value={selectedRule.lastResult} />
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={openEdit}>
                  Edit Rule
                </Button>
                <Button variant="outline" onClick={toggleRuleStatus}>
                  {selectedRule.status === "Active" ? "Pause Rule" : "Activate Rule"}
                </Button>
                <Button variant="outline" onClick={deleteRule}>
                  Delete Rule
                </Button>
              </div>

              <Card className="p-3 bg-muted/30">
                <p className="text-sm font-medium mb-2">Execution History</p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>{selectedRule.lastRun}: Rule evaluated successfully.</li>
                  <li>
                    {selectedRule.nextRun !== "-"
                      ? `Next run scheduled on ${selectedRule.nextRun}.`
                      : "No future run is currently scheduled."}
                  </li>
                </ul>
              </Card>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p>{value || "-"}</p>
    </div>
  );
}
