import React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Grid } from "@material-ui/core";

const BootstrapDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 0 }} {...other}>
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

export default function ContentOne(props) {
  return (
    <div>
      <Grid align={"center"}>
        <BootstrapDialogTitle id="customized-dialog-title">
          <h3>Welcome To Pegasus {props.details.get("first_name")}</h3>
        </BootstrapDialogTitle>
      </Grid>
      <Grid align={"center"}>
        <small>We're lucky to have you onboard</small>
      </Grid>
      <DialogContent dividers>
        <Typography gutterBottom>
          Pegasus is a web application whose sole aim is to easen the property
          management hustle.
        </Typography>
        <Typography gutterBottom>
          Pegasus is based on the latest technologies in data manipulation and
          data security. Any information provided in this portal in accessible
          only to the account's credential holders. We therefore strongly
          recommend that you only share your portal's password with people you
          trust.
        </Typography>
        <Typography gutterBottom>
          For us to make your experience as smooth and fruitful as possible,
          there are a few details we require about your properties. Please fill
          in all the next pages as accurately as possible following the
          specified guidelines.
        </Typography>
      </DialogContent>
    </div>
  );
}
