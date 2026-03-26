import { Typography } from "@mui/material";

function FooterComponent() {
  return (
    <div className="p-5 bg-light d-flex justify-content-center">
      <div className="col-lg-4 text-center">
        <Typography fontWeight={700}>Attendance Management System</Typography>
        <Typography variant="overline">
          © {new Date().getFullYear()} JAMB. All rights reserved.
        </Typography>
      </div>
    </div>
  );
}

export default FooterComponent;
