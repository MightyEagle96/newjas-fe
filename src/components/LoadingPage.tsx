import { Box, CircularProgress } from "@mui/material";

import logo from "../assets/logo.png";

function LoadingPage() {
  return (
    <div
      style={{
        height: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="text-center floating-logo">
        <div className="d-flex justify-content-center">
          <img src={logo} height={100} className="logo-pulse" />
        </div>

        <div className="mt-2">
          {/* Circular Progress with gradient */}
          <Box sx={{ position: "relative", display: "inline-flex", mt: 2 }}>
            <CircularProgress
              size={40}
              thickness={3}
              sx={{
                "svg circle": {
                  stroke: "url(#gradientColors)",
                },
              }}
            />
            {/* Gradient definition */}
            <svg width="0" height="0">
              <defs>
                <linearGradient
                  id="gradientColors"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#124170" />
                  <stop offset="50%" stopColor="#26667F" />
                  <stop offset="100%" stopColor="#67C090" />
                </linearGradient>
              </defs>
            </svg>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;
