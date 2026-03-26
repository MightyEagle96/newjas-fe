import { Button, TextField, Typography } from "@mui/material";
import logo from "../assets/logo.png";
import { Login } from "@mui/icons-material";
import { useState } from "react";
import { toastError } from "../components/ErrorToast";
import { httpService } from "../httpService";

type IUser = {
  centreId: string;
  password: string;
};
function HomePage() {
  const [user, setUser] = useState<IUser | {}>({
    centreId: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const loginData = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data } = await httpService.post("/centre/login", user);

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
    <div className="py-5 container">
      <div className="d-flex justify-content-center">
        <div className="col-lg-5 text-center">
          <div className="mb-4">
            <img src={logo} height={100} />
          </div>
          <div className="mb-4">
            <Typography gutterBottom variant="h5" fontWeight={700}>
              ATTENDANCE MANAGEMENT SYSTEM
            </Typography>
            <Typography color="GrayText">Please login here</Typography>
          </div>
          <form onSubmit={loginData}>
            <div className="mb-3">
              <TextField
                fullWidth
                label="Centre ID"
                onChange={(e) => setUser({ ...user, centreId: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <TextField
                fullWidth
                label="Password"
                type="password"
                onChange={(e) => setUser({ ...user, password: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <Button
                variant="contained"
                color="success"
                fullWidth
                endIcon={<Login />}
                type="submit"
                loading={loading}
                loadingPosition="end"
              >
                Login
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
