import mongoose from "mongoose";
const trainningPlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    // required: true,
  },
  phone: {
    type: String,
  },
  email: {
    type: String,
    // unique: true,
  },
  supervisorName: {
    type: String,
  },
  supervisorPhone: {
    type: String,
  },
  owner: {
    type: String,
  },
  ownerPhone: {
    type: String,
  },
  commercialRegister: {
    type: String,
  },
  idCard: {
    type: String,
  }, // URL for national ID
  taxFile: {
    type: String,
  }, // URL for tax file
  socialMedia: { type: String },
  max_participants: { type: Number },
  current_participants: { type: Number, default: 0 },
});
const TrainningPlace = mongoose.model("trainningPlace", trainningPlaceSchema);
export { TrainningPlace };
