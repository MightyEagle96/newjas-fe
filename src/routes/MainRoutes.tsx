import { useAuth } from "./useAuth";
import LoadingPage from "../components/LoadingPage";
import NotFound from "../pages/NotFound";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import { adminRoutes } from "./adminRoutes";

import HomePage from "../pages/HomePage";

import { userRoutes } from "./userRoutes";
import { accountRoles } from "../utils";

import NavbarComponent from "../components/Navbar";
import AdminHomePage from "../pages/AdminHomePage";
import AdminNavbarComponent from "../components/AdminNavbar";

function MainRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingPage />;

  const publicRoutes = [
    { path: "/", component: HomePage },
    //{ path: "/admin/*", component: AdminRoutes },
    { path: "/admin", component: AdminHomePage },
    { path: "*", component: NotFound },
  ];

  const routesToDisplay = (role: string) => {
    if (role === accountRoles.admin) {
      return adminRoutes;
    } else if (role === accountRoles.user) {
      return userRoutes;
    }
    return publicRoutes;
  };

  //console.log(user);
  const privateRoutes = routesToDisplay(user?.role as string);

  return (
    <BrowserRouter>
      {user ? (
        <>
          <div className="mb-5">
            {user.role === accountRoles.user && <NavbarComponent />}

            {user.role === accountRoles.admin && <AdminNavbarComponent />}
          </div>
          <Routes>
            {privateRoutes.map((c, i) => (
              <Route key={i} path={c.path} element={<c.component />} />
            ))}
          </Routes>
        </>
      ) : (
        <>
          <Routes>
            {publicRoutes.map((c, i) => (
              <Route key={i} path={c.path} element={<c.component />} />
            ))}
          </Routes>
        </>
      )}
    </BrowserRouter>
  );
}

export default MainRoutes;
