import {
  Alert,
  AlertTitle,
  Button,
  Divider,
  MenuItem,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { httpService } from "../../httpService";
import { toastError } from "../../components/ErrorToast";
import { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import { useTheme, useMediaQuery } from "@mui/material";

type ICentre = {
  name: string;
  centreId: string;
  password: string;
};
type IExamination = {
  _id: string;
  name: string;
};

type IRecord = {
  day: string;
  nscdc: number;
  proctors: number;
  officials: [
    {
      fullName: string;
      role: string;
      status: string;
      createdAt: Date;
    },
  ];
};
function CentreReport() {
  const [exams, setExams] = useState<IExamination[]>([]);
  const [searchData, setSearchData] = useState({});
  const [loading, setLoading] = useState(false);
  const [records, setRecords] = useState<IRecord[]>([]);
  const [centreDetail, setCentreDetail] = useState<ICentre | null>(null);
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await httpService("examination/viewall");
      if (data) {
        setExams(data);
        console.log(data);
      }
    } catch (error) {
      setCentreDetail(null);
      setRecords([]);
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getCentreReport = async () => {
    try {
      setLoading(true);
      const { data } = await httpService.post(
        "centre/centrereport",
        searchData,
      );

      setRecords(data.result);
      setCentreDetail(data.centre);
      console.log(data);
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  return (
    <div>
      <div className="container">
        <div className="mb-4">
          <Typography variant="h5" fontWeight={700}>
            Centre Reports
          </Typography>
        </div>
        <div className="row mb-4">
          <div className="col-lg-4 my-2">
            <TextField
              label="Examination"
              fullWidth
              select
              onChange={(e) =>
                setSearchData({ ...searchData, examination: e.target.value })
              }
            >
              {exams.map((exam) => (
                <MenuItem key={exam._id} value={exam._id}>
                  {exam.name}
                </MenuItem>
              ))}
            </TextField>
          </div>
          <div className="col-lg-2 my-2">
            <TextField
              fullWidth
              label="Centre ID"
              onChange={(e) =>
                setSearchData({ ...searchData, centreId: e.target.value })
              }
            />
          </div>
          <div className="col-lg-2 my-2">
            <Button
              loading={loading}
              onClick={getCentreReport}
              variant="contained"
              color="error"
            >
              Get Data
            </Button>
          </div>
        </div>
        {loading && (
          <div>
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="p-3 rounded mb-3 border">
                <Skeleton width="40%" height={30} />
                <Skeleton width="60%" height={20} />

                {[1, 2, 3].map((_, j) => (
                  <div key={j} className="d-flex justify-content-between my-2">
                    <Skeleton width="20%" />
                    <Skeleton width="20%" />
                    <Skeleton width="20%" />
                    <Skeleton width="30%" />
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {centreDetail && !loading && (
          <div className="mb-4">
            <Alert severity="info">
              <AlertTitle>Centre Detail</AlertTitle>
              <span className="mt-2 text-uppercase">{centreDetail.name}</span>
              <div className="my-2">
                <Typography variant="caption" gutterBottom>
                  Centre ID: {centreDetail.centreId}
                </Typography>
                <br />
                <Typography variant="caption" gutterBottom>
                  Password: {centreDetail.password}
                </Typography>
              </div>
            </Alert>
          </div>
        )}
        {records.map((record, i) => (
          <div key={record.day} className="p-3 rounded mb-3 border">
            <div className="mb-3">
              <Typography variant="overline">Day {i + 1}</Typography>
              <Typography>{record.day}</Typography>
              <Divider />
              <Stack
                className="text-primary"
                direction={"row"}
                spacing={2}
                sx={{ mt: 2 }}
              >
                <Typography gutterBottom variant="body2">
                  NSCDC: {record.nscdc}
                </Typography>
                <Typography gutterBottom variant="body2">
                  PROCTORS: {record.proctors}
                </Typography>
              </Stack>
            </div>

            {isMobile ? (
              record.officials.map((official, i) => (
                <div key={i} className="p-2 mb-2 border rounded">
                  <Typography variant="subtitle2" textTransform={"capitalize"}>
                    {official.fullName}
                  </Typography>
                  <Stack
                    direction={"row"}
                    spacing={2}
                    className="d-flex align-items-center"
                  >
                    <Typography
                      variant="caption"
                      gutterBottom
                      textTransform="uppercase"
                    >
                      {official.role}
                    </Typography>
                    <Typography>|</Typography>
                    <Typography
                      variant="caption"
                      color={
                        official.status === "present" ? "success" : "error"
                      }
                    >
                      {official.status}
                    </Typography>
                  </Stack>

                  <Typography variant="caption" color="GrayText">
                    {new Date(official.createdAt).toLocaleString()}
                  </Typography>
                </div>
              ))
            ) : (
              <Table striped borderless>
                <thead>
                  <tr className="fw-bold">
                    <td>S. No.</td>
                    <td>Name</td>
                    <td>Role</td>
                    <td>Status</td>
                    <td>Time Log</td>
                  </tr>
                </thead>
                <tbody>
                  {record.officials.map((official, i) => (
                    <tr key={official.fullName}>
                      <td>{i + 1}.</td>
                      <td>
                        <Typography
                          variant="body2"
                          textTransform={"capitalize"}
                        >
                          {official.fullName}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2" textTransform="uppercase">
                          {official.role}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2" textTransform="capitalize">
                          {official.status}
                        </Typography>
                      </td>
                      <td>
                        <Typography variant="body2" textTransform="capitalize">
                          {new Date(official.createdAt).toLocaleString()}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CentreReport;
