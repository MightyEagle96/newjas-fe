import { Alert, AlertTitle, Button, Typography } from "@mui/material";
import { useAppUser } from "../../context/AppUserContext";
import { httpService } from "../../httpService";
import { toastError } from "../../components/ErrorToast";
import { useEffect, useState } from "react";
import { KeyboardArrowRight } from "@mui/icons-material";
import { Link } from "react-router-dom";

interface IExamination {
  name: string;
  selectedOfficials: string[];
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}
function CentreHomePage() {
  const { user } = useAppUser();

  const [examination, setExamination] = useState<IExamination | null>(null);
  const [count, setCount] = useState(0);
  const getActiveExamination = async () => {
    try {
      const { data } = await httpService("/examination/active");

      setExamination(data);
    } catch (error) {
      toastError(error);
    }
  };

  const getExaminationOfficialsCount = async () => {
    try {
      const { data } = await httpService("/centre/examofficialscount");
      if (data) {
        setCount(data.officials);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    getActiveExamination();

    getExaminationOfficialsCount();
  }, []);
  return (
    <div>
      <div className="container">
        <div className="mb-4 bg-light p-3">
          <div className="mb-2">
            <Typography variant="caption" gutterBottom color="GrayText">
              CENTRE NAME
            </Typography>
            <Typography textTransform={"uppercase"} fontWeight={500}>
              {user?.name}
            </Typography>
          </div>
          <div>
            <Typography
              color="primary"
              variant="overline"
              textTransform={"uppercase"}
            >
              {user?.state}
            </Typography>
          </div>
        </div>
        <div className="mb-4">
          {examination ? (
            <div>
              <div className="mb-3">
                <Alert className="mb-3">
                  <AlertTitle>Active Examination</AlertTitle>
                  <span className="text-uppercase">{examination.name}</span>
                </Alert>
                <Typography variant="body1" color="GrayText">
                  Designated officials: {count}
                </Typography>
              </div>
              <div>
                <Button
                  variant="contained"
                  color="error"
                  endIcon={<KeyboardArrowRight />}
                  component={Link}
                  to="/markattendance"
                >
                  Mark attendance
                </Button>
              </div>
            </div>
          ) : (
            <div>
              <Alert severity="error">
                <AlertTitle>No active examination</AlertTitle>
                Sorry, there is no active examination at this time
              </Alert>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CentreHomePage;
