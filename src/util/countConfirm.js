const confirmStudentCount = (session) => {
  const confirmed = session.participant.reduce((count, participant) => {
    return participant.user.userStatus === "confirm" ||
      participant.user.userStatus === "Confirm"
      ? count + 1
      : count;
  }, 0);
  return confirmed;
};

export default confirmStudentCount;
