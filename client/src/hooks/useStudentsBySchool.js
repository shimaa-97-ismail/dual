// hooks/useStudentsBySchool.js
import { useMemo } from "react";
import { useStudents } from "./useStudent";
import { useSchools } from "./useSchools";

export function useStudentsBySchool(selectedSchool) {
  // Fetch all students and schools (use large limit to get all)
  const { data: studentsData, isLoading: studentsLoading, error: studentsError } = useStudents({ limit: 10000 });
  const { data: schoolsData, isLoading: schoolsLoading, error: schoolsError } = useSchools({ limit: 10000 });

  const isLoading = studentsLoading || schoolsLoading;
  const error = studentsError || schoolsError;

  const chartData = useMemo(() => {
    const students = studentsData?.data || [];
    const schools = schoolsData?.data || [];

    if (!students.length || !schools.length) return [];

    // Count students per school _id
    const countBySchool = {};
    students.forEach((student) => {
      // student.school can be an object or a string ID
      const schoolId = typeof student.school === 'object' ? student.school?._id : student.school;
      if (schoolId) {
        countBySchool[schoolId] = (countBySchool[schoolId] || 0) + 1;
      }
    });

    // If a specific school is selected (not "all")
    if (selectedSchool !== "all") {
      const school = schools.find(s => s._id === selectedSchool);
      if (!school) return [];
      // Return a single bar with the selected school's total students
      return [{ name: school.name, count: countBySchool[selectedSchool] || 0 }];
    }

    // For "all schools": return one bar per school
    return schools.map(school => ({
      name: school.name,
      count: countBySchool[school._id] || 0,
    }));
  }, [studentsData, schoolsData, selectedSchool]);

  return { data: chartData, isLoading, error };
}