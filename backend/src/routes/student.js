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
  deleteWeekAttendance,
  updateStudent
} from "../controllers/student.js";

const router = express.Router();

// ---------- Static / specific routes (no parameters) ----------
router.get("/search", searchStudents);                  // must come before /:id
router.get("/bulk-update", bulkUpdateStudents);        // GET? usually POST/PATCH, but keep as is
router.post("/bulk-update", bulkUpdateStudents);       // maybe intended as POST/PATCH

// ---------- Routes with fixed prefixes ----------
router.get("/by-school/:schoolId", getStudentBySChool);
router.get("/by-trainning-place/:id", getStudentByTrainningPlace);

 // two params

// ---------- Routes that start with /:studentId (but have extra segments) ----------
// These must come before the plain /:id route
router.get("/:studentId/enrollments", getAllPaymentByStudent);
router.post("/:studentId/enrollments", createEnrollment);

router.get("/:studentId/attendance", getStudentAttendance);
router.get("/:studentId/attendance/:weekStart", getWeekAttendance);
router.post("/:studentId/attendance", addStudentAbsent);           // original: POST /:id/attendance
router.put("/:studentId/attendance/:weekStart", updateWeekAttendance);
router.delete("/:studentId/attendance/:weekStart", deleteWeekAttendance);


router.get("/:schoolID/:speacialID", getStudentByschoolAndSpeacial);
router.post("/:studentId/repeat-stage", repeatStage);
router.post("/:studentId/promote", promoteStudent);

router.post("/:studentId/enrollments/:enrollmentId/payments", addPaymentToEnrollment);
router.put("/:studentId/enrollments/:enrollmentId/payments/:paymentId", updatePayment);
router.delete("/:studentId/enrollments/:enrollmentId/payments/:paymentId", deletePayment);
router.get("/:studentId/enrollments/:enrollmentId/payments/:paymentId", getPaymentById);

// ---------- Generic CRUD (parameter :id) ----------
router.get("/:id", getStudentById);     // must be LAST for GET with single param
router.post("/", createStudent);
router.get("/", getAllStudents);
router.delete("/:id", deleteStudent);
router.patch("/:id",updateStudent)

export { router as studentRouter };