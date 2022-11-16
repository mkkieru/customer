import React from "react";
import "./App.css";
import { loginState } from "./dummyData";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import UserList from "./pages/tenantList/UserList";
import Topbar from "./components/topbar/Topbar";
import Sidebar from "./components/sidebar/Sidebar";
import User from "./pages/tenant/User";
import Property from "./pages/property/Property";
import PropertyList from "./pages/propertyList/PropertyList";
import CreateUser from "./pages/createUser/CreateUser";
import Stack from "@mui/material/Stack";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import Details from "./pages/details/Details";
import CustomizedDialogs from "./components/dialog/DialogTemplate";
import LoginDialog from "./components/authentication/LoginDialog";
import SignupDialog from "./components/authentication/SignupDialog";
import Transactions from "./pages/transactions/transactions";
import Events from "./pages/events/Events";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function App() {
  const [open, setOpen] = React.useState(loginState);

  const [message, setMessage] = React.useState("");

  const [severity, setSeverity] = React.useState();

  const [isLoggedIn, setLogin] = React.useState(false);

  const [viewTopBar, updateViewTopBar] = React.useState(true);

  const changeLogin = () => {
    setLogin(true);
    //updateViewTopBar(true);
  };

  const logout = () => {
    setLogin(false);
    localStorage.clear();
  };

  const handleClick = (message) => {
    setMessage(message.text);
    setSeverity(message.type);
    setOpen(true);
  };

  const viewTopBarClick = () => {
    console.log("view topbar");
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  return (
    <div>
      <Stack spacing={2} sx={{ width: "100%" }}>
        <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={severity}
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </Stack>

      <div className="App">
        <div className="container">
          <Router>
            <Sidebar loginState={isLoggedIn} fn={() => logout()} />
            <div
              style={{ flex: 4, width: "100wh", backgroundColor: "whitesmoke" }}
            >
              {viewTopBar ? <Topbar loginState={isLoggedIn} /> : <></>}
              <Routes>
                <Route
                  path="/"
                  element={
                    <CustomizedDialogs>
                      <LoginDialog
                        snackBar={(message) => handleClick(message)}
                        fn={() => changeLogin()}
                        topBar={() => viewTopBarClick()}
                      />
                    </CustomizedDialogs>
                  }
                />
                <Route
                  path="/tenantList"
                  element={
                    <UserList
                      loginState={isLoggedIn}
                      snackBar={(message) => handleClick(message)}
                    />
                  }
                />
                <Route
                  path="/propertyList"
                  element={
                    <PropertyList
                      snackBar={(message) => handleClick(message)}
                      loginState={isLoggedIn}
                    />
                  }
                />
                <Route
                  path="/transactions"
                  element={
                    <Transactions
                      snackBar={(message) => handleClick(message)}
                      loginState={isLoggedIn}
                    />
                  }
                />
                <Route
                  path="/events"
                  element={
                    <Events
                      loginState={isLoggedIn}
                      topBar={() => changeLogin()}
                      snackBar={(message) => handleClick(message)}
                    />
                  }
                />
                <Route
                  path="/signup"
                  element={
                    // <Signup snackBar={(message) => handleClick(message)} />
                    <CustomizedDialogs>
                      <SignupDialog
                        snackBar={(message) => handleClick(message)}
                        fn={() => changeLogin()}
                        topBar={() => viewTopBarClick()}
                      />
                    </CustomizedDialogs>
                  }
                />
                <Route
                  path="/tenant/:userId"
                  element={
                    <User
                      loginState={isLoggedIn}
                      snackBar={(message) => handleClick(message)}
                    />
                  }
                />
                <Route
                  path="/property/:propertyId"
                  element={
                    <Property
                      loginState={isLoggedIn}
                      snackBar={(message) => handleClick(message)}
                    />
                  }
                />
                <Route
                  path="/user/create"
                  element={<CreateUser loginState={isLoggedIn} />}
                />
                <Route
                  path="/home"
                  element={
                    <Home
                      loginState={isLoggedIn}
                      topBar={() => changeLogin()}
                    />
                  }
                />
                <Route
                  path="/details"
                  element={<Details loginState={isLoggedIn} />}
                />
              </Routes>
            </div>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
