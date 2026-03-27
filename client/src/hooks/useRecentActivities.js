// hooks/useRecentActivities.js
import { useState, useEffect } from "react";

export function useRecentActivities() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setData([
        { id: 1, description: "تم إضافة طالب جديد: أحمد محمد", createdAt: new Date() },
        { id: 2, description: "تم تحديث بيانات مدرسة النصر", createdAt: new Date(Date.now() - 86400000) },
      ]);
      setIsLoading(false);
    }, 500);
  }, []);

  return { data, isLoading, error };
}