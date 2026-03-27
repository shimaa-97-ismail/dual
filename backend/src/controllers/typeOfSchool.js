import { schoolModel } from "../models/school.js";
import { typeOfSchoolModel } from "../models/typeOfSchool.js";

// export const getAllTypesOfSchool = async (req, res) => {
//   try {
//     const types = await typeOfSchoolModel.find();
//      const count = await schoolModel.countDocuments({ type: typeId });
//     res.status(200).json({ success: true, data: types ,count});
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: `${error.message}  خطأ في جلب أنواع المدارس`,
//     });
//   }
// };

export const getAllTypesOfSchool = async (req, res) => {
    try {
        const result = await typeOfSchoolModel.aggregate([
            // Lookup to get all schools for each type
            {
                $lookup: {
                    from: "schools",
                    localField: "_id",
                    foreignField: "type",
                    as: "schools"
                }
            },
            {
                $addFields: {
                    schoolCount: { $size: "$schools" }
                }
            },
            {
                $project: {
                    _id: "$_id",
                    name: "$name",
                    count: "$schoolCount",
                    // _id: 0
                }
            },
            // {
            //     $sort: { count: -1 }
            // }
        ]);
        res.status(200).json({ success: true, data: result });
        
    } catch (error) {
        console.error('Error fetching types with school count:', error);
        throw error;
    }
}
export const createTypeOfSchool = async (req, res) => {
  try {
    const newType = new typeOfSchoolModel(req.body);
    await newType.save();
    res.status(201).json({ success: true, data: newType });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message} خطأ في إنشاء نوع المدرسة`,
    });
  }
};
export const getTypeOfSchoolById = async (req, res) => {
  try {
    const { id } = req.params;
    const type = await typeOfSchoolModel.findById(id);
    if (!type) {
      return res
        .status(404)
        .json({ success: false, message: "نوع المدرسة غير موجود" });
    }
    res.status(200).json({ success: true, data: type });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message} خطأ في جلب نوع المدرسة`,
    });
  }
};
export const updateTypeOfSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedType = await typeOfSchoolModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedType) {
      return res
        .status(404)
        .json({ success: false, message: "نوع المدرسة غير موجود" });
    }
    res.status(200).json({ success: true, data: updatedType });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message} خطأ في تحديث نوع المدرسة`,
    });
  }
};
export const deleteTypeOfSchool = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedType = await typeOfSchoolModel.findByIdAndDelete(id);
    if (!deletedType) {
      return res
        .status(404)
        .json({ success: false, message: "نوع المدرسة غير موجود" });
    }
    res
      .status(200)
      .json({ success: true, message: "تم حذف نوع المدرسة بنجاح" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: `${error.message} خطأ في حذف نوع المدرسة`,
    });
  }
};

export const getSchoolByType = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    
    const typeExists = await TypeOfSchool.findById(id);
    if (!typeExists) {
      return res.status(404).json({
        success: false,
        message: "نوع المدرسة غير موجود",
      });
    }
    const schools = await schoolModel
      .find({ type: id })
      .populate("type", "name ") // بيانات النوع
     
console.log(schools);

    res.status(200).json({
      success: true,
      data: schools,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "خطأ في جلب البيانات",
    });
  }
};


