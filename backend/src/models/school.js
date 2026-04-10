import mongoose from "mongoose";

const schoolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      max: 60,
    },
    address: {
      type: String,
      required: true,
    },
    intakes: [{ type: String }],
    managerName: {
      type: String,
      max: 50,
    },
    phone: 
      {
        type: String,
        maxlength: 11,
      }
    ,
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    studentAffairs: {
      type: String,
      max: 60,
    },
    studentAffairsPhone: {
      type: String,
      max: 11,
    },
    is_active: { type: Boolean, default: true },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "typeOfSchool",
      required: true,
    },
    departement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "department",
      required: true,
    },
    special: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "schoolSpecial",
      },
    ],
  },
  { timestamps: true },
);

const School = mongoose.model("school", schoolSchema);
export { School as schoolModel };
