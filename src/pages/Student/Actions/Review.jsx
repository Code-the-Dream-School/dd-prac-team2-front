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
import TextArea from "../../../components/TextField/TextArea";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const Review = ({ sessionId }) => {
  const axiosPrivate = useAxiosPrivate();
  const [review, setReview] = useState();
  const [openDialog, setOpenDialog] = useState(false);
  const [reset, setReset] = useState(false);
  const [formError, setFormError] = useState({
    reviewError: {
      error: false,
      errorMessage: "Please enter a valid review",
    },
  });
  const handleOpenReview = () => {
    setOpenDialog(true);
  };

  const handleCloseReview = () => {
    setOpenDialog(false);
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
    handleCloseReview();
  };
  return (
    <>
      <AppButton
        text={"Write a Review"}
        type="button"
        width="100%"
        color="#0F3460"
        handlerFunction={() => {
          handleOpenReview();
        }}
      >
        <EditRounded></EditRounded>
      </AppButton>

      {openDialog ? (
        <Dialog
          open={openDialog}
          TransitionComponent={Transition}
          onClose={handleCloseReview}
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
                handleCloseReview();
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
                  <TextArea
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
                  ></TextArea>
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
