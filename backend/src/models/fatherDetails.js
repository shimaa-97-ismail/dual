import mongoose from "mongoose";

const fatherDetailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
});

const FatherDetails = mongoose.model("fatherDetails", fatherDetailsSchema);
export { FatherDetails as fatherDetailsModel };
