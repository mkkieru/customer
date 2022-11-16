import React from "react";
import "./widgetLg.css";
import { Visibility } from "@mui/icons-material";

export default function WidgetLg() {
  const Button = ({ type }) => {
    return <button className={"widgetLgButton " + type}> {type} </button>;
  };
  let [transactions, updateTransactions] = React.useState(
    Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("transactions")
    )
  );
  const [status, setStatus] = React.useState(localStorage.getItem("isNew"));
  if (status === "no") {
    transactions = Array.from(
      new Map(JSON.parse(localStorage.portfolioDetails)).get("transactions")
    );
  }
  return (
    <div className="widgetLg">
      <h3 className="widgetLgTitle">Latest Transactions</h3>
      <table className="widgetLgTable">
        <tr className="widgetLgTr">
          <th className="widgetLgTh">Transaction</th>
          <th className="widgetLgTh">Amount</th>
          <th className="widgetLgTh">Phone</th>
          <th className="widgetLgTh">Date</th>
          {/*<th className="widgetLgTh">Status</th>*/}
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
              <td className="widgetLgStatus">
                <Button type="Approved" />
              </td>
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
              <td className="widgetLgStatus">
                <Button type="Pending" />
              </td>
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
              <td className="widgetLgStatus">
                <Button type="Declined" />
              </td>
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
              <td className="widgetLgStatus">
                <Button type="Approved" />
              </td>
            </tr>
          </>
        ) : (
          <>
            {transactions.map((e, index) => (
              <>
                {index > 4 ? (
                  <></>
                ) : (
                  <tr className="widgetLgTr" key={index}>
                    <td className="widgetLgUser">
                      <span
                        style={{ fontSize: "15px" }}
                        className="widgetLgName"
                      >
                        {e.transaction_id}
                      </span>
                    </td>
                    <td style={{ fontSize: "13px" }} className="wigetLgAmount">
                      {e.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "KSH",
                      })}
                    </td>
                    <td style={{ fontSize: "13px" }} className="wigetLgAmount">
                      {e.phone_number}
                    </td>
                    <td style={{ fontSize: "13px" }} className="wigetLgDate">
                      {e.date_created}
                    </td>

                    {/*<td className="widgetLgStatus">*/}
                    {/*  <Button type="Approved" />*/}
                    {/*</td>*/}
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
