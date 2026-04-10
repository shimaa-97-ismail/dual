import {TrainningPlace} from "../models/trainningPlace.js";

export const createTrainningPlace = async (req, res) => {
  try {
    console.log("here traninig place new",req.body);
    
     const trainningPlace = new TrainningPlace(req.body);
    await trainningPlace.save();
   
    res.status(201).json({
      success: true,
      data: trainningPlace,
    });
  } catch (error) {
    console.log(error);
    
    if (error.code === 11000) {

      return res.status(400).json({
        success: false,
        message: 'اسم مكان التدريب موجود بالفعل',
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  //   const { name, address, phone, supervisorName } = req.body;
  //   const newTrainningPlace = new TrainningPlace({
  //     name,
  //     address,
  //       phone,
  //       supervisorName,
  //   });
  //   await newTrainningPlace.save();
  //   res.status(201).json(newTrainningPlace);
  // } catch (error) {
  //   res.status(500).json({ message: "Server Error", error: error.message });
  // }
};
export const getAllTrainningPlaces = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    
    const query = {};
    
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    
    const trainningPlaces = await TrainningPlace.find(query)
      .populate('supervisorName', 'username phone').populate("owner","username phone")
      .skip((page - 1) * limit)
      .limit(limit);
      console.log(trainningPlaces);
      
    
    const total = await TrainningPlace.countDocuments(query);
    
    res.json({
      success: true,
      data: trainningPlaces,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
  //   const trainningPlaces = await TrainningPlace.find().populate("supervisorName", "username role");
  //   res.status(200).json(trainningPlaces);
  // } catch (error) {
  //   res.status(500).json({ message: "Server Error", error: error.message });
  // } 
};
export const getTrainningPlaceById = async (req, res) => {
  try {
    const { id } = req.params;
    const trainningPlace = await TrainningPlace.findById(id).populate("supervisorName", "username role");
    if (!trainningPlace) {
      return res.status(404).json({ message: "Training Place not found" });
    }
    res.status(200).json(trainningPlace);
    } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  } 
};
export const updateTrainningPlace = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTrainningPlace = await TrainningPlace.findByIdAndUpdate(
        id,
         req.body,
        { new: true, runValidators: true }
    ).populate([
  { path: "departement", select: "name" },
  { path: "special", select: "name" },
]);

    if (!updatedTrainningPlace) {
      return res.status(404).json({ message: "Training Place not found" });
    }
    res.status(200).json({data:updatedTrainningPlace, success:true});
  }
    catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteTrainningPlace = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTrainningPlace = await TrainningPlace.findByIdAndDelete(id);
    if (!deletedTrainningPlace) {
      return res.status(404).json({ message: "Training Place not found" });
    }
    res.status(200).json({ success:true,message: "Training Place deleted successfully" });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
