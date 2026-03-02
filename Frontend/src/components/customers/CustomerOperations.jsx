
import { useState } from "react";
import { CustomerRelationshipSidebar } from "./CustomerRelationshipSidebar";
import { CustomerProjects } from "./CustomerProjects";

export function CustomerOperations() {
  const [selectedNode, setSelectedNode] = useState(null);

  // Only allow CUSTOMER selection to drive right panel
  const handleSelect = (node) => {
    if (node.type === "customer") {
      setSelectedNode(node);
    }
  };

  return (
    <div className="h-full w-full px-8">
      <div className="grid grid-cols-[320px_minmax(0,1fr)] gap-8">
        {/* LEFT SIDEBAR */}
        <CustomerRelationshipSidebar
          selectedId={selectedNode?.id}
          onSelect={handleSelect}
        />

        {/* RIGHT PANEL */}
        <div>
          {selectedNode ? (
            <CustomerProjects customerId={selectedNode.id} />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select a customer to view projects
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
