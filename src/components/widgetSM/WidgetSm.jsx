import React from "react";
import "./widgetSm.css";

export default function WidgetSm() {
  let [tenants, updateTenants] = React.useState(
    Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("tenants")
    )
  );
  const [status, setStatus] = React.useState(localStorage.getItem("isNew"));
  if (status === "no") {
    tenants = Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("tenants")
    );
  }
  console.log(status);
  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Tenants</span>

      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Tenant Name</th>
          <th className="widgetLgTh">Phone</th>
          <th className="widgetLgTh">Date</th>
        </tr>

        {status === "yes" ? (
          <>
            <tr className="widgetLgTr">
              <td className="widgetLgUser">
                <img
                  src={require("../../assets/nathan-dumlao-6dmx8YnkPGo-unsplash.jpg")}
                  alt=""
                  className="widgetLgImg"
                />
                <span className="widgetLgName">Susan Carol</span>
              </td>
              <td className="wigetLgDate">2 June 2021</td>
              <td className="wigetLgAmount">$122.9,</td>
            </tr>
            <tr className="widgetLgTr">
              <td className="widgetLgUser">
                <img
                  src={require("../../assets/nathan-dumlao-6dmx8YnkPGo-unsplash.jpg")}
                  alt=""
                  className="widgetLgImg"
                />
                <span className="widgetLgName">Susan Carol</span>
              </td>
              <td className="wigetLgDate">2 June 2021</td>
              <td className="wigetLgAmount">$122.9,</td>
            </tr>

            <tr className="widgetLgTr">
              <td className="widgetLgUser">
                <img
                  src={require("../../assets/nathan-dumlao-6dmx8YnkPGo-unsplash.jpg")}
                  alt=""
                  className="widgetLgImg"
                />
                <span className="widgetLgName">Susan Carol</span>
              </td>
              <td className="wigetLgDate">2 June 2021</td>
              <td className="wigetLgAmount">$122.9,</td>
            </tr>
            <tr className="widgetLgTr">
              <td className="widgetLgUser">
                <img
                  src={require("../../assets/nathan-dumlao-6dmx8YnkPGo-unsplash.jpg")}
                  alt=""
                  className="widgetLgImg"
                />
                <span className="widgetLgName">Susan Carol</span>
              </td>
              <td className="wigetLgDate">2 June 2021</td>
              <td className="wigetLgAmount">$122.9,</td>
            </tr>
          </>
        ) : (
          <>
            {tenants.map((e, index) => (
              //console.log(e);
              <>
                {index > 4 ? (
                  <></>
                ) : (
                  <tr className="widgetLgTr" key={index}>
                    <td className="widgetLgUser">
                      <span
                        style={{ paddingRight: "5px", fontSize: "15px" }}
                        className="widgetSmUsername"
                      >
                        {e.first_name}
                      </span>
                      <span className="widgetSmUsername"> </span>
                      <span
                        style={{ fontSize: "15px" }}
                        className="widgetSmUserTitle"
                      >
                        {e.last_name}
                      </span>
                    </td>
                    <td style={{ fontSize: "13px" }} className="wigetLgAmount">
                      {e.phone_number}
                    </td>
                    <td style={{ fontSize: "13px" }} className="wigetLgDate">
                      {e.date_created}
                    </td>
                  </tr>
                )}
              </>
            ))}
          </>
        )}
      </table>
    </div>
  );
}
