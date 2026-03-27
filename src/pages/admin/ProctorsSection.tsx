import { Skeleton, Typography } from "@mui/material";
import { toastError } from "../../components/ErrorToast";
import { useSearchParams } from "react-router-dom";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

type ISummmary = {
  totalActualProctors: number;
  totalCentres: number;
  totalExpectedProctors: number;
  totalGap: 704;
  totalStates: 37;
};

type IStaffReport = {
  state: string;
  actualProctors: number;
  expectedProctors: number;
  gap: number;
  totalCentres: number;
};
function ProctorsSection() {
  const [params] = useSearchParams();

  const examinationId = params.get("examination");

  const [loading, setLoading] = useState(false);

  const [summary, setSummary] = useState<ISummmary | null>(null);
  const [fullyStaffed, setFullyStaffed] = useState<IStaffReport[]>([]);

  const [underStaffed, setUnderStaffed] = useState<IStaffReport[]>([]);
  const [unStaffed, setUnstaffed] = useState<IStaffReport[]>([]);

  const stateDistribution = async () => {
    try {
      setLoading(true);

      const { data } = await httpService(
        "examination/proctorstatedistribution",
        {
          params: { examinationId },
        },
      );

      setSummary(data.summary);
      setFullyStaffed(data.fullyStaffed);
      setUnderStaffed(data.understaffed);
      setUnstaffed(data.unstaffed);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    stateDistribution();
  }, []);
  return (
    <div>
      {loading ? (
        <div className="py-3 bg-light mb-4">
          <div className="container">
            <Skeleton width={200} height={30} />

            <div className="row mt-3">
              {[1, 2, 3, 4].map((_, i) => (
                <div key={i} className="col-lg-3">
                  <Skeleton width="60%" />
                  <Skeleton height={40} />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        summary && (
          <div className="py-3 bg-light mb-4">
            <div className="container">
              <div className="mb-2">
                <Typography variant="h6" color="error">
                  Proctors Section
                </Typography>
              </div>
              <div className="row">
                <div className="col-lg-3">
                  <Typography variant="overline">Total Proctors</Typography>
                  <Typography variant="h4">
                    {summary.totalActualProctors.toLocaleString()}/
                    {summary.totalExpectedProctors.toLocaleString()}
                  </Typography>
                </div>
                <div className="col-lg-3">
                  <Typography variant="overline">Total Centres</Typography>
                  <Typography variant="h4">
                    {summary.totalCentres.toLocaleString()}
                  </Typography>
                </div>
                <div className="col-lg-3">
                  <Typography variant="overline">Total Gap</Typography>
                  <Typography variant="h4">
                    {summary.totalGap.toLocaleString()}
                  </Typography>
                </div>
                <div className="col-lg-3">
                  <Typography variant="overline">Total States</Typography>
                  <Typography variant="h4">
                    {summary.totalStates.toLocaleString()}
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        )
      )}

      <div className="container">
        <div className="row">
          <div className="col-lg-4 me-2 mb-2">
            <div className="p-3 bg-success text-light">
              <Typography>
                Fully staffed states: {fullyStaffed.length}
              </Typography>
            </div>
            <div
              style={{
                maxHeight: "40vh",
                overflowY: "scroll",
                overflowX: "scroll",
              }}
            >
              {loading ? (
                <TableSkeleton />
              ) : (
                <Table striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>State</th>
                      <th>Proctors</th>
                      <th>Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fullyStaffed.map((c, i) => (
                      <tr>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {i + 1}.
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.state}{" "}
                            <span className="text-success fw-bold">
                              ({c.totalCentres})
                            </span>
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.actualProctors}/{c.expectedProctors}
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.gap}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
          <div className="col-lg-4 me-2 mb-2">
            <div className="p-3 bg-warning text-light">
              <Typography>
                Understaffed States: {underStaffed.length}
              </Typography>
            </div>
            <div
              style={{
                maxHeight: "40vh",
                overflowY: "scroll",
                overflowX: "scroll",
              }}
            >
              {loading ? (
                <TableSkeleton />
              ) : (
                <Table striped>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>State</th>
                      <th>Proctors</th>
                      <th>Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {underStaffed.map((c, i) => (
                      <tr>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {i + 1}.
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.state}{" "}
                            <span className="text-warning fw-bold">
                              ({c.totalCentres})
                            </span>
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.actualProctors}/{c.expectedProctors}
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.gap}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
          <div className="col-lg-4 me-2 mb-2">
            <div className="p-3 bg-danger text-light">
              <Typography>Unstaffed States: {unStaffed.length}</Typography>
            </div>
            <div
              style={{
                maxHeight: "40vh",
                overflowY: "scroll",
                overflowX: "scroll",
              }}
            >
              {loading ? (
                <TableSkeleton />
              ) : (
                <Table striped borderless>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>State</th>
                      <th>Proctors</th>
                      <th>Gap</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unStaffed.map((c, i) => (
                      <tr>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {i + 1}.
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.state}{" "}
                            <span className="text-danger fw-bold">
                              ({c.totalCentres})
                            </span>
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.actualProctors}/{c.expectedProctors}
                          </Typography>
                        </td>
                        <td>
                          <Typography
                            variant="body2"
                            textTransform={"uppercase"}
                          >
                            {c.gap}
                          </Typography>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProctorsSection;

const TableSkeleton = () => (
  <Table striped>
    <tbody>
      {[1, 2, 3, 4, 5].map((_, i) => (
        <tr key={i}>
          <td>
            <Skeleton width={20} />
          </td>
          <td>
            <Skeleton width={120} />
          </td>
          <td>
            <Skeleton width={80} />
          </td>
          <td>
            <Skeleton width={40} />
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
);
