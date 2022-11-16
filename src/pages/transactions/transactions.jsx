import "./transactions.css";
import { makeStyles } from "@material-ui/core/styles";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import Button from "@mui/material/Button";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import Typography from "@mui/material/Typography";
import DialogActions from "@mui/material/DialogActions";
import Dialog from "@mui/material/Dialog";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import { TextField } from "@material-ui/core";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>,
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

//create your forceUpdate hook WHICH DID NOT WORK

const useStyles = makeStyles({
  root: {
    "&.MuiDataGrid-root .MuiDataGrid-cell:focus": {
      outline: "none",
    },
    "& .MuiDataGrid-columnHeaders": {
      fontSize: 16,
      color: "darkblue",
      backgroundColor: "rgb(245,245,245)",
    },
  },
});

export default function Transactions(props) {
  //Navigator

  //Modal states
  const [transactioDetailsModal, setOpen] = useState(false);

  //Modal Details
  const [details, setDetails] = useState({
    id: "",
    message: "",
    date: "",
    amount: "",
  });

  //Date values
  const [dateFrom, setDateFrom] = React.useState(new Date("1999-08-04"));
  const [dateTo, setDateTo] = React.useState(new Date());

  const [propertyName] = React.useState(null);

  const classes = useStyles();

  let [tenants] = React.useState(
    Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("transactions")
    )
  );

  const [searchResults, setSearchResults] = useState(tenants);

  const handleClose = () => {
    setOpen(false);
  };

  const searchTransactions = (e) => {
    if (propertyName === null) {
      setSearchResults(
        Array.from(tenants).filter((item) =>
          item.transaction_message
            .toLowerCase()
            .includes(e.target.value.toLowerCase())
        )
      );
    } else if (propertyName !== null) {
      setSearchResults(
        Array.from(tenants).filter((item) => {
          if (
            item.first_name
              .toLowerCase()
              .includes(e.target.value.toLowerCase()) &&
            item.property.toLowerCase().includes(propertyName.toLowerCase())
          ) {
            return true;
          } else {
            return false;
          }
        })
      );
    }
  };

  const searchTransactionsByDate = () => {
    setSearchResults(
      Array.from(tenants).filter((item) => {
        if (
          new Date(item.date_created) >= dateFrom &&
          new Date(item.date_created) <= dateTo
        ) {
          return true;
        } else {
          return false;
        }
      })
    );
  };

  const columns = [
    {
      field: "transaction_id",
      headerName: "Transaction ID",
      width: 150,
    },
    {
      field: "phone_number",
      headerName: "Phone NO",
      width: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "transaction_message",
      headerName: "Message",
      width: 200,
      align: "left",

      headerAlign: "center",
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div>
            {params.row.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "KSH",
            })}
          </div>
        );
      },
    },
    {
      field: "date_created",
      headerName: "Date",
      width: 200,
      headerAlign: "center",
      align: "right",
    },
    {
      field: "action",
      headerName: "Actions",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="userListAction">
            <Button
              onClick={() => {
                setDetails({
                  id: params.row.id,
                  message: params.row.transaction_message,
                  date: params.row.date_created,
                  amount: params.row.amount,
                });
                setOpen(true);
              }}
              variant="outlined"
            >
              Details
            </Button>
          </div>
        );
      },
    },
  ];

  return (
    <>
      {/*DELETE MODAL*/}
      <Dialog
        open={transactioDetailsModal}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          Transaction ID :<span style={{ color: "blue" }}> {details.id}</span>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography>{details.message}</Typography>
            <br />
            <Typography>
              {details.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "KSH",
              })}
            </Typography>
            <br />
            <small>{details.date}</small>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span style={{ color: "green" }}>Cancel</span>
          </Button>
        </DialogActions>
      </Dialog>

      <div className="userList">
        <div>
          <div
            style={{
              padding: "10px 10px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
              }}
            >
              <div
                style={{
                  marginRight: "10px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    id="outlined-basic"
                    variant="outlined"
                    label="Date From ... "
                    openTo="year"
                    views={["year", "month", "day"]}
                    value={dateFrom}
                    onChange={(newValue) => {
                      setDateFrom(newValue);
                      searchTransactionsByDate();
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
              <div
                style={{
                  marginRight: "10px",
                }}
              >
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    id="outlined-basic"
                    variant="outlined"
                    label="Date To ..."
                    openTo="year"
                    views={["year", "month", "day"]}
                    value={dateTo}
                    onChange={(newValue) => {
                      setDateTo(newValue);
                      searchTransactionsByDate();
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <TextField
                id="outlined-basic"
                label="Search Messages ... "
                variant="outlined"
                name="firstname"
                onChange={(e) => {
                  searchTransactions(e);
                }}
                style={{ width: "fit-content" }}
              />
            </div>
          </div>
        </div>
        <div className={"userListDataGrid"}>
          <DataGrid
            className={classes.root}
            rows={searchResults}
            disableSelectionOnClick
            rowHeight={45}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10]}
          />
        </div>
      </div>
    </>
  );
}
