import { Button, Typography } from "@mui/material";
import { toastError } from "../../components/ErrorToast";
import { httpService } from "../../httpService";
import { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Clear, Done } from "@mui/icons-material";
import { Link } from "react-router-dom";

function ExaminationPage() {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const getData = async () => {
    try {
      setLoading(true);
      const { data } = await httpService("examination/viewall");
      if (data) {
        setExams(data);
        console.log(data);
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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      width: 70,
    },
    {
      field: "name",
      headerName: "Name",
      width: 200,
      renderCell: (params: any) => (
        <span className="text-uppercase">{params.row.name}</span>
      ),
    },
    {
      field: "selectedOfficials",
      headerName: "Selected Officials",
      width: 200,
      renderCell: (params: any) => (
        <span className="text-uppercase">
          {params.row.selectedOfficials.length}
        </span>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 200,
      renderCell: (params: any) => (
        <span className="text-uppercase">
          {params.row.active ? (
            <Done color="success" />
          ) : (
            <Clear color="error" />
          )}
        </span>
      ),
    },
    {
      field: "activationHour",
      headerName: "Activation Hour",
      width: 200,
      renderCell: (params: any) => (
        <span className="text-uppercase">{params.row.activationHour}:00</span>
      ),
    },
    {
      field: "_id",
      headerName: "View",
      width: 200,
      renderCell: (params: any) => (
        <Button component={Link} to={`/admin/examination?id=${params.row._id}`}>
          view
        </Button>
      ),
    },
  ];
  return (
    <div>
      <div className="container">
        <div className="mb-4">
          <Typography variant="h5" fontWeight={700}>
            Examinations
          </Typography>
        </div>
        <div>
          <DataGrid columns={columns} rows={exams} loading={loading} />
        </div>
      </div>
    </div>
  );
}

export default ExaminationPage;
