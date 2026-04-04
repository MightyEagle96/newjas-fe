import { Alert, Typography } from "@mui/material";
import { toastError } from "../../components/ErrorToast";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { Skeleton } from "@mui/material";

type IRecord = {
  day: string;
  nscdc: number;
  proctors: number;
  officials: [
    {
      fullName: string;
      role: string;
      status: string;
    },
  ];
};
function AttendanceRecords() {
  const [records, setRecords] = useState<IRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await httpService("centre/attendancerecords");
      if (data) {
        setRecords(data);
      }
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);
  return (
    <div>
      <div className="container">
        <div className="mb-4">
          <Typography variant="h5" fontWeight={700}>
            Attendance Records
          </Typography>
        </div>
        <div>
          {records.length === 0 && !loading && (
            <Alert severity="info">No records found</Alert>
          )}
          {loading
            ? Array.from({ length: 3 }).map((_, i) => (
                <div className="border rounded p-3 mb-4" key={i}>
                  {/* Day */}
                  <Skeleton width={80} height={20} />

                  {/* NSCDC */}
                  <Skeleton width={150} height={25} className="mb-3" />

                  {/* Officials */}
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div className="bg-light p-2 mb-2" key={j}>
                      <Skeleton width={100} height={15} />
                      <Skeleton width={200} height={20} />
                      <Skeleton width={80} height={25} />
                    </div>
                  ))}
                </div>
              ))
            : records.map((c) => (
                <div className="border rounded p-3 mb-4" key={c.day}>
                  <div className="mb-3">
                    <Typography variant="overline" gutterBottom>
                      {c.day}
                    </Typography>
                    <Typography>PROCTORS: {c.proctors}</Typography>
                    <Typography>NSCDC OFFICIALS: {c.nscdc}</Typography>
                  </div>

                  <div>
                    {c.officials.map((o, i) => (
                      <div className="bg-light p-2 mb-2" key={i}>
                        <Typography
                          variant="caption"
                          gutterBottom
                          textTransform={"uppercase"}
                          color="GrayText"
                        >
                          {o.role}
                        </Typography>

                        <Typography
                          variant="body2"
                          textTransform={"uppercase"}
                          gutterBottom
                        >
                          {o.fullName}
                        </Typography>

                        <Alert
                          severity={
                            o.status === "present" ? "success" : "error"
                          }
                          sx={{ fontWeight: "300", fontSize: "0.8rem" }}
                        >
                          {o.status}
                        </Alert>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
}

export default AttendanceRecords;
