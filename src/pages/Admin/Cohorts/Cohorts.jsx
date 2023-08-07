import { Box, Button, Container, Paper, Typography, styled } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import styles from "./Cohorts.module.css";
import React from 'react';
import AuthFormControl from '../../../components/FormControl/AuthFormControl';
import { Email, SchoolRounded } from '@mui/icons-material';
import FormTextField from '../../../components/TextField/FormTextField';

const RenderActions = (props) => {
    return(
        <Button
        component="button"
        variant="contained"
        size="small"
        >
            {props.value}
        </Button>
    )
}

const columns = [
    {field: "id", headerName: "ID", width: 130},
    {field: "cohort", headerName: "Cohort", width: 130},
    {field: "class", headerName: "Class", width: 130},
    {field: "startDate", headerName: "Start date", type: "date", width: 130},
    {field: "endDate", headerName: "End date", type: "date", width: 130},
    {field: "actions", headerName: "Actions", sortable:false, disableColumnMenu:true, width: 130, valueGetter: (params)=><a href={`/${params.id}`}>{params.id}</a>, renderCell: RenderActions }
]

const rows = [
    {id: "1", cohort:"Dove", class: "React.js", startDate: new Date(), endDate: new Date()},
    {id: "2", cohort:"Deer", class: "React.js", startDate: new Date(), endDate: new Date()},
    {id: "3", cohort:"Dorado", class: "React.js", startDate: new Date(), endDate: new Date()},
];

const StyledDataGrid = styled(DataGrid)(()=>({
    borderTop: "5px solid #C84B31",
    borderBottom: "5px solid #C84B31",
    borderLeft: "0px",
    borderRight: "0px",
    color: "white",
    letterSpacing: "normal",
    width: "100%",
    "& .MuiDataGrid-iconSeparator": {
        display: "none"
    },
    "& .MuiDataGrid-sortIcon": {
        color: "white",
        opacity: "inherit !important"
    },
    "& .MuiDataGrid-menuIconButton" : {
        opacity: 1,
        color: "white"
    },
    "& .MuiTouchRipple-root":{
        color: "#C84B31"
    },
    "& .MuiDataGrid-columnHeaders": {
        borderBottom: "3px solid #C84B31",
    },
    "& .MuiDataGrid-columnHeader, .MuiDataGrid-cell": {
        color: "white",
        borderRight: "0px solid #C84B31",
    },
    "& .MuiDataGrid-columnHeader:focus":{
        outline: "0px"
    },
    "& .MuiDataGrid-row":{
        backgroundColor: "white"
    },
    "& .MuiDataGrid-row.Mui-selected": {
        backgroundColor: "#C84B31",
        "& .MuiDataGrid-cell": {
            borderBottom: "1px solid #1A1A2E",
            color: "white"
        }
    },
    "& .MuiDataGrid-row:hover, & .MuiDataGrid-row.Mui-selected:hover": {
        backgroundColor: "#C84B31",
        "& .MuiDataGrid-cell":{
            borderBottom: "1px solid #1A1A2E",
            color:"white"
        }
    },
    "& .MuiDataGrid-cell":{
        color: "black",
        fontWeight: "bold",
    },
    "& .MuiDataGrid-cell.MuiDataGrid-withBorderColor":{
        outline: "0px",
    },
    "& .MuiDataGrid-columnsContainer, .MuiDataGrid-cell" : {
        borderBottom: "1px solid #C84B31"
    },
    "& .MuiDataGrid-footerContainer" : {
        borderTop: "3px solid #C84B31",
        "& .MuiTablePagination-root" : {
            color: "white",
            "& .MuiSelect-icon, & .MuiTablePagination-actions > .MuiButtonBase-root": {
                color: "white"
            }
        }
    },
}));

const Cohorts = () => {
    return (
        <Container maxWidth="md">
            <Paper 
                    elevation={3} 
                    sx={
                        {
                            display:"flex", 
                            flexDirection:"column", 
                            justifyContent:"center", 
                            alignItems:"center", 
                            bgcolor:"#1A1A2E", 
                            color: "#FFFFFF", 
                            borderRadius: "10px",
                            padding:2,
                            height:"auto",
                        }
                    }
            >
                <Typography component={"h1"} sx={{backgroundColor:"#C84B31", borderRadius:2, padding: 1, margin: 1, textAlign: "center", fontWeight:"bold", fontSize: 25}}> COHORTS MANAGEMENT </Typography>
                <Box
                        component={"form"}
                        sx={{

                            display: "flex",
                            flexDirection: "column",
                            justifyContent:"center",
                            alignItems:"center",
                            width: "100%"
                        }}
                        autoComplete='off'
                        onSubmit={()=>{}}
                >
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                                <SchoolRounded fontSize="large"></SchoolRounded>
                                <FormTextField required type="text" label="Cohort" name="cohort" isFocused={true} width="100%" variant="light" regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/} onHandleError={()=>{}} reset={null}></FormTextField>
                        </AuthFormControl>
                    </div>
                </Box>
                <StyledDataGrid
                    rows={rows}
                    columns={columns}
                    initialState={{
                        pagination: {
                            paginationModel: {page: 0, pageSize: 5}
                        }
                    }}
                    pageSizeOptions={[5]}
                    slotProps={{
                        columnMenu: {
                            sx: {
                                backgroundColor: "white",
                                "& .MuiMenuItem-root":{
                                    "& .MuiListItemText-root":{
                                        "& .MuiTypography-root":{
                                            fontWeight: "bold"
                                        }
                                    },
                                    "& .MuiListItemIcon-root": {
                                        color: "#C84B31"
                                    }
                                },
                                "& .MuiMenuItem-root:hover": {
                                    backgroundColor: "#C84B31",
                                    color: "white",
                                    "& .MuiListItemIcon-root":{
                                        color: "white",
                                    }
                                }
                            }
                        },
                        
                    }}
                />
            </Paper>
        </Container>
    )
}

export default Cohorts;