import express from "express";
import {
  getSchools,
  getSchoolById,
  createSchool,
  updateSchool,
  deleteSchool,
  getSchoolsByDepartment,
  getIntakesBySchool,
  getSpecialBySchool,
  getClassesForAttendance,
  getStudentInClassesForAttendance,
  getSchoolBySpecial,
  useStudentInClasses

} from "../controllers/school.js";
const router = express.Router();

router.get("/", getSchools);
router.get("/classes", getClassesForAttendance);
router.get("/student-by-class", getStudentInClassesForAttendance);
router.get("/schools-by-special/:id",getSchoolBySpecial);
router.get("/student-in-class",useStudentInClasses);
router.get("/:id", getSchoolById);
router.post("/", createSchool);
router.put("/:id", updateSchool);
router.delete("/:id", deleteSchool);
router.get("/by-department/:departmentId", getSchoolsByDepartment);
router.get("/intakes/:id", getIntakesBySchool);
router.get("/special/:id", getSpecialBySchool);


export { router as schoolRouter };
