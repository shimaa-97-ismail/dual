import React, { useState } from "react";
import { SchoolCard, MainHeader } from "../../components";
import { SchoolModel } from "../../components/model/School-model";
import { useCreateSchool, useSchools } from "../../hooks/useSchools";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import EmptyState from "../../components/common/EmptyState";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
export default function SchoolPage() {
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  // const [searchTerm, setSearchTerm] = useState("");

  // const {
  //   schools,
  //   departments,
  //   specials,
  //   loading,
  //   errors,
  //   pagination,
  //   filters
  // } = useSelector((state) => state.schools);
  // console.log(specials);

  //  useEffect(() => {
  //   dispatch(fetchSchools());
  //   dispatch(fetchDepartments());
  //   dispatch(fetchSpecials());
  // }, []);
  // // جلب البيانات الأولية
  // useEffect(() => {
  //   dispatch(fetchSchools());
  //   dispatch(fetchDepartments());
  //   dispatch(fetchSpecials());
  // }, [dispatch]);

  // البحث مع debounce
  // const debouncedSearch = useCallback(
  //   debounce((term) => {
  //     dispatch(setFilters({ search: term }));
  //     dispatch(fetchSchools({ search: term, ...filters }));
  //   }, 500),
  //   [dispatch, filters]
  // );

  // useEffect(() => {
  //   if (searchTerm !== undefined) {
  //     debouncedSearch(searchTerm);
  //   }
  //   return () => debouncedSearch.cancel();
  // }, [searchTerm, debouncedSearch]);

  // معالجة إضافة مدرسة جديدة

  const { data, isLoading, isError } = useSchools();
  console.log(data);

  const addMutation = useCreateSchool();

  const handleAddSchool = async (formData) => {
    try {
      // await dispatch(addSchool(formData)).unwrap();
      addMutation.mutate(formData, {
        onSuccess: () => {
          toast.success("تم إضافة المدرسة بنجاح");
          setShowAddModal(false);
        },
      });
    } catch (error) {
      toast.error("فشل في إضافة المدرسة");
      console.error("Error adding school:", error);
    }
  };

  // معالجة النقر على قسم
  const handleSpecialClick = (specialId, specialName, schoolId, schoolName) => {
    console.log("Special clicked:", {
      specialId,
      specialName,
      schoolId,
      schoolName,
    });
    //  (speacialID, special, schoolID, schoolName) => {
    navigate(`/students/${schoolName}/${specialName}`, {
      state: { schoolID: schoolId, speacialID: specialId },
    });
    // يمكنك التوجيه إلى صفحة القسم
    // navigate(`/school/${schoolId}/special/${specialId}`);
  };

  // تحديث الفلاتر
  // const handleFilterChange = (key, value) => {
  //   dispatch(setFilters({ [key]: value }));
  //   dispatch(fetchSchools({ ...filters, [key]: value }));
  // };

  // تحديث الصفحة
  // const handlePageChange = (newPage) => {
  //   dispatch(setPage(newPage));
  //   dispatch(fetchSchools({ ...filters, page: newPage }));
  // };

  // إعادة تحميل البيانات
  // const handleRefresh = () => {
  //   dispatch(fetchSchools());
  //   dispatch(fetchDepartments());
  //   // dispatch(fetchSpecials());
  // };

  // تصدير البيانات
  // const handleExport = () => {
  //   // كود التصدير
  //   toast.success('تم تصدير البيانات بنجاح');
  // };

  // استيراد البيانات
  // const handleImport = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     // كود الاستيراد
  //     toast.success('تم استيراد البيانات بنجاح');
  //   }
  // };

  // عرض حالة التحميل
  if (isLoading) {
    return <LoadingSpinner message="جارٍ تحميل المدارس..." />;
  }

  // عرض حالة الخطأ
  // if (errors.fetchSchools && !schools.length) {
  //   return (
  //     <ErrorState
  //       error={errors.fetchSchools}
  //       onRetry={handleRefresh}
  //     />
  //   );
  // }

  return (
    <div className="p-4 md:p-6 space-y-6">
      <MainHeader
        btnTitle="إضافة مدرسة"
        setViewMode={setViewMode}
        viewMode={viewMode}
        setShowAddModal={setShowAddModal}
        title="المدارس"
        description="جميع المدارس في محافظة قنا تحت نظام التعليم الفنى المزدوج"
      />

      {/* شريط البحث والفلاتر */}
      {/* <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
         
          //  بحث
                    // <div className="flex-1">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="ابحث باسم المدرسة أو العنوان..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          {/* فلاتر 
                    <div className="flex flex-wrap gap-2">
            <Select
              value={filters.type}
              onValueChange={(value) => handleFilterChange("type", value)}
            >
              <SelectTrigger className="w-[150px]">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="نوع المدرسة" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">الكل</SelectItem>
                <SelectItem value="government">حكومية</SelectItem>
                <SelectItem value="private">خاصة</SelectItem> *
              </SelectContent>
            </Select>

            <Select
              value={filters.department}
              onValueChange={(value) => handleFilterChange("department", value)}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="الإدارة التابعة" />
              </SelectTrigger>
              <SelectContent>
                {/* <SelectItem value="">الكل</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept._id} value={dept._id}>
                    {dept.name}
                  </SelectItem>
                ))} 
              </SelectContent>
            </Select>

            {filters.type || filters.department || filters.search ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  dispatch(resetFilters());
                  setSearchTerm("");
                  dispatch(fetchSchools());
                }}
              >
                إعادة تعيين
              </Button>
            ) : null}
          </div>
        </div>
      </Card> */}

      {/* قائمة المدارس */}
      {data?.length === 0 ? (
        <EmptyState
          title="لا توجد مدارس"
          description="ابدأ بإضافة مدرسة جديدة"
          actionText="إضافة مدرسة"
          onAction={() => setShowAddModal(true)}
        />
      ) : (
        <>
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
          >
            {data &&
              data.map((school) => (
                console.log(school),
                
                <SchoolCard
                  key={school._id}
                  data={school}
                  onSpecialClick={handleSpecialClick}
                />
              ))}
          </div>

          {/* الترقيم */}
          {/* {pagination.totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={pagination.itemsPerPage}
                totalItems={pagination.totalItems}
              />
            </div>
          )}*/}
        </>
      )}

      {/* مودال إضافة مدرسة */}
      <SchoolModel
        open={showAddModal}
        onOpenChange={setShowAddModal}
        mode="add"
        onSubmit={handleAddSchool}
        isLoading={addMutation.isLoading}
        initialData={null}
      />
    </div>
  );
}
