"use client";

import { useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function JobInfoTab(props) {
  const data = props.data ?? props.formData?.jobInfo ?? {};

  const onDataChange =
    props.onDataChange ??
    ((next) => props.setFormData?.((prev) => ({ ...prev, jobInfo: next })));

  const d = useMemo(
    () => ({
      jobDescription: "",
      jobType: "",
      jobStatus: "none",
      startDate: "",
      projectedEndDate: "",
      endDate: "",
      ...(data || {}),
    }),
    [data],
  );

  const update = (key, value) => {
    onDataChange?.({ ...d, [key]: value });
  };

  // ✅ Clean neutral dropdown (NO orange highlight)
  const selectItemCls =
    "cursor-pointer data-[highlighted]:bg-muted/50 data-[highlighted]:text-foreground";

  const Row = ({ label, children }) => (
    <div className="grid grid-cols-[160px_minmax(0,1fr)] items-center gap-3">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );

  const inputCls = "h-9 w-full rounded-lg";

  return (
    <div className="space-y-6 max-w-3xl">
      {/* JOB DESCRIPTION */}
      <Row label="JOB DESCRIPTION">
        <Input
          className={inputCls}
          value={d.jobDescription}
          onChange={(e) => update("jobDescription", e.target.value)}
        />
      </Row>

      {/* JOB TYPE */}
      <Row label="JOB TYPE">
        <Select value={d.jobType} onValueChange={(v) => update("jobType", v)}>
          <SelectTrigger className={inputCls}>
            <SelectValue placeholder="Select job type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="commercial" className={selectItemCls}>
              Commercial
            </SelectItem>
            <SelectItem value="residential" className={selectItemCls}>
              Residential
            </SelectItem>
          </SelectContent>
        </Select>
      </Row>

      {/* JOB STATUS */}
      <Row label="JOB STATUS">
        <Select
          value={d.jobStatus}
          onValueChange={(v) => update("jobStatus", v)}
        >
          <SelectTrigger className={inputCls}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none" className={selectItemCls}>
              None
            </SelectItem>
            <SelectItem value="pending" className={selectItemCls}>
              Pending
            </SelectItem>
            <SelectItem value="awarded" className={selectItemCls}>
              Awarded
            </SelectItem>
            <SelectItem value="in_progress" className={selectItemCls}>
              In Progress
            </SelectItem>
            <SelectItem value="closed" className={selectItemCls}>
              Closed
            </SelectItem>
            <SelectItem value="not_awarded" className={selectItemCls}>
              Not Awarded
            </SelectItem>
          </SelectContent>
        </Select>
      </Row>

      {/* START DATE */}
      <Row label="START DATE">
        <Input
          type="date"
          className={inputCls}
          value={d.startDate}
          onChange={(e) => update("startDate", e.target.value)}
        />
      </Row>

      {/* PROJECTED END DATE */}
      <Row label="PROJECTED END DATE">
        <Input
          type="date"
          className={inputCls}
          value={d.projectedEndDate}
          onChange={(e) => update("projectedEndDate", e.target.value)}
        />
      </Row>

      {/* END DATE */}
      <Row label="END DATE">
        <Input
          type="date"
          className={inputCls}
          value={d.endDate}
          onChange={(e) => update("endDate", e.target.value)}
        />
      </Row>
    </div>
  );
}
