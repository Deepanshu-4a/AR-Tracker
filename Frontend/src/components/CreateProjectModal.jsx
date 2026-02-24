import { useState, useMemo } from "react";
import { X, Square, Plus, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";

const uid = () => crypto.randomUUID();

const emptyCost = () => ({
  id: uid(),
  description: "",
  amount: 0,
});

const emptyJob = () => ({
  id: uid(),
  name: "",
  status: "Draft",
  costs: [emptyCost()],
});

const emptyTaskOrder = () => ({
  id: uid(),
  name: "",
  jobs: [emptyJob()],
});

export function CreateProjectModal({ open, onOpenChange, onSave }) {
  const [isMaximized, setIsMaximized] = useState(false);

  const [project, setProject] = useState({
    name: "",
    status: "Active",
    startDate: "",
    taskOrders: [emptyTaskOrder()],
  });

  const total = useMemo(() => {
    return project.taskOrders
      .flatMap((to) =>
        to.jobs.flatMap((job) =>
          job.costs.reduce((sum, cost) => sum + Number(cost.amount || 0), 0),
        ),
      )
      .reduce((a, b) => a + b, 0);
  }, [project]);

  if (!open) return null;

  /* ================= UPDATE HELPERS ================= */

  const updateTaskOrderName = (toId, value) => {
    setProject((prev) => ({
      ...prev,
      taskOrders: prev.taskOrders.map((to) =>
        to.id === toId ? { ...to, name: value } : to,
      ),
    }));
  };

  const updateJobName = (toId, jobId, value) => {
    setProject((prev) => ({
      ...prev,
      taskOrders: prev.taskOrders.map((to) =>
        to.id === toId
          ? {
              ...to,
              jobs: to.jobs.map((job) =>
                job.id === jobId ? { ...job, name: value } : job,
              ),
            }
          : to,
      ),
    }));
  };

  const updateCost = (toId, jobId, costId, field, value) => {
    setProject((prev) => ({
      ...prev,
      taskOrders: prev.taskOrders.map((to) =>
        to.id === toId
          ? {
              ...to,
              jobs: to.jobs.map((job) =>
                job.id === jobId
                  ? {
                      ...job,
                      costs: job.costs.map((cost) =>
                        cost.id === costId ? { ...cost, [field]: value } : cost,
                      ),
                    }
                  : job,
              ),
            }
          : to,
      ),
    }));
  };

  /* ================= UI ================= */

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div
        className={`bg-card shadow-2xl flex flex-col ${
          isMaximized
            ? "w-screen h-screen rounded-none"
            : "w-[1150px] h-[90vh] rounded-xl"
        }`}
      >
        {/* ================= HEADER ================= */}
        <div className="flex items-center justify-between px-8 py-4 bg-orange-500 text-white rounded-t-xl">
          <h3 className="text-sm font-semibold tracking-wide">
            Create Project
          </h3>

          <div className="flex gap-2">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="size-8 flex items-center justify-center rounded-md hover:bg-white/20"
            >
              <Square size={14} />
            </button>

            <button
              onClick={() => onOpenChange(false)}
              className="size-8 flex items-center justify-center rounded-md hover:bg-red-500/80"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* ================= PROJECT META ================= */}
        <div className="px-8 py-6 border-b bg-muted/40">
          <div className="grid grid-cols-3 gap-8">
            <div className="space-y-2">
              <Label>Project Name</Label>
              <Input
                value={project.name}
                onChange={(e) =>
                  setProject((p) => ({ ...p, name: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Badge>{project.status}</Badge>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={project.startDate}
                onChange={(e) =>
                  setProject((p) => ({
                    ...p,
                    startDate: e.target.value,
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="flex-1 overflow-auto px-8 py-8 space-y-10">
          {project.taskOrders.map((to, index) => (
            <div
              key={to.id}
              className="border rounded-xl bg-background p-6 space-y-6 shadow-sm"
            >
              {/* TASK ORDER HEADER */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-xs uppercase text-muted-foreground tracking-wide">
                    Task Order {index + 1}
                  </p>
                  <Input
                    placeholder="Task Order Name"
                    value={to.name}
                    onChange={(e) => updateTaskOrderName(to.id, e.target.value)}
                    className="font-medium"
                  />
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setProject((prev) => ({
                      ...prev,
                      taskOrders: [...prev.taskOrders, emptyTaskOrder()],
                    }))
                  }
                >
                  <Plus size={14} /> Add Task Order
                </Button>
              </div>

              {/* JOBS */}
              <div className="space-y-6 pl-6 border-l border-muted">
                {to.jobs.map((job, jIndex) => (
                  <div
                    key={job.id}
                    className="space-y-4 bg-muted/30 p-5 rounded-lg"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-1">
                        <p className="text-xs uppercase text-muted-foreground tracking-wide">
                          Job {jIndex + 1}
                        </p>
                        <Input
                          placeholder="Job Name"
                          value={job.name}
                          onChange={(e) =>
                            updateJobName(to.id, job.id, e.target.value)
                          }
                        />
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setProject((prev) => ({
                            ...prev,
                            taskOrders: prev.taskOrders.map((t) =>
                              t.id === to.id
                                ? { ...t, jobs: [...t.jobs, emptyJob()] }
                                : t,
                            ),
                          }))
                        }
                      >
                        <Plus size={14} /> Add Job
                      </Button>
                    </div>

                    {/* COSTS */}
                    <div className="space-y-3 pl-6 border-l border-muted">
                      {job.costs.map((cost) => (
                        <div
                          key={cost.id}
                          className="flex gap-4 items-center bg-white border rounded-md p-3"
                        >
                          <Input
                            placeholder="Cost Description"
                            value={cost.description}
                            onChange={(e) =>
                              updateCost(
                                to.id,
                                job.id,
                                cost.id,
                                "description",
                                e.target.value,
                              )
                            }
                          />

                          <Input
                            type="number"
                            placeholder="Amount"
                            value={cost.amount}
                            onChange={(e) =>
                              updateCost(
                                to.id,
                                job.id,
                                cost.id,
                                "amount",
                                e.target.value,
                              )
                            }
                            className="w-36"
                          />

                          <Trash2 className="text-destructive cursor-pointer" />
                        </div>
                      ))}

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setProject((prev) => ({
                            ...prev,
                            taskOrders: prev.taskOrders.map((t) =>
                              t.id === to.id
                                ? {
                                    ...t,
                                    jobs: t.jobs.map((j) =>
                                      j.id === job.id
                                        ? {
                                            ...j,
                                            costs: [...j.costs, emptyCost()],
                                          }
                                        : j,
                                    ),
                                  }
                                : t,
                            ),
                          }))
                        }
                      >
                        <Plus size={14} /> Add Cost
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-between items-center px-8 py-5 border-t bg-muted/40 rounded-b-xl">
          <div className="text-lg font-semibold">
            Project Total: ${total.toLocaleString()}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>

            <Button
              onClick={() => {
                onSave(project);
                onOpenChange(false);
              }}
              className="bg-orange-500 hover:bg-orange-600"
            >
              Save Project
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
