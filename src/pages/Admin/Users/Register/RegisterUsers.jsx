/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import {Box, Container, Paper, TextField, Typography } from '@mui/material';
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';


/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, {useState, useEffect} from 'react';

/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./RegisterUsers.module.css";


/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import UserRoleRender from '../RegisterOnCohort/TableRenders/UserRoleRender';
import UserStatusRender from '../RegisterOnCohort/TableRenders/UserStatusRender';
import AppDataGrid from '../../../../components/DataGrid/AppDataGrid';
import RegisterUserActions from './Actions/RegisterUserActions';
import UserCohortRender from './TableRenders/UserCohortRender';
import AuthFormControl from '../../../../components/FormControl/AuthFormControl';
import { School } from '@mui/icons-material';
import FormAutocomplete from '../../../../components/Autocomplete/Autocomplete';
/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const rolesList = ["Admin", "Mentor", "Student"];

const RegisterUsers = () => {
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
    const axiosPrivate = useAxiosPrivate();

     /*
        ==========================
        =         STATES         =
        ==========================
    */   
    const [users, setUsers] = useState([]);
    const [cohorts, setCohorts] = useState([]);
    const [cohortsValueSelected, setCohortsValueSelected] = useState([])
    console.log(cohortsValueSelected);
    const [cohortsInputValueSelected, setCohortsInputValueSelected] = useState("");
    const [formError, setFormError] = useState({
        userCohortError: {
            error:false,
            errorMessage: "Please add a cohort for this user"
        },
    });
    console.log(users);
    /*
        ==========================
        =      AUX VARIABLES     =
        ==========================
    */
    const columns = [
        {field: "id", headerName: "ID", minWidth:100, maxWidth: 130, flex: 1},
        {field: "userName", headerName: "Full name:", minWidth:250, maxWidth: 250, flex: 1},
        {field: "userEmail", headerName: "E-mail:", minWidth:200, maxWidth: 300, flex: 1},
        {field: "userCohort", headerName: "Cohort: ", sortable:false, disableColumnMenu:true,minWidth:250, maxWidth: 250, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<UserCohortRender params={params}></UserCohortRender>)},
        {field: "userRole", headerName: "Roles: ", sortable:false, disableColumnMenu:true,minWidth:250, maxWidth: 250, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<UserRoleRender params={params}></UserRoleRender>)},
        {field: "userActivatedStatus", headerName: "Status: ", sortable:false, disableColumnMenu:true, minWidth:100, maxWidth: 100, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<UserStatusRender params={params}></UserStatusRender>)},
        {field: "actions", headerName: "Actions: ", sortable:false, disableColumnMenu:true, minWidth: 180, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<RegisterUserActions params={params} onHandleUsers={setUsers}></RegisterUserActions>)},

    ];

    /*
        ==========================
        =    ASYNC FUNCTIONS     =
        ==========================
    */
    const fetchUsers = async () => {
        try{
            const response = [
                {
                    _id: "100",
                    name: "Ever Argelio Reyes Reyes",
                    email: "everreyes07@gmail.com",
                    cohorts: ["Dove"],
                    role: ["student"],
                    isActivated: false
                    
                },
                {
                    _id: "101",
                    name: "Marisela Castillo Chamagua",
                    email: "marisela@gmail.com",
                    cohorts: ["Deer"],
                    role: ["mentor", "student"],
                    isActivated: true
                    
                }
            ];
            if(/*response.status===200*/true){
                const formattedUsers =  response.map((user)=>{
                    return ({
                        id: user._id,
                        userName: user.name,
                        userEmail: user.email,
                        userCohort: user.cohorts,
                        userRole: user.role,
                        userActivatedStatus: user.isActivated,
                    });
                });
                setUsers(formattedUsers);
            }
            else{
                console.error("There was an error fetching the users of this cohort");
            }
        }
        catch(error){
            console.error(error);
        }
    };

    const fetchCohorts = async () => {
        try{
            const response = await axiosPrivate.get("/cohort");
            const formattedCohorts = (response.data.cohorts).map((cohort)=>{
                return ({
                    id: cohort._id,
                    cohort: cohort.name,
                });
            });
            setCohorts(formattedCohorts);
            setCohortsValueSelected((prevState)=>[...prevState, formattedCohorts[0]]);
        }
        catch(error){
        console.error(error);
        }
    };

    /*
        ==========================
        =   HANDLER FUNCTIONS    =
        ==========================
    */
    const handleValueSelectedChange = (newValue) => {
        setCohortsValueSelected(newValue);
    }

    /* 
        ==========================
        =        EFFECTS         =
        ==========================
    */
    useEffect(()=>{
        fetchUsers();
        fetchCohorts();
    }, []);

    useEffect(()=>{
        setFormError((prevState)=>
        (
            {
                ...prevState,
                userCohortError:{
                    ...prevState.userCohortError,
                    error: cohortsValueSelected.length === 0 ? true:false
                }
            }
        ));
    }, [cohortsValueSelected])

    return (
        <Container maxWidth="xl">
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
                <Typography component={"h1"} sx={{backgroundColor:"#C84B31", borderRadius:2, padding: 1, margin: 1, textAlign: "center", textTransform:"uppercase", fontWeight:"bold", fontSize: 25}} > Users Management </Typography>
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
                    <AuthFormControl width="75%">
                        <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                            <School fontSize="large"/>
                            <br></br>
                        </Box>
                        <AuthFormControl width="100%" isNested={true}>
                            <FormAutocomplete value={cohortsValueSelected} onHandleSelectedValueChange={handleValueSelectedChange} inputValue={cohortsInputValueSelected} onHandleInputValueChange={setCohortsInputValueSelected} options={cohorts} error={formError.userCohortError}></FormAutocomplete>
                        </AuthFormControl>
                    </AuthFormControl>
                </Box>
                <AppDataGrid columns={columns} rows={users} pageSize={10} fieldToBeSorted={"userName"} sortType={"asc"}/>
            </Paper>
        </Container>
    )
};

export default RegisterUsers;