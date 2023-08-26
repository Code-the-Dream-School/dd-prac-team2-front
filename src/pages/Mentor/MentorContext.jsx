import { useState } from "react";
import { Outlet } from "react-router-dom";

const MentorContext = () => {
  const [selectedCohort, setSelectedCohort] = useState();

  return <Outlet context={[selectedCohort, setSelectedCohort]} />;
};

export default MentorContext;
