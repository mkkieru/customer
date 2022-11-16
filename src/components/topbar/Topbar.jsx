import React, { useEffect } from "react";
import "./topbar.css";
import {
  NotificationsNone,
  Language,
  Settings,
  Logout,
} from "@mui/icons-material";
import { Avatar, Menu, MenuItem } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";
import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import IconButton from "@mui/material/IconButton";
import { Link } from "react-router-dom";

export default function Topbar(props) {
  const [profileImage, setProfileImage] = React.useState("");
  const [notifications, setNotifications] = React.useState();
  const [notificationsNumber, updateNotificationsNumber] = React.useState(0);

  let initialName = "new user";
  try {
    initialName =
      JSON.parse(localStorage.myMap)[1][1] +
      " " +
      JSON.parse(localStorage.myMap)[2][1];
  } catch (e) {}

  const [name, setName] = React.useState(initialName);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = (event) => {
    // 👇️ toggle class on click
    localStorage.clear();
  };

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <div>
            <span
              style={{
                fontWeight: "bold",
                fontSize: "20px",
                color: "black",
              }}
            >
              Welcome, {name.toUpperCase()}
            </span>
          </div>
        </div>
        <div className="topRight">
          {/*<div className="topbarIconContainer">*/}
          {/*  <NotificationsNone style={{ color: "white", fontSize: "25px" }} />*/}
          {/*  <span className="topIconBadge">{notificationsNumber}</span>*/}
          {/*</div>*/}

          {/*<div className="topbarIconContainer">*/}
          {/*  <Settings style={{ color: "white", fontSize: "25px" }} />*/}
          {/*  <span className="topIconBadge">6</span>*/}
          {/*</div>*/}

          <Box
            style={{
              visibility: "hidden",
            }}
            sx={{ display: "flex", alignItems: "center", textAlign: "center" }}
          >
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <Avatar sx={{ width: 50, height: 50 }}>M</Avatar>
              </IconButton>
            </Tooltip>
          </Box>

          <Menu
            anchorEl={anchorEl}
            // id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <MenuItem>
              <Avatar
                style={{
                  marginRight: "10px",
                }}
              />
              Profile
            </MenuItem>
            <MenuItem>
              <Avatar
                style={{
                  marginRight: "10px",
                }}
              />{" "}
              My account
            </MenuItem>
            <Divider />
            <MenuItem disabled={true}>
              <ListItemIcon
                style={{
                  marginRight: "10px",
                }}
              >
                <Settings fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>

            <MenuItem>
              <Link onClick={logout} className="linkItem" to={"/"}>
                <ListItemIcon
                  style={{
                    marginRight: "10px",
                  }}
                >
                  <Logout fontSize="small" />
                </ListItemIcon>
                Logout
              </Link>
            </MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}
