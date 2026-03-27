import { studentModel } from "../models/student.js";
import { enrollmentModel } from "../models/payment.js";

const stageMonths = {
  "الصف الأول": ["فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس"],
  "الصف الثاني": [
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
    "أبريل",
    "مايو",
    "يونيو",
    "يوليو",
    "أغسطس",
  ],
  "الصف الثالث": [
    "سبتمبر",
    "أكتوبر",
    "نوفمبر",
    "ديسمبر",
    "يناير",
    "فبراير",
    "مايو",
  ],
};

export const createStudent = async (req, res) => {
  try {
    console.log("create student");

    const existingStudent = await studentModel.findOne({
      $or: [{ studID: req.body.studID }],
    });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: "الرقم القومي مسجل مسبقاً",
      });
    }

    const newStudent = new studentModel(req.body);

    await newStudent.save();
    //  const populatedStudent = await Student.findById(student._id)
    //   .populate('stdSpecial')
    //   .populate('school')
    //   .populate('stdSupervisorName');
    res.status(201).json({
      success: true,
      message: "تم إضافة الطالب بنجاح",
      data: newStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllStudents = async (req, res) => {
  try {
    const students = await studentModel
      .find()
      .populate("stdSpecial", "specialName")
      .populate("school", "schoolName")
      .populate("stdTrainningPlace", "name address phone")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await studentModel
      .findById(id)
      .populate("stdSpecial", "name")
      .populate("school", "name")
      .populate("stdTrainningPlace", "name address phone");
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "الطالب غير موجود",
      });
    }
    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//absent
function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Arabic day names (1=Saturday, 2=Sunday, ..., 7=Friday)
const arabicDays = ["السبت", "الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة"];

function getArabicDayName(dayNumber) {
  return arabicDays[dayNumber - 1];
}

// Compute week number within the month (1‑5, based on the given Saturday)
function getWeekOfMonth(saturdayDate) {
  const year = saturdayDate.getFullYear();
  const month = saturdayDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1);
  let firstSaturday = new Date(firstDayOfMonth);
  while (firstSaturday.getDay() !== 6) { // find first Saturday of month
    firstSaturday.setDate(firstSaturday.getDate() + 1);
  }
  // If the given Saturday is before the first Saturday of its month,
  // it belongs to the previous month's last week.
  if (saturdayDate < firstSaturday) {
    return Math.ceil(saturdayDate.getDate() / 7);
  }
  const diffWeeks = Math.floor((saturdayDate - firstSaturday) / (1000 * 60 * 60 * 24 * 7));
  return diffWeeks + 1;
}function convertToWeeklyAttendance(weekStart, attendanceData) {
  // Parse weekStart as local date (e.g., "2026-02-28")
  const [year, month, day] = weekStart.split('-').map(Number);
  const startLocal = new Date(year, month - 1, day);
  startLocal.setHours(0, 0, 0, 0);

  // Generate the 7 days of the week
  const days = [];
  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(startLocal);
    currentDate.setDate(startLocal.getDate() + i);
    const dateStr = formatLocalDate(currentDate);
    const status = attendanceData[dateStr] || "حاضر";

    days.push({
      day_number: i + 1,                      // 1=Saturday, 2=Sunday, ..., 7=Friday
      day_name_ar: getArabicDayName(i + 1),
      date: currentDate,                     // stored as Date (local)
      status,
      notes: "",
    });
  }

  // Summary statistics
  const total_days = days.length;
  const present_days = days.filter(d => d.status === "حاضر").length;
  const absent_days = days.filter(d => d.status === "غائب").length;
  const excused_absences = days.filter(d => d.status === "اجازه").length;
  const attendance_rate = total_days > 0 ? (present_days / total_days) * 100 : 0;

  // Week start/end as local strings
  const weekStartStr = formatLocalDate(startLocal);
  const endDate = new Date(startLocal);
  endDate.setDate(startLocal.getDate() + 6);
  const weekEndStr = formatLocalDate(endDate);

  // Week number within the month (based on the Saturday)
  const week_number = getWeekOfMonth(startLocal);

  return [{
    year: startLocal.getFullYear(),
    month: startLocal.getMonth() + 1,
    week_number,
    week_start_date: weekStartStr,   // ✅ stored as string
    week_end_date: weekEndStr,       // ✅ stored as string
    days,
    summary: {
      total_days,
      present_days,
      absent_days,
      excused_absences,
      late_days: 0,
      attendance_rate,
    },
    recorded_at: new Date(),
  }];
}


