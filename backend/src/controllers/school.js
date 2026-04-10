import { departmentModel } from "../models/department.js";
import { schoolModel } from "../models/school.js";
import { studentModel } from "../models/student.js";
import {schoolSpecialModel} from "../models/schoolSpecial.js"

export const getSchools = async (req, res) => {
  try {
    console.log("get all");

    const schools = await schoolModel
      .find()
      .populate("departement", "name")
      .populate("special", "name")
      .populate("type", "name")
      .populate("intakes", "name");
    console.log(schools);

    res.status(200).json(schools);
  } catch (error) {
    console.log(error.message);

    res.status(404).json({ message: error.message });
  }
};

export const createSchool = async (req, res) => {
  try {
    console.log(req.body);
    if (!req.body.email) {
  delete req.body.email;
}
    const newSchool = new schoolModel(req.body);
    await newSchool.save();

    await newSchool.populate([
      { path: "departement", select: "name" },
      { path: "special", select: "name" },
      { path: "type", select: "name" },
      { path: "intakes", select: "name" },
    ]);

    res.status(201).json(newSchool);
  } catch (error) {
      console.log(error.message);
    res.status(409).json({ message: error.message });
  }
};

export const updateSchool = async (req, res) => {
  // console.log("updatee",req.params, req.body);

  const { id } = req.params;
  // const { name, address, departement,type,phone,email,mangerName, special,intakes } = req.body;

  console.log(req.body);

  try {
    const existingSchool = await schoolModel.findById(id);
    if (!existingSchool) {
      return res.status(404).json({ message: "المدرسة غير موجودة" });
    }

    // const idsSpecial = special?.map(item => item._id);
    // console.log(idsSpecial);

    //  const idDepartement=departement?._id;
    //   const updateData = {
    //     name,
    //     address,
    //     type,
    //     phone,email,mangerName,
    //     departement:idDepartement,
    //     // Only update special if provided
    //     ...(idsSpecial !== undefined &&  { special: idsSpecial }),
    //   };

    // console.log(updateData);
    const updatedSchool = await schoolModel
      .findByIdAndUpdate(id, req.body, {
        new: true,
      })
      .populate("special", "name")
      
      .populate("intakes", "name");
    console.log(updatedSchool);
    res.status(200).json({
      success: true,
      message: "تم تحديث المدرسة بنجاح",
      data: updatedSchool,
    });
  } catch (error) {
    console.log(error.message);

    res.status(400).json({
      success: false,
      message: "فشل تحديث المدرسة",
      error: error.message,
    });
  }
};

export const deleteSchool = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    await schoolModel.findByIdAndDelete(id);
    res.status(200).json({ message: "School deleted successfully.", data: id });
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getSchoolsByDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const schools = await schoolModel
      .find({ departement: departmentId })
      .populate("departement", "name")
      .populate("special", "name")
      .populate("intakes", "name")
      .populate("type", "name");

    console.log(schools);

    const total = schools.length;
    console.log(total);
    res.status(200).json({ success: true, data: schools });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};
export const getSchoolById = async (req, res) => {
  const { id } = req.params;
  try {
    const school = await schoolModel
      .findById(id)
      .populate("departement", "name")
      .populate("special", "name")
      .populate("type", "type")
      .populate("intakes", "name");
    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "المدرسة غير موجودة" });
    }
    res.status(200).json({ success: true, data: school });
  } catch (error) {
    res.status(404).json({ success: false, message: error.message });
  }
};

