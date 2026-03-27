// components/common/LoadingSpinner.jsx
import { Loader2 } from "lucide-react";

const LoadingSpinner = ({ message = "جارٍ التحميل..." }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
      <Loader2 className="w-12 h-12 animate-spin text-primary" />
      <p className="text-gray-600">{message}</p>
    </div>
  );
};

export default LoadingSpinner;