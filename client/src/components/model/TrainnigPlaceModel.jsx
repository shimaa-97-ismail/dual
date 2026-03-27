
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const TrainningPlaceModel = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children,
  className,
  showFooter = false,
  onConfirm,
  confirmText = "حفظ",
  cancelText = "إلغاء",
  isLoading = false
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={cn(
          "sm:max-w-[650px] max-h-[90vh] overflow-y-auto p-0",
          className
        )}
        dir="rtl"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold text-gray-900">
              {title}
            </DialogTitle>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          {description && (
            <DialogDescription className="text-right text-gray-600 mt-2">
              {description}
            </DialogDescription>
          )}
        </DialogHeader>

        {/* Content */}
        <div className="px-6 py-5">
          {children}
        </div>

        {/* Footer (optional) */}
        {showFooter && (
          <DialogFooter className="px-6 py-4 border-t bg-gray-50/50">
            <div className="flex items-center justify-end gap-3 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    جاري الحفظ...
                  </span>
                ) : (
                  confirmText
                )}
              </Button>
            </div>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

