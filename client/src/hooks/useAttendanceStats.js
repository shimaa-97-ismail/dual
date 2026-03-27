// hooks/useAttendanceStats.js
import { useState, useEffect } from "react";

export function useAttendanceStats() {
  const [data, setData] = useState(null);
  const [isLoading, setisLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setData({ absenceRate: 12.5 }); // Example data
      setisLoading(false);
    }, 500);
  }, []);

  return { data, isLoading, error };
}