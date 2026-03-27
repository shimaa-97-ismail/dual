import mongoose from "mongoose";
const typeOfSchoolSchema = new mongoose.Schema(
    {   
        name: {
            type: String,
            required: true,
            min: 3,
            max: 50,
        },
    },
    { timestamps: true }
);
const TypeOfSchool = mongoose.model("typeOfSchool", typeOfSchoolSchema);
export { TypeOfSchool as typeOfSchoolModel };