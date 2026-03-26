import { Alert, AlertTitle, Button, Typography, Skeleton } from "@mui/material";
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
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const getActiveExamination = async () => {
    try {
      setLoading(true);
      const { data } = await httpService("/examination/active");
      setExamination(data);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const getExaminationOfficialsCount = async () => {
    try {
      const { data } = await httpService("/centre/examofficialscount");
      if (data) {
        setCount(data.officials);
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
        {/* 🔥 Centre Info */}
        <div className="mb-4 bg-light p-3">
          {loading ? (
            <>
              <Skeleton width={120} height={15} />
              <Skeleton width={200} height={25} />
              <Skeleton width={100} height={20} />
            </>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* 🔥 Examination Section */}
        <div className="mb-4">
          {loading ? (
            <div>
              {/* Alert Skeleton */}
              <Skeleton width="100%" height={60} className="mb-3" />

              {/* Count */}
              <Skeleton width={200} height={20} className="mb-3" />

              {/* Button */}
              <Skeleton variant="rounded" width={180} height={40} />
            </div>
          ) : examination ? (
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
