import React from "react";
import "./featuredInfo.css";
import { ArrowDownward, ArrowUpwardOutlined } from "@mui/icons-material";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { Button } from "@material-ui/core";
import { ArrowDownwardOutlined } from "@material-ui/icons";

function LinearProgressWithLabel(
  props: LinearProgressProps & { value: number }
) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress
          sx={{ height: "20px" }}
          style={{
            color: "green ",
          }}
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

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function FeaturedInfo() {
  const [state, setStatus] = React.useState(localStorage.getItem("isNew"));

  return (
    <>
      {state === "yes" ? (
        <div className="featured">
          <div className="featuredTop">
            <div className="featuredItem">
              <Link className="linkItem" to={"/"}>
                <span className="featuredTitle">Portfolio value</span>
                <div className="featuredMoneyContainer">
                  <span className="featuredMoney">KSH 10000000</span>
                </div>
                <div className="featuredSub">By market standards</div>
              </Link>
            </div>
            <div className="featuredItem">
              <Link className="linkItem" to={"/"}>
                <span className="featuredTitle">Asset Return</span>
                <div className="featuredMoneyContainer">
                  <span className="featuredMoney">$2,234</span>
                  <span className="featuredMoneyRate">
                    -11.4
                    <ArrowDownward className="featuredIcon negative" />
                  </span>
                </div>
                <div className="featuredSub">Compared to last month</div>
              </Link>
            </div>
            <div className="featuredItem">
              <Link className="linkItem" to={"/"}>
                <span className="featuredTitle">Income</span>
                <div className="featuredMoneyContainer">
                  <span className="featuredMoney">$2,234</span>
                  <span className="featuredMoneyRate">
                    +1.4
                    <ArrowUpwardOutlined className="featuredIcon" />
                  </span>
                </div>
              </Link>
              <div className="featuredSub">
                KSH 10000000
                <small> Expected</small>
              </div>
            </div>
            <div className="featuredItem">
              <Link className="linkItem" to={"/"}>
                <span className="featuredTitle">Occupancy</span>
                <div className="featuredMoneyContainer">
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel value={80} />
                  </Box>
                  {/* <span className="featuredMoney">$2,234</span>
                <span className="featuredMoneyRate">
                    +1.4
                    <ArrowUpwardOutlined  className= 'featuredIcon'/>
                </span> */}
                </div>
              </Link>
            </div>
          </div>

          <div className="featuredBottom">
            <div className="featuredItem">
              <span className="featuredTitle">Total Debt</span>
              <div className="featuredMoneyContainer">
                <span className="featuredMoney">KSH 10000000</span>
              </div>
            </div>
            <div className="featuredItem">
              <Link className="linkItem" to={"/propertyList"}>
                <span className="featuredTitle">Properties</span>
                <div className="featuredMoneyContainer">
                  <span className="featuredMoney">3</span>
                </div>
              </Link>
            </div>
            <div className="featuredItem">
              <Link className="linkItem" to={"/"}>
                <span className="featuredTitle">Units</span>
                <div className="featuredMoneyContainer">
                  <span className="featuredMoney">4</span>
                </div>
                <div className="featuredSub">All properties</div>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="featured">
          <div className="featuredTop">
            <div
              className="featuredItem"
              style={{ backgroundColor: "rgb(170,250,170)" }}
            >
              <span className="featuredTitle">Portfolio value</span>
              <div className="featuredMoneyContainer">
                <HtmlTooltip
                  title={
                    <React.Fragment>
                      <em>{"Total properties value"}</em>
                    </React.Fragment>
                  }
                >
                  <span className="featuredMoney">
                    {new Map(JSON.parse(localStorage.portfolioDetails))
                      .get("portfolioValue")
                      .toLocaleString("en-US", {
                        style: "currency",
                        currency: "KSH",
                      })}
                  </span>
                </HtmlTooltip>
                {/*<span className="featuredMoneyRate">*/}
                {/*  -11.4*/}
                {/*  <ArrowDownward className="featuredIcon negative" />*/}
                {/*</span>*/}
              </div>
              <div className="featuredSub">By market standards</div>
            </div>
            <div className="featuredItem">
              <Link className="linkItem" to={"/"}>
                <span className="featuredTitle">Asset Return</span>
                <div className="featuredMoneyContainer">
                  <span className="featuredMoney">$2,234</span>
                  <span className="featuredMoneyRate">
                    -11.4
                    <ArrowDownward className="featuredIcon negative" />
                  </span>
                </div>
                <div className="featuredSub">Compared to last month</div>
              </Link>
            </div>

            {new Map(JSON.parse(localStorage.portfolioDetails)).get(
              "expectedIncome"
            ) >
            new Map(JSON.parse(localStorage.portfolioDetails)).get(
              "receivedMoney"
            ) ? (
              <div
                className="featuredItem"
                style={{ backgroundColor: "rgb(250,170,170)" }}
              >
                <Link className="linkItem" to={"/transactions"}>
                  <span className="featuredTitle">Income</span>
                  <div className="featuredMoneyContainer">
                    <div style={{ display: "flex" }}>
                      {" "}
                      <span className="featuredMoney">
                        {new Map(JSON.parse(localStorage.portfolioDetails))
                          .get("receivedMoney")
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "KSH",
                          })}
                      </span>
                      {/*Positive Span*/}
                      <span className="featuredMoneyRate">
                        -1.4
                        <ArrowDownwardOutlined className="featuredIcon" />
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="featuredSub" style={{ color: "black" }}>
                  {new Map(JSON.parse(localStorage.portfolioDetails))
                    .get("expectedIncome")
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "KSH",
                    })}
                  <small> Expected</small>
                </div>
              </div>
            ) : (
              <div
                className="featuredItem"
                style={{ backgroundColor: "rgb(170,250,170)" }}
              >
                <Link className="linkItem" to={"/transactions"}>
                  <span className="featuredTitle">Income</span>
                  <div className="featuredMoneyContainer">
                    <div style={{ display: "flex" }}>
                      {" "}
                      <span className="featuredMoney">
                        {new Map(JSON.parse(localStorage.portfolioDetails))
                          .get("receivedMoney")
                          .toLocaleString("en-US", {
                            style: "currency",
                            currency: "KSH",
                          })}
                      </span>
                      {/*Positive Span*/}
                      <span className="featuredMoneyRate">
                        +1.4
                        <ArrowUpwardOutlined className="featuredIcon" />
                      </span>
                    </div>
                  </div>
                </Link>
                <div className="featuredSub" style={{ color: "black" }}>
                  {new Map(JSON.parse(localStorage.portfolioDetails))
                    .get("expectedIncome")
                    .toLocaleString("en-US", {
                      style: "currency",
                      currency: "KSH",
                    })}
                  <small> Expected</small>
                </div>
              </div>
            )}

            <div className="featuredItem">
              <Link className="linkItem" to={"/"}>
                <span className="featuredTitle">Occupancy</span>
                <div className="featuredMoneyContainer">
                  <Box sx={{ width: "100%" }}>
                    <LinearProgressWithLabel
                      value={new Map(
                        JSON.parse(localStorage.portfolioDetails)
                      ).get("occupancy")}
                    />
                  </Box>
                </div>
              </Link>
            </div>
          </div>

          <div className="featuredBottom">
            {new Map(JSON.parse(localStorage.portfolioDetails)).get("debt") >
            0 ? (
              <>
                <div
                  className="featuredItem"
                  style={{ backgroundColor: "rgb(250,170,170)" }}
                >
                  <span className="featuredTitle">Total Debt</span>
                  <div className="featuredMoneyContainer">
                    <span className="featuredMoney">
                      {new Map(JSON.parse(localStorage.portfolioDetails))
                        .get("debt")
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "KSH",
                        })}
                    </span>
                  </div>

                  <div className="featuredSub">Properties' Debt</div>
                </div>
              </>
            ) : (
              <>
                <div
                  className="featuredItem"
                  style={{ backgroundColor: "rgb(170,250,170)" }}
                >
                  <span className="featuredTitle">Total Debt</span>
                  <div className="featuredMoneyContainer">
                    <span className="featuredMoney">
                      {new Map(JSON.parse(localStorage.portfolioDetails))
                        .get("debt")
                        .toLocaleString("en-US", {
                          style: "currency",
                          currency: "KSH",
                        })}
                    </span>
                  </div>
                  <div className="featuredSub">No Property Debt Found</div>
                </div>
              </>
            )}
            <div className="featuredItem">
              <Link className="linkItem" to={"/propertyList"}>
                <span className="featuredTitle">Properties</span>
                <div className="featuredMoneyContainer">
                  <span className="featuredMoney">
                    {new Map(JSON.parse(localStorage.portfolioDetails)).get(
                      "number_of_properties"
                    )}
                  </span>
                </div>
              </Link>
            </div>

            <div className="featuredItem">
              <span className="featuredTitle">Units</span>
              <div className="featuredMoneyContainer">
                <span className="featuredMoney">
                  {new Map(JSON.parse(localStorage.portfolioDetails)).get(
                    "number_of_units"
                  )}
                </span>
              </div>
              <div className="featuredSub">All properties</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
