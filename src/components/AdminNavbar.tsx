import { useState } from "react";

import AdminRichNavbar from "./AdminRichNavbar";
import { useAppUser } from "../context/AppUserContext";
import { httpService } from "../httpService";
import { toastError } from "./ErrorToast";

function AdminNavbarComponent() {
  const [loading, setLoading] = useState(false);

  const { user } = useAppUser();

  const handleLogout = async () => {
    try {
      setLoading(true);
      const { data } = await httpService.get("/account/logout");

      if (data) {
        window.location.assign("/");
      }
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminRichNavbar
      appUser={user}
      handlelogout={handleLogout}
      setLoading={setLoading}
      loading={loading}
    />
  );
}

export default AdminNavbarComponent;
