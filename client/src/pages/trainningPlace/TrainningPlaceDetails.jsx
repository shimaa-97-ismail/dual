import React from "react";
import { useParams } from "react-router-dom";
import { useStudentByTrainningPlace } from "@/hooks/useStudent";
import { StudentTrainning } from "@/components/table/StudentTrainning";
export function TrainningPlaceDetails() {
  const { trainningId } = useParams();
  console.log("trainningId from params:", trainningId);

  const {
    data: students,
    isLoading,
    error,
  } = useStudentByTrainningPlace(trainningId);
  console.log("Raw hook response:", students);
  console.log("Actual student array:", students?.data);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <div className="mt-5 mb-6 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          الطلبة المتدربين
        </h2>

        {students?.data.length === 0 ? (
          <p className="text-center text-gray-500">
            لا يوجد طلبة متدربين في هذا المكان
          </p>
        ) : (
          <>
            <p className="text-gray-600">
              قائمة الطلبة المتدربين في هذا المكان
            </p>
            <StudentTrainning data={students} />
          </>
        )}
      </div>
    </>
  );
}
