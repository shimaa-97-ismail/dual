import mongoose from "mongoose";

const motherDetailsSchema = new mongoose.Schema({
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

const motherDetails = mongoose.model("motherDetails", motherDetailsSchema);
export { motherDetails as motherDetailsModel };
