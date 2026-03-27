import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSchoolByDepatment } from "../../store/slices/schools";
import { SchoolCard, MainHeader } from "../../components";
import { useDepartment } from "../../hooks/useDepartments";
import { TrainningPlaceModel } from "../../components/model/TrainnigPlaceModel";
import {useCreateSchool,useUpdateSchool,schoolKeys} from '../../hooks/useSchools';
import {useQueryClient } from "@tanstack/react-query";
import {SchoolModel} from "../../components/model/School-model"
export function DepartmentSchool() {
  const { departmentId } = useParams();
  const dispatch = useDispatch();
  const queryClient=useQueryClient();
  // const { data: specials } = useSpecials();
  // const { data: departments } = useDepartments();
const addMutation = useCreateSchool(departmentId);
const updateMutation=useUpdateSchool();

  const [loading, setLoading] = useState({
    addSchool: false,
  });
  // const [errors, setErrors] = useState({
  //   addSchool: null,
  // });
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedPlace, setSelectedPlace] = useState(null);
  const { data, isLoading: deptLoading } = useDepartment(departmentId);
  const [viewMode, setViewMode] = useState("grid");
  const [showAddModal, setShowAddModal] = useState(false);
  const [schools, setSchools] = useState([]);

  // const handleAddSchool = async (schoolData) => {

  //   setLoading((prev) => ({ ...prev, addSchool: true }));
  //   setErrors((prev) => ({ ...prev, addSchool: null }));
  //   try {
  //     await createSchool(schoolData);
  //     setShowAddModal(false);
  //   } catch (error) {
  //     setErrors((prev) => ({ ...prev, addSchool: error.message || "حدث خطأ ما" }));
  //   } finally {
  //     setLoading((prev) => ({ ...prev, addSchool: false }));
  //   }
  // };
   
  
  const handleEdit=(data)=>{
    console.log(data);
    
    // setShowAddModal(true);
    // setSelectedPlace(data)
  }
  const handleSubmit = async (data) => {
    setIsModalOpen(false);
    if (!selectedPlace) {
       const dataToSend = departmentId 
      ? { ...data, department: departmentId }
      : data;
       addMutation.mutate(dataToSend, {
            onSuccess: () => {
                // queryClient.invalidateQueries({ queryKey: schoolKeys.byDept(departmentId) });
              // fetchSchools();
              // dispatch(clearFormData());
            },
          });
    } else {
      // Call edit function from the hook
      console.log("update",data);
      
    //  updateMutation.mutate(selectedPlace._id,data)
    }
    // Refresh the list after adding/editing
    setShowAddModal(false)
    fetchSchools();
  };
  const fetchSchools = async () => {
    try {
      const response = await dispatch(
        getSchoolByDepatment(departmentId)
      ).unwrap();
      // console.log("Response:", response.data);
      setSchools(response.data);
    } catch (error) {
      console.error("Error fetching schools:", error);
    }
  };

  useEffect(() => {
    if (departmentId) {
      fetchSchools();
    }
  }, [departmentId, dispatch]);

  //   // جلب المدارس التابعة لهذه الإدارة
  //   const {
  //     data: schools,
  //     isLoading: schoolsLoading,
  //     refetch
  //   } = useQuery({
  //     queryKey: ['schools', 'by-department', departmentId],
  //     queryFn: () => getSchoolsByDepartment(departmentId),
  //     enabled: !!departmentId, // لا ينفذ إلا إذا كان departmentId موجود
  //   });

  //   if (deptLoading || schoolsLoading) {
  //     return <div>جار التحميل...</div>;
  //   }

  return (
    <>
      <div className="p-6">
        {/* رجوع للإدارة أو الصفحة الرئيسية */}
        <div className="mb-6">
          <Link to={`/department`} className="text-blue-600 hover:underline">
            ← رجوع إلى الادارات
          </Link>
        </div>
        {/* <MainHeader
          title={"المدارس"}
          description={` جميع المدارس في ادارة ${deptLoading || data.name}`}
          setViewMode={setViewMode}
          viewMode={viewMode}
          setShowAddModal={setShowAddModal}
          // btnTitle={"اضافه مدرسه"}
        /> */}
        {/* قائمة المدارس */}
        {schools?.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <p className="text-gray-500">لا توجد مدارس في هذه الإدارة بعد</p>
            <Link
              // to={`/schools/new?department=${departmentId}`}
          onClick={()=>setShowAddModal(true)}
              className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded hover:bg-[#2c4d8c]"
            >
              إضافة أول مدرسة
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {schools?.map(
              (school) => (
                // console.log(school),
                (<SchoolCard key={school._id} data={school} onEdit={handleEdit} />)
              )
            )}
          </div>
        )}
      </div>
      <SchoolModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode={selectedPlace?"edit":"add"}
        onSubmit={handleSubmit}
        isLoading={loading.addSchool}
          isOpen={showAddModal}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedPlace(null);
        }}
        title={selectedPlace ? "تعديل مكان التدريب" : "إضافة مكان تدريب جديد"}
      initialData={selectedPlace}
    >

    </SchoolModel>
    </>

    //   {/* عنوان الصفحة */}
    //   <div className="mb-8">
    //     <h1 className="text-2xl font-bold text-gray-800">
    //       المدارس في إدارة {department?.name}
    //     </h1>
    //     <p className="text-gray-600 mt-2">
    //       إجمالي المدارس: {schools?.length || 0} مدرسة
    //     </p>
    //   </div>

    //   {/* إحصائيات سريعة */}
    //   <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
    //     <div className="bg-white p-4 rounded-lg shadow">
    //       <h3 className="font-semibold">المدارس الحكومية</h3>
    //       <p className="text-2xl">{schools?.filter(s => s.type === 'government').length}</p>
    //     </div>
    //     <div className="bg-white p-4 rounded-lg shadow">
    //       <h3 className="font-semibold">المدارس الخاصة</h3>
    //       <p className="text-2xl">{schools?.filter(s => s.type === 'private').length}</p>
    //     </div>
    //     <div className="bg-white p-4 rounded-lg shadow">
    //       <h3 className="font-semibold">إجمالي الطلاب</h3>
    //       <p className="text-2xl">
    //         {schools?.reduce((sum, school) => sum + (school.totalStudents || 0), 0)}
    //       </p>
    //     </div>
    //     <div className="bg-white p-4 rounded-lg shadow">
    //       <h3 className="font-semibold">متوسط الطلاب</h3>
    //       <p className="text-2xl">
    //         {Math.round(schools?.reduce((sum, school) => sum + (school.totalStudents || 0), 0) / (schools?.length || 1))}
    //       </p>
    //     </div>
    //   </div>

    //   {/* أزرار التحكم */}
    //   <div className="flex justify-between items-center mb-6">
    //     <div className="flex space-x-2 rtl:space-x-reverse">
    //       <button
    //         onClick={() => refetch()}
    //         className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
    //       >
    //         تحديث القائمة
    //       </button>
    //       <Link
    //         to="/schools"
    //         className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
    //       >
    //         عرض جميع المدارس
    //       </Link>
    //     </div>

    //     <Link
    //       to={`/schools/new?department=${departmentId}`}
    //       className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    //     >
    //       + إضافة مدرسة جديدة
    //     </Link>
    //   </div>

    //   {/* قائمة المدارس */}
    //   {schools?.length === 0 ? (
    //     <div className="text-center py-12 bg-white rounded-lg shadow">
    //       <p className="text-gray-500">لا توجد مدارس في هذه الإدارة بعد</p>
    //       <Link
    //         to={`/schools/new?department=${departmentId}`}
    //         className="mt-4 inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
    //       >
    //         إضافة أول مدرسة
    //       </Link>
    //     </div>
    //   ) : (
    //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //       {schools?.map(school => (
    //         <SchoolCard
    //           key={school.id}
    //           school={school}
    //           showDepartment={false} // لا نعرض الإدارة لأننا بالفعل في صفحتها
    //           onUpdate={() => refetch()}
    //         />
    //       ))}
    //     </div>
    //   )}
    // </div>
  );
}
