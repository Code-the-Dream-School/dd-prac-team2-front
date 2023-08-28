/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container, Stack, styled } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import PropTypes from "prop-types";
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from "react";
import { BusAlert } from "@mui/icons-material";
import GridOverlay from "../GridOverlay/GridOverlay";

const StyledDataGrid = styled(DataGrid)(() => ({
  borderTop: "5px solid #C84B31",
  borderBottom: "5px solid #C84B31",
  borderLeft: "0px",
  borderRight: "0px",
  color: "white",
  letterSpacing: "normal",
  width: "100%",
  "& .MuiDataGrid-iconSeparator": {
    display: "none",
  },
  "& .MuiDataGrid-sortIcon": {
    color: "white",
    opacity: "inherit !important",
  },
  "& .MuiDataGrid-menuIconButton": {
    opacity: 1,
    color: "white",
  },
  "& .MuiTouchRipple-root": {
    color: "#C84B31",
  },
  "& .MuiDataGrid-columnHeaders": {
    borderBottom: "3px solid #C84B31",
  },
  "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
    color: "white",
    borderRight: "0px solid #C84B31",
  },
  "& .MuiDataGrid-columnHeader:focus": {
    outline: "0px",
  },
  "& .MuiDataGrid-row": {
    backgroundColor: "white",
  },
  "& .MuiDataGrid-row.Mui-selected": {
    backgroundColor: "#C84B31",
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid #1A1A2E",
      color: "white",
    },
  },
  "& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-selected:hover": {
    backgroundColor: "#C84B31",
    "& .MuiDataGrid-cell": {
      borderBottom: "1px solid #1A1A2E",
      color: "white",
    },
  },
  "& .MuiDataGrid-cell": {
    color: "black",
    fontWeight: "bold",
  },
  "& .MuiDataGrid-cell.MuiDataGrid-withBorderColor": {
    outline: "0px",
  },
  "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell": {
    borderBottom: "1px solid #C84B31",
  },
  "& .MuiDataGrid-footerContainer": {
    borderTop: "3px solid #C84B31",
    "& .MuiTablePagination-root": {
      color: "white",
      "& .MuiSelect-icon, & .MuiTablePagination-actions > .MuiButtonBase-root":
        {
          color: "white",
        },
    },
  },
}));
const MyCustomNoRowsOverlay = () => {
  <GridOverlay />;
};

const MyCustomNoRowsOverlay = () => <GridOverlay />;

const AppDataGrid = ({
  columns,
  rows,
  pageSize,
  fieldToBeSorted,
  sortType,
}) => {
  return (
    <StyledDataGrid
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: pageSize ? pageSize : 5 },
        },
        sorting: {
          sortModel: [{ field: fieldToBeSorted, sort: sortType }],
        },
      }}
      pageSizeOptions={[pageSize ? pageSize : 5]}
      slotProps={{
        columnMenu: {
          sx: {
            backgroundColor: "white",
            "& .MuiMenuItem-root": {
              "& .MuiListItemText-root": {
                "& .MuiTypography-root": {
                  fontWeight: "bold",
                },
              },
              "& .MuiListItemIcon-root": {
                color: "#C84B31",
              },
            },
            "& .MuiMenuItem-root:hover": {
              backgroundColor: "#C84B31",
              color: "white",
              "& .MuiListItemIcon-root": {
                color: "white",
              },
            },
          },
        },
      }}
      slots={{
        noRowsOverlay: MyCustomNoRowsOverlay,
        noResultsOverlay: MyCustomNoRowsOverlay,
      }}
      columnVisibilityModel={{
        id: false,
      }}
      autoHeight={true}
    />
  );
};

export default AppDataGrid;

AppDataGrid.propTypes = {
  columns: PropTypes.array.isRequired,
  rows: PropTypes.array.isRequired,
  pageSize: PropTypes.number,
  fieldToBeSorted: PropTypes.string.isRequired,
  sortType: PropTypes.string.isRequired,
};
