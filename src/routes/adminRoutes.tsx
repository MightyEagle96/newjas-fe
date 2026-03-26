import { Route, Routes } from "react-router-dom";
import AdminHomePage from "../pages/admin/AdminHomePage";
import NotFound from "../pages/NotFound";
import ExaminationPage from "../pages/admin/ExaminationPage";
import ViewExamination from "../pages/admin/ViewExamination";
import DailyDashboard from "../pages/admin/DailyDashboard";

export const adminRoutes = [
  { path: "/", component: AdminHomePage },
  { path: "/examinations", component: ExaminationPage },
  { path: "/examination", component: ViewExamination },
  { path: "/dailydashboard", component: DailyDashboard },
  { path: "*", component: NotFound },
];

export function AdminRoutes() {
  return (
    <div className="py-5">
      <Routes>
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<route.component />}
          />
        ))}
      </Routes>
    </div>
  );
}
