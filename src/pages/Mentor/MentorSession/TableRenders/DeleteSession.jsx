import AppButton from "../../../../components/Button/AppButton";

function DeleteSession({ id }) {
  const handleDelete = () => {
    // send a delete request with the session Id
  };
  return (
    <AppButton
      text="Remove"
      type="button"
      handlerFunction={handleDelete}
    ></AppButton>
  );
}

export default DeleteSession;
