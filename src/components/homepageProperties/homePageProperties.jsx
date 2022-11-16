import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import React from "react";
import "./chart.css";
import { Link } from "react-router-dom";
import {
  Edit,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
} from "@mui/icons-material";
import CircularProgress from "@mui/material/CircularProgress";
// import { LineChart, Line, XAxis , CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import { TextField } from "@material-ui/core";
import { ApiDetails } from "../../dummyData";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          sx={{ height: "20px" }}
          variant="determinate"
          {...props}
        />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

export default function HomePageProperties() {
  const navigate = useNavigate();

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

  const [status, setStatus] = React.useState(localStorage.getItem("isNew"));

  let [properties, updateProperties] = React.useState(
    Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("properties")
    )
  );
  if (status === "no") {
    properties = Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("properties")
    );
  }

  return (
    <div className="chart">
      <h3 className="chartTitle">Properties</h3>

      <div className="media-scroller snaps-inline">
        <table className="widgetLgTable">
          <thead className="widgetLgTr">
            <th className="widgetLgTh">Name</th>
            <th className="widgetLgTh">Location</th>
            <th className="widgetLgTh">Units</th>
            <th className="widgetLgTh">Occupancy</th>
          </thead>

          {status === "yes" ? (
            <>
              <tr
                className="widgetLgTr"
                onClick={() => changePage("/property/4")}
              >
                <td className="widgetLgUser">
                  <img
                    src={require("../../assets/nathan-dumlao-6dmx8YnkPGo-unsplash.jpg")}
                    alt=""
                    className="widgetLgImg"
                  />
                  <span className="widgetLgName">Toll Estate</span>
                </td>
                <td className="wigetLgDate">Central | Ruiru</td>
                <td className="wigetLgAmount">2</td>
                <td className="widgetLgStatus">
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={100} />
                  </Box>
                </td>
              </tr>
            </>
          ) : (
            <>
              {properties.map((e, index) => (
                //console.log(e.property_id);
                <tr
                  key={index}
                  className="widgetLgTr"
                  onClick={() => {
                    changePage(e.id);
                  }}
                >
                  <td className="widgetLgUser">
                    <img
                      src={require("../../assets/nathan-dumlao-6dmx8YnkPGo-unsplash.jpg")}
                      alt=""
                      className="widgetLgImg"
                    />
                    <span className="widgetLgName">{e.property_name}</span>
                  </td>
                  {e.location === "" ? (
                    <td className="wigetLgDate">
                      <small>Not Set</small>
                    </td>
                  ) : (
                    <td className="wigetLgDate">{e.location}</td>
                  )}

                  <td className="wigetLgAmount">{e.total_property_units}</td>
                  <td className="widgetLgStatus">
                    <Box sx={{ width: "100%" }}>
                      <LinearProgressWithLabel
                        value={parseInt(e.occupancy.replace("%", "").trim())}
                      />
                    </Box>
                  </td>
                </tr>
              ))}
            </>
          )}
        </table>
      </div>
    </div>
  );
}

// export default function HomePageProperties({title,data,dataKey,grid}) {
//   return (
//     <div className="homepageProperties">
//         <h3 className="chartTitle">{title}s</h3>
//         <ResponsiveContainer width="100%" aspect={4 / 1}>
//             <LineChart data = {data}>
//                 <XAxis dataKey="name" stroke='#5550bd'/>
//                 <Line type="monotone" dataKey={dataKey}  stroke='#5550bd'/>
//                 <Tooltip/>
//                 {grid && <CartesianGrid stroke='#e0dfdf' strokeDasharray="5 5"/>}
//             </LineChart>
//         </ResponsiveContainer>
//     </div>
//   )
// }

