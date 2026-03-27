import express from "express";
import {
  createStudent,
  getAllStudents,
  getStudentById,
  addStudentAbsent,
  deleteStudent,
  getStudentByschoolAndSpeacial,
  getStudentBySChool,
  getStudentByTrainningPlace,
  searchStudents,
  bulkUpdateStudents,
  // payPaymentForStudent,
  getAllPaymentByStudent,
  updatePayment,
  getPaymentById,
  deletePayment,
  repeatStage,
  addPaymentToEnrollment,
  createEnrollment,
  promoteStudent,
  getStudentAttendance,
  getWeekAttendance,
  updateWeekAttendance,
  deleteWeekAttendance

} from "../controllers/student.js";

const router = express.Router();
router.post("/", createStudent);
router.get("/", getAllStudents);
router.get("/search", searchStudents);
router.get("/:id", getStudentById);


router.post("/:id/attendance", addStudentAbsent);
router.put('/:studentId/attendance/:weekStart', updateWeekAttendance);


router.delete("/:id", deleteStudent);
router.get("/by-school/:schoolId", getStudentBySChool);
router.get("/:studentId/enrollments", getAllPaymentByStudent);
router.get('/:studentId/attendance', getStudentAttendance);
router.get('/:studentId/attendance/:weekStart', getWeekAttendance);
router.get("/by-trainning-place/:trainningId", getStudentByTrainningPlace);
router.get("/:schoolID/:speacialID", getStudentByschoolAndSpeacial);
router.get("/:studentId/enrollments/:enrollmentId/payments/:paymentId", getPaymentById);
router.post('/:studentId/enrollments', createEnrollment);
router.delete('/:studentId/attendance/:weekStart', deleteWeekAttendance);
// router.get("/:studentId/payments/:paymentId",getPaymentById)
router.patch("/bulk-update", bulkUpdateStudents);
// router.post("/:studentId/payments",payPaymentForStudent);
// router.put("/:studentId/payments/:paymentId",updatePayment);
// router.delete("/:studentId/payments/:paymentId",deletePayment);
router.post('/:studentId/repeat-stage', repeatStage);
// جلب كل التسجيلات
router.post('/:studentId/promote', promoteStudent);
router.post("/:studentId/enrollments/:enrollmentId/payments", addPaymentToEnrollment);
router.put("/:studentId/enrollments/:enrollmentId/payments/:paymentId", updatePayment);
router.delete("/:studentId/enrollments/:enrollmentId/payments/:paymentId", deletePayment);
export { router as studentRouter };
