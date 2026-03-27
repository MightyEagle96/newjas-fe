import { useSearchParams } from "react-router-dom";
import { toastError } from "../../components/ErrorToast";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { Divider, Typography } from "@mui/material";

type IReport = {
  role: string;
  present: number;
  absent: number;
  expected: number;
};
function DailyDashboard() {
  const [params] = useSearchParams();
  const [reports, setReports] = useState<IReport[]>([]);

  const examination = params.get("examination");
  const date = params.get("date");
  const getData = async () => {
    try {
      const { data } = await httpService("examination/dailydashboardreport", {
        params: { examination, day: date },
      });

      setReports(data);
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    getData();

    const interval = setInterval(() => {
      getData();
    }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <div className="container">
        <div className="row">
          {reports.map((report) => (
            <div className="col-lg-4 p-3 bg-light rounded mb-2 me-2">
              <div className="mb-4">
                <Typography
                  variant="h6"
                  textTransform={"uppercase"}
                  fontWeight={500}
                >
                  {report.role}
                </Typography>
                <Divider />
              </div>
              <div>
                <Typography variant="body1" className="mb-2" fontWeight={300}>
                  Present: {report.present.toLocaleString()}
                </Typography>
                <Typography variant="body1" className="mb-2" fontWeight={300}>
                  Absent: {report.absent.toLocaleString()}
                </Typography>
                <Typography variant="body1" className="mb-2" fontWeight={300}>
                  Expected: {report.expected.toLocaleString()}
                </Typography>
              </div>
              {/* <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-uppercase">{report.role}</h5>
                  <Divider />
                  <p className="card-text">
                    Present: {report.present.toLocaleString()}
                  </p>
                  <p className="card-text">
                    Absent: {report.absent.toLocaleString()}
                  </p>
                  <p className="card-text">
                    Expected: {report.expected.toLocaleString()}
                  </p>
                </div>
              </div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailyDashboard;
