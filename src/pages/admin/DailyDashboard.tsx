import { useSearchParams } from "react-router-dom";
import { toastError } from "../../components/ErrorToast";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { Divider, Typography } from "@mui/material";
import { Table } from "react-bootstrap";

type IReport = {
  role: string;
  present: number;
  absent: number;
  expected: number;
};

type Report = { numberOfOfficials: number; count: number };

type NscdcAndProctors = {
  expectedProctors: number;
  expectedNscdc: number;
  nscdcReports: Report[];
  proctorsReports: Report[];
  totalNscdc: number;
  totalProctors: number;
  totalCentres: number;
};
function DailyDashboard() {
  const [params] = useSearchParams();
  const [reports, setReports] = useState<IReport[]>([]);

  const [otherReports, setOtherReports] = useState<NscdcAndProctors | null>(
    null,
  );
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

  const getNscdcAndProctors = async () => {
    try {
      const { data } = await httpService(
        "examination/nscdcandproctorsdashboard",
        {
          params: { examination, day: date },
        },
      );

      if (data) {
        setOtherReports(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };
  useEffect(() => {
    getData();
    getNscdcAndProctors();

    const interval = setInterval(() => {
      getData();
      getNscdcAndProctors();
    }, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div>
      <div className="container my-5">
        <div className="mb-4 text-center ">
          <Typography color="info">{date}</Typography>
        </div>
        <div className="row d-flex justify-content-center m-0">
          {reports.map((report) => (
            <div className="col-lg-2 p-3 bg-light rounded mb-2 me-2">
              <div className="mb-2">
                <Typography textTransform={"uppercase"} fontWeight={500}>
                  {report.role}
                </Typography>
                <Divider />
              </div>
              <div className="text-muted">
                <Typography variant="body2">
                  Present: {report.present.toLocaleString()}
                </Typography>
                {/* <Typography variant="body2">
                  Absent: {report.absent.toLocaleString()}
                </Typography> */}
                <Typography variant="body2">
                  Absent: {(report.expected - report.present).toLocaleString()}
                </Typography>
                <Typography variant="body2">
                  Expected: {report.expected.toLocaleString()}
                </Typography>
              </div>
            </div>
          ))}
        </div>
        <hr />
        {otherReports && (
          <div>
            <div className="row  ">
              <div className="col-lg-3 rounded-3 p-3 m-1 text-success">
                <Typography>Total Centres</Typography>
                <Typography variant="h3">
                  {otherReports.totalCentres.toLocaleString()}
                </Typography>
              </div>
              <div className="col-lg-4 border rounded-3 p-3 m-1">
                <div className="mb-2">
                  <Typography variant="caption" gutterBottom>
                    Total NSCDC
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {otherReports.totalNscdc.toLocaleString()}/
                    {otherReports.expectedNscdc.toLocaleString()}
                  </Typography>
                  <Divider />
                </div>
                <div>
                  <Table striped borderless>
                    <thead style={{ fontSize: 14 }}>
                      <tr>
                        <th>NSCDC</th>
                        <th>Centres</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherReports.nscdcReports.map((report, i) => (
                        <tr style={{ fontSize: 14 }} key={i}>
                          <td>{report.numberOfOfficials}</td>
                          <td>{report.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="col-lg-4 border rounded-3 p-3 m-1">
                <div className="mb-2">
                  <Typography variant="caption" gutterBottom>
                    Total PROCTORS
                  </Typography>
                  <Typography variant="h6" gutterBottom>
                    {otherReports.totalProctors.toLocaleString()}/
                    {otherReports.expectedProctors.toLocaleString()}
                  </Typography>
                  <Divider />
                </div>
                <div>
                  <Table striped borderless>
                    <thead>
                      <tr style={{ fontSize: 14 }}>
                        <th>PROCTORS</th>
                        <th>Centres</th>
                      </tr>
                    </thead>
                    <tbody>
                      {otherReports.proctorsReports.map((report, i) => (
                        <tr style={{ fontSize: 14 }} key={i}>
                          <td>{report.numberOfOfficials}</td>
                          <td>{report.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DailyDashboard;
