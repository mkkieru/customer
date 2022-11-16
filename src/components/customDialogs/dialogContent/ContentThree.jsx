import React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Button } from "@material-ui/core";
import { useNavigate } from "react-router-dom";
import { ApiDetails } from "../../../dummyData";

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
};

export default function ContentThree(props) {
  const [propertyDetails, setPropertyDetails] = React.useState("");

  const navigate = useNavigate();

  function handleFile(e) {
    setPropertyDetails(e.target.files[0]);
  }
  const getUserDetails = () => {
    //"proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/dashboard/get/details", {
      method: "POST",
      body: JSON.stringify({
        landlord_id: JSON.parse(localStorage.myMap)[0][1],
      }),
    })
      .then(async (response) => {
        // console.log(response.status);
        let data = await response.json();
        if (response.status === 200) {
          console.log("success");
          const map1 = new Map(Object.entries(data));
          localStorage.setItem(
            "portfolioDetails",
            JSON.stringify(Array.from(map1.entries()))
          );
          localStorage.portfolioDetails = JSON.stringify(
            Array.from(map1.entries())
          );

          //new Map(JSON.parse(localStorage.portfolioDetails));
          props.snackBar({
            text: "File Uploaded Successfully",
            type: "success",
          });
          props.complete();

          //navigate("/home");
          window.location.href = "/home";
        } else {
          props.snackBar({ text: "Failed Fetching Details", type: "error" });
        }
      })
      .catch((err) => console.log(err));
  };
  const uploadFile = () => {
    let formData = new FormData();
    formData.append(
      "details",
      JSON.stringify({
        landlord_id: props.details.get("landlord_id"),
        email_address: props.details.get("email_address"),
      })
    );
    formData.append("updated_document", propertyDetails);

    if (propertyDetails === "") {
      props.snackBar({
        text: "Please Select File To Upload",
        type: "error",
      });
      return;
    }

    fetch(ApiDetails + "pegasus/visionary/files/finishSetup", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (response.status === 200) {
          getUserDetails();
        } else if (response.status === 401) {
          props.snackBar({
            text: "Something went wrong. Please try again later",
            type: "error",
          });
        } else if (response.status === 400) {
          props.snackBar({
            text: "Something went wrong. Please try again later",
            type: "error",
          });
        } else if (response.status === 400) {
          props.snackBar({
            text: "Something went wrong. Please try again later",
            type: "error",
          });
        } else {
          props.snackBar({
            text: "Something went wrong. Please try again later",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <BootstrapDialogTitle id="customized-dialog-title">
        Finally
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography>
          Make sure the changes made to the document downloaded are as per the
          provided guidelines. This document is used by the system to help the
          system know the current status of all your properties.
        </Typography>
        <br />
        <Typography></Typography>
        <Typography>Select the excel file you downloaded and edited</Typography>
        <br />
        <input type={"file"} onChange={(e) => handleFile(e)} /> <br />
        <Button
          style={{ marginTop: "20px", marginBottom: "10px" }}
          variant="contained"
          color="primary"
          onClick={uploadFile}
        >
          Upload
        </Button>
      </DialogContent>
    </div>
  );
}
