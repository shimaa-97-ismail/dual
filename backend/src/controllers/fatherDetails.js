import { fatherDetailsModel } from "../models/fatherDetails.js";

export const getFatherDetails = async (req, res) => {
  try {
    const fatherDetails = await fatherDetailsModel.find();

    res.status(200).json(fatherDetails);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createFather = async (req, res) => {
  const { newData } = req.body;
  console.log(newData);

  try {
    const newFather = new fatherDetailsModel(newData);
    console.log(newFather);

    await newFather.save();
    res.status(201).json(newFather);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const updateFather = async (req, res) => {
  const { id } = req.params;
  const newFatherDetails = req.body;
  try {
    const updatedDetails = await fatherDetailsModel.findByIdAndUpdate(
      id,
      newFatherDetails,
      { new: true }
    );
    res.status(200).json(updatedDetails);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};


export const deleteFather=async(req,res)=>{
     try {
        const { id } = req.params;
        const deletedFather = await fatherDetailsModel.findByIdAndDelete(id);
        if (!deletedFather) {
          return res.status(404).json({ message: "father not found" });
        }
        res.status(200).json({ message: "father deleted successfully", data: id });
      } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
      }
}