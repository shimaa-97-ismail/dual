// components/common/ConfirmationModal.jsx
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

const ConfirmationModal = ({
  open,
  onOpenChange,
  title = "تأكيد الإجراء",
  description = "هل أنت متأكد من تنفيذ هذا الإجراء؟",
  confirmText = "تأكيد",
  cancelText = "إلغاء",
  onConfirm,
  variant = "default",
  isLoading = false
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange} >
      <AlertDialogContent>
        <AlertDialogHeader >
          <AlertDialogTitle className="text-right">{title}</AlertDialogTitle>
          <AlertDialogDescription className="text-right">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" disabled={isLoading} className="bg-accent hover:bg-accent/80">
              {cancelText}
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant={variant === "destructive" ? "destructive" : "default"}
              onClick={onConfirm}
              disabled={isLoading}
              className="bg-[#831e2e] hover:bg-red-800"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 ml-2 animate-spin" />
                  جاري التنفيذ...
                </>
              ) : (
                confirmText
              )}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfirmationModal;