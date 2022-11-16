import React, { useState } from "react";
import { Grid, Paper, Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ApiDetails } from "../../dummyData";

const RegistrationForm = (props) => {
  const [tenantContractTemplate, setContract] = useState();
  const [caretakerContractTemplate, setCaretakerContract] = useState();
  const [propertyInventory, setProperty] = useState();

  function handleFile1(e) {
    setContract(e.target.files[0]);
  }
  function handleFile2(e) {
    setCaretakerContract(e.target.files[0]);
  }
  function handleFile3(e) {
    setProperty(e.target.files[0]);
  }

  const phoneRegExp = /^[2-9]{2}[0-9]{8}/;
  const passwordRegExp =
    /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const initialValues = {
    first_name: props.details.get("first_name"),
    last_name: props.details.get("last_name"),
    email: props.details.get("email_address"),
    phoneNumber: props.details.get("phone_number"),
    password: "",
    // confirmPassword: "",
  };
  const validationSchema = Yup.object().shape({
    first_name: Yup.string().min(3, "It's too short").required("Required"),
    last_name: Yup.string().min(3, "It's too short").required("Required"),
    email: Yup.string().email("Enter valid email").required("Required"),
    // phoneNumber: Yup.number().typeError("Enter valid Phone number").required("Required"),
    phoneNumber: Yup.string()
      .matches(phoneRegExp, "Enter valid Phone number")
      .required("Required"),
    password: Yup.string()
      .min(8, "Minimum characters should be 8")
      .matches(
        passwordRegExp,
        "Password must have one upper, lower case, number, special symbol"
      )
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Password not matches")
      .required("Required"),
  });
  const onSubmit = (values) => {
    let formData = new FormData();
    //Add values to formData
    //formData.append("details", [detailsMap]);
    formData.append(
      "details",
      JSON.stringify({
        first_name: values.first_name,
        last_name: values.last_name,
        phone_number: values.phoneNumber,
        password: values.password,
        email_address: values.email,
        landlord_id: props.details.get("landlord_id"),
      })
    );
    //formData.append("details", JSON.stringify(details));
    formData.append("inventory_checklist_template", propertyInventory);
    formData.append("tenant_contract_template", tenantContractTemplate);
    formData.append("caretaker_contract_template", caretakerContractTemplate);

    //Make API call
    //"proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/authorization/update", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          props.snackBar({
            text: "Details Updated Successful",
            type: "success",
          });

          props.next();
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

    //updateValues

    //props.resetForm();
  };

  return (
    <Grid align="center">
      <Paper elevation={10}>
        <Grid align="center">
          <br />

          <h3>FINISH UP CREATING YOUR ACCOUNT </h3>
          <br />
          {/*<Typography variant="caption">
            Complete setting up your account
          </Typography>*/}
        </Grid>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form noValidate>
              <Field
                as={TextField}
                name="first_name"
                label="First Name"
                variant="outlined"
                error={props.errors.first_name && props.touched.first_name}
                helperText={<ErrorMessage name="first_name" />}
                required
                style={{ width: "500px", marginTop: "5px" }}
              />
              <Field
                as={TextField}
                name="last_name"
                label="Last Name"
                error={props.errors.last_name && props.touched.last_name}
                helperText={<ErrorMessage name="last_name" />}
                required
                variant="outlined"
                style={{ width: "500px", marginTop: "5px" }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "500px",
                  marginTop: "8px",
                }}
              >
                <Field
                  as={TextField}
                  name="email"
                  label="Email"
                  error={props.errors.email && props.touched.email}
                  helperText={<ErrorMessage name="email" />}
                  required
                  variant="outlined"
                  style={{ width: "243px" }}
                />
                <Field
                  as={TextField}
                  name="phoneNumber"
                  label="Phone Number"
                  error={props.errors.phoneNumber && props.touched.phoneNumber}
                  helperText={<ErrorMessage name="phoneNumber" />}
                  required
                  variant="outlined"
                  style={{ width: "243px" }}
                />
              </div>
              <Field
                as={TextField}
                name="password"
                label="Password"
                type="password"
                error={props.errors.password && props.touched.password}
                helperText={<ErrorMessage name="password" />}
                required
                variant="outlined"
                style={{ width: "500px", marginTop: "5px" }}
              />
              <Field
                as={TextField}
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                error={
                  props.errors.confirmPassword && props.touched.confirmPassword
                }
                helperText={<ErrorMessage name="confirmPassword" />}
                required
                variant="outlined"
                style={{ width: "500px", marginTop: "8px" }}
              />
              <br />
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "500px",
                }}
              >
                <span>TENANT CONTRACT TEMPLATE</span>
                <Button variant="outlined" component="label">
                  Upload File
                  <input onChange={(e) => handleFile1(e)} type="file" hidden />
                </Button>
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "500px",
                }}
              >
                <span>CARETAKER CONTRACT TEMPLATE</span>
                <Button variant="outlined" component="label">
                  Upload File
                  <input onChange={(e) => handleFile2(e)} type="file" hidden />
                </Button>
              </div>
              <br />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "500px",
                }}
              >
                <span>PROPERTY UNIT'S INVENTORY TEMPLATE</span>
                <Button variant="outlined" component="label">
                  Upload File
                  <input onChange={(e) => handleFile3(e)} type="file" hidden />
                </Button>
              </div>
              <br />
              <Button
                variant="outlined"
                type="submit"
                style={{
                  marginBottom: "5px",
                }}
              >
                <span style={{ color: "blue" }}>Submit</span>
              </Button>
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};

export default RegistrationForm;
