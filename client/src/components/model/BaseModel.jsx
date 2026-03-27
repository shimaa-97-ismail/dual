import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function BaseModel({
  open,
  onOpenChange,
  title,
  description="",
  children,
  onSubmit,
  onCancel,
  submitLabel = "حفظ",
  cancelLabel = "إلغاء",
  isLoading = false,
  disabled = false,
}) {
  const handleCancel = () => {
    onCancel?.();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}  dir="rtl">
      <DialogContent className="sm:max-w-[525px] text-right" dir="rtl">
        <DialogHeader>
          <DialogTitle className="w-full text-right">{title}</DialogTitle>
          {description && <DialogDescription className="w-full text-right">{description}</DialogDescription>}
        </DialogHeader>

        {/* Form fields go here */}
        <div className="py-4"  >{children}</div>

        <DialogFooter>
          <Button variant="outline" className=" bg-[#831e2e] hover:bg-[#a42338]" onClick={handleCancel} type="button">
            {cancelLabel}
          </Button>
          <Button
            onClick={onSubmit}
            disabled={disabled || isLoading}
            type="button"
          >
            {isLoading ? "جاري الحفظ..." : submitLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

