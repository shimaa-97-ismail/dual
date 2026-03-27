import React from 'react'
import { useParams } from 'react-router-dom'
import {useStudentByTrainningPlace} from "@/hooks/useStudent";
import {StudentTrainning} from "@/components/table/StudentTrainning"
export function TrainningPlaceDetails() {
    const {trainningId} =useParams();
    console.log(trainningId);
    
    const {data:students}=useStudentByTrainningPlace(trainningId);
    console.log(students);
    
  return (
    <>
    {/* <div>TrainningPlaceDetails</div> */}
    <StudentTrainning data={students}/>
    </>
    
  )
}
