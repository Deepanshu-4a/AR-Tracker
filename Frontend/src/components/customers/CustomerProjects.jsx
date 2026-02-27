import { useState, useMemo, useEffect } from "react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ChevronDown, ChevronRight, Plus, Trash2 } from "lucide-react";
import { CreateProjectModal } from "../CreateProjectModal";

const uid = () => crypto.randomUUID();

/* ================= MOCK DATA (Now Customer Scoped) ================= */

const mockProjects = [
  {
    id: "P1001",
    customerId: "C-IRS", // MUST match sidebar customer id
    name: "Enterprise AR Automation Platform",
    status: "Active",
    taskOrders: [],
  },
  {
    id: "P2001",
    customerId: "C-MD",
    name: "Federal Modernization Program",
    status: "Active",
    taskOrders: [],
  },
];

export function CustomerProjects({ customerId }) {
  const [expanded, setExpanded] = useState({});
  const [createOpen, setCreateOpen] = useState(false);

  /* ================= FILTER BY CUSTOMER ================= */

  const projects = useMemo(() => {
    return mockProjects.filter((p) => p.customerId === customerId);
  }, [customerId]);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const deleteProject = (projectId) => {
    // In real app this would call backend
    console.log("Delete project", projectId);
  };

  /* ================= UI ================= */

  if (!customerId) {
    return (
      <div className="text-muted-foreground">
        Select a customer to view projects
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Projects</h2>
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
      {projects.length === 0 && (
        <div className="text-sm text-muted-foreground">
          No projects found for this customer.
        </div>
      )}

      {projects.map((project) => (
        <Card key={project.id} className="border border-border/60 shadow-sm">
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

          {expanded[project.id] && (
            <div className="px-8 pb-6 border-t border-border/60 text-sm text-muted-foreground">
              Project details go here...
            </div>
          )}
        </Card>
      ))}

      <CreateProjectModal
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSave={(newProject) => {
          console.log("Create project for customer:", customerId, newProject);
        }}
      />
    </div>
  );
}
