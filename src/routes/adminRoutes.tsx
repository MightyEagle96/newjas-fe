//import { Route, Routes } from "react-router-dom";
import AdminHomePage from "../pages/admin/AdminHomePage";
import NotFound from "../pages/NotFound";
import ExaminationPage from "../pages/admin/ExaminationPage";
import ViewExamination from "../pages/admin/ViewExamination";
import DailyDashboard from "../pages/admin/DailyDashboard";

const ADMIN_BASE = "/admin";

// export const adminRoutes = [
//   { path: "/admin", component: AdminHomePage },
//   { path: "/admin/examinations", component: ExaminationPage },
//   { path: "/examination", component: ViewExamination },
//   { path: "/dailydashboard", component: DailyDashboard },
//   { path: "*", component: NotFound },
// ];

export const adminRoutes = [
  { path: ADMIN_BASE, component: AdminHomePage },
  { path: `${ADMIN_BASE}/examinations`, component: ExaminationPage },
  { path: `${ADMIN_BASE}/examination`, component: ViewExamination },
  { path: `${ADMIN_BASE}/dailydashboard`, component: DailyDashboard },
  { path: "*", component: NotFound },
];
// export function AdminRoutes() {
//   return (
//     <div className="py-5">
//       <Routes>
//         {adminRoutes.map((route) => (
//           <Route
//             key={route.path}
//             path={route.path}
//             element={<route.component />}
//           />
//         ))}
//       </Routes>
//     </div>
//   );
// }
