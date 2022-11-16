import React from "react";
import HomePageProperties from "../../components/homepageProperties/homePageProperties";
import FeaturedInfo from "../../components/featuredInfo/FeaturedInfo";
import "./home.css";
import WidgetSm from "../../components/widgetSM/WidgetSm";
import WidgetLg from "../../components/widgetLG/WidgetLg";
import OnboardingStepOne from "../../components/customDialogs/onboardingDialog";
import Snackbar from "@mui/material/Snackbar";
import Stack from "@mui/material/Stack";
import MuiAlert from "@mui/material/Alert";
import { loginState } from "../../dummyData";

export default function Home(props) {
  //const navigate = useNavigate();

  const [open, setOpen] = React.useState(loginState);

  const [message, setMessage] = React.useState("");

  const [severity, setSeverity] = React.useState();

  const handleClick = (message) => {
    setMessage(message.text);
    setSeverity(message.type);
    setOpen(true);
  };

  const viewTopBarClick = () => {
    props.topBar();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const [status] = React.useState(localStorage.getItem("isNew"));
  let map;
  try {
    map = new Map(JSON.parse(localStorage.myMap));
  } catch (e) {}

  const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  return (
    <>
      {status === "yes" ? (
        <>
          <div className="home">
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity={severity}
                  sx={{ width: "100%" }}
                >
                  {message}
                </Alert>
              </Snackbar>
            </Stack>
            <OnboardingStepOne
              details={map}
              snackBar={(message) => handleClick(message)}
              topBar={() => viewTopBarClick()}
            />
          </div>
        </>
      ) : (
        <>
          <div className="home">
            <Stack spacing={2} sx={{ width: "100%" }}>
              <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
              >
                <Alert
                  onClose={handleClose}
                  severity={severity}
                  sx={{ width: "100%" }}
                >
                  {message}
                </Alert>
              </Snackbar>
            </Stack>
            {/*{status === "yes" ? (*/}
            {/*  <OnboardingStepOne*/}
            {/*    details={map}*/}
            {/*    snackBar={(message) => handleClick(message)}*/}
            {/*  />*/}
            {/*) : null}*/}
            <FeaturedInfo />
            <HomePageProperties />
            <div className="homeWidgets">
              <WidgetSm />
              <WidgetLg />
            </div>
          </div>
        </>
      )}
    </>
  );
}
