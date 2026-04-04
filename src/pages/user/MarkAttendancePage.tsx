import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
  Skeleton,
} from "@mui/material";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { toastError } from "../../components/ErrorToast";
import { Clear, Done } from "@mui/icons-material";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export interface IOfficial {
  _id: string;
  role: string;
  department: string;
  centre: string;
  idCard: string;
  phoneNumber: string;
  fullName: string;
  email: string;
  examination: string;
  createdAt: Date;
  updatedAt: Date;
  conraiss: string;
}

type AttendanceStatus = "present" | "absent";

function MarkAttendancePage() {
  const [officials, setOfficials] = useState<IOfficial[]>([]);
  const [loading, setLoading] = useState(true);
  const [nscdc, setNscdc] = useState(0);
  const [proctors, setProctors] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});

  const nscdcOfficials = [0, 1, 2];

  const proctorsOfficials = [0, 1, 2, 3];

  const navigate = useNavigate();
  const getExamOfficials = async () => {
    try {
      setLoading(true);
      const { data } = await httpService("/centre/examofficials");
      if (data) {
        setOfficials(data);
      }
    } catch (error) {
      toastError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getExamOfficials();
  }, []);

  const handleAttendance = (id: string, status: AttendanceStatus) => {
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  // Optional summary
  const presentCount = Object.values(attendance).filter(
    (s) => s === "present",
  ).length;

  const absentCount = Object.values(attendance).filter(
    (s) => s === "absent",
  ).length;

  const allMarked =
    officials.length > 0 && Object.keys(attendance).length === officials.length;
  const remaining = officials.length - Object.keys(attendance).length;

  const markAttendance = async () => {
    try {
      setUploading(true);
      const { data } = await httpService.post("/centre/markattendance", {
        attendance,
        nscdc,
        proctors,
      });
      if (data) {
        setShowModal(false);
        toast.success(data);

        setTimeout(() => {
          navigate("/records");
        }, 2500);
      }
    } catch (error) {
      toastError(error);
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <div className="container">
        <div className="mb-4">
          <div className="mb-3">
            <Typography variant="h5" fontWeight={700}>
              MARK ATTENDANCE
            </Typography>
          </div>

          <div className="mb-3">
            <Alert severity="info">
              Kindly indicate the status for all officials
            </Alert>
          </div>

          {/* 🔥 Summary */}
          {!loading && (
            <Typography
              mt={1}
              fontSize={14}
              color="text.secondary"
              gutterBottom
            >
              Present: {presentCount} | Absent: {absentCount} | NSCDC Officials:{" "}
              {nscdc}
            </Typography>
          )}

          {!loading && remaining > 0 && (
            <Typography color="error" fontSize={13} mt={1}>
              {remaining} official(s) left to mark
            </Typography>
          )}
        </div>

        {/* 🔥 Officials List */}
        <div className="mb-4">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div className="mb-4 border-bottom pb-2" key={i}>
                  <Skeleton width={100} height={20} />
                  <Skeleton width={200} height={25} />
                  <div className="d-flex gap-2 mt-2">
                    <Skeleton variant="rounded" width={100} height={36} />
                    <Skeleton variant="rounded" width={100} height={36} />
                  </div>
                </div>
              ))
            : officials.map((official) => {
                const status = attendance[official._id];

                return (
                  <div className="mb-4 border-bottom pb-2" key={official._id}>
                    <div className="mb-1 d-flex justify-content-between align-items-center">
                      <div>
                        <Typography variant="overline">
                          {official.role}
                        </Typography>

                        <Typography
                          textTransform={"uppercase"}
                          fontWeight={500}
                          color="GrayText"
                        >
                          {official.fullName}
                        </Typography>
                      </div>

                      {/* 🔥 Status Badge */}
                      {status && (
                        <Typography
                          variant="caption"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 1,
                            backgroundColor:
                              status === "present" ? "#d4edda" : "#f8d7da",
                            color: status === "present" ? "#155724" : "#721c24",
                            fontWeight: 600,
                          }}
                        >
                          {status.toUpperCase()}
                        </Typography>
                      )}
                    </div>

                    <Stack direction={"row"} spacing={1}>
                      <Button
                        color="success"
                        variant={
                          status === "present" ? "contained" : "outlined"
                        }
                        endIcon={<Done />}
                        onClick={() =>
                          handleAttendance(official._id, "present")
                        }
                        size="small"
                      >
                        Present
                      </Button>

                      <Button
                        color="error"
                        variant={status === "absent" ? "contained" : "outlined"}
                        endIcon={<Clear />}
                        onClick={() => handleAttendance(official._id, "absent")}
                        size="small"
                      >
                        Absent
                      </Button>
                    </Stack>
                  </div>
                );
              })}
        </div>

        {/* 🔥 PROCTOR Dropdown */}
        <div className="mb-4">
          <TextField
            onChange={(e) => setProctors(Number(e.target.value))}
            fullWidth
            select
            label="PROCTORS"
            helperText="Kindly indicate the numbers of proctors present"
          >
            {proctorsOfficials.map((c, i) => (
              <MenuItem value={c} key={i}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </div>
        {/* 🔥 NSCDC Dropdown */}
        <div className="mb-4">
          <TextField
            onChange={(e) => setNscdc(Number(e.target.value))}
            fullWidth
            select
            label="NSCDC OFFICIALS"
            helperText="Kindly indicate the numbers of NSCDC officials present"
          >
            {nscdcOfficials.map((c, i) => (
              <MenuItem value={c} key={i}>
                {c}
              </MenuItem>
            ))}
          </TextField>
        </div>
        <div className="mb-4">
          <Button
            disabled={!allMarked}
            variant="contained"
            color="success"
            fullWidth
            onClick={() => setShowModal(true)}
          >
            Upload attendance
          </Button>
        </div>
      </div>
      <Modal centered show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>UPLOAD ATTENDANCE</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="mb-2 text-success">
              <Typography variant="caption">Total Present</Typography>
              <Typography variant="h5">{presentCount}</Typography>
            </div>
            <div className="mb-2 text-danger">
              <Typography variant="caption">Total Absent</Typography>
              <Typography variant="h5">{absentCount}</Typography>
            </div>
            <div className="mb-2 text-muted">
              <Typography variant="caption">PROCTORS Count</Typography>
              <Typography variant="h5">{proctors}</Typography>
            </div>
            <div className="mb-2 text-muted">
              <Typography variant="caption">NSCDC Count</Typography>
              <Typography variant="h5">{nscdc}</Typography>
            </div>
            <div className="text-end">
              <Typography color="error">
                Are you sure you want to upload this attendance data?
                <br />
                Please note that this cannot be changed afterwards
              </Typography>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            // variant="contained"
            color="success"
            onClick={markAttendance}
            loading={uploading}
            //onClick={() => uploadAttendance()}
          >
            Yes upload
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => setShowModal(false)}
          >
            Not yet
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default MarkAttendancePage;
