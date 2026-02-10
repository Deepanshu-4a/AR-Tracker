import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus } from "lucide-react";

export function ConfigureRulesSheet({ open, onOpenChange }) {
  const [rules, setRules] = useState([
    {
      id: "1",
      field: "daysOverdue",
      operator: ">",
      value: 30,
      action: "mark_at_risk",
      enabled: true,
    },
  ]);

  const updateRule = (id, updates) => {
    setRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, ...updates } : rule
      )
    );
  };

  const addRule = () => {
    setRules((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        field: "daysOverdue",
        operator: ">",
        value: 45,
        action: "send_email",
        enabled: true,
      },
    ]);
  };

  const removeRule = (id) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id));
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[420px] sm:w-[480px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Configure Automation Rules</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="rounded-lg border p-4 space-y-4"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Rule</p>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={rule.enabled}
                    onCheckedChange={(checked) =>
                      updateRule(rule.id, { enabled: checked })
                    }
                  />

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeRule(rule.id)}
                  >
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </div>
              </div>

              {/* IF */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  IF
                </p>

                <div className="flex gap-2">
                  <Select
                    value={rule.field}
                    onValueChange={(value) =>
                      updateRule(rule.id, { field: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daysOverdue">
                        Days Overdue
                      </SelectItem>
                      <SelectItem value="amount">
                        Invoice Amount
                      </SelectItem>
                      <SelectItem value="riskScore">
                        Risk Score
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={rule.operator}
                    onValueChange={(value) =>
                      updateRule(rule.id, { operator: value })
                    }
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value=">">{">"}</SelectItem>
                      <SelectItem value=">=">{">="}</SelectItem>
                      <SelectItem value="<">{"<"}</SelectItem>
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    value={rule.value}
                    onChange={(e) =>
                      updateRule(rule.id, {
                        value: Number(e.target.value),
                      })
                    }
                    className="w-[90px]"
                  />
                </div>
              </div>

              {/* THEN */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  THEN
                </p>

                <Select
                  value={rule.action}
                  onValueChange={(value) =>
                    updateRule(rule.id, { action: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mark_at_risk">
                      Mark as At Risk
                    </SelectItem>
                    <SelectItem value="send_email">
                      Send Email Reminder
                    </SelectItem>
                    <SelectItem value="escalate">
                      Escalate to Manager
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ))}

          <Button
            variant="outline"
            className="w-full"
            onClick={addRule}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Rule
          </Button>

          <Separator />

          <Button className="w-full">
            Save Rules
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
