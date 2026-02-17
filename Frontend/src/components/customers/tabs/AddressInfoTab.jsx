import { Input } from "../../ui/input";
import { Textarea } from "../../ui/textarea";
import { Label } from "../../ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../../ui/select";
import { Button } from "../../ui/button";

export function AddressInfoTab({ formData, setFormData }) {
  const addressInfo = formData?.addressInfo || {};

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      addressInfo: {
        ...prev.addressInfo,
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-8 text-sm">
      {/* ================= BASIC INFO GRID ================= */}
      <div className="grid grid-cols-4 gap-x-6 gap-y-4">
        {/* Company Name */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Company Name</Label>
        </div>
        <div className="col-span-3">
          <Input
            value={addressInfo.companyName || ""}
            onChange={(e) => updateField("companyName", e.target.value)}
          />
        </div>

        {/* Full Name */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Full Name</Label>
        </div>

        <div className="col-span-3 grid grid-cols-4 gap-3">
          <Select
            value={addressInfo.title || ""}
            onValueChange={(val) => updateField("title", val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Title" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Mr.">Mr.</SelectItem>
              <SelectItem value="Ms.">Ms.</SelectItem>
              <SelectItem value="Mrs.">Mrs.</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="First"
            value={addressInfo.firstName || ""}
            onChange={(e) => updateField("firstName", e.target.value)}
          />

          <Input
            placeholder="M.I."
            value={addressInfo.middleInitial || ""}
            onChange={(e) => updateField("middleInitial", e.target.value)}
          />

          <Input
            placeholder="Last"
            value={addressInfo.lastName || ""}
            onChange={(e) => updateField("lastName", e.target.value)}
          />
        </div>

        {/* Job Title */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Job Title</Label>
        </div>
        <div className="col-span-3">
          <Input
            value={addressInfo.jobTitle || ""}
            onChange={(e) => updateField("jobTitle", e.target.value)}
          />
        </div>

        {/* Main Phone */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Main Phone</Label>
        </div>
        <div className="col-span-1">
          <Input
            value={addressInfo.mainPhone || ""}
            onChange={(e) => updateField("mainPhone", e.target.value)}
          />
        </div>

        {/* Main Email */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Main Email</Label>
        </div>
        <div className="col-span-1">
          <Input
            value={addressInfo.mainEmail || ""}
            onChange={(e) => updateField("mainEmail", e.target.value)}
          />
        </div>

        {/* Work Phone */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Work Phone</Label>
        </div>
        <div className="col-span-1">
          <Input
            value={addressInfo.workPhone || ""}
            onChange={(e) => updateField("workPhone", e.target.value)}
          />
        </div>

        {/* CC Email */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>CC Email</Label>
        </div>
        <div className="col-span-1">
          <Input
            value={addressInfo.ccEmail || ""}
            onChange={(e) => updateField("ccEmail", e.target.value)}
          />
        </div>

        {/* Mobile */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Mobile</Label>
        </div>
        <div className="col-span-1">
          <Input
            value={addressInfo.mobile || ""}
            onChange={(e) => updateField("mobile", e.target.value)}
          />
        </div>

        {/* Website */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Website</Label>
        </div>
        <div className="col-span-1">
          <Input
            value={addressInfo.website || ""}
            onChange={(e) => updateField("website", e.target.value)}
          />
        </div>

        {/* Fax */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Fax</Label>
        </div>
        <div className="col-span-1">
          <Input
            value={addressInfo.fax || ""}
            onChange={(e) => updateField("fax", e.target.value)}
          />
        </div>

        {/* Other */}
        <div className="col-span-1 flex items-center justify-end">
          <Label>Other</Label>
        </div>
        <div className="col-span-1">
          <Input
            value={addressInfo.other || ""}
            onChange={(e) => updateField("other", e.target.value)}
          />
        </div>
      </div>

      {/* ================= ADDRESS DETAILS ================= */}
      <div className="border-t pt-6 space-y-6">
        <h4 className="text-xs uppercase tracking-wide text-muted-foreground">
          Address Details
        </h4>

        <div className="grid grid-cols-2 gap-10">
          {/* BILL TO */}
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground uppercase">
              Invoice / Bill To
            </Label>

            <Textarea
              rows={6}
              placeholder="Billing address..."
              value={addressInfo.billingAddress || ""}
              onChange={(e) => updateField("billingAddress", e.target.value)}
            />
          </div>

          {/* SHIP TO */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <Label className="text-xs text-muted-foreground uppercase">
                Ship To
              </Label>

              <Select
                value={addressInfo.shipOption || "same"}
                onValueChange={(val) => updateField("shipOption", val)}
              >
                <SelectTrigger className="w-44">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="same">Same as Billing</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              rows={6}
              placeholder="Shipping address..."
              value={addressInfo.shippingAddress || ""}
              onChange={(e) => updateField("shippingAddress", e.target.value)}
            />

            <div className="flex items-center gap-2 text-xs">
              <input
                type="checkbox"
                checked={addressInfo.defaultShipping || false}
                onChange={(e) =>
                  updateField("defaultShipping", e.target.checked)
                }
              />
              Default shipping address
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button
            variant="outline"
            onClick={() =>
              updateField("shippingAddress", addressInfo.billingAddress || "")
            }
          >
            Copy &gt;&gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
