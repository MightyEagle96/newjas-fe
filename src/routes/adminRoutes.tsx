//import { Route, Routes } from "react-router-dom";
import AdminHomePage from "../pages/admin/AdminHomePage";
import NotFound from "../pages/NotFound";
import ExaminationPage from "../pages/admin/ExaminationPage";
import ViewExamination from "../pages/admin/ViewExamination";
import DailyDashboard from "../pages/admin/DailyDashboard";
import CentreReport from "../pages/admin/CentreReport";

const ADMIN_BASE = "/admin";

export const adminRoutes = [
  { path: ADMIN_BASE, component: AdminHomePage },
  { path: `${ADMIN_BASE}/examinations`, component: ExaminationPage },
  { path: `${ADMIN_BASE}/examination`, component: ViewExamination },
  { path: `${ADMIN_BASE}/dailydashboard`, component: DailyDashboard },
  { path: `${ADMIN_BASE}/centrereports`, component: CentreReport },
  { path: "*", component: NotFound },
];
