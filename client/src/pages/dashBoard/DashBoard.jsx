import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useSchools } from "@/hooks/useSchools";
import { useDepartments } from "@/hooks/useDepartments";
import { useSpecials } from "@/hooks/useSpecial";
import { useStudents, useGetPercentAbsence } from "@/hooks/useStudent";
import { useTrainningPlaces } from "@/hooks/useTrainngPlace";
import { useStudentsBySchool } from "@/hooks/useStudentsBySchool";
import { SearchStudent } from "@/components/model/SearchStudent";
export function DashBoard() {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSearchSubmit = async (formData) => {
    setIsLoading(true);
    try {
      navigate(`/search?search=${formData.studentName}`);

      // إغلاق المودال بعد التوجيه
      setIsModalOpen(false);
    } catch (error) {
      console.error("حدث خطأ أثناء البحث", error);
    } finally {
      setIsLoading(false);
    }
  };
  // Existing data
  const { data: schools, isLoading: schoolsLoading } = useSchools();
  const { data: departments, isLoading: deptsLoading } = useDepartments();
  const { data: specials, isLoading: specialsLoading } = useSpecials();
  const { data: students, isLoading: studentsLoading } = useStudents();
  const { pagination: trainingPlaces, isLoading: trainingLoading } =
    useTrainningPlaces();
  const { data: percentAbsence, isLoading: percentAbsenceLoading } =
    useGetPercentAbsence();

  // Additional data
  const { data: studentsBySchool, isLoading: chartLoading } =
    useStudentsBySchool(selectedSchool);

  const isLoadingMetrics =
    schoolsLoading ||
    deptsLoading ||
    specialsLoading ||
    studentsLoading ||
    trainingLoading ||
    percentAbsenceLoading ||
    chartLoading;

  if (isLoadingMetrics) {
    return <div className="text-center p-8">جاري تحميل بيانات ...</div>;
  }

  return (
    <>
      <div className="p-4 md:p-6 space-y-6">
        {/* First Row of Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
          <MetricCard
            title="الإدارات التعليميه"
            value={departments?.length || 0}
            color="green"
          />
          <MetricCard
            title="إجمالي المدارس"
            value={schools?.pagination?.total || 0}
            color="blue"
          />
          <MetricCard
            title="التخصصات المتاحة"
            value={specials?.length || 0}
            color="purple"
          />
          <MetricCard
            title="إجمالي الطلاب"
            value={students?.count || 0}
            color="orange"
          />
          <MetricCard
            title={`نسبة الغياب ${percentAbsence?.[0]?.academicYear ?? ""}`}
            value={`${percentAbsence?.[0]?.absencePercentage ?? 0}%`}
            color="pink"
          />
          <MetricCard
            title="إجمالي المنشأت التدريبيه"
            value={trainingPlaces?.total || 0}
            color="teal"
          />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>إجراءات سريعة</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="text-primary! border-primary hover:bg-primary hover:text-white! px-3"
              onClick={() => navigate("/school/student/add")}
            >
              + طالب جديد
            </Button>
            <Button
              variant="outline"
              className="text-primary! border-primary hover:bg-primary hover:text-white! px-3"
              onClick={() => navigate("/weeklyAbsent")}
            >
              الغياب الاسبوعى
            </Button>
            <Button
              variant="outline"
              className="text-primary! border-primary hover:bg-primary hover:text-white! px-3"
              onClick={() => navigate("/schools")}
            >
              المدارس
            </Button>
            <Button
              variant="outline"
              className="text-primary! border-primary hover:bg-primary hover:text-white! px-3"
              onClick={() => setIsModalOpen(true)}
            >
              استعلام عن المصروفات
            </Button>
            <Button
              variant="outline"
              className="text-primary! border-primary hover:bg-primary hover:text-white! px-3"
              onClick={() => navigate("/reports")}
            >
              تقارير
            </Button>
          </CardContent>
        </Card>

        {/* Chart Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-2">
            <CardTitle>توزيع الطلاب حسب المدرسة</CardTitle>
            <Select value={selectedSchool} onValueChange={setSelectedSchool}>
              <SelectTrigger className="w-[180px] text-black!">
                <SelectValue placeholder="اختر المدرسة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المدارس</SelectItem>
                {schools?.data?.map((school) => (
                  <SelectItem key={school._id} value={school._id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-64 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={studentsBySchool}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
      <SearchStudent
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        onSubmit={handleSearchSubmit}
        isLoading={isLoading}
      />
    </>
  );
}

// Reusable Metric Card
function MetricCard({ title, value, color }) {
  const colorMap = {
    green: "from-green-50 to-green-100 text-green-800",
    blue: "from-blue-50 to-blue-100 text-blue-800",
    purple: "from-purple-50 to-purple-100 text-purple-800",
    orange: "from-orange-50 to-orange-100 text-orange-800",
    pink: "from-pink-50 to-pink-100 text-pink-800",
    teal: "from-teal-50 to-teal-100 text-teal-800",
    yellow: "from-yellow-50 to-yellow-100 text-yellow-800",
    indigo: "from-indigo-50 to-indigo-100 text-indigo-800",
  };

  return (
    <Card className={`bg-gradient-to-r ${colorMap[color]}`}>
      <CardContent className="p-4">
        <p className={`text-sm text-${color}-600`}>{title}</p>
        <p className={`text-2xl font-bold text-${color}-800`}>{value}</p>
      </CardContent>
    </Card>
  );
}

// Loading Skeleton
function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
      <Skeleton className="h-32 w-full" />
      <Skeleton className="h-80 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
