import { Avatar } from "@mui/material";
import React from "react";

const Slack = ({ params }) => {
  const isSlack = typeof params.row.slackId === "string" ? true : false;
  return (
    <>
    {
        isSlack ? (<Avatar
            alt="Slack icon"
            src="/images/slack.png"
          />) : (<Avatar
            alt="Slack icon"
            src="/images/small-logo.png"
          />)
    }
    </>
  );
};

export default Slack;
