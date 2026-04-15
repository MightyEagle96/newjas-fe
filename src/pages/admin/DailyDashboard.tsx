import { useSearchParams } from "react-router-dom";
import { toastError } from "../../components/ErrorToast";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import {
  Divider,
  Typography,
  Skeleton,
  Button,
  IconButton,
  Stack,
} from "@mui/material";
import { Table } from "react-bootstrap";
import { Download } from "@mui/icons-material";

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

type OverviewReport = {
  selectedCentres: number;
  uploadedCentres: number;
  selectedOfficials: number;
  expectedProctors: number;
  expectedNscdc: number;
  totalNscdc: number;
  totalProctors: number;
  totalCentres: number;
  totalOfficials: number;
  presentOfficials: number;
  absentOfficials: number;
};
function DailyDashboard() {
  const [params] = useSearchParams();
  const [reports, setReports] = useState<IReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [otherReports, setOtherReports] = useState<NscdcAndProctors | null>(
    null,
  );
  const examination = params.get("examination");
  const date = params.get("date");
  const [initialLoad, setInitialLoad] = useState(true);
  const [overviewReport, setOverviewReport] = useState<OverviewReport | null>(
    null,
  );

  const fetchAllData = async () => {
    try {
      const [reportRes, otherRes, overviewRes] = await Promise.all([
        httpService("examination/dailydashboardreport", {
          params: { examination, day: date },
        }),
        httpService("examination/nscdcandproctorsdashboard", {
          params: { examination, day: date },
        }),

        httpService("examination/overviewreport", {
          params: { examination, day: date },
        }),
      ]);

      setReports(reportRes.data);
      setOtherReports(otherRes.data);
      setOverviewReport(overviewRes.data);
    } catch (error) {
      toastError(error);
    } finally {
      setInitialLoad(false);
    }
  };

  useEffect(() => {
    if (!examination || !date) return;

    const run = async () => {
      await fetchAllData();
    };

    run();

    const interval = setInterval(run, 60_000);

    return () => {
      clearInterval(interval);
    };
  }, [examination, date]);

  if (initialLoad) return <DashboardSkeleton />;

  const downloadReport = async (role: string) => {
    try {
      setLoading(true);
      const response = await httpService("result/download-officials-report", {
        params: {
          examination,
          day: date,
          role,
        },
        responseType: "blob", // 🔥 VERY IMPORTANT
      });

      // Create file from blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      // Create temp link
      const link = document.createElement("a");
      link.href = url;
      link.download = `report-${role}-${date}.xlsx`;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadNscdcGapReport = async () => {
    try {
      setLoading(true);

      const response = await httpService("result/download-nscdc-gap-report", {
        params: {
          examination,
          day: date,
        },
        responseType: "blob", // 🔥 critical
      });

      // Create blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      // Extract filename from backend (optional but clean)
      const contentDisposition = response.headers["content-disposition"];
      const fileName =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `nscdc-gap-${date}.xlsx`;

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExternalNscdcGapReport = async () => {
    try {
      setLoading(true);

      const response = await httpService(
        "result/download-external-nscdc-gap-report",
        {
          params: {
            examination,
            day: date,
          },
          responseType: "blob", // 🔥 critical
        },
      );

      // Create blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      // Extract filename from backend (optional but clean)
      const contentDisposition = response.headers["content-disposition"];
      const fileName =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `nscdc-gap-${date}.xlsx`;

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadProctorsGapReport = async () => {
    try {
      setLoading(true);

      const response = await httpService(
        "result/download-proctors-gap-report",
        {
          params: {
            examination,
            day: date,
          },
          responseType: "blob", // 🔥 critical
        },
      );

      // Create blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      // Extract filename from backend (optional but clean)
      const contentDisposition = response.headers["content-disposition"];
      const fileName =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `proctors-gap-${date}.xlsx`;

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadExternalProctorsGapReport = async () => {
    try {
      setLoading(true);

      const response = await httpService(
        "result/download-external-proctors-gap-report",
        {
          params: {
            examination,
            day: date,
          },
          responseType: "blob", // 🔥 critical
        },
      );

      // Create blob
      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      // Extract filename from backend (optional but clean)
      const contentDisposition = response.headers["content-disposition"];
      const fileName =
        contentDisposition?.split("filename=")[1]?.replace(/"/g, "") ||
        `proctors-gap-${date}.xlsx`;

      // Trigger download
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;

      document.body.appendChild(link);
      link.click();

      // Cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadAbsentReport = async () => {
    try {
      setLoading(true);
      const response = await httpService("result/download-absent-centre", {
        params: {
          examination,
          day: date,
        },
        responseType: "blob", // 🔥 critical
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Absent_Centres_Report${date}.xlsx`);

      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <div className="container">
        <div className="mb-4 text-center ">
          <Typography color="info">{date}</Typography>
        </div>

        <div className="p-3 border rounded mb-4 overflow-scroll">
          <Table striped borderless>
            <thead>
              <tr>
                <th>
                  <Typography fontWeight={700}>Role</Typography>
                </th>
                <th>
                  <Typography fontWeight={700} color="success">
                    Present
                  </Typography>
                </th>
                <th>
                  <Typography fontWeight={700} color="error">
                    Absent
                  </Typography>
                </th>
                <th>
                  <Typography fontWeight={700} color="primary">
                    Expected
                  </Typography>
                </th>
                <th>
                  <Typography fontWeight={700} sx={{ color: "GrayText" }}>
                    Download Report
                  </Typography>
                </th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr key={report.role}>
                  <td>
                    <Typography
                      variant="body2"
                      color="GrayText"
                      textTransform={"uppercase"}
                    >
                      {report.role}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body2" color="success">
                      {report.present.toLocaleString()}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body2" gutterBottom color="error">
                      {(report.expected - report.present).toLocaleString()}
                    </Typography>
                  </td>
                  <td>
                    <Typography variant="body2" color="primary">
                      {report.expected.toLocaleString()}
                    </Typography>
                  </td>
                  <td>
                    <IconButton
                      size="small"
                      loading={loading}
                      onClick={() => downloadReport(report.role)}
                    >
                      <Download />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {otherReports && (
          <div>
            <div className="row  ">
              <div className="col-lg-3 rounded-3 p-3 m-1">
                <div className="mb-2 text-primary">
                  <Typography variant="caption">Uploaded Centres</Typography>
                  <Stack spacing={2} direction={"row"} alignItems={"center"}>
                    <div>
                      <Typography variant="h5" fontWeight={700}>
                        {overviewReport?.uploadedCentres}/
                        {otherReports.totalCentres.toLocaleString()}
                      </Typography>
                    </div>
                    <div>
                      <IconButton
                        loading={loading}
                        onClick={downloadAbsentReport}
                      >
                        <Download />
                      </IconButton>
                    </div>
                  </Stack>
                </div>
                <div className="mb-2 text-success">
                  <Typography variant="caption">Present Officials</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {overviewReport?.presentOfficials.toLocaleString()}/
                    {overviewReport?.totalOfficials.toLocaleString()}
                  </Typography>
                </div>
                <div className="mb-2 text-danger">
                  <Typography variant="caption">Absent Officials</Typography>
                  <Typography variant="h5" fontWeight={700}>
                    {overviewReport?.absentOfficials.toLocaleString()}/
                    {overviewReport?.totalOfficials.toLocaleString()}
                  </Typography>
                </div>
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
                  <div className="text-end">
                    <Stack direction={"row"} spacing={2}>
                      <Button
                        color="primary"
                        onClick={downloadNscdcGapReport}
                        loading={loading}
                        loadingPosition="end"
                        endIcon={<Download />}
                      >
                        Internal Report
                      </Button>
                      <Button
                        color="error"
                        onClick={downloadExternalNscdcGapReport}
                        loading={loading}
                        loadingPosition="end"
                        endIcon={<Download />}
                      >
                        External Report
                      </Button>
                    </Stack>
                  </div>
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
                  <div className="text-end">
                    <Stack direction={"row"} spacing={2}>
                      <Button
                        color="primary"
                        onClick={downloadProctorsGapReport}
                        loading={loading}
                        loadingPosition="end"
                        endIcon={<Download />}
                      >
                        Internal Report
                      </Button>
                      <Button
                        color="error"
                        onClick={downloadExternalProctorsGapReport}
                        loading={loading}
                        loadingPosition="end"
                        endIcon={<Download />}
                      >
                        External Report
                      </Button>
                    </Stack>
                  </div>
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

const DashboardSkeleton = () => {
  return (
    <div className="container my-5">
      {/* Date */}
      <div className="mb-4 text-center">
        <Skeleton width={120} height={30} style={{ margin: "0 auto" }} />
      </div>

      {/* Top Cards */}
      <div className="row d-flex justify-content-center m-0">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="col-lg-2 p-3 bg-light rounded mb-2 me-2">
            <Skeleton width="60%" height={20} />
            <Skeleton width="100%" height={10} />

            <div className="mt-2">
              <Skeleton width="80%" height={20} />
              <Skeleton width="80%" height={20} />
              <Skeleton width="80%" height={20} />
            </div>
          </div>
        ))}
      </div>

      <hr />

      {/* Bottom Section */}
      <div className="row">
        {/* Total Centres */}
        <div className="col-lg-3 rounded-3 p-3 m-1">
          <Skeleton width="60%" height={20} />
          <Skeleton width="40%" height={40} />
        </div>

        {/* NSCDC */}
        <div className="col-lg-4 border rounded-3 p-3 m-1">
          <Skeleton width="50%" height={20} />
          <Skeleton width="60%" height={30} />

          <div className="mt-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={20} />
            ))}
          </div>
        </div>

        {/* PROCTORS */}
        <div className="col-lg-4 border rounded-3 p-3 m-1">
          <Skeleton width="50%" height={20} />
          <Skeleton width="60%" height={30} />

          <div className="mt-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} width="100%" height={20} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
