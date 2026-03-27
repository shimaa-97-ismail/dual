import React from 'react'
import {
  Card,
  CardContent,
  
} from "@/components/ui/card";
export function ReportCard({title,onSubmit}) {
  return (
    <div className="w-full hover:shadow-xl transition-all duration-300 transform cursor-pointer hover:-translate-y-1" >
        <Card className="h-full flex flex-col border-2 hover:border-primary/20" onClick={onSubmit}>
         
          <CardContent className="flex items-center justify-between">
            <div className="mb-4 text-center">
              <h3 className="text-lg font-semibold mb-2 text-center text-gray-700">
               {title}
              </h3>
            </div>
          </CardContent>
         
        </Card>
      </div>

  )
}
