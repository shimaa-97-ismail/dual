import "./App.css";
import {
  Login,
  Home,
  ProtectedRoute,
  Schools,
  TrainningPlacesList,
  Department,
  Specials,
  DepartmentSchool,
  SchoolDetails,
  TypeOfSchool,
  TrainningPlaceDetails,
  StudentDetails,
  Reports,
  StudentRe_registration,
  Clearance,
  WeeklyAbsent,
  ChooseClass,
  SchoolByData,
  ForgetPassword,
  ResetPassword,
  SearchDetails,
  ExpensesOfStudent,
  Class,
  Users,
  TotalExpenses
} from "../src/pages";
import { StudentAttendanceList } from "@/components/table/StudentAttendanceList";
import { SetAbsencesTable } from "@/components/table/SetAbsencesTable";
import { Routes, Route } from "react-router-dom";
import { StudentTable } from "../src/components";
import { Student } from "./pages/student/Student";
import { DashBoard } from "./pages/dashBoard/DashBoard";
import { SchoolCard } from "./components/card/SchoolCard";
import { StudentForm } from "@/components/forms/studentForm";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Protected routes – any authenticated user */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Home />}>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/home" element={<Home />} />
            <Route path="/schools" element={<Schools />} />
            <Route path="/type-of-school" element={<TypeOfSchool />} />
            <Route path="/type-of-school/schools" element={<SchoolByData />} />
            <Route path="/trainning-place" element={<TrainningPlacesList />} />
            <Route
              path="/trainning-place/:trainningId/details"
              element={<TrainningPlaceDetails />}
            />
            <Route
              path="/trainning-place/:trainningId/absent/:studentId"
              element={<SetAbsencesTable />}
            />
            <Route
              path="/student/absent/:studentId"
              element={<StudentAttendanceList />}
            />
            <Route path="/student/:studentId" element={<StudentDetails />} />
            <Route path="/department" element={<Department />} />
            <Route
              path="/department/:departmentId/school"
              element={<DepartmentSchool />}
            />
            <Route
              path="/department/:departmentId/school/:schoolId"
              element={<SchoolDetails />}
            />
            <Route path="/special" element={<Specials />} />
            <Route path="/special/schools" element={<SchoolByData />} />
            <Route path="/special/:specialId/school" element={<Specials />} />
            <Route path="/school/student/add" element={<Student />} />
            <Route
              path="/school/student/edit/:studentId"
              element={<Student />}
            />
            <Route
              path="/student/expenses/:studentId"
              element={<ExpensesOfStudent />}
            />
            <Route path="/total-expenses" element={<TotalExpenses/>}/>
            <Route path="/StudentRe_registration" element={<StudentRe_registration />} />
            <Route path="/clearance" element={<Clearance />} />
            <Route path="/weeklyAbsent" element={<WeeklyAbsent />} />
            <Route path="/choose-class" element={<ChooseClass />} />
            <Route path="/class" element={<SchoolDetails />} />
            <Route path="/student-class" element={<Class />} />
            <Route path="/search" element={<SearchDetails />} />
          </Route>
        </Route>

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<Home />}>
            <Route path="/users" element={<Users />} />
          </Route>
        </Route>

        {/* Admin & Manager routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'manager']} />}>
          <Route element={<Home />}>
            <Route path="/reports" element={<Reports />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;