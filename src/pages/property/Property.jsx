import React, { useState } from "react";
import "./property.css";
import { Add, DeleteOutline, PercentOutlined } from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { InputLabel, TextField, Typography } from "@material-ui/core";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import {
  AccountCircleOutlined,
  ApartmentOutlined,
  LocationOnOutlined,
} from "@material-ui/icons";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { ApiDetails } from "../../dummyData";

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
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>,
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Property(props) {
  const { state } = useLocation();
  let { property, tenants } = state;

  //Updated Properties
  let [currentTenants, updateCurrentTenants] = useState(null);

  //Navigator
  const navigate = useNavigate();

  //Modal states
  const [arrearsModal, setArrearsModal] = useState(false);
  const [addTenantModal, setAddTenantModal] = useState(false);
  const [deleteModal, setOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);

  //Units State
  const [units, setUnits] = React.useState(null);
  const [selectedUnit, setSelectedUnit] = React.useState(null);

  const [isStudent, setIsStudent] = React.useState("NO");

  const [addTenantPropertyName, setAddTenantPropertyName] =
    React.useState("Select Property");
  let [propertyID, setPropertyID] = React.useState(null);

  let [tenantInfo, setTenantInfo] = React.useState({
    id: "",
    name: "",
    last_name: "",
  });
  let [tenantDeleteInfo, setTenantDeleteInfo] = React.useState({
    id: "",
    name: "",
    last_name: "",
  });

  const [searchResults, setSearchResults] = useState(tenants);
  const [searchUpdateResults, setSearchUpdatedResults] =
    useState(currentTenants);

  let initialValues = {
    id: "",
    first_name: "",
    description: "",
    amount: "",
  };

  const initialValues2 = {
    property_id: property.property_id,
    property_name: property.property_name,
    // landlord_id: JSON.parse(localStorage.myMap)[0][1],
    location: property.location,
    total_property_units: property.total_property_units,
    minimum_water_bill: property.minimum_water_bill,
    occupancy: property.occupancy,
  };
  const initialValues3 = {
    first_name: "",
    landlord_id: JSON.parse(localStorage.myMap)[0][1],
    occupation_or_profession: "",
    last_name: "",
    phone_number: "",
    national_id: "",
    next_of_kin_relationship: "",
    next_of_kin_first_name: "",
    next_of_kin_last_name: "",
    next_of_kin_national_id: "",
    next_of_kin_contacts: ["0711111111 mother"],
    institution_name: "",
    place_of_work: "",
    reason_for_relocating: "",
    previous_residence: "",
    email_address: "",
    rent: "",
  };

  const handleClose = () => {
    setOpen(false);
    setArrearsModal(false);
    setAddTenantModal(false);
    setEditModal(false);
  };
  const handleDelete = () => {
    //Make API call to delete tenant
    fetch(ApiDetails + "pegasus/visionary/tenant/delete", {
      method: "POST",
      body: JSON.stringify({
        ...tenantInfo,
        property_name: property.property_name,
        landlord_email_address: JSON.parse(localStorage.myMap)[5][1],
      }),
    })
      .then(async (response) => {
        if (response.status === 200) {
          getUserDetails2({
            landlord_id: JSON.parse(localStorage.myMap)[0][1],
          });
          // getPropertyDetails();
          props.snackBar({
            text: "Tenant Deleted Successful",
            type: "success",
          });
          handleClose();
          window.location.href = "/propertyList";
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

          tenants = Array.from(
            new Map(JSON.parse(localStorage.portfolioDetails)).get("tenants")
          ).filter((item) => item.property === property.property_name);

          setSearchUpdatedResults(tenants);
          updateCurrentTenants(tenants);
        } else {
          props.snackBar({ text: "Failed Fetching Details", type: "error" });
        }
      })
      .catch((err) => console.log(err));
  };
  const getUserDetails2 = (userDetails) => {
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
        } else {
          props.snackBar({ text: "Failed Fetching Details", type: "error" });
        }
      })
      .catch((err) => console.log(err));
  };
  const searchUser = (e) => {
    if (currentTenants !== null) {
      searchUpdateResults(
        Array.from(currentTenants).filter((item) =>
          (
            item.first_name.toString().toLowerCase() +
            item.last_name.toString().toLowerCase()
          ).includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setSearchResults(
        Array.from(tenants).filter((item) =>
          (
            item.first_name.toString().toLowerCase() +
            item.last_name.toString().toLowerCase()
          ).includes(e.target.value.toLowerCase())
        )
      );
    }
  };
  const addArrears = (values) => {
    //Add arrear to database
    let body = {
      tenant_id: tenantInfo.id,
      description: values.description,
      amount: values.amount,
    };

    fetch(ApiDetails + "pegasus/visionary/tenant/add/arrears", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          getUserDetails({
            landlord_id: JSON.parse(localStorage.myMap)[0][1],
          });
          handleClose();
        } else {
          props.snackBar({
            text: "Something Went Wrong. Try Again Later",
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
  const addTenant = (values) => {
    values.is_student = isStudent;
    values.landlord_email_address = JSON.parse(localStorage.myMap)[5][1];
    values.property_name = JSON.parse(
      localStorage.portfolioDetails
    )[1][1].filter(
      (item) => item.id === addTenantPropertyName
    )[0].property_name;
    values.property_id = addTenantPropertyName;
    values.house_number = selectedUnit;
    values.landlord_id = JSON.parse(localStorage.myMap)[0][1];

    let formData = new FormData();
    //Add values to formData
    //formData.append("details", [detailsMap]);
    formData.append("body", JSON.stringify(values));
    // formData.append("photo_of_national_id", photoOfNationalID);
    // formData.append("copy_of_contract", copyOfContract);
    // formData.append("inventory_checklist", inventoryChecklist);
    // formData.append("tenant_photo", tenantPhoto);
    console.log(values);
    //"proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/tenant/add/tenant", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        let data = new Map(Object.entries(await response.json()));
        if (response.status === 200) {
          getUserDetails({
            landlord_id: JSON.parse(localStorage.myMap)[0][1],
          });
          props.snackBar({
            text: "Tenant Added Successful",
            type: "success",
          });
          handleClose();
        } else if (response.status === 401) {
          props.snackBar({
            text: "Maximum concurrent logins reached",
            type: "warning",
          });
        } else if (response.status === 400) {
          props.snackBar({
            text: "Invalid Credentials Provided.",
            type: "error",
          });
        } else if (response.status === 500) {
          if (
            data
              .get("Message")
              .includes(
                'duplicate key value violates unique constraint "tenants_phone_number'
              )
          ) {
            props.snackBar({
              text: "Tenant With Provided Phone Number Already Exists",
              type: "error",
            });
          } else {
            props.snackBar({
              text: "Something went wrong. Please try again later.",
              type: "error",
            });
          }
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
  const getUnits = () => {
    console.log(propertyID);
    //Make API call
    //"proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/property/getUnits", {
      method: "POST",
      body: JSON.stringify({ property_id: propertyID }),
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          setUnits(data);
          props.snackBar({
            text: "Property Units Retreived Successful",
            type: "success",
          });
        } else if (response.status === 401) {
          props.snackBar({
            text: "Maximum concurrent logins reached",
            type: "warning",
          });
        } else if (response.status === 400) {
          props.snackBar({
            text: "Invalid Credentials Provided.",
            type: "error",
          });
        } else if (response.status === 500) {
          console.log(data);
          console.log(data["Message"]);
          if (data["Message"].includes("duplicate key")) {
            if (data["Message"].includes("owners_email_address_uindex")) {
              props.snackBar({
                text: "Email Address Already Exists",
                type: "error",
              });
              return;
            }
          }
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
  const updateProperty = (values) => {
    let body = {
      ...values,
      water_bill: property.water_bill,
      minimum_water_bill: property.minimum_water_bill,
    };
    fetch(ApiDetails + "pegasus/visionary/property/update", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (response.status === 200) {
          getUserDetails2({
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

  const classes = useStyles();
  const columns = [
    {
      field: "user",
      headerName: "Name",
      width: 150,
      sortOrder: "asc",
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row.first_name} {params.row.last_name}
          </div>
        );
      },
    },
    {
      field: "house_number",
      align: "center",
      headerAlign: "center",
      headerName: "HSE NO",
      width: 100,
    },
    {
      field: "phone_number",
      align: "center",
      headerAlign: "center",
      headerName: "Phone Number",
      width: 180,
    },
    {
      field: "rent",
      headerName: "Rent",
      headerAlign: "center",
      width: 120,
      align: "center",
      renderCell: (params) => {
        return (
          <div className="userListAction">
            {parseInt(
              params.row.rent.toString().replace(",", "")
            ).toLocaleString("en-US", {
              style: "currency",
              currency: "KSH",
            })}
          </div>
        );
      },
    },
    {
      field: "arrears",
      headerName: "Arrears",
      width: 200,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        if (params.row.arrears === 0) {
          return (
            <div
              style={{
                width: "100px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ color: "green" }}>{params.row.arrears}</div>
            </div>
          );
        } else {
          return (
            <div
              style={{
                width: "100px",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <div style={{ color: "red" }}>{params.row.arrears}</div>
            </div>
          );
        }
      },
    },
    {
      field: "details",
      headerName: "Tenant Details",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="userListAction">
            <Button
              onClick={() => {
                //Fetch tenant details
                fetch(
                  ApiDetails + "pegasus/visionary/tenant/get/specific/tenant",
                  {
                    method: "POST",
                    body: JSON.stringify({
                      tenant_id: params.row.tenant_id,
                    }),
                  }
                )
                  .then(async (response) => {
                    let data = await response.json();
                    if (response.status === 200) {
                      //Fetch tenant arrears
                      fetch(
                        ApiDetails +
                          "pegasus/visionary/tenant/get/tenant/arrears",
                        {
                          method: "POST",
                          body: JSON.stringify({
                            tenant_id: params.row.tenant_id,
                          }),
                        }
                      )
                        .then(async (response) => {
                          let arrears = await response.json();
                          if (response.status === 200) {
                            //Fetch tenant transactions
                            fetch(
                              ApiDetails +
                                "pegasus/visionary/tenant/get/tenant/transactions",
                              {
                                method: "POST",
                                body: JSON.stringify({
                                  tenant_id: params.row.tenant_id,
                                }),
                              }
                            )
                              .then(async (response) => {
                                let transactions = await response.json();
                                if (response.status === 200) {
                                  //fetch property units
                                  fetch(
                                    ApiDetails +
                                      "pegasus/visionary/property/getUnits",
                                    {
                                      method: "POST",
                                      body: JSON.stringify({
                                        property_id: data.property_id,
                                      }),
                                    }
                                  )
                                    .then(async (response) => {
                                      let units = await response.json();
                                      if (response.status === 200) {
                                        navigate(
                                          "/tenant/" + params.row.tenant_id,
                                          {
                                            state: {
                                              tenant: data,
                                              arrears: arrears,
                                              transactions: transactions,
                                              propertyUnits: units,
                                            },
                                          }
                                        );
                                      } else if (response.status === 401) {
                                        props.snackBar({
                                          text: "Maximum concurrent logins reached",
                                          type: "warning",
                                        });
                                      } else if (response.status === 400) {
                                        props.snackBar({
                                          text: "Invalid Credentials Provided.",
                                          type: "error",
                                        });
                                      } else if (response.status === 500) {
                                        console.log(data);
                                        console.log(data["Message"]);
                                        if (
                                          data["Message"].includes(
                                            "duplicate key"
                                          )
                                        ) {
                                          if (
                                            data["Message"].includes(
                                              "owners_email_address_uindex"
                                            )
                                          ) {
                                            props.snackBar({
                                              text: "Email Address Already Exists",
                                              type: "error",
                                            });
                                            return;
                                          }
                                        }
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
                //Opens edit modal
                //setOpen(true);
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
      headerName: "Actions",
      width: 200,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="userListAction">
            <DeleteOutline
              className="userListDelete"
              onClick={() => {
                setTenantInfo({
                  tenant_id: params.row.tenant_id,
                  name: params.row.first_name,
                  last_name: params.row.last_name,
                  unit: params.row.house_number,
                  property_id: params.row.property_id,
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
    <div className="property">
      {/*DELETE MODAL*/}
      <Dialog
        open={deleteModal}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ color: "red" }}>
          Delete {tenantDeleteInfo.first_name} {tenantDeleteInfo.last_name}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography>
              Deleting a Tenant will completely remove them and their respective
              documents from the system and render a house vacant.
            </Typography>
            <br />
            <Typography>
              Are you sure you want to delete this tenant ?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span style={{ color: "red" }}>Disagree</span>
          </Button>
          <Button onClick={handleDelete}>
            <span style={{ color: "green" }}>Agree</span>
          </Button>
        </DialogActions>
      </Dialog>
      {/*Arrears MODAL*/}
      <Dialog
        open={arrearsModal}
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
            Add Arrear
          </div>
        </DialogTitle>
        <DialogContent
          style={{
            padding: "10px",
          }}
        >
          <Formik initialValues={initialValues} onSubmit={addArrears}>
            {() => (
              <Form noValidate>
                <Field
                  as={TextField}
                  name="first_name"
                  label="Tenant Name"
                  value={tenantInfo.name + " " + tenantInfo.last_name}
                  variant="outlined"
                  fullwidth
                  required
                  disabled={true}
                  style={{ marginTop: "8px", width: "100%" }}
                />
                <Field
                  as={TextField}
                  name="amount"
                  label="Amount"
                  type="number"
                  fullwidth
                  required
                  variant="outlined"
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    width: "100%",
                  }}
                />
                <Field
                  as={TextareaAutosize}
                  name="description"
                  required
                  fullwidth
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Arrear description ... "
                  style={{ width: "100%" }}
                />
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

      {/*Add Tenant MODAL*/}
      <Dialog
        maxWidth={true}
        open={addTenantModal}
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
            Add Tenant
          </div>
        </DialogTitle>
        <DialogContent
          style={{
            padding: "10px",
          }}
        >
          <Formik
            initialValues={initialValues3}
            // validationSchema={validationSchema}
            onSubmit={addTenant}
          >
            {(props) => (
              <Form noValidate>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Field
                    as={TextField}
                    name="first_name"
                    label="First Name"
                    variant="outlined"
                    error={props.errors.first_name && props.touched.first_name}
                    helperText={<ErrorMessage name="first_name" />}
                    required
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                  <Field
                    as={TextField}
                    name="last_name"
                    label="Last Name"
                    error={props.errors.last_name && props.touched.last_name}
                    helperText={<ErrorMessage name="last_name" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Field
                    as={TextField}
                    name="email_address"
                    label="Email"
                    error={props.errors.email && props.touched.email}
                    helperText={<ErrorMessage name="email" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                  <Field
                    as={TextField}
                    name="phone_number"
                    label="Phone Number"
                    error={
                      props.errors.phoneNumber && props.touched.phoneNumber
                    }
                    helperText={<ErrorMessage name="phoneNumber" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                  <Field
                    as={TextField}
                    name="national_id"
                    label="National ID"
                    type="number"
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignContent: "center",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    required
                    style={{
                      marginTop: "10px",
                      width: "49%",
                    }}
                    label="Property *"
                    name="is_student"
                  >
                    <InputLabel id="demo-simple-select-required-label">
                      Student
                    </InputLabel>
                    <Select
                      name="is_student"
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={isStudent}
                      label="Property *"
                      onChange={(e) => {
                        setIsStudent(e.target.value);
                      }}
                    >
                      <MenuItem value="YES">
                        <em>YES</em>
                      </MenuItem>
                      <MenuItem value="NO">
                        <em>NO</em>
                      </MenuItem>
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                  {isStudent === "YES" ? (
                    <>
                      <Field
                        as={TextField}
                        name="institution_name"
                        label="Institution Name"
                        variant="outlined"
                        error={
                          props.errors.first_name && props.touched.first_name
                        }
                        helperText={<ErrorMessage name="first_name" />}
                        required
                        style={{ marginTop: "10px", width: "49%" }}
                      />
                    </>
                  ) : (
                    <>
                      <Field
                        as={TextField}
                        name="institution_name"
                        label="Institution Name"
                        variant="outlined"
                        disabled={true}
                        error={
                          props.errors.first_name && props.touched.first_name
                        }
                        helperText={<ErrorMessage name="first_name" />}
                        required
                        style={{ marginTop: "10px", width: "49%" }}
                      />
                    </>
                  )}
                  <br />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Field
                    as={TextField}
                    name="occupation_or_profession"
                    label="Occupation"
                    variant="outlined"
                    error={props.errors.first_name && props.touched.first_name}
                    helperText={<ErrorMessage name="first_name" />}
                    required
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                  <Field
                    as={TextField}
                    name="place_of_work"
                    label="Place Of Work"
                    error={props.errors.last_name && props.touched.last_name}
                    helperText={<ErrorMessage name="last_name" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Field
                    as={TextField}
                    name="reason_for_relocating"
                    label="Reason For Relocation"
                    variant="outlined"
                    error={props.errors.first_name && props.touched.first_name}
                    helperText={<ErrorMessage name="first_name" />}
                    required
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                  <Field
                    as={TextField}
                    name="previous_residence"
                    label="Previous Residence"
                    error={props.errors.last_name && props.touched.last_name}
                    helperText={<ErrorMessage name="last_name" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    name="property_name"
                    required
                    style={{
                      marginTop: "10px",
                      width: "32%",
                    }}
                    label="Property *"
                  >
                    <InputLabel id="demo-simple-select-required-label">
                      Select Property
                    </InputLabel>
                    <Select
                      name="property_name"
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      value={addTenantPropertyName}
                      label="Property *"
                      onChange={(e) => {
                        setAddTenantPropertyName(e.target.value);
                        propertyID = e.target.value;
                        setPropertyID(e.target.value);
                        getUnits();
                      }}
                    >
                      <MenuItem value={null}>
                        <em>None</em>
                      </MenuItem>
                      {new Map(JSON.parse(localStorage.portfolioDetails))
                        .get("properties")
                        .map((property, index) => (
                          <MenuItem key={index} value={property.id}>
                            {property.property_name}
                          </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>Required</FormHelperText>
                  </FormControl>
                  <br />

                  {units !== null ? (
                    <>
                      <FormControl
                        name="house_number"
                        size="small"
                        required
                        style={{
                          marginTop: "10px",
                          width: "32%",
                        }}
                        label="Property *"
                      >
                        <InputLabel id="demo-simple-select-required-label">
                          Select House NO
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-required-label"
                          id="demo-simple-select-required"
                          value={selectedUnit}
                          label="Unit *"
                          onChange={(e) => {
                            setSelectedUnit(e.target.value);
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                          {units.map((unit, index) => {
                            let hse = unit.state;
                            if (hse === "OCCUPIED") {
                              return (
                                <MenuItem
                                  key={index}
                                  value={unit.unit}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                  disabled={true}
                                >
                                  <span>{unit.unit}</span>
                                  <small>{unit.state.toLowerCase()}</small>
                                </MenuItem>
                              );
                            } else {
                              return (
                                <MenuItem
                                  key={index}
                                  value={unit.unit}
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <span>{unit.unit}</span>
                                  <small>{unit.state.toLowerCase()}</small>
                                </MenuItem>
                              );
                            }
                          })}
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                      </FormControl>
                      <br />
                    </>
                  ) : (
                    <>
                      <FormControl
                        name="house_number"
                        size="small"
                        required
                        disabled={true}
                        style={{
                          marginTop: "10px",
                          width: "32%",
                        }}
                        label="Property *"
                      >
                        <InputLabel id="demo-simple-select-required-label">
                          Select House NO
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-required-label"
                          id="demo-simple-select-required"
                          value={selectedUnit}
                          label="Unit *"
                          onChange={(e) => {
                            setSelectedUnit(e.target.value);
                          }}
                        >
                          <MenuItem value="">
                            <em>None</em>
                          </MenuItem>
                        </Select>
                        <FormHelperText>Required</FormHelperText>
                      </FormControl>
                      <br />
                    </>
                  )}

                  <Field
                    as={TextField}
                    name="rent"
                    label="Rent"
                    type="number"
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                </div>

                <br />
                <Typography style={{ textAlign: "center" }}>
                  NEXT OF KIN DETAILS
                </Typography>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Field
                    as={TextField}
                    name="next_of_kin_first_name"
                    label="First Name"
                    error={props.errors.first_name && props.touched.first_name}
                    helperText={<ErrorMessage name="first_name" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                  <Field
                    as={TextField}
                    name="next_of_kin_last_name"
                    label="Last Name"
                    error={props.errors.first_name && props.touched.first_name}
                    helperText={<ErrorMessage name="first_name" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                  <Field
                    as={TextField}
                    name="next_of_kin_relationship"
                    label="Relationship"
                    error={props.errors.first_name && props.touched.first_name}
                    helperText={<ErrorMessage name="first_name" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Field
                    as={TextField}
                    name="next_of_kin_contacts"
                    label="Phone Number"
                    error={
                      props.errors.phoneNumber && props.touched.phoneNumber
                    }
                    helperText={<ErrorMessage name="phoneNumber" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                  <Field
                    as={TextField}
                    name="next_of_kin_national_id"
                    label="National ID"
                    type="number"
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                </div>

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

      {/*Edit Property MODAL*/}
      <Dialog
        maxWidth={true}
        open={editModal}
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
            Edit Property
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
            onSubmit={updateProperty}
          >
            {(props) => (
              <Form noValidate>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Field
                    as={TextField}
                    name="property_name"
                    label="Property Name"
                    variant="outlined"
                    error={props.errors.first_name && props.touched.first_name}
                    helperText={<ErrorMessage name="first_name" />}
                    required
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                  <Field
                    as={TextField}
                    name="location"
                    label="Property Location"
                    error={props.errors.last_name && props.touched.last_name}
                    helperText={<ErrorMessage name="last_name" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "49%" }}
                  />
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Field
                    as={TextField}
                    name="minimum_water_bill"
                    label="Min Water Bill"
                    disabled={true}
                    error={props.errors.email && props.touched.email}
                    helperText={<ErrorMessage name="email" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                  <Field
                    as={TextField}
                    name="total_property_units"
                    label="Property Units"
                    disabled={true}
                    error={
                      props.errors.phoneNumber && props.touched.phoneNumber
                    }
                    helperText={<ErrorMessage name="phoneNumber" />}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                  <Field
                    as={TextField}
                    name="occupancy"
                    label="Occupancy"
                    disabled={true}
                    required
                    variant="outlined"
                    style={{ marginTop: "10px", width: "32%" }}
                  />
                </div>

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

      {/*Property details*/}
      <div className="userShow">
        <img
          src={require("../../assets/img1.jpg")}
          alt=""
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "10px",
            object_fit: "cover",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <AccountCircleOutlined
              className="sidebarListItemDetails"
              style={{
                color: "black",
              }}
            />
            {/*<Typography style={{ paddingRight: "20px" }}>Name :</Typography>*/}
            <span
              style={{ fontSize: "15px", marginLeft: "10px" }}
              className="userShowUserTitle"
            >
              {property.property_name}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <LocationOnOutlined
              className="sidebarListItemDetails"
              style={{
                color: "black",
              }}
            />
            {/*<Typography style={{ paddingRight: "20px" }}>Location :</Typography>*/}
            <span
              style={{ fontSize: "15px", marginLeft: "10px" }}
              className="userShowUserTitle"
            >
              {property.location}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <ApartmentOutlined
              className="sidebarListItemDetails"
              style={{
                color: "black",
              }}
            />
            {/*<Typography style={{ paddingRight: "20px" }}>Location :</Typography>*/}

            <span
              style={{ fontSize: "15px", marginLeft: "10px" }}
              className="userShowUserTitle"
            >
              {property.total_property_units} units
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
            }}
          >
            <PercentOutlined
              className="sidebarListItemDetails"
              style={{
                color: "black",
              }}
            />
            {/*<Typography style={{ paddingRight: "20px" }}>Location :</Typography>*/}
            <span
              style={{ fontSize: "15px", marginLeft: "10px" }}
              className="userShowUserTitle"
            >
              {property.occupancy}
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
        >
          {/*<Button onClick={() => {}}>*/}
          {/*  <span style={{ color: "red" }}>Cancel</span>*/}
          {/*</Button>*/}
          <Button
            onClick={() => {
              setEditModal(true);
              console.log("Edit property");
            }}
            variant="outlined"
            component="label"
          >
            EDIT PROPERTY
          </Button>
        </div>
        {/*<div*/}
        {/*  style={{*/}
        {/*    display: "flex",*/}
        {/*    flexDirection: "column",*/}
        {/*    justifyContent: "end",*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <Button*/}
        {/*    onClick={() => {*/}
        {/*      console.log("Download Report");*/}
        {/*    }}*/}
        {/*    variant="outlined"*/}
        {/*    component="label"*/}
        {/*  >*/}
        {/*    Download Report*/}
        {/*  </Button>*/}
        {/*</div>*/}
      </div>

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
            paddingTop: "10px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <TextField
            id="outlined-basic"
            label="Search tenants ... "
            variant="outlined"
            name="firstname"
            onChange={(e) => {
              searchUser(e);
            }}
            style={{ paddingRight: "10px" }}
          />
          <Button
            onClick={(e) => {
              searchUser(e);
            }}
            variant="outlined"
          >
            Search
          </Button>
        </div>
        <Button
          onClick={() => {
            setAddTenantModal(true);
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
          Add Tenant
        </Button>
      </div>

      {/*  Property tenants*/}
      <div
        style={{
          height: "calc(100vh - 318px)",
          marginTop: "10px",
        }}
      >
        {currentTenants === null ? (
          <>
            <DataGrid
              className={classes.root}
              rows={searchResults}
              disableSelectionOnClick
              rowHeight={50}
              // onRowClick={(e) => {
              //   console.log("Row clocked : " + e.id);
              // }}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </>
        ) : (
          <>
            <DataGrid
              className={classes.root}
              rows={searchUpdateResults}
              disableSelectionOnClick
              rowHeight={45}
              // onRowClick={(e) => {
              //   console.log("Row clocked : " + e.id);
              // }}
              columns={columns}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          </>
        )}
      </div>
    </div>
  );
}
