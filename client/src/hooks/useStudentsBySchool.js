// hooks/useStudentsBySchool.js
import { useMemo } from "react";
import { useStudents } from "./useStudent";
import { useSchools } from "./useSchools";

export function useStudentsBySchool(selectedSchool) {
  const { data: students, isLoading: studentsLoading, error: studentsError } = useStudents();
  const { data: schools, isLoading: schoolsLoading, error: schoolsError } = useSchools();
  console.log(students,schools);
  

  const isLoading = studentsLoading || schoolsLoading;
  const error = studentsError || schoolsError;

  const data = useMemo(() => {
    if (!students?.data || !schools) return [];

    const counts = {};
    students?.data?.forEach((student) => {
      counts[student.schoolId] = (counts[student.schoolId] || 0) + 1;
    });

    if (selectedSchool !== "all") {
      const school = schools.find((s) => s.id === selectedSchool);
      return [{ name: school?.name, count: counts[selectedSchool] || 0 }];
    }

    return schools.map((school) => ({
      name: school.name,
      count: counts[school.id] || 0,
    }));
  }, [students, schools, selectedSchool]);

  return { data, isLoading, error };
}