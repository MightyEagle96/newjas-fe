import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Tooltip,
  useMediaQuery,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  Menu,
  Logout,
  Login,
  Home,
  List as ListIcon,
  Cabin,
} from "@mui/icons-material";
import logo from "../assets/logo.png";
import { useAppUser } from "../context/AppUserContext";

export default function AdminRichNavbar({
  appUser,
  handlelogout,
  setLoading,
  loading,
}: any) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const ADMIN_BASE = "/admin";
  // Navigation links
  const loggedInLinks = [
    { text: "Home", link: "/admin", icon: <Home fontSize="small" /> },
    {
      text: "Examinations",
      link: ADMIN_BASE + "/examinations",
      icon: <ListIcon fontSize="small" />,
    },
    {
      text: "Centre Reports",
      link: ADMIN_BASE + "/centrereports",
      icon: <Cabin fontSize="small" />,
    },
  ];

  const isActive = (link: string) => location.pathname === link;

  const { user } = useAppUser();

  return (
    <>
      {/* ===== APP BAR ===== */}
      <AppBar
        position="sticky"
        sx={{ backgroundColor: "#fff", color: "#333", boxShadow: 1 }}
      >
        <Toolbar
          sx={{
            justifyContent: isMobile ? "center" : "space-between",
            position: "relative",
          }}
        >
          {/* Placeholder left on mobile for traversal buttons */}
          {isMobile && <Box sx={{ position: "absolute", left: 8 }} />}

          {/* Brand */}
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            sx={{
              cursor: "pointer",
              position: isMobile ? "absolute" : "static",
              left: isMobile ? "50%" : "auto",
              transform: isMobile ? "translateX(-50%)" : "none",
              textDecoration: "none",
            }}
            component={Link}
            to={`/admin`}
            //onClick={() => (window.location.href = "/")}
          >
            <img src={logo} height={32} />
            {/* <Avatar src={logo} alt="Logo" sx={{ width: 32, height: 32 }} /> */}
            <Typography variant="h6" fontWeight={700} color="success">
              Centre {user?.centreId}
            </Typography>
          </Box>

          {/* Desktop Links */}
          <Box
            sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
          >
            {appUser &&
              loggedInLinks.map((item, i) => (
                <Button
                  key={i}
                  component={Link}
                  to={item.link}
                  startIcon={item.icon}
                  sx={{
                    color: isActive(item.link) ? "#2e7d32" : "#333",
                    fontWeight: isActive(item.link) ? 700 : 500,
                    textTransform: "none",
                    mx: 0.5,
                    borderBottom: isActive(item.link)
                      ? "2px solid #2e7d32"
                      : "none",
                    borderRadius: 0,
                    "&:hover": { backgroundColor: "#f0f0f0" },
                  }}
                >
                  {item.text}
                </Button>
              ))}

            {appUser ? (
              <>
                <Typography sx={{ mx: 2 }}>{appUser.emailAddress}</Typography>
                <Tooltip title="Logout">
                  <IconButton
                    onClick={() => {
                      handlelogout();
                      setLoading(true);
                      setTimeout(() => setLoading(false), 10000);
                    }}
                    color="inherit"
                  >
                    <Logout />
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Button
                component={Link}
                to="/login"
                startIcon={<Login />}
                sx={{ textTransform: "none", color: "#333" }}
              >
                Login
              </Button>
            )}
          </Box>

          {/* Mobile Toggle */}
          {isMobile && (
            <IconButton
              color="inherit"
              sx={{ position: "absolute", right: 8 }}
              onClick={() => setDrawerOpen(true)}
            >
              <Menu />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      {/* ===== MOBILE / TABLET DRAWER ===== */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 260, backgroundColor: "#f9fafb", p: 2 } }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6" fontWeight={700}>
            Menu
          </Typography>
          <IconButton onClick={() => setDrawerOpen(false)}>
            <Logout />
          </IconButton>
        </Box>

        <Divider />

        <List>
          {loggedInLinks.map((item, i) => (
            <ListItemButton
              key={i}
              component={Link}
              to={item.link}
              selected={isActive(item.link)}
              onClick={() => setDrawerOpen(false)}
            >
              <ListItemIcon
                sx={{ color: isActive(item.link) ? "#2e7d32" : "inherit" }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: isActive(item.link) ? 700 : 500,
                  color: isActive(item.link) ? "#2e7d32" : "inherit",
                }}
              />
            </ListItemButton>
          ))}
        </List>

        <Divider sx={{ my: 2 }} />

        {appUser ? (
          <ListItemButton
            onClick={() => {
              handlelogout();
              setLoading(true);
              setTimeout(() => setLoading(false), 10000);
              setDrawerOpen(false);
            }}
          >
            <ListItemIcon>
              {loading ? <CircularProgress size={20} /> : <Logout />}
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        ) : (
          <ListItemButton
            component={Link}
            to="/login"
            onClick={() => setDrawerOpen(false)}
          >
            <ListItemIcon>
              <Login />
            </ListItemIcon>
            <ListItemText primary="Login" />
          </ListItemButton>
        )}
      </Drawer>
    </>
  );
}
