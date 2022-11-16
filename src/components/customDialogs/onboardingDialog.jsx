import * as React from "react";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import ContentOne from "./dialogContent/ContentOne";
import ContentTwo from "./dialogContent/ContentTwo";
import RegistrationForm from "./registration";

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

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

BootstrapDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function OnboardingDialog(props) {
  const [open, setOpen] = React.useState(true);
  let [setupDone, setSetupDone] = React.useState(false);
  const [step, setValue] = React.useState(
    <ContentOne details={props.details} />
  );
  const [details, setDetails] = React.useState(false);
  const [displayButton, setDisplayButton] = React.useState(true);

  const handleClose = () => {
    if (!setupDone) {
      console.log("Please finish setting up your account ... ");
      props.snackBar({
        text: "Please finish setting up your account ",
        type: "warning",
      });
    } else {
      setOpen(false);
    }
  };

  const viewTopBarClick = () => {
    props.topBar();
  };

  const pageTwo = () => {
    //setNumber(contentNumber + 1);
    setValue(
      <ContentTwo
        snackBar={props.snackBar}
        details={props.details}
        complete={() => {
          setSetupDone(true);
          setOpen(false);
          setupDone = true;
          localStorage.setItem("isNew", false);
        }}
      />
    );
    setDisplayButton(false);
  };

  return (
    <div>
      {/*<Button style={{display:"none"}} variant="outlined" onClick={handleClickOpen}>*/}
      {/*    Open dialog*/}
      {/*</Button>*/}
      <BootstrapDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        {details ? (
          <>
            {step}
            <>
              {displayButton ? (
                <DialogActions>
                  <Button
                    autoFocus
                    style={{ visibility: "gone" }}
                    onClick={pageTwo}
                  >
                    NEXT
                  </Button>
                </DialogActions>
              ) : (
                <></>
              )}
            </>
          </>
        ) : (
          <>
            <RegistrationForm
              next={() => {
                setDetails(true);
              }}
              details={props.details}
              snackBar={props.snackBar}
            />
          </>
        )}
      </BootstrapDialog>
    </div>
  );
}
