// components/common/EmptyState.jsx
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const EmptyState = ({
  title = "لا توجد بيانات",
  description = "ابدأ بإضافة بيانات جديدة",
  actionText = "إضافة جديد",
  onAction,
  icon: Icon = FileText
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4 text-center p-8">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
        <p className="text-gray-500 mt-1">{description}</p>
      </div>
      {onAction && (
        <Button onClick={onAction}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;