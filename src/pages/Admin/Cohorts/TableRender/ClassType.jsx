import { Avatar } from "@mui/material";
import React from "react";

const ClassType = ({ params }) => {
  const classType = params.row.class;
  return (
    <>
      {classType === "Intro to programming" ? (
        <Avatar alt={classType} src="/images/html.png" />
      ) : classType === "React.js" ? (
        <Avatar alt={classType} src="/images/react.png" />
      ) : classType === "Node.js/Express" ? (
        <Avatar alt={classType} src="/images/nodejs.png" />
      ) : (
        <Avatar alt={classType} src="/images/ruby.png" variant="square" />
      )}
    </>
  );
};

export default ClassType;
