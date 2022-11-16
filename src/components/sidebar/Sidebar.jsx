import React from "react";
import "./sidebar.css";
import {
  LineStyle,
  PermIdentity,
  ChatBubbleOutline,
  Logout,
  CalendarMonthOutlined,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { Apartment } from "@material-ui/icons";

export default function Sidebar(props) {
  const handleClick = (event) => {
    // 👇️ toggle class on click
    // event.currentTarget.classList.toggle("active");
    //props.fn();
  };
  const logout = (event) => {
    // 👇️ toggle class on click
    localStorage.clear();
    props.fn();
  };
  return (
    <div className="sidebar">
      <div className="sidebarWrapper">
        <div className="sidebarWrapperTop">
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Quick Menu</h3>
            <ul className="sidebarList">
              <Link className="linkItem" to={"/propertyList"}>
                <li onClick={handleClick} className="sidebarListItem">
                  <Apartment className="sidebarIcon" />
                  Properties
                </li>
              </Link>
              <Link className="linkItem" to={"/tenantList"}>
                <li onClick={handleClick} className="sidebarListItem">
                  <PermIdentity className="sidebarIcon" />
                  Tenants
                </li>
              </Link>
              <Link className="linkItem" to={"/events"}>
                <li onClick={handleClick} className="sidebarListItem">
                  <CalendarMonthOutlined className="sidebarIcon" />
                  Events
                </li>
              </Link>
            </ul>
          </div>
        </div>
        <div className="sidebarWrapperBottom">
          <div className="sidebarMenu">
            <h3 className="sidebarTitle">Authentication</h3>
            <ul className="sidebarList">
              <Link className="linkItem" to={"/"}>
                <li onClick={logout} name="logout" className="sidebarListItem">
                  <Logout className="sidebarIcon" />
                  Logout
                </li>
              </Link>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
