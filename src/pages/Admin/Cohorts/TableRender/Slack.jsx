import { Avatar } from "@mui/material";
import React from "react";

const Slack = ({ params }) => {
  console.log(params.row.slackId);
  const isSlack = params.row.slackId === null ? false : true;
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
