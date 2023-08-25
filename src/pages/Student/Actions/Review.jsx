import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Typography,
} from "@mui/material";
import { Close, SchoolRounded, EditRounded } from "@mui/icons-material";
import React, { forwardRef, useState, useEffect } from "react";
import AppButton from "../../../components/Button/AppButton";
import FormTextField from "../../../components/TextField/FormTextField";
import AuthFormControl from "../../../components/FormControl/AuthFormControl";
import styles from "../Student.module.css";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

const Review = ({ sessionId }) => {
  const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });
  const axiosPrivate = useAxiosPrivate();
  const [review, setReview] = useState();
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [reset, setReset] = useState(false);
  const [formError, setFormError] = useState({
    reviewError: {
      error: false,
      errorMessage: "Please enter a valid review",
    },
  });
  const handleOpenEditCohort = () => {
    setOpenEditDialog(true);
  };

  const handleCloseEditCohort = () => {
    setOpenEditDialog(false);
  };
  const handleReviewError = (inputError) => {
    setFormError((prevState) => ({
      ...prevState,
      reviewError: {
        ...prevState.reviewError,
        error: inputError,
      },
    }));
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    const { data } = await axiosPrivate.post("/session/review", {
      content: e.target.review.value.trim(),
      sessionId: sessionId,
    });
    console.log(data);
    setReview("");
  };
  return (
    <>
      <AppButton
        text={"Write Review"}
        type="button"
        width="100%"
        color="#F3950D"
        handlerFunction={() => {
          handleOpenEditCohort();
        }}
      >
        <EditRounded></EditRounded>
      </AppButton>

      {openEditDialog ? (
        <Dialog
          open={openEditDialog}
          TransitionComponent={Transition}
          onClose={handleCloseEditCohort}
          fullWidth
          maxWidth="sm"
        >
          <DialogTitle
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
            gap={"5px"}
            component={"div"}
          >
            <Typography
              variant="h1"
              textAlign={"center"}
              fontSize={"30px"}
              fontWeight={"bold"}
            >
              Review{" "}
            </Typography>
            <AppButton
              text={""}
              type="button"
              width="10%"
              handlerFunction={() => {
                handleCloseEditCohort();
              }}
            >
              <Close></Close>
            </AppButton>
          </DialogTitle>
          <Box
            component={"form"}
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              color: "#C84B31",
            }}
            autoComplete="off"
            onSubmit={handleReviewSubmit}
          >
            <DialogContent
              sx={{ width: "100%", paddingX: 0, paddingY: 1 }}
              dividers
            >
              <div className={styles.formContainer}>
                <AuthFormControl width="75%">
                  <SchoolRounded fontSize="large"></SchoolRounded>
                  <FormTextField
                    required
                    value={review}
                    type="text"
                    label="Review:"
                    name="review"
                    isFocused={true}
                    width="100%"
                    variant="dark"
                    onHandleError={handleReviewError}
                    errorMessage={"Please enter a valid review"}
                    reset={reset}
                  ></FormTextField>
                </AuthFormControl>
              </div>
            </DialogContent>
            <DialogActions sx={{ display: "flex", justifyContent: "center" }}>
              <AppButton
                text={"Submit review"}
                type="submit"
                width="100%"
                handlerFunction={() => {}}
              />
            </DialogActions>
          </Box>
        </Dialog>
      ) : null}
    </>
  );
};

export default Review;