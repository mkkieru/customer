import React, { Component } from "react";
import "./details.css";
import { Link } from "react-router-dom";
import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@mui/icons-material";

class Details extends Component {
  render() {
    return (
      <div className="details">
        <div className="detailsTitle">
          <h1 >WELCOME TO PEGASUS !</h1>
        </div>

        <div className="detailsContainer">
          <div className="show">
            this is a test ...

          </div>

        </div>
      </div>
    );
  }
}

export default Details;
