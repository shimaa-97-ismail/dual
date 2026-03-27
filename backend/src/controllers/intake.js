import { intakeModel } from "../models/intake.js";

export const getIntakes = async (req, res) => {
  try {
    const intakes = await intakeModel.find();   
    res.status(200).json({ success: true, data: intakes });
  } catch (error) {
    res.status(500).json({
      success: false,
        message: error.message,
    });
  }
};
    
export const createIntake = async (req, res) => {
  const data = req.body;    
    try {
    const newIntake = new intakeModel(data);
    await newIntake.save();
    res.status(201).json({ success: true, data: newIntake });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'اسم الدفعة موجود بالفعل',
      });
    }   
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateIntake = async (req, res) => {   
    const { id } = req.params;
    const data = req.body;
    try {
    const updatedIntake = await intakeModel.findByIdAndUpdate(
        id,
        data,
        { new: true, runValidators: true }
    );
    if (!updatedIntake) {
      return res.status(404).json({ message: "الدفعة غير موجودة" });
    }
    res.status(200).json({ success: true, data: updatedIntake });
  }
    catch (error) { 
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
export const deleteIntake = async (req, res) => {
    const { id } = req.params;    
    try {
    const deletedIntake = await intakeModel.findByIdAndDelete(id);
    if (!deletedIntake) {
      return res.status(404).json({ message: "الدفعة غير موجودة" });
    }
    res.status(200).json({ success: true,data:id, message: "تم حذف الدفعة بنجاح" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};