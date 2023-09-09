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

const MyCustomNoRowsOverlay = () => {
  return <GridOverlay />;
};

const AppDataGrid = ({
  columns,
  rows,
  pageSize,
  fieldToBeSorted,
  sortType,
  loading=false,
  rowId = "id",
  checkBoxSelection = false,
  onSelectBox = () => {},
  variant = "light",
}) => {
  const [rowSelectionModel, setRowSelectionModel] = React.useState([]);
  console.log(loading);
  console.log(rowId);
  return (
    <DataGrid
      sx={{
        borderTop: "5px solid #C84B31",
        borderBottom: "5px solid #C84B31",
        borderLeft: "0px",
        borderRight: "0px",
        color: variant === "light" ? "white" : "#16213E",
        letterSpacing: "normal",
        width: "100%",
        "& .MuiDataGrid-iconSeparator": {
          display: "none",
        },
        "& .MuiDataGrid-sortIcon": {
          color: variant === "light" ? "white" : "#16213E",
          opacity: "inherit !important",
        },
        "& .MuiDataGrid-menuIconButton": {
          opacity: 1,
          color: variant === "light" ? "white" : "#16213E",
        },
        "& .MuiTouchRipple-root": {
          color: "#C84B31",
        },
        "& .MuiDataGrid-columnHeaders": {
          borderBottom: "3px solid #C84B31",
          "& .MuiDataGrid-columnHeaderCheckbox":{
            outline: "0px"
          }
        },
        "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
          color: variant === "light" ? "white" : "#16213E",
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
            color: variant === "light" ? "white" : "#16213E",
            "& .MuiSelect-icon, & .MuiTablePagination-actions > .MuiButtonBase-root":
              {
                color: variant === "light" ? "white" : "#16213E",
              },
          },
        },
        '& .MuiCheckbox-root svg': {
          width: 16,
          height: 16,
          backgroundColor: 'white',
          border: "2px solid #C84B31",
          borderRadius: 2,
        },
        '& .MuiCheckbox-root svg path': {
          display: 'none',
        },
        '& .MuiCheckbox-root.Mui-checked:not(.MuiCheckbox-indeterminate) svg': {
          backgroundColor: '#16213E',
          border: '2px solid white',
        },
        '& .MuiCheckbox-root.Mui-checked .MuiIconButton-label:after': {
          position: 'absolute',
          display: 'table',
          border: '2px solid #fff',
          borderTop: 0,
          borderLeft: 0,
          transform: 'rotate(45deg) translate(-50%,-50%)',
          opacity: 1,
          transition: 'all .2s cubic-bezier(.12,.4,.29,1.46) .1s',
          content: '""',
          top: '50%',
          left: '39%',
          width: 5.71428571,
          height: 9.14285714,
        },
        '& .MuiCheckbox-root.MuiCheckbox-indeterminate .MuiIconButton-label:after': {
          width: 8,
          height: 8,
          backgroundColor: '#16213E',
          transform: 'none',
          top: '39%',
          border: 0,
        },
      }}
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
        slackId: false,
      }}
      getRowId={(row) => {
        return (row[rowId]);
      }}
      checkboxSelection={checkBoxSelection}
      onRowSelectionModelChange={(newRowSelectionModel) => {
        onSelectBox((prevNewUsers) =>
          prevNewUsers.map((user) => {
            if (newRowSelectionModel.includes(user.slackId) || newRowSelectionModel.includes(user.id)) {
              return {
                ...user,
                isSelected: true,
              };
            } else {
              return {
                ...user,
                isSelected: false,
              };
            }
          })
        );
        setRowSelectionModel(newRowSelectionModel);
      }}
      rowSelectionModel={rowSelectionModel}
      autoHeight={true}
      loading={loading}
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
  loading: PropTypes.bool,
  rowId: PropTypes.string,
  checkBoxSelection: PropTypes.bool,
  onSelectBox: PropTypes.func,
  variant: PropTypes.string,
};
