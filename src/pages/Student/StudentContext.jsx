import { useState } from "react";
import { Outlet } from "react-router-dom";

const StudentContext = () => {
  const [selectedCohort, setSelectedCohort] = useState();

  return <Outlet context={[selectedCohort, setSelectedCohort]} />;
};

export default StudentContext;