{
  /* <div className="media-scroller snaps-inline">
        <div className="media-element">
          <div className="propertyDetails">
            <div className="propertyimgName">
              <img
                src={require("../../assets/img1.jpg")}
                alt=""
                className="propertyImg"
              />
              <div className="propertyName">Witeithie</div>
            </div>
            <div className="showPropertyDetails">
              <span className="userShowTitle">Caretaker</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">Mike </span>
              </div>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">+254 712292899</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">mkieru55@gmail.com</span>
              </div>
              <div className="userShowInfo">
                <LocationSearching className="userShowIcon" />
                <span className="userShowInfoTitle">Nairobi , Kenya</span>
              </div>
            </div>


            <div
              style={{
                // do your styles depending on your needs.
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
                <CircularProgressWithLabel
                value={79}
                />

            </div>

            <div
               style={{
                // do your styles depending on your needs.
                display: "flex",
                flexDirection:"column",
                justifyContent: "space-between",
                alignItems: "center",
                height:"100%"
              }}
            >
                <div className="dummyText"></div>
              <button className="editPropertyIcon">
                <Edit className="editPropertyIcn" />
              </button>

            </div>
          </div>
        </div>
        <div className="media-element">
          <div className="propertyDetails">
            <div className="propertyimgName">
              <img
                src={require("../../assets/img1.jpg")}
                alt=""
                className="propertyImg"
              />
              <div className="propertyName">Witeithie</div>
            </div>
            <div className="showPropertyDetails">
              <span className="userShowTitle">Caretaker</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">Mike </span>
              </div>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">+254 712292899</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">mkieru55@gmail.com</span>
              </div>
              <div className="userShowInfo">
                <LocationSearching className="userShowIcon" />
                <span className="userShowInfoTitle">Nairobi , Kenya</span>
              </div>
            </div>


            <div
              style={{
                // do your styles depending on your needs.
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                <CircularProgressWithLabel
                value={79}
                />

            </div>

            <button className="editPropertyIcon">
              <Edit className="editPropertyIcn" />
            </button>
          </div>
        </div>
        <div className="media-element">
          <div className="propertyDetails">
            <div className="propertyimgName">
              <img
                src={require("../../assets/img1.jpg")}
                alt=""
                className="propertyImg"
              />
              <div className="propertyName">Witeithie</div>
            </div>
            <div className="showPropertyDetails">
              <span className="userShowTitle">Caretaker</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">Mike </span>
              </div>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">+254 712292899</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">mkieru55@gmail.com</span>
              </div>
              <div className="userShowInfo">
                <LocationSearching className="userShowIcon" />
                <span className="userShowInfoTitle">Nairobi , Kenya</span>
              </div>
            </div>


            <div
              style={{
                // do your styles depending on your needs.
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                <CircularProgressWithLabel
                value={79}
                />

            </div>

            <button className="editPropertyIcon">
              <Edit className="editPropertyIcn" />
            </button>
          </div>
        </div>
         <div className="media-element">
          <div className="propertyDetails">
            <div className="propertyimgName">
              <img
                src={require("../../assets/img1.jpg")}
                alt=""
                className="propertyImg"
              />
              <div className="propertyName">Witeithie</div>
            </div>
            <div className="showPropertyDetails">
              <span className="userShowTitle">Caretaker</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">Mike </span>
              </div>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">+254 712292899</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">mkieru55@gmail.com</span>
              </div>
              <div className="userShowInfo">
                <LocationSearching className="userShowIcon" />
                <span className="userShowInfoTitle">Nairobi , Kenya</span>
              </div>
            </div>


            <div
              style={{
                // do your styles depending on your needs.
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                <CircularProgressWithLabel
                value={79}
                />

            </div>

            <button className="editPropertyIcon">
              <Edit className="editPropertyIcn" />
            </button>
          </div>
        </div>
        <div className="media-element">
          <div className="propertyDetails">
            <div className="propertyimgName">
              <img
                src={require("../../assets/img1.jpg")}
                alt=""
                className="propertyImg"
              />
              <div className="propertyName">Witeithie</div>
            </div>
            <div className="showPropertyDetails">
              <span className="userShowTitle">Caretaker</span>
              <div className="userShowInfo">
                <PermIdentity className="userShowIcon" />
                <span className="userShowInfoTitle">Mike </span>
              </div>
              <div className="userShowInfo">
                <PhoneAndroid className="userShowIcon" />
                <span className="userShowInfoTitle">+254 712292899</span>
              </div>
              <div className="userShowInfo">
                <MailOutline className="userShowIcon" />
                <span className="userShowInfoTitle">mkieru55@gmail.com</span>
              </div>
              <div className="userShowInfo">
                <LocationSearching className="userShowIcon" />
                <span className="userShowInfoTitle">Nairobi , Kenya</span>
              </div>
            </div>


            <div
              style={{
                // do your styles depending on your needs.
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
                <CircularProgressWithLabel
                value={79}
                />

            </div>

            <button className="editPropertyIcon">
              <Edit className="editPropertyIcn" />
            </button>
          </div>
        </div>

      </div> */
}
