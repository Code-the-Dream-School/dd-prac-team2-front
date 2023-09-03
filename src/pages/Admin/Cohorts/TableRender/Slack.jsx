import { Avatar } from "@mui/material";
import React from "react";

const Slack = ({ params }) => {
  const isSlack = params.row.slackId === undefined || params.row.slackId === null ? false : true;
  return (
    <>
    {
        isSlack ? (<Avatar
            alt="Slack icon"
            src="/images/slack.png"
            variant="square"
          />) : (<Avatar
            alt="Slack icon"
            src="/images/small-logo.png"
            variant="square"
          />)
    }
    </>
  );
};

export default Slack;
