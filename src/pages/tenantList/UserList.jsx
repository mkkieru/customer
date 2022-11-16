import "./userList.css";
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
import {
  Autocomplete,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { InputLabel, TextField } from "@material-ui/core";
import { Add, DeleteOutline } from "@mui/icons-material";
// import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { ApiDetails } from "../../dummyData";

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

export default function UserList(props) {
  //Navigator
  const navigate = useNavigate();

  //Modal states
  const [deleteModal, setOpen] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [arrearsModal, setArrearsModal] = useState(false);
  const [addTenantModal, setAddTenantModal] = useState(false);

  //Units State
  const [units, setUnits] = React.useState(null);
  const [selectedUnit, setSelectedUnit] = React.useState(null);

  const [isStudent, setIsStudent] = React.useState("NO");

  const [tenantName] = React.useState();
  let [tenantInfo, setTenantInfo] = React.useState({
    tenant_id: "",
    name: "",
    last_name: "",
    unit: "",
    property_id: "",
  });
  const [propertyName, setPropertyName] = React.useState(null);

  const [addTenantPropertyName, setAddTenantPropertyName] = React.useState("");
  let [propertyID, setPropertyID] = React.useState(null);

  let initialValues = {
    id: "",
    first_name: "",
    description: "",
    amount: "",
  };
  const initialValues2 = {
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

  const classes = useStyles();

  let [tenants, updateTenants] = React.useState(
    Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("tenants")
    )
  );

  const [searchResults, setSearchResults] = useState(tenants);

  const handleClose = () => {
    setAddTenantModal(false);
    setArrearsModal(false);
    setEditModal(false);
    setOpen(false);
  };
  const handleDelete = () => {
    //Make API call to delete tenant
    console.log(tenantInfo);
    fetch(ApiDetails + "pegasus/visionary/tenant/delete", {
      method: "POST",
      body: JSON.stringify(tenantInfo),
    })
      .then(async (response) => {
        if (response.status === 200) {
          getUserDetails2({
            landlord_id: JSON.parse(localStorage.myMap)[0][1],
          });
          props.snackBar({
            text: "Tenant Deleted Successful",
            type: "success",
          });
          handleClose();
          window.location.href = "/tenantList";
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

  const searchUser = (e) => {
    if (propertyName === null) {
      setSearchResults(
        Array.from(tenants).filter((item) =>
          (
            item.first_name.toString().toLowerCase() +
            item.last_name.toString().toLowerCase()
          ).includes(e.target.value.toLowerCase())
        )
      );
    } else if (propertyName !== null) {
      setSearchResults(
        Array.from(tenants).filter((item) => {
          if (
            (
              item.first_name.toString().toLowerCase() +
              item.last_name.toString().toLowerCase()
            )
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
  const searchProperty = (e) => {
    if (e === null) {
      setPropertyName(null);
      setSearchResults(Array.from(tenants));
    } else {
      setPropertyName(e);
      setSearchResults(
        Array.from(tenants).filter((item) =>
          item.property.toLowerCase().includes(e.toLowerCase())
        )
      );
    }
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

          updateTenants(
            Array.from(
              new Map(JSON.parse(localStorage.portfolioDetails)).get("tenants")
            )
          );
          tenants = Array.from(
            new Map(JSON.parse(localStorage.portfolioDetails)).get("tenants")
          );
          setSearchResults(tenants);

          props.snackBar({ text: "Arrear Added Successful", type: "success" });
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

    let formData = new FormData();
    //Add values to formData
    //formData.append("details", [detailsMap]);
    formData.append("body", JSON.stringify(values));
    // formData.append("photo_of_national_id", photoOfNationalID);
    // formData.append("copy_of_contract", copyOfContract);
    // formData.append("inventory_checklist", inventoryChecklist);
    // formData.append("tenant_photo", tenantPhoto);

    //"proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/tenant/add/tenant", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        let data = await response.json();
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
            new Map(Object.entries(data))
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
      headerName: "Delete",
      width: 150,
      headerAlign: "center",
      align: "center",
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
    <>
      {/*DELETE MODAL*/}
      <Dialog
        open={deleteModal}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle style={{ color: "red" }}>
          Delete {tenantInfo.name + " " + tenantInfo.last_name}
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

      {/*EDIT MODAL*/}
      <Dialog
        open={editModal}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Edit {tenantName} </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            <Typography>Edit user ...</Typography>
            <Typography>{/*tenant details*/}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            <span style={{ color: "red" }}>Cancel</span>
          </Button>
          <Button onClick={handleClose}>
            <span style={{ color: "green" }}>Submit</span>
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
            {(props) => (
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
            initialValues={initialValues2}
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

      <div className="userList">
        <div
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={new Map(JSON.parse(localStorage.portfolioDetails))
              .get("properties")
              .map((property, index) => {
                return property.property_name;
              })}
            style={{ width: 300, padding: "10px 10px" }}
            onChange={(e, value) => {
              searchProperty(value);
            }}
            renderInput={(params) => (
              <TextField
                id="outlined-basic"
                label="Filter Properties ... "
                variant="outlined"
                name="property"
                {...params}
              />
            )}
          />
          <div
            style={{
              padding: "10px 10px",
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
            onClick={(e) => {
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
              marginRight: "10px",
            }}
          >
            Add Tenant
          </Button>
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
