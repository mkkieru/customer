import React from "react";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import DownloadFiles from "../../files/downloadFiles";
import ContentThree from "./ContentThree";

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

export default function ContentTwo(props) {
  const [goToThree, setGoToThree] = React.useState(false);
  const complete = () => {
    props.complete();
  };
  const snackbar = (e) => {
    props.snackBar(e);
  };

  return (
    <>
      {goToThree ? (
        <div>
          <DialogContent dividers>
            <ContentThree
              snackBar={snackbar}
              details={props.details}
              complete={() => complete()}
            />
          </DialogContent>
        </div>
      ) : (
        <>
          <BootstrapDialogTitle id="customized-dialog-title">
            HELP US KNOW YOU BETTER
          </BootstrapDialogTitle>
          <DialogContent dividers>
            <DownloadFiles
              details={props.details}
              display={props.buttonDisplay}
              next={() => {
                setGoToThree(true);
              }}
            />
          </DialogContent>
        </>
      )}
    </>
  );
}
