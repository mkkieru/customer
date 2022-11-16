import React, { useEffect, useState } from "react";
import "./events.css";
import format from "date-fns/format";
import getDay from "date-fns/getDay";
import parse from "date-fns/parse";
import startOfWeek from "date-fns/startOfWeek";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

import { InputLabel, TextField } from "@material-ui/core";
import { LocalizationProvider } from "@mui/x-date-pickers";
import enLocale from "date-fns/locale/en-US";
import deLocale from "date-fns/locale/de";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";

import DialogContent from "@mui/material/DialogContent";
import { Field, Form, Formik } from "formik";
import Button from "@mui/material/Button";
import { makeStyles } from "@material-ui/core/styles";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import DialogActions from "@mui/material/DialogActions";
import { ApiDetails } from "../../dummyData";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
makeStyles({
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
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>,
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const events = [
  {
    title: "Big Meeting",
    allDay: true,
    start: new Date(2022, 10, 23),
    end: new Date(2022, 10, 23),
  },
];
const localeMap = {
  en: enLocale,
  de: deLocale,
};
export default function Events(props) {
  //Loading Screen
  let [backDrop, setBackDrop] = useState(
    <Backdrop
      sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={true}
      onClick={null}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
    // <></>
  );

  const handleClose = () => {
    setModal(false);
  };
  useEffect(() => {
    fetch(ApiDetails + "pegasus/visionary/events/", {
      method: "POST",
      body: JSON.stringify({
        landlord_id: JSON.parse(localStorage.myMap)[0][1],
      }),
    })
      .then(async (response) => {
        let data = await response.json();
        // console.log(data);
        if (response.status === 200) {
          //Fetch tenant arrears
          setAllEvents(data);
          setBackDrop(<></>);
        } else {
          props.snackBar({
            text: "Failed fetching tenant details.",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        props.snackBar({
          text: "Something Went Wrong. Call Customer Care For Assistance.",
          type: "error",
        });
      });
  }, [props]);

  const getEvents = () => {
    fetch(ApiDetails + "pegasus/visionary/events/", {
      method: "POST",
      body: JSON.stringify({
        landlord_id: JSON.parse(localStorage.myMap)[0][1],
      }),
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          setAllEvents(data);
        } else {
          props.snackBar({
            text: "Failed fetching events.",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        props.snackBar({
          text: "Something Went Wrong. Call Customer Care For Assistance.",
          type: "error",
        });
      });
  };

  const [newEvent, setNewEvent] = useState({ title: "", start: "", end: "" });
  const [allEvents, setAllEvents] = useState(events);

  function handleAddEvent() {
    for (let i = 0; i < allEvents.length; i++) {
      const d1 = new Date(allEvents[i].start);
      const d2 = new Date(newEvent.start);
      const d3 = new Date(allEvents[i].end);
      const d4 = new Date(newEvent.end);
      /*
          console.log(d1 <= d2);
          console.log(d2 <= d3);
          console.log(d1 <= d4);
          console.log(d4 <= d3);
            */

      if ((d1 <= d2 && d2 <= d3) || (d1 <= d4 && d4 <= d3)) {
        alert("CLASH");
        break;
      }
    }

    setAllEvents([...allEvents, newEvent]);

    let body = {
      landlord_id: JSON.parse(localStorage.myMap)[0][1],
      title: newEvent.title,
      start_date: newEvent.start,
      end_date: newEvent.end + 1,
    };

    fetch(ApiDetails + "pegasus/visionary/events/add", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (response.status === 200) {
          getEvents();
        } else {
          props.snackBar({
            text: "Failed adding event.",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        props.snackBar({
          text: "Something Went Wrong. Call Customer Care For Assistance.",
          type: "error",
        });
      });
    handleClose();
    getEvents();
  }
  const [modal, setModal] = React.useState(false);
  let initialValues = {
    id: "",
    first_name: "",
    description: "",
    amount: "",
  };
  return (
    <>
      {backDrop}

      {/*Arrears MODAL*/}
      <Dialog
        open={modal}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Add Event
          </div>
        </DialogTitle>
        <DialogContent>
          <Formik initialValues={initialValues} onSubmit={handleAddEvent}>
            {() => (
              <Form noValidate>
                <div>
                  {/*<input*/}
                  {/*  type="text"*/}
                  {/*  placeholder="Add Title"*/}
                  {/*  style={{ width: "20%", marginRight: "10px" }}*/}
                  {/*  value={newEvent.title}*/}
                  {/*  onChange={(e) =>*/}
                  {/*    setNewEvent({ ...newEvent, title: e.target.value })*/}
                  {/*  }*/}
                  {/*/>*/}
                  <Field
                    as={TextField}
                    name="event_title"
                    label="Event Title"
                    variant="outlined"
                    fullWidth
                    required
                    value={newEvent.title}
                    onChange={(e) =>
                      setNewEvent({ ...newEvent, title: e.target.value })
                    }
                    style={{ marginTop: "8px", width: "100%" }}
                  />
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      paddingTop: "10px",
                    }}
                  >
                    <div
                      style={{
                        paddingRight: "10px",
                      }}
                    >
                      <InputLabel>Start Date</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          placeholderText="Start Date"
                          style={{ marginRight: "10px" }}
                          value={newEvent.start}
                          onChange={(start) =>
                            setNewEvent({ ...newEvent, start })
                          }
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div>
                    <div>
                      <InputLabel>End Date</InputLabel>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          placeholderText="End Date"
                          style={{ marginRight: "10px" }}
                          value={newEvent.end}
                          onChange={(end) => setNewEvent({ ...newEvent, end })}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span style={{ color: "red" }}>Disagree</span>
          </Button>
          <Button onClick={handleAddEvent}>
            <span style={{ color: "green" }} onClick={() => {}}>
              Agree
            </span>
          </Button>
        </DialogActions>
      </Dialog>

      <div className="App">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            padding: "20px",
          }}
        >
          <h1>Calendar</h1>
          <Button
            onClick={() => {
              setModal(true);
            }}
            variant="outlined"
            style={{
              color: "white",
              text_transform: "uppercase",
              width: "200px",
              line_height: "50px",
              border_radius: "5px",
              background: "#00B000",
              text_align: "center",
              box_shadow: "inset 0 0 25px rgba(0,0,0,.25)",
            }}
          >
            Add New Event
          </Button>
        </div>
        <Calendar
          localizer={localizer}
          events={allEvents}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: "20px" }}
        />
      </div>
    </>
  );
}
