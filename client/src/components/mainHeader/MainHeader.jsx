import React from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle, Grid, List } from "lucide-react";
export function MainHeader({
  btnTitle,
  setShowAddModal,
  title,
  description,
  setViewMode,
  viewMode,
  onAddButtonClick
}) {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 m-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {title}
        </h1>
        <p className="text-gray-600 mt-1"> {description}</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex border rounded-lg p-1 items-center">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("grid")}
            className="rounded-r-none  text-[ffff]! mt-0! hover:bg-[#345ea6] ml-2"
          >
            <Grid
              className={`w-4 h-4 ${
                viewMode === "grid" ? "text-white" : "text-gray-400"
              }`}
            />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            onClick={() => setViewMode("list")}
            className="rounded-l-none mt-0! hover:bg-[#345ea6]"
          >
            <List
              className={`w-4 h-4 ${
                viewMode === "list" ? "text-white" : "text-gray-400"
              }`}
            />
          </Button>
        </div>

        <div className="flex gap-2 items-center">
          <Button
            onClick={() => {
              if (onAddButtonClick) {
                onAddButtonClick();
              } else {
                setShowAddModal(true);
              }
            }}
            className="flex items-center gap-2  mt-0! "
          >
            <PlusCircle className="w-4 h-4" />
            {btnTitle}
          </Button>
        </div>
      </div>
    </div>
  );
}
