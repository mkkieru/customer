import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { useNavigate } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useForm } from "react-hook-form";
import "./authentication.css";
import { ApiDetails } from "../../dummyData";

export default function SignupDialog(props) {
  const {
    register,
    formState: { errors },
  } = useForm();

  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();
  const [backdrop, setBackdrop] = React.useState(<></>);

  const onSubmit = (event) => {
    event.preventDefault();
    var body = {
      first_name: document.getElementById("signupFirstName").value,
      last_name: document.getElementById("signupLastName").value,
      email_address: document.getElementById("signupEmail").value,
      password: document.getElementById("signupPassword").value,
      phone_number: document.getElementById("signupMobileNUmber").value,
    };

    if (
      document.getElementById("signupPassword").value ===
      document.getElementById("signupConfirmPassword").value
    ) {
      setBackdrop(
        <div
          style={{
            position: "absolute",
          }}
        >
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={true}
            onClick={null}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </div>
      );
      fetch(ApiDetails + "pegasus/visionary/authorization/createAccount", {
        method: "POST",
        body: JSON.stringify(body),
      })
        .then(async (response) => {
          var data = await response.json();
          // console.log(data);
          if (response.status === 200) {
            setBackdrop(<></>);
            props.snackBar({ text: "Signup Successful", type: "success" });
            const map1 = new Map(Object.entries(data));
            localStorage.myMap = JSON.stringify(Array.from(map1.entries()));
            localStorage.setItem(
              "myMap",
              JSON.stringify(Array.from(map1.entries()))
            );
            getUserDetails({
              landlord_id: JSON.parse(localStorage.myMap)[0][1],
            });
            handleClose();
          } else if (response.status === 400) {
            setBackdrop(<></>);
            props.snackBar({
              text: "User with provided email address already exists.",
              type: "error",
            });
          } else {
            setBackdrop(<></>);
            props.snackBar({
              text: "Signup Failed.",
              type: "error",
            });
          }
        })
        .then((json) => console.log(json))
        .catch((err) => {
          console.log(err);
        });
    } else {
      props.snackBar({
        text: "Passwords do not match.",
        type: "error",
      });
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
        // console.log(response.status);

        if (response.status === 200) {
          const map1 = new Map(Object.entries(data));
          //localStorage.setItem("userDetails",new Map(Object.entries(data)));
          localStorage.portfolioDetails = JSON.stringify(
            Array.from(map1.entries())
          );
          localStorage.setItem(
            "portfolioDetails",
            JSON.stringify(Array.from(map1.entries()))
          );

          // navigate("/home");
          // props.topBar();
          window.location.href = "/propertyList";
          props.snackBar({ text: "Login Successful", type: "success" });

          props.fn();
        } else {
          props.snackBar({ text: "Failed Fetching Details", type: "error" });
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog maxWidth={true} open={open}>
      {/*<DialogContent dividers>*/}
      <div className="Authentication">
        {backdrop}
        <div className="register">
          <div className="col-1-auth">
            <h2>Sign Up</h2>
            <span>register and enjoy the service</span>

            <form id="form" className="flex flex-col" onSubmit={onSubmit}>
              <input
                type="text"
                id="signupFirstName"
                {...register("firstName")}
                placeholder="first name"
              />
              <input
                type="text"
                id="signupLastName"
                {...register("lastName")}
                placeholder="last name"
              />
              <input
                type="email"
                id="signupEmail"
                {...register("email")}
                placeholder="example@gmail.com"
              />
              <input
                type="password"
                id="signupPassword"
                {...register("password")}
                placeholder="password"
              />
              <input
                type="password"
                id="signupConfirmPassword"
                {...register("confirmpwd")}
                placeholder="confirm password"
              />
              <input
                type="number"
                id="signupMobileNUmber"
                {...register("mobile", { required: true, maxLength: 10 })}
                placeholder="mobile number"
              />
              {errors.mobile?.type === "required" &&
                "Mobile Number is required"}
              {errors.mobile?.type === "maxLength" && "Max Length Exceed"}
              <button className="btn">Sign Up</button>
              <span>
                Already have an account? <a href="/">Login </a>
              </span>
            </form>
          </div>
        </div>
      </div>
      {/*</DialogContent>*/}
    </Dialog>
  );
}
