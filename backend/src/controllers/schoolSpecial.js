import { schoolSpecialModel } from "../models/schoolSpecial.js";

// export const getSchoolSpecials = async (req, res) => {
//     try {
//         const specials = await schoolSpecialModel.find();   
//         res.status(200).json(specials);
//     } catch (error) {
//         res.status(404).json({ message: error.message });
//     }
// };

export const getSchoolSpecials = async (req, res) => {
    try {
        const specials = await schoolSpecialModel.aggregate([
            {
                $lookup: {
                    from: "schools",
                    let: { specialId: "$_id" },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $in: ["$$specialId", "$special"]
                                }
                            }
                        }
                    ],
                    as: "relatedSchools"
                }
            },
            {
                $addFields: {
                    schoolCount: { $size: "$relatedSchools" }
                }
            },
            {
                $project: {
                    name: 1,
                    is_active: 1,
                    description: 1,
                    schoolCount: 1,
                    _id: 1
                    // لا ندرج relatedSchools، وبالتالي لن تظهر في النتائج
                }
            },
            {
                $sort: { schoolCount: -1 }
            }
        ]);
        
        res.status(200).json(specials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
export const createSchoolSpecial = async (req, res) => {
   console.log(req.body);
   
    const newSpecial = new schoolSpecialModel(req.body);
    try {
        await newSpecial.save();
        res.status(201).json(newSpecial);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};
export const updateSchoolSpecial = async (req, res) => {
    const { id } = req.params;
    const special = req.body;
     console.log(req.body);
    console.log( req.params,special);
    
    try {
        const updatedSpecial = await schoolSpecialModel.findByIdAndUpdate(id, special, { new: true });
        res.status(200).json(updatedSpecial);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }   
};
export const deleteSchoolSpecial = async (req, res) => {
    const { id } = req.params;
    try {
        await schoolSpecialModel.findByIdAndDelete(id);
        res.status(200).json({ message: "School Special deleted successfully.",data:id });
    } catch (error) {
        res.status(409).json({ message: error.message });
    }   
};