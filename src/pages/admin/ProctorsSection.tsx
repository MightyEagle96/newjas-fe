import { Typography } from "@mui/material";
import { toastError } from "../../components/ErrorToast";
import { useSearchParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

type IStateSummary = {
  summary: {
    totalStates: number;
    statesWithProctors: number;
    statesWithoutProctors: number;
    totalProctors: number;
  };

  statesWithProctors: {
    state: string;
    count: number;
  }[];

  statesWithoutProctors: {
    state: string;
    count: number;
  }[];
};
function ProctorsSection() {
  const [params] = useSearchParams();

  const examinationId = params.get("examination");

  const [stateSummary, setStateSummary] = useState<IStateSummary | null>(null);
  const stateDistribution = async () => {
    try {
      const { data } = await httpService(
        "examination/proctorstatedistribution",
        {
          params: { examinationId },
        },
      );

      setStateSummary(data);
      console.log(data);
    } catch (error) {
      toastError(error);
    }
  };

  useEffect(() => {
    stateDistribution();
  }, []);
  return (
    <div>
      {stateSummary && (
        <div>
          <div className="py-3 bg-light mb-4">
            <div className="container">
              <div className="row">
                <div className="col-lg-3">
                  <Typography variant="h5" fontWeight={700}>
                    Proctors Section
                  </Typography>
                </div>
                <div className="col-lg-4">
                  <Typography variant="h6" fontWeight={300}>
                    Total Proctors:{" "}
                    {stateSummary.summary.totalProctors.toLocaleString()}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
          <div className="container">
            <div className="my-3">
              <div className="row d-flex align-items-center">
                <div className="col-lg-3">
                  <Typography variant="h5">State Distribution</Typography>
                </div>
                <div className="col-lg-3">
                  <Typography variant="overline">Total States</Typography>
                  <Typography variant="h4">
                    {stateSummary.summary.totalStates}
                  </Typography>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-5 p-0  shadow-sm me-2 mb-2 ">
                <div className="bg-dark text-light p-3">
                  <Typography variant="body1">
                    States with proctors:{" "}
                    {stateSummary.summary.statesWithProctors}
                  </Typography>
                </div>
                <div
                  className="p-3"
                  style={{ maxHeight: "40vh", overflowY: "scroll" }}
                >
                  <Table>
                    <tbody>
                      {stateSummary.statesWithProctors.map((state, i) => (
                        <tr key={state.state}>
                          <td>
                            <Typography variant="subtitle1">
                              {i + 1}.
                            </Typography>
                          </td>
                          <td>
                            <Typography
                              textTransform={"capitalize"}
                              variant="subtitle1"
                            >
                              {state.state}
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="subtitle1">
                              {state.count}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
              <div className="col-lg-5 p-0 shadow-sm me-2 mb-2 ">
                <div className="bg-light text-muted p-3">
                  <Typography variant="body1">
                    States without proctors:{" "}
                    {stateSummary.summary.statesWithoutProctors}
                  </Typography>
                </div>
                <div
                  className="p-3"
                  style={{ maxHeight: "40vh", overflowY: "scroll" }}
                >
                  <Table>
                    <tbody>
                      {stateSummary.statesWithoutProctors.map((state, i) => (
                        <tr key={state.state}>
                          <td>
                            <Typography variant="subtitle1">
                              {i + 1}.
                            </Typography>
                          </td>
                          <td>
                            <Typography
                              textTransform={"capitalize"}
                              variant="subtitle1"
                            >
                              {state.state}
                            </Typography>
                          </td>
                          <td>
                            <Typography variant="subtitle1">
                              {state.count}
                            </Typography>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProctorsSection;