export const getIntakesBySchool = async (req, res) => {
  const { id } = req.params;
  console.log(id);

  try {
    const school = await schoolModel.findById(id);

    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "المدرسة غير موجودة" });
    }
    const intakes = school.intakes || [];
    res.status(200).json({ success: true, data: intakes });
  } catch (err) {
    console.log(err);

    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "معرف المدرسة غير صالح" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getSpecialBySchool = async (req, res) => {
  const { id } = req.params;
  console.log("SPECIAL",id);

  try {
    const school = await schoolModel.findById(id).populate("special", "name");

    if (!school) {
      return res
        .status(404)
        .json({ success: false, message: "المدرسة غير موجودة" });
    }
    const specials = school.special || [];
    console.log(specials);

    res.status(200).json({ success: true, data: specials });
  } catch (err) {
    console.log(err);

    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "معرف المدرسة غير صالح" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getClassesForAttendance = async (req, res) => {
  try {
  console.log("hereeeeeeeee");
  
    const { school, intake, special, stage } = req.query;
console.log(req.query,"asd");

    // Validate the input
    if (!school || !intake || !special || !stage) {
      return res.status(400).json({ message: 'Missing required parameters' });
    }

    // Check if the school exists and has the intake and specialization
    const schoolDoc = await schoolModel.findById(school);
    if (!schoolDoc) {
      return res.status(404).json({ message: 'School not found' });
    }
console.log(schoolDoc.intakes);

    // Check if the intake exists in the school
    if (!schoolDoc.intakes.includes(intake)) {
      return res.status(400).json({ message: 'Intake not found in this school' });
    }

    // Check if the specialization exists in the school
    if (!schoolDoc.special.includes(special)) {
      return res.status(400).json({ message: 'Specialization not found in this school' });
    }

    // Get the distinct classes for the given criteria
    const classes = await studentModel.distinct('current_class', {
      school,
      intake,
      stdSpecial: special,
      'current_stage.stage_name': stage
    });
    console.log(classes);
    

    // Also, we might want to get the students in each class? Or just the class names?
    // For now, let's just return the class names.

    res.status(200).json({data: classes });
  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: error.message });
  }
};
// export const getStudentInClassesForAttendance = async (req, res) => {


//   try {
//     const { school, intake, special, stage, className } = req.query;
//     console.log('Query Parameters:', req.query);

//     // Validate the input
//     if (!school || !intake || !special || !stage) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Missing required parameters: school, intake, special, stage' 
//       });
//     }

//     // Check if the school exists
//     const schoolDoc = await schoolModel.findById(school);
//     if (!schoolDoc) {
//       return res.status(404).json({ 
//         success: false,
//         message: 'School not found' 
//       });
//     }

//     // Check if the intake exists in the school
//     if (!schoolDoc.intakes.includes(intake)) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Intake not found in this school' 
//       });
//     }

//     // Check if the specialization exists in the school
//     if (!schoolDoc.special.includes(special)) {
//       return res.status(400).json({ 
//         success: false,
//         message: 'Specialization not found in this school' 
//       });
//     }

//     // If className is provided, return the students in that class
//     if (className) {
//       const students = await studentModel.find({
//         school,
//         intake,
//         stdSpecial: special,
//         'current_stage.stage_name': stage,
//         current_class: className
//       }).select('stdName studID weekly_attendance stdTrainningPlace');

//       return res.status(200).json({
//         success: true,
//         data: {
//           school: schoolDoc.name,
//           intake,
//           specialization: special,
//           stage,
//           className,
//           students: students,
//           count: students.length
//         }
//       });
//     }

//     // If className is not provided, return the classes with student count
//     const students = await studentModel.find({
//       school,
//       intake,
//       stdSpecial: special,
//       'current_stage.stage_name': stage
//     }).select('current_class stdName');

//     // Group students by class
//     const classesMap = {};
//     students.forEach(student => {
//       const className = student.current_class;
//       if (!className) return;

//       if (!classesMap[className]) {
//         classesMap[className] = {
//           class_name: className,
//           student_count: 0,
//           students: [] // We can choose to include student names or not
//         };
//       }

//       classesMap[className].student_count += 1;
//       // If you want to include student names in the class list, uncomment the next line
//       // classesMap[className].students.push({ id: student._id, name: student.stdName });
//     });

//     const classesArray = Object.values(classesMap);

//     // Sort classes by name
//     classesArray.sort((a, b) => a.class_name.localeCompare(b.class_name));

//     res.status(200).json({
//       success: true,
//       data: {
//         classes: classesArray,
//         summary: {
//           total_classes: classesArray.length,
//           total_students: students.length,
//           school: schoolDoc.name,
//           intake,
//           specialization: special,
//           stage
//         }
//       }
//     });
//   } catch (error) {
//     console.error('Error in getClassesForAttendance:', error);
//     res.status(500).json({ 
//       success: false,
//       message: 'Server error',
//       error: error.message 
//     });
//   }
// };




export const getStudentInClassesForAttendance = async (req, res) => {
  try {
    const { school, intake, special, stage, className, year, month, startWeek } = req.query;
    console.log('Query Parameters:', req.query);

    // Validate the input
    if (!school || !intake || !special || !stage || !year || !month || !startWeek) {
      return res.status(400).json({ 
        success: false,
        message: 'Missing required parameters' 
      });
    }

    const yearNum = parseInt(year);
    const monthNum = parseInt(month);
    const weekStartDate = new Date(startWeek);
    
    // Check if the school exists
    const schoolDoc = await schoolModel.findById(school);
    if (!schoolDoc) {
      return res.status(404).json({ 
        success: false,
        message: 'School not found' 
      });
    }

    // بناء استعلام الطلاب
    const studentQuery = {
      school: school,
      intake: intake,
      stdSpecial: special,
      'current_stage.stage_name': stage
    };

    if (className) {
      studentQuery.current_class = className;
    }

    // جلب الطلاب
    const students = await studentModel.find(studentQuery)
      .select('stdName studID stdTrainningPlace current_class weekly_attendance stdSpecial')
      .populate('stdSpecial', 'name').populate('stdTrainningPlace', 'name');
    
    console.log(`Found ${students.length} students`);

    // تعريف دالة للمقارنة بدون وقت
    const datesAreEqual = (date1, date2) => {
      if (!date1 || !date2) return false;
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      return d1.getFullYear() === d2.getFullYear() && 
             d1.getMonth() === d2.getMonth() && 
             d1.getDate() === d2.getDate();
    };

    // معالجة بيانات الطلاب
    const formattedStudents = students.map(student => {
      const studentObj = student.toObject();
      let weeklyAttendance = null;
      
      // البحث في weekly_attendance للأسبوع المطلوب
      if (studentObj.weekly_attendance && studentObj.weekly_attendance.length > 0) {
        console.log(`\nStudent: ${studentObj.stdName}`);
        console.log(`Has ${studentObj.weekly_attendance.length} attendance records`);
        
        // نسخة بديلة: البحث باستخدام week_number إذا كان متاحاً
        // أو البحث باستخدام year و month و startWeek
        
        weeklyAttendance = studentObj.weekly_attendance.find(att => {
          if (!att) return false;
          
          // البحث بالسنة والشهر
          if (att.year !== yearNum || att.month !== monthNum) return false;
          
          // المقارنة بتاريخ بداية الأسبوع
          if (att.week_start_date) {
            return datesAreEqual(att.week_start_date, weekStartDate);
          }
          
          return false;
        });
        
        // إذا لم يتم العثور، ربما هناك خطأ في تنسيق التواريخ
        // جرب مقارنة بأسبوع من التاريخ
        if (!weeklyAttendance) {
          console.log('Trying alternative search method...');
          
          weeklyAttendance = studentObj.weekly_attendance.find(att => {
            if (!att || !att.days || att.days.length === 0) return false;
            
            // تحقق من السنة والشهر
            if (att.year !== yearNum || att.month !== monthNum) return false;
            
            // تحقق من أن أحد الأيام يقع في نطاق الأسبوع المطلوب
            return att.days.some(day => {
              if (!day || !day.date) return false;
              const dayDate = new Date(day.date);
              const startDate = new Date(weekStartDate);
              const endDate = new Date(startDate);
              endDate.setDate(endDate.getDate() + 6);
              
              return dayDate >= startDate && dayDate <= endDate;
            });
          });
        }
        
        console.log(`Found attendance: ${weeklyAttendance ? 'YES' : 'NO'}`);
      }

      // بناء بيانات الطالب
      const studentData = {
        _id: studentObj._id,
        stdName: studentObj.stdName,
        studID: studentObj.studID,
          stdSpecial: studentObj.stdSpecial,
        stdTrainningPlace: studentObj.stdTrainningPlace,
        current_class: studentObj.current_class,
        attendance_status: "لم يسجل بعد",
        attendance_info: null,

        days: []
      };

      if (weeklyAttendance) {
        studentData.attendance_info = {
          year: weeklyAttendance.year,
          month: weeklyAttendance.month,
          week_number: weeklyAttendance.week_number,
          week_start_date: weeklyAttendance.week_start_date,
          week_end_date: weeklyAttendance.week_end_date,
          recorded_at: weeklyAttendance.recorded_at
        };

        // إضافة أيام الأسبوع (يجب أن تكون 7 أيام)
        if (weeklyAttendance.days && Array.isArray(weeklyAttendance.days)) {
          console.log(`Found ${weeklyAttendance.days.length} days for student ${studentObj.stdName}`);
          
          // نسخ الأيام الأصلية مع جميع الحقول
          studentData.days = weeklyAttendance.days.map(day => {
            const dayData = {
              day_number: day.day_number,
              day_name_ar: day.day_name_ar,
              date: day.date,
              status: day.status || "غير محدد",
              notes: day.notes || "",
              _id: day._id
            };
            
            // إضافة حقول إضافية للعرض
            if (day.date) {
              const dateObj = new Date(day.date);
              dayData.display_date = dateObj.toLocaleDateString('ar-EG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              });
              dayData.short_date = dateObj.toLocaleDateString('ar-EG', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              });
            }
            
            // أعلام الحالة
            dayData.is_absent = day.status === "غائب";
            dayData.is_present = day.status === "حاضر";
            dayData.is_excused = day.status === "اجازه";
            dayData.is_school = day.status === "مدرسه";
            
            return dayData;
          });
          
          // تحديد حالة الحضور العامة
          const hasAbsent = studentData.days.some(day => day.is_absent);
          const hasExcused = studentData.days.some(day => day.is_excused || day.is_school);
          
          if (hasAbsent) {
            studentData.attendance_status = "غائب";
          } else if (hasExcused) {
            studentData.attendance_status = "حالات خاصة";
          } else {
            studentData.attendance_status = "حاضر";
          }
        }
      }

      return studentData;
    });

    // عرض الإحصائيات النهائية
    console.log(`\n=== FINAL STATISTICS ===`);
    console.log(`Total students processed: ${formattedStudents.length}`);
    console.log(`Students with attendance data: ${formattedStudents.filter(s => s.days.length > 0).length}`);
    formattedStudents.forEach((student, index) => {
      console.log(`${index + 1}. ${student.stdName}: ${student.days.length} days, Status: ${student.attendance_status}`);
    });

    // إذا كان className محدداً
    if (className) {
      // حساب الإحصائيات
      const stats = formattedStudents.reduce((acc, student) => {
        acc.total_students++;
        
        if (student.days.length > 0) {
          acc.with_attendance++;
          
          switch(student.attendance_status) {
            case "حاضر": acc.present_students++; break;
            case "غائب": acc.absent_students++; break;
            case "حالات خاصة": acc.special_cases++; break;
          }
          
          // حساب أيام الغياب
          student.days.forEach(day => {
            if (day.is_absent) acc.total_absent_days++;
            if (day.is_present) acc.total_present_days++;
            if (day.is_excused) acc.total_excused_days++;
            if (day.is_school) acc.total_school_days++;
          });
        } else {
          acc.without_attendance++;
        }
        
        return acc;
      }, {
        total_students: 0,
        with_attendance: 0,
        without_attendance: 0,
        present_students: 0,
        absent_students: 0,
        special_cases: 0,
        total_absent_days: 0,
        total_present_days: 0,
        total_excused_days: 0,
        total_school_days: 0
      });

      return res.status(200).json({
        success: true,
        data: {
          school: schoolDoc.name,
          intake,
          specialization: formattedStudents[0]?.stdSpecial?.name || "غير محدد",
          stage,
          className,
          year: yearNum,
          month: monthNum,
          week_start_date: weekStartDate,
          students: formattedStudents,
          count: formattedStudents.length,
          attendance_summary: {
            ...stats,
            attendance_percentage: stats.total_students > 0 
              ? `${Math.round((stats.present_students / stats.total_students) * 100)}%` 
              : "0%",
            days_summary: {
              absent_days: stats.total_absent_days,
              present_days: stats.total_present_days,
              excused_days: stats.total_excused_days,
              school_days: stats.total_school_days
            }
          }
        }
      });
    }

    // تجميع حسب الصف
    const classesMap = {};
    
    formattedStudents.forEach(student => {
      const className = student.current_class || "غير محدد";
      if (!classesMap[className]) {
        classesMap[className] = {
          class_name: className,
          student_count: 0,
          present_students: 0,
          absent_students: 0,
          special_cases: 0,
          without_attendance: 0
        };
      }

      classesMap[className].student_count++;

      switch(student.attendance_status) {
        case "حاضر":
          classesMap[className].present_students++;
          break;
        case "غائب":
          classesMap[className].absent_students++;
          break;
        case "حالات خاصة":
          classesMap[className].special_cases++;
          break;
        case "لم يسجل بعد":
          classesMap[className].without_attendance++;
          break;
      }
    });

    const classesArray = Object.values(classesMap);
    classesArray.sort((a, b) => a.class_name.localeCompare(b.class_name));

    return res.status(200).json({
      success: true,
      data: {
        classes: classesArray,
        summary: {
          total_classes: classesArray.length,
          total_students: formattedStudents.length,
          school: schoolDoc.name,
          intake,
          specialization: special,
          stage,
          year: yearNum,
          month: monthNum,
          week_start_date: weekStartDate
        }
      }
    });

  } catch (error) {
    console.error('Error in getStudentInClassesForAttendance:', error);
    res.status(500).json({ 
      success: false,
      message: 'Server error',
      error: error.message 
    });
  }
};

export const useStudentInClasses = async (req, res) => {
  try {
    const { school, intake, special, stage, className } = req.query;
    console.log('Query Parameters:', req.query);
    // Validate the input
    if (!school || !intake || !special || !stage || !className) {
      return res.status(400).json({
        success: false,
        message: 'Missing required parameters: school, intake, special, stage, className'
      });
    }

    // Check if the school exists
    const schoolDoc = await schoolModel.findById(school);
    if (!schoolDoc) {
      return res.status(404).json({
        success: false,
        message: 'المدرسة غير موجودة'
      });
    }

    // Fetch students based on the criteria
    const students = await studentModel.find({
      school,
      intake,
      stdSpecial: special,
      'current_stage.stage_name': stage,
      current_class: className
    })
    .populate("stdTrainningPlace","name").populate("stdSpecial","name").populate("school","name");

    res.status(200).json({
      success: true,
      data: { 
        school: schoolDoc.name,
        intake,
        specialization: special,
        stage,
        className,
        students,
        count: students.length
      }
    });
  } catch (error) {
    console.error('Error in useStudentInClasses:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
};

export const getSchoolBySpecial=async(req,res)=>{
   const { id } = req.params;
  console.log(id);

  try {
    const special = await schoolSpecialModel.findById(id)
    if (!special) {
      return res
        .status(404)
        .json({ success: false, message: "التخصص غير موجودة" });
    }
   
 const schools = await schoolModel.find({
      special: { $in: [id] }
    }).populate('special');

    res.status(200).json({ success: true, data: schools });
  } catch (err) {
    console.log(err);

    if (err.name === "CastError") {
      return res
        .status(400)
        .json({ success: false, message: "معرف المدرسة غير صالح" });
    }
    res.status(500).json({ success: false, message: err.message });
  }
}

