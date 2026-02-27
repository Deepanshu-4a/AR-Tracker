import { useState } from "react";
import { Card } from ".././ui/card";
import { Button } from ".././ui/button";
import { Badge } from ".././ui/badge";
import { Input } from ".././ui/input";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { CreateProjectModal } from "../CreateProjectModal";

const uid = () => crypto.randomUUID();



const mockProjects = [
  {
    id: "P1001",
    name: "Enterprise AR Automation Platform",
    status: "Active",
    taskOrders: [
      {
        id: "TO1001",
        name: "Phase 1 - Core Platform Development",
        jobs: [
          {
            id: "J1001",
            name: "Backend API Architecture",
            status: "Approved",
            costs: [
              {
                id: "C1001",
                description: "Senior Backend Engineer (160 hrs)",
                amount: 24000,
              },
              {
                id: "C1002",
                description: "Cloud Infrastructure Setup (AWS)",
                amount: 6500,
              },
              {
                id: "C1003",
                description: "Database Design & Optimization",
                amount: 8500,
              },
            ],
          },
          {
            id: "J1002",
            name: "Authentication & RBAC Module",
            status: "In Progress",
            costs: [
              { id: "C1004", description: "OAuth Integration", amount: 4200 },
              { id: "C1005", description: "Security Audit", amount: 3000 },
            ],
          },
        ],
      },
      {
        id: "TO1002",
        name: "Phase 2 - Frontend & UI/UX",
        jobs: [
          {
            id: "J1003",
            name: "Dashboard UI Development",
            status: "Approved",
            costs: [
              {
                id: "C1006",
                description: "Frontend Engineer (120 hrs)",
                amount: 18000,
              },
              { id: "C1007", description: "UI/UX Design System", amount: 7000 },
            ],
          },
          {
            id: "J1004",
            name: "Invoice & Payment Module",
            status: "Draft",
            costs: [
              { id: "C1008", description: "Stripe Integration", amount: 3500 },
              { id: "C1009", description: "Frontend Components", amount: 5200 },
            ],
          },
        ],
      },
      {
        id: "TO1003",
        name: "Phase 3 - AI & Automation",
        jobs: [
          {
            id: "J1005",
            name: "AI Risk Scoring Engine",
            status: "Draft",
            costs: [
              {
                id: "C1010",
                description: "ML Engineer (80 hrs)",
                amount: 15000,
              },
              {
                id: "C1011",
                description: "Model Training Infrastructure",
                amount: 9000,
              },
            ],
          },
        ],
      },
    ],
  },
];

export function CustomerProjects({ customerId }) {
  const [projects, setProjects] = useState(mockProjects);
  const [expanded, setExpanded] = useState({});
  const [createOpen, setCreateOpen] = useState(false);

  const toggle = (id) => setExpanded((p) => ({ ...p, [id]: !p[id] }));

  /* ================= DELETE ================= */

  const deleteProject = (projectId) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2>Projects</h2>
          <p className="text-sm text-muted-foreground">
            Operational structure and cost tracking
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Project
        </Button>
      </div>

      {/* PROJECT LIST */}
      {projects.map((project) => {
        const projectTotal = project.taskOrders
          .flatMap((to) =>
            to.jobs.flatMap((j) =>
              j.costs.reduce((s, c) => s + Number(c.amount || 0), 0),
            ),
          )
          .reduce((a, b) => a + b, 0);

        return (
          <Card key={project.id} className="border border-border/60 shadow-sm">
            {/* PROJECT HEADER */}
            <div
              onClick={() => toggle(project.id)}
              className="flex items-center justify-between px-6 py-5 cursor-pointer hover:bg-muted/40 transition"
            >
              <div className="flex items-center gap-4">
                {expanded[project.id] ? (
                  <ChevronDown className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}

                <div>
                  <h3 className="font-semibold">{project.name}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <Badge variant="outline">{project.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      ${projectTotal.toLocaleString()} total cost
                    </span>
                  </div>
                </div>
              </div>

              <Trash2
                className="w-4 h-4 text-destructive cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProject(project.id);
                }}
              />
            </div>

            {/* PROJECT CONTENT */}
            {expanded[project.id] && (
              <div className="px-8 pb-6 space-y-6 border-t border-border/60">
                {project.taskOrders.map((to) => (
                  <div key={to.id} className="space-y-4 mt-6">
                    <h4 className="text-sm font-semibold tracking-wide">
                      {to.name}
                    </h4>

                    {to.jobs.map((job) => {
                      const jobTotal = job.costs.reduce(
                        (s, c) => s + Number(c.amount || 0),
                        0,
                      );

                      return (
                        <div
                          key={job.id}
                          className="border border-border/50 rounded-lg p-4 bg-muted/20"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <p className="font-medium">{job.name}</p>
                              <p className="text-xs text-muted-foreground">
                                ${jobTotal.toLocaleString()} cost
                              </p>
                            </div>

                            <Badge variant="outline">{job.status}</Badge>
                          </div>

                          {job.costs.map((cost) => (
                            <div
                              key={cost.id}
                              className="flex justify-between items-center py-2 border-t border-border/40"
                            >
                              <span className="text-sm text-muted-foreground">
                                {cost.description}
                              </span>
                              <span className="text-sm font-medium">
                                ${cost.amount.toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </Card>
        );
      })}

      {/* ================= CREATE PROJECT MODAL ================= */}
      <CreateProjectModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={(newProject) => {
          setProjects((prev) => [...prev, { ...newProject, id: uid() }]);
        }}
      />
    </div>
  );
}
