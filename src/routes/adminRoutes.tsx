import AdminHomePage from "../pages/admin/AdminHomePage";
import NotFound from "../pages/NotFound";

export const adminRoutes = [
  { path: "/", component: AdminHomePage },
  { path: "*", component: NotFound },
];
