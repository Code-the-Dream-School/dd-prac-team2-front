import { Typography, Box, IconButton, Stack, Chip } from "@mui/material";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";

function CohortHeader({ cohort, currentWeek, getWeek }) {
  const startDate = new Date(currentWeek?.start).toLocaleDateString();
  const endDate = new Date(currentWeek?.end).toLocaleDateString();

  const handleNextWeek = () => {
    if (currentWeek.end === cohort.end) {
      return;
    }
    getWeek(currentWeek.index + 1);
  };

  const handlePreviousWeek = () => {
    if (currentWeek.index === 0) {
      return;
    }
    getWeek(currentWeek.index - 1);
  };

  return (
    <>
      <Typography
        component={"h1"}
        sx={{
          backgroundColor: "#C84B31",
          padding: 2,
          color: "background.paper",
          textAlign: "center",
          fontWeight: "bold",
          fontSize: 25,
          borderRadius: 2,
          marginBottom: 4,
        }}
      >
        {`${cohort?.name} Sessions`}
      </Typography>

      {currentWeek && (
        <Box
          sx={{
            padding: 3,
            backgroundColor: "#1a1a2e",
            fontSize: 25,
            borderRadius: 2,
            marginBottom: 4,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
              alignItems: "center",
              width: "60%",
              margin: "auto",
              backgroundColor: "#C84B31",
              borderRadius: 2,
              marginBottom: 4,
              p: 0.5,
            }}
          >
            <IconButton onClick={handlePreviousWeek}>
              <NavigateBefore fontSize="large" />
            </IconButton>
            <Typography
              sx={{
                color: "background.paper",
                fontWeight: "bold",
                fontSize: 25,
              }}
            >
              {currentWeek?.name}
            </Typography>
            <IconButton onClick={handleNextWeek}>
              <NavigateNext fontSize="large" />
            </IconButton>
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 1, sm: 2, md: 4 }}
            alignItems="center"
            justifyContent="center"
          >
            <Chip
              label={`Start Date: ${startDate} `}
              sx={{
                backgroundColor: "#C84B31",
                color: "white",
                fontWeight: "bold",
              }}
            />
            <Chip
              label={`End Date: ${endDate}`}
              sx={{
                backgroundColor: "#C84B31",
                color: "white",
                fontWeight: "bold",
              }}
            />
          </Stack>
        </Box>
      )}
    </>
  );
}

export default CohortHeader;
