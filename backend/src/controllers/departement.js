import { departmentModel } from "../models/department.js";
import { schoolModel } from "../models/school.js";

export const getDepatement = async (req, res) => {
  try {
    const aggregatedDepartments = await departmentModel.aggregate([
      {
        $lookup: {
          from: "schools",
          let: { departmentId: "$_id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$departement", "$$departmentId"] } } },
            { $count: "count" },
          ],
          as: "schoolCounts",
        },
      },
      {
        $addFields: {
          schoolCount: {
            $ifNull: [{ $arrayElemAt: ["$schoolCounts.count", 0] }, 0],
          },
        },
      },
      {
        $project: {
          schoolCounts: 0,
        },
      },
    ]);

    // If you want to keep the same structure as before, with a count of departments
    const count = aggregatedDepartments.length;

    res.status(200).json({ success: true, data: aggregatedDepartments, count });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
export const createDepartement = async (req, res) => {
  {
    const departementData = req.body;
    try {
      const newDepartement = new departmentModel(departementData);
      await newDepartement.save();
      res.status(201).json({ success: true, data: newDepartement });
    } catch (error) {
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: "اسم الاداره موجود بالفعل",
        });
      }
      res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
};
export const updateDepartement = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updatedDepartement = await departmentModel.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true },
    );
    if (!updatedDepartement) {
      return res.status(404).json({ message: "الاداره غير موجود" });
    }
    res.status(200).json({ success: true, data: updatedDepartement });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteDepartement = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedDepartement = await departmentModel.findByIdAndDelete(id);
    if (!deletedDepartement) {
      return res.status(404).json({ message: "الاداره غير موجود" });
    }
    res.status(200).json({ success: true, message: "تم حذف الاداره بنجاح" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getDepartementById = async (req, res) => {
  const { id } = req.params;
  try {
    const departement = await departmentModel.findById(id);
    if (!departement) {
      return res.status(404).json({ message: "الاداره غير موجود" });
    }

    res.status(200).json({ success: true, data: departement });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