//add absent per student per week
export const addStudentAbsent = async (req, res) => {
  try {
    const studentId = req.params.id;
    const { startDate, attendanceData } = req.body;

    if (!startDate) {
      return res.status(400).json({ success: false, message: "startDate is required" });
    }

    const student = await studentModel.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "الطالب غير موجود" });
    }
const existingWeek = student.weekly_attendance.find(
      (week) => week.week_start_date === startDate
    );
    if (existingWeek) {
      return res.status(400).json({
        success: false,
        message: `تم تسجيل حضور هذا الأسبوع بالفعل (${startDate})`,
      });
    }
    const weeklyAttendance = convertToWeeklyAttendance(startDate, attendanceData);

    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      { $push: { weekly_attendance: { $each: weeklyAttendance } } },
      { new: true, runValidators: true }
    ).populate("stdSpecial school stdTrainningPlace");

    res.status(200).json({ success: true, message: "تم تسجيل الغياب بنجاح", data: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

//get all absent per student

// controllers/student.js
export const getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;

    // جلب الطالب مع حقل weekly_attendance فقط (لتقليل البيانات)
    const student = await studentModel.findById(studentId).select('weekly_attendance');
    if (!student) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
    }
console.log(student);

    // إرجاع مصفوفة الغياب (مرتبة حسب تاريخ البداية تنازلياً – الأحدث أولاً)
    const attendance = student.weekly_attendance.sort((a, b) => 
      b.week_start_date.localeCompare(a.week_start_date)
    );
    console.log(attendance);
    

    res.status(200).json({ success: true, data: attendance });
  } catch (error) {
    console.error('Error fetching student attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const getWeekAttendance = async (req, res) => {
  try {
    const { studentId, weekStart } = req.params;

    // جلب الطالب مع حقل weekly_attendance فقط
    const student = await studentModel.findById(studentId).select('weekly_attendance');
    if (!student) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
    }

    // البحث عن الأسبوع المطلوب باستخدام week_start_date
    const week = student.weekly_attendance.find(w => w.week_start_date === weekStart);
    if (!week) {
      return res.status(404).json({ success: false, message: 'لا يوجد سجل غياب لهذا الأسبوع' });
    }

    res.status(200).json({ success: true, data: week });
  } catch (error) {
    console.error('Error fetching week attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWeekAttendance = async (req, res) => {
  try {
    const { studentId, weekStart } = req.params;
    const { days } = req.body; // days هي مصفوفة جديدة تحتوي على الأيام المعدلة

    // التحقق من وجود الأيام
    if (!days || !Array.isArray(days) || days.length !== 7) {
      return res.status(400).json({ success: false, message: 'يجب إرسال مصفوفة تحتوي على 7 أيام' });
    }

    // حساب الملخص الجديد
    const total_days = days.length;
    const present_days = days.filter(d => d.status === 'حاضر').length;
    const absent_days = days.filter(d => d.status === 'غائب').length;
    const excused_absences = days.filter(d => d.status === 'اجازه').length;
    const attendance_rate = total_days > 0 ? (present_days / total_days) * 100 : 0;

    const newSummary = {
      total_days,
      present_days,
      absent_days,
      excused_absences,
      late_days: 0,
      attendance_rate,
    };

    // تحديث الأسبوع باستخدام $set مع عامل المصفوفة $
    const updatedStudent = await studentModel.findOneAndUpdate(
      { _id: studentId, 'weekly_attendance.week_start_date': weekStart },
      {
        $set: {
          'weekly_attendance.$.days': days,
          'weekly_attendance.$.summary': newSummary,
          'weekly_attendance.$.recorded_at': new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: 'الطالب أو الأسبوع غير موجود' });
    }

    // إعادة الأسبوع المعدل من البيانات
    const updatedWeek = updatedStudent.weekly_attendance.find(w => w.week_start_date === weekStart);

    res.status(200).json({ success: true, data: updatedWeek });
  } catch (error) {
    console.error('Error updating week attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deleteWeekAttendance = async (req, res) => {
  try {
    const { studentId, weekStart } = req.params;
console.log("delete",studentId, weekStart );

    // استخدام $pull لإزالة العنصر الذي week_start_date يساوي weekStart
    const updatedStudent = await studentModel.findByIdAndUpdate(
      studentId,
      { $pull: { weekly_attendance: { week_start_date: weekStart } } },
      { new: true } // إرجاع الوثيقة المحدثة
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
    }

    // التحقق من أن العنصر قد تم حذفه فعلاً
    const stillExists = updatedStudent.weekly_attendance.some(
      (week) => week.week_start_date === weekStart
    );
    if (stillExists) {
      return res.status(500).json({ success: false, message: 'فشل في حذف الأسبوع' });
    }

    res.status(200).json({ success: true, message: 'تم حذف الأسبوع بنجاح' });
  } catch (error) {
    console.error('Error deleting week attendance:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};



////
// controllers/studentController.js
export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    // Parse JSON fields that might be sent as strings
    if (updateData.phones) {
      try {
        updateData.phones = JSON.parse(updateData.phones);
      } catch (e) {
        // If parsing fails, assume it's already an array
      }
    }
    if (updateData.current_stage) {
      try {
        updateData.current_stage = JSON.parse(updateData.current_stage);
      } catch (e) {}
    }

    // Handle file uploads (if any)
    if (req.files) {
      if (req.files.fatherDeathCert) {
        updateData.fatherDeathCert = req.files.fatherDeathCert[0].path;
      }
      if (req.files.motherDeathCert) {
        updateData.motherDeathCert = req.files.motherDeathCert[0].path;
      }
    }

    // Check if studID already exists for another student
    if (updateData.studID) {
      const existingStudent = await studentModel.findOne({
        studID: updateData.studID,
        _id: { $ne: id },
      });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: 'الرقم القومي مسجل مسبقاً لطالب آخر',
        });
      }
    }

    // Update student
    const updatedStudent = await studentModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: 'الطالب غير موجود' });
    }

    res.status(200).json({
      success: true,
      message: 'تم تحديث الطالب بنجاح',
      data: updatedStudent,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStudent = await studentModel.findByIdAndDelete(id);
    if (!deletedStudent) {
      return res.status(404).json({
        success: false,
        message: "الطالب غير موجود",
      });
    }
    res
      .status(200)
      .json({ success: true, message: "تم حذف الطالب بنجاح", data: id });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getStudentByschoolAndSpeacial = async (req, res) => {
  try {
    const { schoolID, speacialID } = req.params;
    console.log(schoolID, speacialID);

    const students = await studentModel
      .find({
        school: schoolID,
        stdSpecial: speacialID,
      })
      .populate("stdTrainningPlace", "name");
    console.log(students);
    res
      .status(200)
      .json({ success: true, message: "تم حذف الطالب بنجاح", data: students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getStudentBySChool = async (req, res) => {
  try {
    const { schoolId } = req.params;

    console.log(schoolId);

    const students = await studentModel
      .find({ school: schoolId })
      .populate("stdSpecial", "specialName")
      .populate("school", "schoolName")
      .populate("stdTrainningPlace", "name address phone")
      .populate("intake", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getStudentByTrainningPlace = async (req, res) => {
  try {
    const { trainningId } = req.params;

    console.log(trainningId);

    const students = await studentModel
      .find({ stdTrainningPlace: trainningId })
      .populate("stdSpecial", "specialName")
      .populate("school", "schoolName")
      .populate("stdTrainningPlace", "name address phone")
      .populate("intake", "name")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Search students by name or ID
export const searchStudents = async (req, res) => {
  try {
    console.log("asd", req.query);

    const { query } = req.query;
    console.log(query);

    if (!query) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    // Search by name (case-insensitive) OR studentId
    const students = await studentModel
      .find({
        $or: [
          { stdName: { $regex: query, $options: "i" } },
          { studID: { $regex: query, $options: "i" } },
        ],
      })
      .sort({ name: 1 })
      .populate("stdSpecial", "name")
      .populate("school", "name address");
    console.log(students);

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// controllers/studentController.js

export const bulkUpdateStudents = async (req, res) => {
  try {
    const { studentIds, updates } = req.body;

    if (!studentIds || !Array.isArray(studentIds) || studentIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'يرجى توفير قائمة بمعرفات الطلاب',
      });
    }

    // Validate updates - only allowed fields
    const allowedFields = ['studStatus', 'stage_name', 'current_class'];
    const updateData = {};
    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        updateData[field] = updates[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'لا توجد بيانات محدثة',
      });
    }

    // If updating stage_name, we need to update the nested object (if using current_stage.stage_name)
    // Adjust based on your schema. If you have current_stage as an object, we need to set it correctly.
    // Let's assume you have current_stage.stage_name.
    if (updateData.stage_name) {
      updateData['current_stage.stage_name'] = updateData.stage_name;
      delete updateData.stage_name; // remove top-level field
    }

    const result = await studentModel.updateMany(
      { _id: { $in: studentIds } },
      { $set: updateData },
      { runValidators: true }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'لم يتم العثور على أي طلاب',
      });
    }

    res.status(200).json({
      success: true,
      message: `تم تحديث ${result.modifiedCount} طالب بنجاح`,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addPaymentToEnrollment = async (req, res) => {
  const { studentId, enrollmentId } = req.params;
  const paymentsData = req.body; // البيانات كما هي

  try {
    const student = await studentModel.findById(studentId);
    if (student && student.status === "متخرج") {
      return res
        .status(400)
        .json({ message: "الطالب متخرج، لا يمكن تعديل البيانات" });
    }
    const enrollment = await enrollmentModel.findOne({
      _id: enrollmentId,
      studentId,
    });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // التحقق من الازدواجية
    const isDuplicate = enrollment.payments.some(
      (p) =>
        p.month === paymentsData.month &&
        p.year === paymentsData.year &&
        p.academicyearForPayment === paymentsData.academicyearForPayment,
    );
    if (isDuplicate) {
      return res
        .status(400)
        .json({ error: "تم تسديد هذا الشهر مسبقاً لهذه السنة الدراسية" });
    }

    enrollment.payments.push(paymentsData);
    await enrollment.save();
    await checkAndUpdateGraduation(studentId);
    res.status(201).json(enrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
export const getAllPaymentByStudent = async (req, res) => {
  const { studentId } = req.params;
  console.log("getAllPaymentByStudent", studentId);

  try {
    const enrollments = await enrollmentModel
      .find({ studentId })
      .sort({ academicYear: 1, isRepeat: 1 });
    res.json(enrollments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};
export const addPaymentForExistingEnrollment = (req, res) => {};

export const updatePayment = async (req, res) => {
  const { studentId, enrollmentId, paymentId } = req.params;
  const updates = req.body;

  if (!updates || typeof updates !== "object" || Array.isArray(updates)) {
    return res.status(400).json({ message: "Invalid request body" });
  }

  try {
    const student = await studentModel.findById(studentId);
    if (student && student.status === "متخرج") {
      return res
        .status(400)
        .json({ message: "الطالب متخرج، لا يمكن تعديل البيانات" });
    }
    const enrollment = await enrollmentModel.findOne({
      _id: enrollmentId,
      studentId,
    });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const payment = enrollment.payments.id(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // تحديث الحقول
    Object.assign(payment, updates);
    await enrollment.save();
    await checkAndUpdateGraduation(studentId);
    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePayment = async (req, res) => {
  const { studentId, enrollmentId, paymentId } = req.params;

  try {
    const student = await studentModel.findById(studentId);
    if (student && student.status === "متخرج") {
      return res.status(400).json({ message: "لا يمكن حذف دفعة لطالب متخرج" });
    }
    const enrollment = await enrollmentModel.findOne({
      _id: enrollmentId,
      studentId,
    });
    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    const payment = enrollment.payments.id(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // حذف الدفعة
    await payment.deleteOne();
    await enrollment.save();
    await checkAndUpdateGraduation(studentId);
    res.json({ message: "Payment deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// export const updatePayment = async (req, res) => {
//   const [studentId, paymentId] = req.params;
//   console.log("update");

//   const updates = req.body;
//   console.log(req.body);

//   if (!studentId || !paymentId) {
//     return res
//       .status(400)
//       .json({ message: "should have student id and payment id" });
//   }
//   const student = await studentModel.find(studentId);
//   if (!student) {
//     return res.status(404).json({ message: "student not found" });
//   }
//   const update = {};
//   for (const [key, value] of Object.entries(updates)) {
//     update[`payments.$[payment].${key}`] = value;
//   }

//    const updatedStudent = await enrollmentModel.findOneAndUpdate(
//       { studentId: studentId, 'payments._id': paymentId },
//       { $set: update },
//       {
//         arrayFilters: [{ 'payment._id': paymentId }],
//         new: true,           // return the updated document
//         runValidators: true, // run schema validations on the nested document
//       }
//     )
//     console.log(updatedStudent);

//       if (!updatedStudent) {
//       return res.status(404).json({ message: 'Student or payment not found' });
//     }
//    res.json(updatedPayment);
// };
// export const updatePayment = async (req, res) => {
//   const { studentId, paymentId } = req.params;
//   const updates = req.body;

//   // Check if updates is an object (and not null or array)
//   if (!updates || typeof updates !== 'object' || Array.isArray(updates)) {
//     return res.status(400).json({ message: 'Invalid request body, expected an object' });
//   }

//   // Now safe to use Object.entries
//   const setFields = {};
//   for (const [key, value] of Object.entries(updates)) {
//     setFields[`payments.$.${key}`] = value;
//   }

//   try {
//     const result = await enrollmentModel.findOneAndUpdate(
//       { studentId, 'payments._id': paymentId },
//       { $set: setFields },
//       { new: true, runValidators: true }
//     );
//     if (!result) return res.status(404).json({ message: 'Enrollment or payment not found' });
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
// export const deletePayment = async (req, res) => {
//   const { studentId, paymentId } = req.params;

//   try {
//     const result = await enrollmentModel.findOneAndUpdate(
//       { studentId },
//       { $pull: { payments: { _id: paymentId } } },
//       { new: true } // returns the updated document (optional)
//     );

//     if (!result) {
//       return res.status(404).json({ message: 'Enrollment not found' });
//     }

//     res.json({ message: 'Payment deleted successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// };
export const getPaymentById = async (req, res) => {
  //** */
  const { studentId, paymentId } = req.params;
  console.log(studentId, paymentId);

  try {
    const enrollment = await enrollmentModel.findOne({
      studentId,
      "payments._id": paymentId,
    });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }
    const payment = enrollment.payments.find(
      (p) => p._id.toString() === paymentId,
    );

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// controllers/student.js
export const repeatStage = async (req, res) => {
  const { studentId } = req.params;
  const { stage_name, academicYear: providedAcademicYear } = req.body;

  try {
    const student = await studentModel.findById(studentId);
    if (student && student.status === "متخرج") {
      return res
        .status(400)
        .json({ message: "الطالب متخرج، لا يمكن إعادة السنة" });
    }

    const stageEnrollments = await enrollmentModel.find({
      studentId,
      stage_name,
    });
    if (stageEnrollments.length >= 2) {
      return res
        .status(400)
        .json({
          message: "لا يمكن إعادة السنة أكثر من مرة واحدة لهذه المرحلة",
        });
    }
    let targetAcademicYear = providedAcademicYear;

    if (!targetAcademicYear) {
      // No academicYear provided; try to derive from previous enrollment
      const lastEnrollment = await enrollmentModel
        .findOne({ studentId, stage_name })
        .sort({ academicYear: -1 });
      if (!lastEnrollment) {
        return res.status(400).json({
          message: "لم يتم العثور على تسجيل سابق، يجب تحديد العام الدراسي",
        });
      }
      const [start, end] = lastEnrollment.academicYear.split("/");
      const newStart = parseInt(start) + 1;
      const newEnd = parseInt(end) + 1;
      targetAcademicYear = `${newStart}/${newEnd}`;
    }

    const newEnrollment = new enrollmentModel({
      studentId,
      academicYear: targetAcademicYear,
      stage_name,
      isRepeat: true,
      payments: [],
    });
    await newEnrollment.save();
    res.status(201).json(newEnrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "خطأ في الخادم" });
  }
};

export const createEnrollment = async (req, res) => {
  const { studentId } = req.params;
  const { stage_name, academicYear } = req.body;
  console.log("createEnrollment called", studentId, stage_name, academicYear);
  try {
    const existingEnrollment = await enrollmentModel.findOne({
      studentId,
      stage_name,
      academicYear,
    });
    if (existingEnrollment) {
      return res.status(400).json({
        message: `يوجد بالفعل تسجيل للسنة الدراسية ${academicYear} للمرحلة ${stage_name}`,
      });
    }
    const enrollment = new enrollmentModel({
      studentId,
      stage_name,
      academicYear,
      payments: [],
      isRepeat: false,
    });
    await enrollment.save();
    await checkAndUpdateGraduation(studentId);
    res.status(201).json(enrollment);
  } catch (err) {
    console.error("err", err);
    res.status(500).json({ error: err.message });
  }
};

// controllers/student.js
export const promoteStudent = async (req, res) => {
  const { studentId } = req.params;
  const { stage_name, academicYear } = req.body; // stage_name الحالي

  // خريطة لتحديد المرحلة التالية
  const nextStageMap = {
    "الصف الأول": "الصف الثاني",
    "الصف الثاني": "الصف الثالث",
    "الصف الثالث": null, // لا يوجد مرحلة بعد الثالث
  };

  const nextStage = nextStageMap[stage_name];
  if (!nextStage) {
    return res
      .status(400)
      .json({ message: "لا يمكن الانتقال إلى مرحلة أعلى من الصف الثالث" });
  }

  // حساب العام الدراسي التالي (مثلاً "2024/2025" -> "2025/2026")
  if (!academicYear) {
    return res.status(400).json({ message: "العام الدراسي مطلوب" });
  }
  const [start, end] = academicYear.split("/");
  const nextStart = parseInt(start) + 1;
  const nextEnd = parseInt(end) + 1;
  const nextAcademicYear = `${nextStart}/${nextEnd}`;

  try {
    // التحقق من عدم وجود تسجيل مكرر لهذه المرحلة والعام
    const existing = await enrollmentModel.findOne({
      studentId,
      stage_name: nextStage,
      academicYear: nextAcademicYear,
    });
    if (existing) {
      return res.status(400).json({
        message: `يوجد بالفعل تسجيل للمرحلة ${nextStage} للعام ${nextAcademicYear}`,
      });
    }

    const newEnrollment = new enrollmentModel({
      studentId,
      stage_name: nextStage,
      academicYear: nextAcademicYear,
      isRepeat: false,
      payments: [],
    });
    await newEnrollment.save();
    res.status(201).json(newEnrollment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

export const checkAndUpdateGraduation = async (studentId) => {
  try {
    // Get all third‑stage enrollments (including repeats)
    const thirdStageEnrollments = await enrollmentModel.find({
      studentId,
      stage_name: "الصف الثالث",
    });
    console.log(thirdStageEnrollments, "checkAndUpdateGraduation");

    // Collect all payments from these enrollments
    const allPayments = thirdStageEnrollments.flatMap((e) => e.payments);
    console.log(allPayments);

    // Required months for third stage
    const requiredMonths = stageMonths["الصف الثالث"];

    // Check if all required months are present
    const allMonthsPaid = requiredMonths.every((month) =>
      allPayments.some((p) => p.month === month),
    );
    console.log(allMonthsPaid);

    // Determine the academic year to set as graduationYear (use the most recent third‑stage enrollment if exists)
    let graduationYear = null;
    if (thirdStageEnrollments.length > 0) {
      // Sort enrollments by academicYear descending (latest first)
      const sorted = thirdStageEnrollments.sort((a, b) =>
        b.academicYear.localeCompare(a.academicYear),
      );
      // Extract the start year from the academicYear string (e.g., "2025/2026" -> 2025)
      const startYear = parseInt(sorted[0].academicYear.split("/")[0]);
      graduationYear = startYear;
    }

    // Update student
    if (allMonthsPaid) {
      console.log("update");

      // Only update if status is not already "متخرج"
      const res = await studentModel.findOneAndUpdate(
        { _id: studentId },
        { studStatus: "متخرج", graduationYear },
      );
      console.log(res);
    } else {
      // If not all months paid, revert status to something else (e.g., "ناجح منقول" if they have completed the stage but not all months? This is complex)
      // For simplicity, we'll set to "ناجح منقول" if they have completed at least some payments? But that's not accurate.
      // We'll keep the existing logic that only sets to graduated, and we'll NOT revert automatically. Instead, if a payment is deleted,
      // we should consider whether the student should lose graduation. Usually, once graduated, they shouldn't be able to delete payments.
      // So we will prevent deletion for graduated students in the delete controller.
    }
  } catch (err) {
    console.error("Error checking graduation:", err);
  }
};
