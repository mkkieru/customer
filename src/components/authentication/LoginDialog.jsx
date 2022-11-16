import React from "react";
import Dialog from "@material-ui/core/Dialog";
import { useNavigate } from "react-router-dom";
import "./authentication.css";
import { ApiDetails } from "../../dummyData";

export default function LoginDialog(props) {
  const [open, setOpen] = React.useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    var body = {
      password: document.getElementById("login_password").value,
      email_address: document.getElementById("login_email").value,
    };

    // "proxy":"http://0.0.0.0:8080/pegasus/visionary",
    fetch(ApiDetails + "pegasus/visionary/authorization/login", {
      method: "POST",
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        let data = await response.json();
        if (response.status === 200) {
          handleClose();
          props.snackBar({ text: "Login Successful", type: "success" });
          props.fn();

          const map1 = new Map(Object.entries(data));
          //localStorage.setItem("userDetails",new Map(Object.entries(data)));
          localStorage.myMap = JSON.stringify(Array.from(map1.entries()));

          // var map = new Map(JSON.parse(localStorage.myMap));
          // //console.log(localStorage.getItem("userDetails"))
          // console.log(map)
          localStorage.setItem("isNew", data.new);

          // navigate("/home", { state: { status: temp } });

          getUserDetails(data);

          // navigate(`/home`);
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

  localStorage.clear();
  return (
    <Dialog maxWidth={true} open={open}>
      {/*<DialogContent dividers>*/}
      <div className="Authentication">
        <div className="register">
          <div className="col-1-auth">
            <h2>Log In</h2>
            <span>Welcome back!</span>

            <form id="form" className="flex flex-col">
              <input
                type="email"
                id="login_email"
                // {...register("email")}
                placeholder="example@gmail.com"
              />
              <input
                type="password"
                id="login_password"
                // {...register("password")}
                placeholder="password"
              />
              <button
                className="btn"
                onClick={(event) => {
                  onSubmit(event);
                }}
              >
                Log In
              </button>
              <span>
                Don't have an account? <a href="/signup">Signup </a>
              </span>
            </form>
          </div>
        </div>
      </div>
      {/*</DialogContent>*/}
    </Dialog>
  );
}
