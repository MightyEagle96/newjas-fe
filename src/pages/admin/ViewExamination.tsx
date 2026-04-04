import { Link, useSearchParams } from "react-router-dom";
import { toastError } from "../../components/ErrorToast";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { Button, Divider, Skeleton, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";

type ISummary = {
  selectedCentres: number;
  selectedOfficials: number;
  totalCentreReports: number;
  totalOfficialReports: number;
  officersBreakdown: {
    role: string;
    count: number;
  }[];
};

type IExam = {
  name: string;
  selectedOfficials: string[];
  active: boolean;
  activationHour: number;
};
function ViewExamination() {
  const [params] = useSearchParams();
  const [examDate, setExamDate] = useState("");

  const id = params.get("id");

  const [examination, setExamination] = useState<IExam | null>(null);

  const [summary, setSummary] = useState<ISummary | null>(null);

  const [loadingExam, setLoadingExam] = useState(true);
  const [loadingSummary, setLoadingSummary] = useState(true);

  const getExamination = async () => {
    try {
      setLoadingExam(true);
      const { data } = await httpService("examination/viewone", {
        params: { id },
      });

      if (data) setExamination(data);
    } catch (error) {
      toastError(error);
    } finally {
      setLoadingExam(false);
    }
  };

  const getDashboardSummary = async () => {
    try {
      setLoadingSummary(true);
      const { data } = await httpService("examination/dashboardsummary", {
        params: { id },
      });

      if (data) setSummary(data);
    } catch (error) {
      toastError(error);
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    getExamination();

    getDashboardSummary();
  }, []);
  return (
    <div>
      <div className="container">
        <div className="col-lg-6 mb-4 text-light bg-danger rounded p-3">
          <Typography variant="overline">Examination</Typography>
          {loadingExam ? (
            <Skeleton variant="text" width={250} height={40} />
          ) : (
            <Typography
              textTransform={"uppercase"}
              variant="h4"
              color={"white"}
              fontWeight={700}
            >
              {examination?.name}
            </Typography>
          )}
        </div>

        {summary && (
          <div>
            <div>
              <div className="row mb-4">
                {[
                  "Selected Centres",
                  "Selected Officials",
                  "Total Centre Reports",
                  "Total Official Reports",
                ].map((label, index) => (
                  <div className="col-lg-3 my-2" key={index}>
                    <Typography variant="overline">{label}</Typography>

                    {loadingSummary ? (
                      <Skeleton variant="text" width={80} height={30} />
                    ) : (
                      <Typography variant="h5">
                        {[
                          summary?.selectedCentres,
                          summary?.selectedOfficials,
                          summary?.totalCentreReports,
                          summary?.totalOfficialReports,
                        ][index]?.toLocaleString()}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="row">
              <div className="col-lg-5 bg-light rounded p-3 my-2">
                <Typography variant="overline" gutterBottom>
                  Officers Breakdown
                </Typography>

                {loadingSummary
                  ? Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} className="mb-4">
                        <Skeleton variant="text" width="60%" />
                        <Skeleton variant="text" width="30%" />
                        <Divider />
                      </div>
                    ))
                  : summary?.officersBreakdown.map((item, i) => (
                      <div className="mb-4" key={i}>
                        <div className="row">
                          <div className="col-lg-6">
                            <Typography textTransform={"uppercase"}>
                              {item.role}
                            </Typography>
                          </div>
                          <div className="col-lg-6">
                            <Typography fontWeight={700}>
                              {item.count.toLocaleString()}
                            </Typography>
                          </div>
                        </div>
                        <Divider />
                      </div>
                    ))}
              </div>
              <div className="col-lg-4 my-2">
                <div className="mb-2">
                  <DatePicker
                    sx={{ width: "100%" }}
                    label="Examination Date"
                    disableFuture
                    onChange={(value) =>
                      setExamDate(value ? value.toDate().toDateString() : "")
                    }
                  />

                  <Button
                    disabled={!examDate}
                    component={Link}
                    to={`/admin/dailydashboard?date=${examDate}&examination=${id}`}
                  >
                    Get data
                  </Button>
                </div>

                <div className="my-3">
                  <Button
                    component={Link}
                    to={`/admin/proctors?examination=${id}`}
                  >
                    PROCTORS SECTION
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewExamination;
