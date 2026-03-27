import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  month: { type: String, required: true },
  year: { type: Number, required: true },
  amountDue: { type: Number, required: true },
  receipt1: { type: String, required: true },
  receipt2: { type: String, required: true },
  paymentDate: { type: Date, required: true },
  academicyearForPayment:{type:String,required:true,   enum: ['first', 'second', 'third'] }
});

const enrollmentSchema = new mongoose.Schema({
  studentId: {

    type: mongoose.Schema.Types.ObjectId,
    ref: "student",
    required: true,
  },
  academicYear: { type: String, required: true },
  stage_name: {
    type: String,
    enum: ["الصف الأول", "الصف الثاني", "الصف الثالث"],
  },
  isRepeat: { type: Boolean, default: false },
  payments: [paymentSchema],
  createdAt: { type: Date, default: Date.now },
});
enrollmentSchema.index({ studentId: 1 });

const enrollment = mongoose.model("Enrollment", enrollmentSchema);

export { enrollment as enrollmentModel };
