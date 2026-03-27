import React, { useEffect } from "react";
import { useStudentSearch } from "@/hooks/useStudent";
import { useSearchParams } from "react-router-dom";
import { OctagonX } from "lucide-react";

export function SearchDetails() {
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("search");

  const { data, refetch } = useStudentSearch(searchValue, { enabled: false });
console.log(data);

  useEffect(() => {
    if (searchValue && searchValue.length >= 2) {
      refetch();
    }
  }, [searchValue, refetch]);
  return (
    <>
      {data?.data?.count === 0 ? (
        <div className=" text-center mt-50 text-xl ">
          <div>
            <OctagonX className="mx-auto mb-4 text-red-500" size={58} />
          </div>
          <div>
            <p className="text-4xl text-center">
              لا توجد نتائج للبحث عن "{searchValue}"
            </p>
          </div>
        </div>
      ) : (
        <div className="m-6">
          <h2 className="my-3 text-3xl font-bold">نتائج البحث عن "{searchValue}"</h2>
          <ul className="text-2xl list-disc list-inside">
            {data?.data?.data?.map((student) => (
                console.log(student),
                
              <li key={student._id}>
                {/* {student.stdName} - {student.stdSpecial?.name} */}
               <a href={`/student/${student._id}`} className="text-blue-600 hover:underline">
                {student.stdName} - {student.stdSpecial?.name}
                </a> 
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
