import "./propertyList.css";
import React from "react";
import { DeleteOutline } from "@mui/icons-material";
import { ApiDetails, propertyRows } from "../../dummyData";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Slide from "@mui/material/Slide";
import { TransitionProps } from "@mui/material/transitions";
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
} from "@mui/material";
import { InputLabel, TextField } from "@material-ui/core";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { makeStyles } from "@material-ui/core/styles";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>,
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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

export default function PropertyList(props) {
  const navigate = useNavigate();
  const classes = useStyles();
  const [data, setData] = useState(propertyRows);
  const [open, setOpen] = useState(false);
  const [addPropertyModal, setAddPropertyModal] = useState(false);
  const [propertyDetails, setPropertyDetails] = useState({
    id: "",
    name: "",
  });

  const [generate, setGenerate] = useState(false);
  const [inputs, setInputs] = useState(<div></div>);
  const [linkSet, setLinkSet] = useState(false);
  const [file, setFile] = useState("");
  const [showTitle, setShowTitle] = useState(true);
  const [hide, setHide] = useState(false);
  const [downloadedTemplate, setDownloadedTemplate] = useState(false);
  const [searchHistory] = useState(new Map());

  let [properties, updateProperties] = React.useState(
    Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("properties")
    )
  );
  const [searchResults, setSearchResults] = useState(properties);

  const searchProperty = (e) => {
    setSearchResults(
      Array.from(properties).filter((item) =>
        item.property_name.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
  };

  const handleClose = () => {
    setOpen(false);
    setAddPropertyModal(false);
  };

  function changePage(page) {
    //Fetch property details   get/Specific/property
    fetch(ApiDetails + "pegasus/visionary/property/get/Specific/property", {
      method: "POST",
      body: JSON.stringify({ property_id: page }),
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          //Fetch Property Tenants
          fetch(ApiDetails + "pegasus/visionary/tenant/get/property/tenants", {
            method: "POST",
            body: JSON.stringify({ property_id: page }),
          })
            .then(async (response) => {
              let tenants = await response.json();
              if (response.status === 200) {
                navigate("/property/" + page, {
                  state: {
                    property: data,
                    tenants: tenants,
                  },
                });
              } else {
                // props.snackBar({
                //   text: "Failed fetching tenant details.",
                //   type: "error",
                // });
              }
            })
            .catch((err) => {
              console.log(err);
              // props.snackBar({
              //   text: "Something Went Wrong. Call Customer Care For Assistance.",
              //   type: "error",
              // });
            });
        } else {
          // props.snackBar({
          //   text: "Failed fetching tenant details.",
          //   type: "error",
          // });
        }
      })
      .catch((err) => {
        console.log(err);
        // props.snackBar({
        //   text: "Something Went Wrong. Call Customer Care For Assistance.",
        //   type: "error",
        // });
      });
  }

  const handleDelete = () => {
    console.log(propertyDetails);
    fetch(ApiDetails + "pegasus/visionary/property/delete", {
      method: "POST",
      body: JSON.stringify({ property_id: propertyDetails.id }),
    })
      .then(async (response) => {
        if (response.status === 200) {
          getUserDetails({
            landlord_id: JSON.parse(localStorage.myMap)[0][1],
          });
          props.snackBar({
            text: "Property Details Updated Successfully",
            type: "success",
          });
          window.location.href = "/propertyList";
        } else if (response.status === 401) {
          props.snackBar({
            text: "Maximum concurrent logins reached",
            type: "warning",
          });
        } else if (response.status === 500) {
          props.snackBar({
            text: "Something went wrong. Please try again later.",
            type: "error",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        props.snackBar({
          text: "Something Went Wrong. Try Again Later",
          type: "error",
        });
      });
  };

  function LinearProgressWithLabel(
    props: LinearProgressProps & { value: number }
  ) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            props.value
          )}%`}</Typography>
        </Box>
      </Box>
    );
  }

  const initialValues2 = {
    property_name: "",
    email_address: JSON.parse(localStorage.myMap)[5][1],
  };

  const [newPropertyDetails, setNewPropertyDetails] = useState(null);

  const getUserDetails = (userDetails) => {
    //"proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/dashboard/get/details", {
      method: "POST",
      body: JSON.stringify(userDetails),
    })
      .then(async (response) => {
        let data = await response.json();

        if (response.status === 200) {
          const map1 = new Map(Object.entries(data));
          //localStorage.setItem("userDetails",new Map(Object.entries(data)));
          localStorage.portfolioDetails = JSON.stringify(
            Array.from(map1.entries())
          );

          updateProperties(
            Array.from(
              new Map(JSON.parse(localStorage.portfolioDetails)).get(
                "properties"
              )
            )
          );
          properties = Array.from(
            new Map(JSON.parse(localStorage.portfolioDetails)).get("properties")
          );
          setSearchResults(properties);
        } else {
          props.snackBar({ text: "Failed Fetching Details", type: "error" });
        }
      })
      .catch((err) => console.log(err));
  };
  const handleChange = (prop) => (event) => {
    searchHistory.set(event.target.name, event.target.value);
    console.log(searchHistory);
  };
  function base64ToBlob(base64) {
    const binaryString = window.atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; ++i) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    return new Blob([bytes], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
  }
  const download = () => {
    //Download File

    const blob = base64ToBlob(file);
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    //link.setAttribute('target', '_blank');
    link.setAttribute("download", `download`);
    link.href = blobURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadedTemplate(true);
    //Move to next page here
    // eslint-disable-next-line no-unused-expressions
    //next();
  };
  const getDownloadLink = (values, props) => {
    searchHistory.set("email_address", JSON.parse(localStorage.myMap)[5][1]);
    console.log("Values to push to db : " + searchHistory);
    // return;
    if (download) {
      console.log("........ Getting downloads ..........");
      fetch(ApiDetails + "pegasus/visionary/files/download", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(searchHistory)),
      })
        .then(async (response) => {
          console.log(".... Making API call ..... ");
          let data = await response.json();
          if (response.status === 200) {
            console.log(data);
            setLinkSet(true);
            setGenerate(false);
            setShowTitle(false);
            setHide(true);
            //console.log(data["File"]);
            setFile(data["File"]);
          } else if (response.status === 401) {
          } else if (response.status === 400) {
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
    //props.resetForm();
  };
  function handleFile(e) {
    setNewPropertyDetails(e.target.files[0]);
  }
  const uploadFile = () => {
    if (newPropertyDetails === null) {
      props.snackBar({
        text: "Please Select File To Upload",
        type: "error",
      });
      return;
    }
    let formData = new FormData();
    formData.append(
      "details",
      JSON.stringify({
        landlord_id: JSON.parse(localStorage.myMap)[0][1],
        email_address: JSON.parse(localStorage.myMap)[5][1],
      })
    );

    formData.append("updated_document", newPropertyDetails);

    fetch(ApiDetails + "pegasus/visionary/files/finishSetup", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        if (response.status === 200) {
          getUserDetails({
            landlord_id: JSON.parse(localStorage.myMap)[0][1],
          });
          //new Map(JSON.parse(localStorage.portfolioDetails));
          props.snackBar({
            text: "Property Added Successfully",
            type: "success",
          });
          handleClose();
          // props.complete();
          window.location.href = "/propertyList";
        } else if (response.status === 401) {
          console.log(401);
          props.snackBar({
            text: "Something went wrong. Please try again later",
            type: "error",
          });
        } else if (response.status === 400) {
          console.log(400);
          props.snackBar({
            text: "Something went wrong. Please try again later",
            type: "error",
          });
        } else {
          console.log("Else ... ");
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

  const columns = [
    {
      field: "property_name",
      headerName: "Property Name",
      width: 180,
      renderCell: (params) => {
        return <div className="userListUser">{params.row.property_name}</div>;
      },
    },
    { field: "location", headerName: "Location", width: 150 },
    {
      field: "total_property_units",
      headerName: "Total Units",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "occupancy",
      headerName: "Occupancy",
      width: 180,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <Box sx={{ width: "100%" }}>
            <LinearProgressWithLabel
              value={parseInt(params.row.occupancy.replace("%", "").trim())}
            />
          </Box>
        );
      },
    },
    {
      field: "expected_revenue",
      headerName: "Expected Revenue",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row.expected_revenue.toLocaleString("en-US", {
              style: "currency",
              currency: "KSH",
            })}
          </div>
        );
      },
    },
    {
      field: "Tenant Details",
      headerName: "Tenant Details",
      width: 150,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <Button
              onClick={() => {
                changePage(params.row.id);
              }}
              variant="outlined"
            >
              Details
            </Button>
          </div>
        );
      },
    },
    {
      field: "action",
      headerName: "Delete",
      width: 100,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="userListAction">
            <DeleteOutline
              className="userListDelete"
              onClick={() => {
                setPropertyDetails({
                  id: params.row.id,
                  name: params.row.property_name,
                });
                setOpen(true);
              }}
            />
          </div>
        );
      },
    },
  ];
  return (
    <div className="userList">
      {/*Add Property MODAL*/}
      <Dialog
        maxWidth={true}
        open={addPropertyModal}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          style={{
            width: "90%",
          }}
        >
          <div
            style={{
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
            }}
          >
            Add Property
          </div>
        </DialogTitle>
        <DialogContent
          style={{
            padding: "10px",
          }}
        >
          <Formik
            initialValues={initialValues2}
            // validationSchema={validationSchema}
            onSubmit={uploadFile}
          >
            {(props) => (
              <Form noValidate>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  {/*  {
    "property_name":"Pretty ALphas",
    "total_property_units":20,
    "location":"Nairobi",

}*/}
                  {linkSet === false ? (
                    <TextField
                      required
                      id="outlined-basic"
                      label={"property Name"}
                      name={"property name"}
                      type={"text"}
                      variant="outlined"
                      style={{ width: "100%" }}
                      //name={"property" + (index+1)}
                      onChange={handleChange("property Name")}
                    />
                  ) : (
                    <TextField
                      required
                      id="outlined-basic"
                      label={"property Name"}
                      name={"property name"}
                      type={"text"}
                      variant="outlined"
                      style={{ width: "100%" }}
                      disabled={true}
                      onChange={handleChange("property Name")}
                    />
                  )}
                </div>
                <br />
                {linkSet === false ? (
                  <>
                    <Typography variant="caption">
                      Generate Download Link
                    </Typography>

                    <br />

                    <Button
                      style={{
                        marginTop: 10,
                      }}
                      variant="contained"
                      color="primary"
                      onClick={getDownloadLink}
                    >
                      Get Link
                    </Button>
                  </>
                ) : (
                  <>
                    <Typography variant="caption">
                      Generate Download Link
                    </Typography>

                    <br />

                    <Button
                      style={{
                        marginTop: 10,
                      }}
                      variant="contained"
                      color="primary"
                      disabled={true}
                      onClick={getDownloadLink}
                    >
                      Get Link
                    </Button>
                  </>
                )}
                <br />
                <br />

                {/*Download Section*/}
                {linkSet === false ? (
                  <div
                    style={{
                      visibility: "hidden",
                    }}
                  >
                    <p>
                      Please download and fill in your property details in the
                      excel document provided below as accurately as possible.
                    </p>
                    <br />
                    <p>
                      The first sheet represents an example of what is expected
                      of you.
                    </p>
                    <br />
                    <p>
                      Make sure to fill for all units even if the unit is
                      vacant.
                    </p>

                    <br />
                    <br />
                    <Typography variant="caption">Click to download</Typography>

                    <br />

                    <Button
                      style={{
                        marginTop: 10,
                      }}
                      variant="contained"
                      color="primary"
                      onClick={download}
                    >
                      DOWNLOAD
                    </Button>
                  </div>
                ) : (
                  <>
                    <p>
                      Please download and fill in your property details in the
                      excel document provided below as accurately as possible.
                    </p>
                    <br />
                    <p>
                      The first sheet represents an example of what is expected
                      of you.
                    </p>
                    <br />
                    <p>
                      Make sure to fill for all units even if the unit is
                      vacant.
                    </p>

                    <br />
                    <br />
                    <Typography variant="caption">Click to download</Typography>

                    <br />

                    <Button
                      style={{
                        marginTop: 10,
                      }}
                      variant="contained"
                      color="primary"
                      onClick={download}
                    >
                      DOWNLOAD
                    </Button>
                  </>
                )}

                <br />
                <br />
                {downloadedTemplate === false ? (
                  <></>
                ) : (
                  <div>
                    <Typography></Typography>
                    <Typography>
                      Select the excel file you downloaded and edited
                    </Typography>
                    <br />
                    <input type={"file"} onChange={(e) => handleFile(e)} />{" "}
                    <br />
                  </div>
                )}
                <br />
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "end",
                    marginTop: "20px",
                  }}
                >
                  <Button onClick={handleClose}>
                    <span style={{ color: "red" }}>Cancel</span>
                  </Button>
                  <Button type="submit">
                    <span style={{ color: "green" }}>Submit</span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>

      {/*Delete Property Modal*/}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ color: "red" }}>
          Delete {propertyDetails.name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography>
              Deleting a property will completely remove it and its tenants from
              the system
            </Typography>
            <Typography>
              Are you sure you want to delete this property ?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span style={{ color: "red" }}>Disagree</span>
          </Button>
          <Button onClick={handleDelete}>
            <span style={{ color: "green" }} onClick={() => {}}>
              Agree
            </span>
          </Button>
        </DialogActions>
      </Dialog>
      <div
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            padding: "10px 10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search properties  ... "
            variant="outlined"
            name="firstname"
            onChange={(e) => {
              searchProperty(e);
            }}
            style={{ paddingRight: "10px" }}
          />
          <Button
            onClick={(e) => {
              searchProperty(e);
            }}
            variant="outlined"
          >
            Search
          </Button>
        </div>
        <Button
          onClick={(e) => {
            setAddPropertyModal(true);
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
            marginRight: "10px",
          }}
        >
          Add Property
        </Button>
      </div>

      <div className={"userListDataGrid"}>
        <DataGrid
          className={classes.root}
          rows={searchResults}
          disableSelectionOnClick
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          checkboxSelection
        />
      </div>
    </div>
  );
}
