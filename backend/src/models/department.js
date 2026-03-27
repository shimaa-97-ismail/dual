import mongoose from "mongoose";

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
     min:3,
    max:50,
  },mangerName:{
    type: String,
    min:10,
    max:50,
  },
  mangerPhone:{
    type: String, 
    min:11,
    max:11,
  }
});


const Department = mongoose.model("department", departmentSchema);
export { Department as departmentModel };3