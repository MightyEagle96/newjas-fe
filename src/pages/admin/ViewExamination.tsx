import { Link, useSearchParams } from "react-router-dom";
import { toastError } from "../../components/ErrorToast";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { Button, Divider, Typography } from "@mui/material";
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
  const getExamination = async () => {
    try {
      const { data } = await httpService("examination/viewone", {
        params: { id },
      });

      if (data) {
        setExamination(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };

  const getDashboardSummary = async () => {
    try {
      const { data } = await httpService("examination/dashboardsummary", {
        params: { id },
      });
      if (data) {
        setSummary(data);
        console.log(data);
      }
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    getExamination();

    getDashboardSummary();
  }, []);
  return (
    <div>
      <div className="container">
        <div className="col-lg-6 mb-4 bg-danger rounded p-3">
          <Typography
            textTransform={"uppercase"}
            variant="h4"
            color={"white"}
            fontWeight={700}
          >
            {examination?.name}
          </Typography>
        </div>

        {summary && (
          <div>
            <div className="row mb-4">
              <div className="col-lg-3">
                <Typography variant="overline">Selected Centres</Typography>
                <Typography variant="h4">
                  {summary.selectedCentres.toLocaleString()}
                </Typography>
              </div>
              <div className="col-lg-3">
                <Typography variant="overline">Selected Officials</Typography>
                <Typography variant="h4">
                  {summary.selectedOfficials.toLocaleString()}
                </Typography>
              </div>
              <div className="col-lg-3">
                <Typography variant="overline">Total Centre Reports</Typography>
                <Typography variant="h4">
                  {summary.totalCentreReports.toLocaleString()}
                </Typography>
              </div>
              <div className="col-lg-3">
                <Typography variant="overline">
                  Total Official Reports
                </Typography>
                <Typography variant="h4">
                  {summary.totalOfficialReports.toLocaleString()}
                </Typography>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-5 bg-light rounded p-3 ">
                <Typography variant="overline" gutterBottom>
                  Officers Breakdown
                </Typography>
                {summary.officersBreakdown.map((item) => (
                  <div className="mb-4">
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
              <div className="col-lg-4">
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ViewExamination;
