import React, { useState } from "react";
import { Grid, Paper, Button, Typography } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { ApiDetails } from "../../dummyData";

const DownloadFiles = (props) => {
  let data;
  let noOfProperties;
  let details = props.details;
  const [generate, setGenerate] = useState(false);
  const [inputs, setInputs] = useState(<div></div>);
  const [linkSet, setLinkSet] = useState(false);
  const [file, setFile] = useState("");
  const [showTitle, setShowTitle] = useState(true);
  const [hide, setHide] = useState(false);
  const [searchHistory] = useState(new Map());

  const btnStyle = { marginTop: 10 };
  // const phoneRegExp = /^[2-9]{2}[0-9]{8}/;
  // const passwordRegExp =
  //   /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  const initialValues = {
    name: "",
  };
  const validationSchema = Yup.object().shape({
    name: Yup.string().min(1, "Name not valid").required("Required"),
  });

  const handleChange = (prop) => (event) => {
    searchHistory.set(event.target.name, event.target.value);
  };

  const next = () => {
    props.next();
  };

  //Generates input fields
  const onSubmit = (values, props) => {
    //alert(JSON.stringify(values), null, 2);
    noOfProperties = parseInt(values.name);
    setInputs(
      [...Array(noOfProperties)].map((elementInArray, index) => (
        <div key={index}>
          <br />
          <TextField
            required
            id="outlined-basic"
            label={"property " + (index + 1) + " name"}
            name={"property" + (index + 1)}
            type={"text"}
            variant="outlined"
            //name={"property" + (index+1)}
            onChange={handleChange("property" + (index + 1))}
          />
          <br />
          {/*<a href='/home/damark/Desktop/Personal Files/PEGASUS PROJECT/WEB_APP/React_Form_Hook_Registration_Form/README.md' download>Click to download</a>*/}
        </div>
      ))
    );
    setGenerate(true);
    setShowTitle(false);
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

    //Move to next page here
    // eslint-disable-next-line no-unused-expressions
    next();
  };

  const getDownloadLink = (values, props) => {
    searchHistory.set("email_address", details.get("email_address"));
    console.log(searchHistory);
    if (download) {
      console.log("........ Getting downloads ..........");
      fetch(ApiDetails + "pegasus/visionary/files/download", {
        method: "POST",
        body: JSON.stringify(Object.fromEntries(searchHistory)),
      })
        .then(async (response) => {
          console.log(".... Making API call ..... ");
          data = await response.json();
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

  return (
    <Grid>
      <Paper elevation={0} style={{ max_width: "none !important" }}>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(props) => (
            <Form noValidate>
              {showTitle ? (
                <>
                  <lablel>How many properties do you own?</lablel>

                  <Field
                    as={TextField}
                    name="name"
                    label="1,2,3 ... "
                    fullwidth
                    style={{ width: "100%" }}
                    error={props.errors.name && props.touched.name}
                    helperText={<ErrorMessage name="name" />}
                    required
                  />
                </>
              ) : (
                <></>
              )}

              {hide ? (
                <></>
              ) : (
                <>
                  {generate ? (
                    <>
                      <div>
                        <lablel>Enter the property names </lablel>

                        {inputs}
                      </div>

                      <Button
                        style={btnStyle}
                        variant="contained"
                        color="primary"
                        onClick={getDownloadLink}
                      >
                        Submit
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        type="submit"
                        style={btnStyle}
                        variant="contained"
                        color="primary"
                      >
                        Submit
                      </Button>
                    </>
                  )}
                </>
              )}

              {linkSet ? (
                <>
                  <p>
                    Please download and fill in the excel document below as
                    accurately as possible. The first sheet represents an
                    example of what is expected of you. Each excel sheet
                    represents one of your properties and is named
                    appropriately. Make sure to fill for all units even if the
                    unit is vacant.
                  </p>

                  <br />
                  <br />
                  <Typography variant="caption">Click to download</Typography>

                  <br />

                  <Button
                    style={btnStyle}
                    variant="contained"
                    color="primary"
                    onClick={download}
                  >
                    DOWNLOAD
                  </Button>
                </>
              ) : (
                <></>
              )}
            </Form>
          )}
        </Formik>
      </Paper>
    </Grid>
  );
};

export default DownloadFiles;
