import mongoose from "mongoose";
const intakeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  academic_year: { type: String, required: true },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
});
const Intake = mongoose.model("intake", intakeSchema);

export { Intake as intakeModel };
