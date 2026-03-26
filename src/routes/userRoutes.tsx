import NotFound from "../pages/NotFound";
import AttendanceRecords from "../pages/user/AttendanceRecords";
import CentreHomePage from "../pages/user/CentreHomePage";
import MarkAttendancePage from "../pages/user/MarkAttendancePage";

export const userRoutes = [
  { path: "/", component: CentreHomePage },
  { path: "/markattendance", component: MarkAttendancePage },
  { path: "/records", component: AttendanceRecords },
  { path: "*", component: NotFound },
];
