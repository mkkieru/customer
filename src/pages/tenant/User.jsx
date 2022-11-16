import React, { useState } from "react";
import "./user.css";
import { DeleteOutline, PaidOutlined } from "@mui/icons-material";
import { useLocation } from "react-router-dom";
import { InputLabel, TextField, Typography } from "@material-ui/core";
import Button from "@mui/material/Button";
import { DataGrid } from "@mui/x-data-grid";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import { ErrorMessage, Field, Form, Formik } from "formik";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  TextareaAutosize,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";
import Slide from "@mui/material/Slide";
import {
  AccountCircleOutlined,
  AddOutlined,
  AttachFileOutlined,
  BusinessOutlined,
  HomeOutlined,
  LocalPhoneOutlined,
} from "@material-ui/icons";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
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

export default function User(props) {
  let { state } = useLocation();
  let { tenant, arrears, transactions, propertyUnits } = state;
  //const { tenant, transactions } = state;

  const [dateFrom, setDateFrom] = React.useState(new Date());

  let [tenantDetails, setTenantDetails] = useState(null);
  let [tenantArrears, setTenantArrears] = useState(null);

  //Modal states
  const [arrearsModal, setArrearsModal] = useState(false);
  const [editTenantModal, setEditTenantModal] = useState(false);
  const [reportModal, setReportModal] = useState(false);
  // console.log("transactions : " + Object.entries(transactions));

  let transactionsAmount = 0;

  transactions.map((transaction) => {
    transactionsAmount += parseInt(transaction.amount);
  });

  //Units State
  const [units] = React.useState(propertyUnits);
  const [selectedUnit, setSelectedUnit] = React.useState(tenant.house_number);

  const [isStudent, setIsStudent] = React.useState(tenant.is_student);

  const [addTenantPropertyName, setAddTenantPropertyName] = React.useState(
    <MenuItem value="">
      <em>
        {new Map(
          Object.entries(
            Array.from(
              new Map(JSON.parse(localStorage.portfolioDetails)).get(
                "properties"
              )
            ).filter((item) => item.id === tenant.property_id)[0]
          )
        ).get("property_name")}
      </em>
    </MenuItem>
  );
  let [propertyID, setPropertyID] = React.useState(tenant.property_id);
  let initialValues = {
    id: "",
    first_name: "",
    description: "",
    amount: "",
  };

  let initialValues2;
  if (tenantDetails === null) {
    initialValues2 = {
      first_name: tenant.first_name,
      house_number: tenant.house_number,
      occupation_or_profession: tenant.occupation_or_profession,
      last_name: tenant.last_name,
      phone_number: tenant.phone_number,
      national_id: tenant.national_id,
      next_of_kin_relationship: tenant.next_of_kin_relationship,
      next_of_kin_first_name: tenant.next_of_kin_first_name,
      next_of_kin_last_name: tenant.next_of_kin_last_name,
      next_of_kin_national_id: tenant.next_of_kin_national_id,
      next_of_kin_contacts: tenant.next_of_kin_contacts,
      is_student: tenant.is_student,
      institution_name: tenant.institution_name,
      place_of_work: tenant.place_of_work,
      reason_for_relocating: tenant.reason_for_relocating,
      previous_residence: tenant.previous_residence,
      email_address: tenant.email_address,
      landlord_email_address: "",
      onboarding_secret: "SECRET",
      property_name: tenant.property_name,
      rent: tenant.rent,
    };
  } else {
    initialValues2 = {
      first_name: tenantDetails.first_name,
      house_number: tenantDetails.house_number,
      occupation_or_profession: tenantDetails.occupation_or_profession,
      last_name: tenantDetails.last_name,
      phone_number: tenantDetails.phone_number,
      national_id: tenantDetails.national_id,
      next_of_kin_relationship: tenantDetails.next_of_kin_relationship,
      next_of_kin_first_name: tenantDetails.next_of_kin_first_name,
      next_of_kin_last_name: tenantDetails.next_of_kin_last_name,
      next_of_kin_national_id: tenantDetails.next_of_kin_national_id,
      next_of_kin_contacts: tenantDetails.next_of_kin_contacts,
      is_student: tenantDetails.is_student,
      institution_name: tenantDetails.institution_name,
      place_of_work: tenantDetails.place_of_work,
      reason_for_relocating: tenantDetails.reason_for_relocating,
      previous_residence: tenantDetails.previous_residence,
      email_address: tenantDetails.email_address,
      landlord_email_address: "",
      onboarding_secret: "SECRET",
      property_name: tenantDetails.property_name,
      rent: tenantDetails.rent,
    };
  }

  const handleClose = () => {
    setArrearsModal(false);
    setEditTenantModal(false);
    setReportModal(false);
  };

  const [tenantPhoto, setTenantPhoto] = useState("");
  const [photoOfNationalID, setPhotoOfNationalID] = useState("");
  const [copyOfContract, setCopyOfContract] = useState("");
  const [inventoryChecklist, setInventoryChecklist] = useState("");

  function handleFile1(e) {
    setTenantPhoto(e.target.files[0]);
  }
  function handleFile2(e) {
    setPhotoOfNationalID(e.target.files[0]);
  }
  function handleFile3(e) {
    setCopyOfContract(e.target.files[0]);
  }
  function handleFile4(e) {
    setInventoryChecklist(e.target.files[0]);
  }

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
  const download = (file) => {
    //Download File

    const blob = base64ToBlob(file);
    const blobURL = URL.createObjectURL(blob);
    const link = document.createElement("a");
    //link.setAttribute('target', '_blank');
    link.setAttribute(
      "download",
      tenant.first_name +
        `_Tenant_Report_For_The_Year_` +
        dateFrom.getFullYear().toString()
    );
    link.href = blobURL;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
          let map2 = new Map(
            Object.entries(
              Array.from(
                new Map(JSON.parse(localStorage.portfolioDetails)).get(
                  "tenants"
                )
              ).filter((item) => item.tenant_id === tenant.tenant_id)
            )
          ).get("0");
          setTenantDetails(map2);
        } else {
          props.snackBar({ text: "Failed Fetching Details", type: "error" });
        }
      })
      .catch((err) => console.log(err));
  };
  const addArrears = (values) => {
    //Add arrear to database
    let body = {
      tenant_id: tenant.tenant_id,
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
          getArrears();
          handleClose();
          props.snackBar({ text: "Arrear Added Successful", type: "success" });
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
  const deleteArrears = (id) => {
    //Add arrear to database
    let body = {
      tenant_id: tenant.tenant_id,
      id: id,
    };

    fetch(ApiDetails + "pegasus/visionary/tenant/delete/arrears", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        if (response.status === 200) {
          getUserDetails({
            landlord_id: JSON.parse(localStorage.myMap)[0][1],
          });
          getArrears();
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
  const getArrears = () => {
    fetch(ApiDetails + "pegasus/visionary/tenant/get/tenant/arrears", {
      method: "POST",
      body: JSON.stringify({
        tenant_id: tenant.tenant_id,
      }),
    })
      .then(async (response) => {
        let arrears = await response.json();
        if (response.status === 200) {
          setTenantArrears(arrears);
          props.snackBar({
            text: "Arrears updated successfully",
            type: "success",
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
  };
  const updateTenant = (values) => {
    let formData = new FormData();
    //Add values to formData
    formData.append(
      "details",
      JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        national_id: values.national_id,
        email_address: values.email_address,
        phone_number: values.phone_number,
        occupation_or_profession: values.occupation_or_profession,
        next_of_kin_relationship: values.next_of_kin_relationship,
        next_of_kin_first_name: values.next_of_kin_first_name,
        next_of_kin_last_name: values.next_of_kin_last_name,
        next_of_kin_national_id: values.next_of_kin_national_id,
        next_of_kin_contacts: values.next_of_kin_contacts,
        is_student: values.is_student,
        institution_name: values.institution_name,
        place_of_work: values.place_of_work,
        reason_for_relocating: values.reason_for_relocating,
        previous_residence: values.previous_residence,
        rent: values.rent,
        landlord_id: JSON.parse(localStorage.myMap)[0][1],
        tenant_id: tenant.tenant_id,
      })
    );
    if (photoOfNationalID === "") {
      props.snackBar({
        text: "Please select Photo Of National ID",
        type: "error",
      });
      return;
    }
    if (copyOfContract === "") {
      props.snackBar({
        text: "Please select Copy Of Tenant Contract",
        type: "error",
      });
      return;
    }

    formData.append("photo_of_national_id", photoOfNationalID);
    formData.append("copy_of_contract", copyOfContract);
    formData.append("inventory_checklist", inventoryChecklist);
    formData.append("tenant_photo", tenantPhoto);

    //Make API call
    //"proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/tenant/update/tenant", {
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
            text: "Details Updated Successful",
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

  const getReport = () => {
    console.log(dateFrom.getFullYear().toString());
    handleClose();
    // return;
    let data = {
      tenant_id: tenant.tenant_id,
      year: dateFrom.getFullYear().toString(),
    };

    //Make API call
    //"proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/reports/get/tenant/report", {
      method: "POST",
      body: JSON.stringify(data),
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          download(new Map(Object.entries(data)).get("File"));
          props.snackBar({
            text: "Report Generated Successful",
            type: "success",
          });
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

  // getUnits();

  const classes = useStyles();
  const arrearsColumn = [
    {
      field: "description",
      headerName: "Description",
      width: 180,
      sortOrder: "asc",
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser">
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
    },
    {
      field: "action",
      headerName: "",
      width: 50,
      headerAlign: "center",
      renderCell: (params) => {
        return (
          <div className="userListAction">
            <DeleteOutline
              className="userListDelete"
              onClick={() => {
                //open confirm delete modal
                //Delete arrear
                deleteArrears(params.row.id);
              }}
            />
          </div>
        );
      },
    },
  ];
  const columns = [
    {
      field: "id",
      headerName: "Transaction ID",
      width: 150,
      sortOrder: "asc",
    },
    {
      field: "transaction_message",
      headerName: "Description",
      width: 200,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            {params.row.amount.toLocaleString("en-US", {
              style: "currency",
              currency: "KSH",
            })}
          </div>
        );
      },
    },
    { field: "date_created", align: "center", headerName: "Date", width: 200 },
  ];

  return (
    <div className="user">
      {/*Arrears MODAL*/}
      <Dialog
        open={reportModal}
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
            Tenant Report
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
                <InputLabel> Generate Report For Which Year ?</InputLabel>
                <br />
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    disableFuture
                    id="outlined-basic"
                    variant="outlined"
                    label="Year"
                    openTo="year"
                    views={["year"]}
                    value={dateFrom}
                    onChange={(newValue) => {
                      setDateFrom(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} />}
                  />
                </LocalizationProvider>
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
                  <Button
                    onClick={() => {
                      getReport();
                    }}
                  >
                    <span style={{ color: "green" }}>Submit</span>
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </DialogContent>
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
                {tenantDetails === null ? (
                  <Field
                    as={TextField}
                    name="first_name"
                    label="Tenant Name"
                    value={tenant.first_name + " " + tenant.last_name}
                    variant="outlined"
                    fullWidth
                    required
                    disabled={true}
                    style={{ marginTop: "8px", width: "100%" }}
                  />
                ) : (
                  <Field
                    as={TextField}
                    name="first_name"
                    label="Tenant Name"
                    value={
                      tenantDetails.first_name + " " + tenantDetails.last_name
                    }
                    variant="outlined"
                    fullWidth
                    required
                    disabled={true}
                    style={{ marginTop: "8px", width: "100%" }}
                  />
                )}
                <Field
                  as={TextField}
                  name="amount"
                  label="Amount"
                  type="number"
                  fullWidth
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
      {/*Edit Tenant MODAL*/}
      <Dialog
        maxWidth={true}
        open={editTenantModal}
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
            Edit Tenant
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
            onSubmit={updateTenant}
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
                    required
                    style={{
                      marginTop: "10px",
                      width: "32%",
                    }}
                    label="Property *"
                    defaultValue={addTenantPropertyName}
                    disabled={true}
                  >
                    <InputLabel id="demo-simple-select-required-label">
                      Select Property
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-required-label"
                      id="demo-simple-select-required"
                      label="Property *"
                      value={addTenantPropertyName}
                      onChange={(e) => {
                        setAddTenantPropertyName(e.target.value);
                        propertyID = e.target.value;
                        setPropertyID(e.target.value);
                        // getUnits();
                      }}
                    >
                      <MenuItem value="">
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
                  </FormControl>
                  <br />

                  <>
                    <FormControl
                      size="small"
                      required
                      style={{
                        marginTop: "10px",
                        width: "32%",
                      }}
                      label="Property *"
                      disabled={true}
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
                    </FormControl>
                    <br />
                  </>

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
                <Typography style={{ textAlign: "center" }}>
                  TENANT FILES
                </Typography>
                <br />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      width: "49%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Photo Of National ID *</span>
                    <Button variant="outlined" component="label">
                      Upload File
                      <input
                        type="file"
                        onChange={(e) => handleFile2(e)}
                        hidden
                      />
                    </Button>
                  </span>
                  <span
                    style={{
                      width: "49%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Tenant Photo</span>
                    <Button variant="outlined" component="label">
                      Upload File
                      <input
                        type="file"
                        onChange={(e) => handleFile1(e)}
                        hidden
                      />
                    </Button>
                  </span>
                </div>
                <br />
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <span
                    style={{
                      width: "49%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Copy Of Contract *</span>
                    <Button variant="outlined" component="label">
                      Upload File
                      <input
                        type="file"
                        onChange={(e) => handleFile3(e)}
                        hidden
                      />
                    </Button>
                  </span>
                  <span
                    style={{
                      width: "49%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>Inventory Checklist</span>
                    <Button variant="outlined" component="label">
                      Upload File
                      <input
                        type="file"
                        onChange={(e) => handleFile4(e)}
                        hidden
                      />
                    </Button>
                  </span>
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

      {/*Tenant details*/}
      <div className="userShow">
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
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
        </div>
        {tenantDetails === null ? (
          <>
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
                  {tenant.first_name} {"  "} {tenant.last_name}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocalPhoneOutlined
                  className="sidebarListItemDetails"
                  style={{
                    color: "black",
                  }}
                />
                <span
                  style={{ fontSize: "15px", marginLeft: "10px" }}
                  className="userShowUserTitle"
                >
                  {tenant.phone_number}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BusinessOutlined
                  className="sidebarListItemDetails"
                  style={{
                    color: "black",
                  }}
                />
                {/*<Typography style={{ paddingRight: "20px" }}>Unit :</Typography>*/}
                <span
                  style={{ fontSize: "15px", marginLeft: "10px" }}
                  className="userShowUserTitle"
                >
                  {new Map(
                    Object.entries(
                      Array.from(
                        new Map(JSON.parse(localStorage.portfolioDetails)).get(
                          "properties"
                        )
                      ).filter((item) => item.id === tenant.property_id)[0]
                    )
                  ).get("property_name")}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HomeOutlined
                  className="sidebarListItemDetails"
                  style={{
                    color: "black",
                  }}
                />
                {/*<Typography style={{ paddingRight: "20px" }}>Unit :</Typography>*/}
                <span
                  style={{ fontSize: "15px", marginLeft: "10px" }}
                  className="userShowUserTitle"
                >
                  {tenant.house_number}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PaidOutlined
                  className="sidebarListItemDetails"
                  style={{
                    color: "black",
                  }}
                />
                {/*<Typography style={{ paddingRight: "20px" }}>Rent :</Typography>*/}
                <span
                  style={{ fontSize: "15px", marginLeft: "10px" }}
                  className="userShowUserTitle"
                >
                  {parseInt(tenant.rent).toLocaleString("en-US", {
                    style: "currency",
                    currency: "KSH",
                  })}
                </span>
              </div>
            </div>
          </>
        ) : (
          <>
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
                  {tenantDetails.first_name} {"  "} {tenantDetails.last_name}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <LocalPhoneOutlined
                  className="sidebarListItemDetails"
                  style={{
                    color: "black",
                  }}
                />
                <span
                  style={{ fontSize: "15px", marginLeft: "10px" }}
                  className="userShowUserTitle"
                >
                  {tenantDetails.phone_number}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <BusinessOutlined
                  className="sidebarListItemDetails"
                  style={{
                    color: "black",
                  }}
                />
                {/*<Typography style={{ paddingRight: "20px" }}>Unit :</Typography>*/}
                <span
                  style={{ fontSize: "15px", marginLeft: "10px" }}
                  className="userShowUserTitle"
                >
                  {new Map(
                    Object.entries(
                      Array.from(
                        new Map(JSON.parse(localStorage.portfolioDetails)).get(
                          "properties"
                        )
                      ).filter((item) => item.id === tenant.property_id)[0]
                    )
                  ).get("property_name")}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <HomeOutlined
                  className="sidebarListItemDetails"
                  style={{
                    color: "black",
                  }}
                />
                {/*<Typography style={{ paddingRight: "20px" }}>Unit :</Typography>*/}
                <span
                  style={{ fontSize: "15px", marginLeft: "10px" }}
                  className="userShowUserTitle"
                >
                  {tenantDetails.house_number}
                </span>
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <PaidOutlined
                  className="sidebarListItemDetails"
                  style={{
                    color: "black",
                  }}
                />
                {/*<Typography style={{ paddingRight: "20px" }}>Rent :</Typography>*/}
                <span
                  style={{ fontSize: "15px", marginLeft: "10px" }}
                  className="userShowUserTitle"
                >
                  {parseInt(tenantDetails.rent).toLocaleString("en-US", {
                    style: "currency",
                    currency: "KSH",
                  })}
                </span>
              </div>
            </div>
          </>
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
        >
          <Button
            onClick={() => {
              setEditTenantModal(true);
            }}
            variant="outlined"
            component="label"
          >
            EDIT TENANT DETAILS
          </Button>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "end",
          }}
        >
          <Button
            onClick={() => {
              setReportModal(true);
            }}
            variant="outlined"
            component="label"
          >
            DOWNLOAD REPORT
          </Button>
        </div>
      </div>

      {/* Tenant arrears and transactions */}
      <div
        style={{
          height: "calc(100vh - 420px)",
          marginTop: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            marginRight: "10px",
            flex: 1,
            flexDirection: "column",
          }}
        >
          <div className="tableInfo">
            <div className="tableInfoTitle">Arrears</div>
            <small
              style={{
                width: "40%",
              }}
            >
              {tenantDetails === null ? (
                <>
                  {tenant.arrears === 0 ? (
                    <div
                      style={{
                        color: "green",
                      }}
                    >
                      {tenant.arrears.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KSH",
                      })}
                    </div>
                  ) : (
                    <div style={{ color: "red" }}>
                      {tenant.arrears.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KSH",
                      })}
                    </div>
                  )}
                </>
              ) : (
                <>
                  {tenantDetails.arrears === 0 ? (
                    <div
                      style={{
                        color: "green",
                      }}
                    >
                      {tenantDetails.arrears.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KSH",
                      })}
                    </div>
                  ) : (
                    <div style={{ color: "red" }}>
                      {tenantDetails.arrears.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KSH",
                      })}
                    </div>
                  )}
                </>
              )}
            </small>
            <AddOutlined
              style={{
                color: "red",
              }}
              onClick={() => {
                setArrearsModal(true);
              }}
            />
          </div>
          {tenantArrears === null ? (
            <DataGrid
              className={classes.root}
              rows={arrears}
              disableSelectionOnClick
              rowHeight={45}
              columns={arrearsColumn}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          ) : (
            <DataGrid
              className={classes.root}
              rows={tenantArrears}
              disableSelectionOnClick
              rowHeight={45}
              columns={arrearsColumn}
              pageSize={10}
              rowsPerPageOptions={[10]}
            />
          )}
        </div>
        {/*<div*/}
        {/*  style={{*/}
        {/*    flex: 1,*/}
        {/*  }}*/}
        {/*>*/}
        {/*  <div className="tableInfo">*/}
        {/*    <div className="tableInfoTitle">Transactions</div>*/}
        {/*    <small*/}
        {/*      style={{*/}
        {/*        width: "40%",*/}
        {/*        color: "green",*/}
        {/*      }}*/}
        {/*    >*/}
        {/*      {transactionsAmount.toLocaleString("en-US", {*/}
        {/*        style: "currency",*/}
        {/*        currency: "KSH",*/}
        {/*      })}*/}
        {/*    </small>*/}
        {/*  </div>*/}
        {/*  <DataGrid*/}
        {/*    className={classes.root}*/}
        {/*    rows={transactions}*/}
        {/*    disableSelectionOnClick*/}
        {/*    rowHeight={45}*/}
        {/*    // onRowClick={(e) => {*/}
        {/*    //   console.log("Row clocked : " + e.id);*/}
        {/*    // }}*/}
        {/*    columns={columns}*/}
        {/*    pageSize={10}*/}
        {/*    rowsPerPageOptions={[10]}*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </div>
  );
}
