import mongoose from "mongoose";
const schoolSpecialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  is_active: { type: Boolean, default: true },
}, { timestamps: true });
const SchoolSpecial = mongoose.model("schoolSpecial", schoolSpecialSchema);
export { SchoolSpecial as schoolSpecialModel };