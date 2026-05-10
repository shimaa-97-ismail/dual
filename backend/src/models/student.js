import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    // المعلومات الأساسية
    stdName: {
      type: String,
      required: true,
    },
    stdAge: {
      type: Number,
      // required: true,
    },
    studID: {
      type: String,
      required: true,
      unique: true,
      min: 14,
      max: 14,
    },
    stdAddress: {
      type: String,
      required: true,
    },
    stdGender: {
      type: String,
      required: true,
      enum: ["ذكر", "أنثى"],
    },
    stdBOD: {
      type: Date,
      required: true,
    },
    phones: [
      {
        number: { type: String },
        type: {
          type: String,
          enum: ["primary", "alternate"],
          default: "primary",
        },
      },
    ],
    studentImage: {
      type: String,
      default: null,
    },
    fatherName: {
      type: String,
      required: true,
    },
    fatherID: {
      type: String,
      required: true,
    },
    fatherJobTitle: {
      type: String,
      required: true,
      enum: ["موظف", "معاش", "لا يعمل", "ربه منزل", "متوفى"],
    },
    fatherJobDetails: { type: String },
    fatherDeathCert: { type: String },
    fatherPhone: {
      type: String,
      required: true,
    },
    motherName: {
      type: String,
      required: true,
    },
    motherID: {
      type: String,
      required: true,
    },
    motherJobTitle: {
      type: String,
      required: true,
      enum: ["موظف", "معاش", "لا يعمل", "ربه منزل", "متوفى"],
    },
    motherJobDetails: { type: String },
    motherDeathCert: { type: String },
    motherPhone: {
      type: String,
      // required: true,
    },

    code: {
      type: String,
         index: {
         unique: true,
        partialFilterExpression: { code: {$type :"string"} },
      },
    },
    email: {
      type: String,
      // unique: true,
      // sparse: true,
      // index: {
      //   partialFilterExpression: { email: { $ne: "" } },
      // },
    },
    password: {
      type: String,
    },
    preparatorySchoolTotalScore: {
      type: Number,
    },

    // academic_system
    current_stage: {
      // stage_number: {
      //   type: Number,
      //   enum: [1, 2, 3],
      //   required: true,
      //   default: 1,
      // },
      stage_name: {
        type: String,
        enum: ["الصف الأول", "الصف الثاني", "الصف الثالث"],
        default: "الصف الأول",
      },
      academic_year: String, // "2024-2025"
      enrolledDate: {
        type: Date,
        default: Date.now,
      },
      is_repeated: { type: Boolean, default: false }, // هل هذه سنة مكررة؟
      repetition_count: { type: Number, default: 0 }, // عدد مرات التكرار
      max_repetitions_allowed: { type: Number, default: 2 }, // الحد الأقصى للتكرار
    },
    graduationYear: {
      type: String,
      default: null,
    },
    academicYear: {
      type: String,
    },
    // تاريخ المراحل السابقة
    stage_history: [
      {
        stage_number: Number,
        stage_name_ar: String,
        academic_year: String,
        status: {
          type: String,
          enum: ["متخرج", "مفصول", "باقى لأعاده (راسب)", "ناجح منقول", "محول"],
        },
        final_score: Number,
        percentage: Number,
        decision: { type: String, enum: ["passed", "failed", "conditional"] },
        completion_date: Date,
        notes: String,
      },
    ],
    studStatus: {
      type: String,
      required: true,
      enum: [
        "مستجد",
        "ناجح منقول",
        "باقى لأعاده (راسب)",
        "مفصول",
        "محول",
        "متخرج",
        "متقدم",
        "منسحب",
      ],
    },
    chooseSpecial: [
      ///no
      { type: mongoose.Schema.Types.ObjectId, ref: "schoolSpecial" },
    ],
    stdSpecial: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "schoolSpecial",
      // required: true,
    },
    school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "school",
      // required: true,
    },
    stdTrainningPlace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trainningPlace",
      // required: true,
      default: null,
    },
    intake: {
      type: String,
      // type: mongoose.Schema.Types.ObjectId,
      // ref: "intakes",
      // required: true,
    },
    hasInsurace: { type: Boolean, default: false },
    current_class: {
      type: String,
    },
  
    weekly_attendance: [
      {
        year: Number, // 2024
        month: Number, // 1-12
        week_number: { type: Number, min: 1, max: 6 }, // الأسبوع 1، 2، 3، 4
        week_start_date: String, // تاريخ بداية الأسبوع
        week_end_date: String, // تاريخ نهاية الأسبوع
        days: [
          {
            day_number: { type: Number, min: 1, max: 7 }, // 1=الأحد، 2=الاثنين...
            day_name_ar: String, // "الأحد"، "الاثنين"...
            date: Date,
            status: {
              type: String,
              enum: ["حاضر", "غائب", "اجازه", "مدرسه"],
            },
            notes: String, // سبب الغياب إن وجد
          },
        ],
        summary: {
          total_days: Number,
          present_days: Number,
          absent_days: Number,
          excused_absences: Number,
          late_days: Number,
          attendance_rate: Number, // نسبة الحضور لهذا الأسبوع
        },
        // recorded_by: ObjectId, // المستخدم المسجل
        recorded_at: { type: Date, default: Date.now },
      },
    ],
    // الدرجات والتقييم
    academic_performance: {
      current_year_scores: [
        {
          // subject_id: ObjectId,
          subject_name_ar: String,
          midterm_score: Number,
          final_score: Number,
          total_score: Number,
          grade: String, // "ممتاز"، "جيد جدا"، "جيد"...
          status: { type: String, enum: ["ناجح", "راسب", "معفي"] },
        },
      ],
      overall_percentage: Number,
      final_decision: { type: String, enum: ["ناجح", "راسب", "ناجح مشروط"] },
      rank_in_class: Number,
    },
    //  // معلومات النظام
    // system_info: {
    //   username: String,
    //   password_hash: String,
    //   last_login: Date,
    //   created_by: ObjectId,
    //   created_at: { type: Date, default: Date.now },
    //   updated_at: { type: Date, default: Date.now },
    //   active: { type: Boolean, default: true }
    // }
  },
  { timestamps: true },
);

const studentModel = mongoose.model("student", studentSchema);
studentSchema.index({ stdName: "text" });

export { studentModel };
