/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import useAxiosPrivate from '../../../../hooks/useAxiosPrivate';
import { Container, Paper, Box, Typography } from '@mui/material';
import { AccountBoxRounded, AdminPanelSettingsRounded, BadgeRounded, Email } from '@mui/icons-material';

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React, {useState, useEffect} from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

/*
    ==========================
    =        STYLES          =
    ==========================
*/
import styles from "./RegisterOnCohort.module.css";

/*
    ==========================
    =         HOOKS          =
    ==========================
*/
import useAuth from '../../../../hooks/useAuth';

/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppDataGrid from '../../../../components/DataGrid/AppDataGrid';
import AppButton from '../../../../components/Button/AppButton';
import UserRoleRender from './TableRenders/UserRoleRender';
import UserStatusRender from './TableRenders/UserStatusRender';
import RegisterOnCohortActions from './Actions/RegisterOnCohortActions';
import AuthFormControl from '../../../../components/FormControl/AuthFormControl';
import FormTextField from '../../../../components/TextField/FormTextField'
import FormSelect from '../../../../components/Select/FormSelect';

/*
    ==========================
    =     AUX VARIABLES      =
    ==========================
*/
const rolesList = ["Admin", "Mentor", "Student"];

const RegisterOnCohort = () => {
    /*
        ==========================
        =          HOOKS         =
        ==========================
    */
    const {cohortId} = useParams()
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const location = useLocation();
    const {setAuth} = useAuth();

    /*
        ==========================
        =         STATES         =
        ==========================
    */
    //Fetched data states:
    const [cohortUsers, setCohortUsers] = useState([]);
    const [cohortData, setCohortData] = useState({});
    //Form states
    const [userRoles, setUserRoles] = useState([]);
    const [formError, setFormError] = useState({
        userNameError: {
            error:false,
            errorMessage: "Please enter a valid name"
        },
        userEmailError: {
            error:false,
            errorMessage: "Please enter a valid e-mail address"
        },
        userRolesError: {
            error: true,
            errorMessage: "Please select a role for this user"
        },
    });
    const [reset, setReset] = useState(false);
    
    /*
        ==========================
        =      AUX VARIABLES     =
        ==========================
    */
    const columns = [
        {field: "id", headerName: "ID", minWidth:100, maxWidth: 130, flex: 1},
        {field: "userName", headerName: "Full name:", minWidth:250, maxWidth: 250, flex: 1},
        {field: "userEmail", headerName: "E-mail:", minWidth:200, maxWidth: 300, flex: 1},
        {field: "userRole", headerName: "Roles: ", sortable:false, disableColumnMenu:true,minWidth:250, maxWidth: 250, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<UserRoleRender params={params}></UserRoleRender>)},
        {field: "userActivatedStatus", headerName: "Status: ", sortable:false, disableColumnMenu:true, minWidth:100, maxWidth: 100, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<UserStatusRender params={params}></UserStatusRender>)},
        {field: "actions", headerName: "Actions: ", sortable:false, disableColumnMenu:true, minWidth: 180, flex: 1, valueGetter: (params)=>(params), renderCell: (params)=>(<RegisterOnCohortActions params={params} onHandleCohortUsers={setCohortUsers}></RegisterOnCohortActions>)},
    ];
    /*
        ==========================
        =    ASYNC FUNCTIONS     =
        ==========================
    */
    const fetchCohortUsers = async () => {
        try{
            const response = await axiosPrivate(`cohort/${cohortId}`);
            console.log(response);
            if(response.status===200){
                const participants = response.data.cohort[0].participants;
                const formattedUsers =  participants.map((participant)=>{
                    return ({
                        id: participant._id,
                        userName: participant.name,
                        userEmail: participant.email,
                        userRole: participant.role,
                        userActivatedStatus: participant.isActivated,
                    });
                });
                const formattedCohortData = {
                    cohortId: cohortId,
                    cohortName: response.data.cohort[0].name
                }
                console.log(formattedUsers);
                setCohortUsers(formattedUsers);
                setCohortData(formattedCohortData);
            }
            else{
                console.error("There was an error fetching the users of this cohort");
            }
        }
        catch(error){
            if(error.response.status === 403){
                console.error(error);
                //User is required to validate auth again
                navigate("/login", {state:{from: location}, replace: true});
                setAuth({
                    userId: "",
                    userName: "",
                    userEmail: "",
                    role: [],
                    loggedIn: false,
                    avatarUrl: "",
                    isActive: undefined,
                    accessToken: ""
                });
            }
            else{
                console.error(error);
            }
        }
    }

    /*
        ==========================
        =   HANDLER FUNCTIONS    =
        ==========================
    */

    // onSelect Role:
    const handleOnSelectRole = (selectedRoleName) => {
        setUserRoles(selectedRoleName);
    }

    // User name:
    const handleUserNameError = (inputError) => {
        setFormError((prevState) => ({
                ...prevState,
                userNameError: {
                    ...prevState.userNameError,
                    error: inputError
                }
            })
        );
    }

    //User email
    const handleUserEmailError = (inputError) => {
        setFormError((prevState) => ({
                ...prevState,
                userEmailError: {
                    ...prevState.userEmailError,
                    error: inputError
                }
            })
        );
    };
    
    //Form submit:
    const handleRegisterOnCohortSubmit = async (event) => {
        event.preventDefault();
        const formattedUserRegistration = {
            users: [
                {
                    name: event.target.userName.value.trim(),
                    email: event.target.userEmail.value.trim(),
                    role: userRoles.map((role)=>role.toLowerCase())
                }
            ],
            cohort: cohortData.cohortId
        }
        const errors = Object.values(formError);
        try{
            if(!errors.some((error)=>error.error===true)){
                const response = await axiosPrivate.post("auth/register", formattedUserRegistration);
                if(response.data.users.length>0)
                {
                    setCohortUsers((prevState) => [...prevState, {
                        id: response.data.users[0]._id,
                        userName: response.data.users[0].name,
                        userEmail: response.data.users[0].email,
                        userRole: response.data.users[0].role,
                        userActivatedStatus: response.data.users[0].isActivated
                    }]);
                    setReset(true);
                    setUserRoles([]);
                }
                else if (response.data.errors.length>0){
                    console.error(response.data.errors);
                }
            }
            else{
                console.error("There is an error preventing the form submission: check that your entires are correctly validated");
            }
        }
        catch(error){
            if(error.response.status === 403){
                console.error(error);
                //User is required to validate auth again
                navigate("/login", {state:{from: location}, replace: true});
                setAuth({
                    userId: "",
                    userName: "",
                    userEmail: "",
                    role: [],
                    loggedIn: false,
                    avatarUrl: "",
                    isActive: undefined,
                    accessToken: ""
                });
            }
            else{
                console.error(error);
            }
        }
    };

    //. Function to navigate back
    const goBack = () => {
        navigate(-1);
    };

    /* 
        ==========================
        =        EFFECTS         =
        ==========================
    */
    useEffect(()=>{
        fetchCohortUsers();
    }, []);

    useEffect(()=>{
        setFormError((prevState) => ({
                ...prevState,
                userRolesError: {
                    ...prevState.userRolesError,
                    error: userRoles.length === 0 ? true:false
                }
            }) 
        );
    }, [userRoles]);

    useEffect(()=>{
        setReset(false);
    });

    return (
        <Container maxWidth="lg">
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
                <Typography component={"h1"} sx={{backgroundColor:"#C84B31", borderRadius:2, padding: 1, margin: 1, textAlign: "center", textTransform:"uppercase", fontWeight:"bold", fontSize: 25}} > {cohortData.cohortName}'S users management </Typography>
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
                        onSubmit={handleRegisterOnCohortSubmit}
                >
                    <div className={styles.formContainer}>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <BadgeRounded fontSize="large"></BadgeRounded>
                                <br></br>
                                <br></br>
                            </Box>
                            <FormTextField required type="text" label="Full name:" name="userName" isFocused={true} width="100%" variant="light" regex={/^[a-zA-z]+([\s][a-zA-Z]+)*$/} onHandleError={handleUserNameError} errorMessage={"Please enter a valid name"} reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <Email fontSize="large"></Email>
                                <br></br>
                                <br></br>
                            </Box>
                            <FormTextField required type="text" label="E-mail:" name="userEmail" isFocused={false} width="100%" variant="light" regex={/^[^\s@]+@[^\s@]+\.[^\s@]+$/} onHandleError={handleUserEmailError} errorMessage={"Please enter a valid e-mail address"} reset={reset}></FormTextField>
                        </AuthFormControl>
                        <AuthFormControl width="75%">
                            <Box sx={{display:"flex", flexDirection:"column", justifyContent:"center"}}>
                                <AdminPanelSettingsRounded fontSize="large"/>
                                <br></br>
                            </Box>
                            <AuthFormControl width="100%" isNested={true} error={formError.userRolesError.error}>
                                <FormSelect id={"userRoles"} name={"userRoles"} label={"Roles:"} selectValue={userRoles} onSelectValue={handleOnSelectRole} list={rolesList} variant={"light"} multiple={true} error={formError.userRolesError}></FormSelect>
                            </AuthFormControl>
                        </AuthFormControl>
                        <AppButton text={"Add new user"} type="submit" width="25%" handlerFunction={()=>{}}/>
                    </div>
                </Box>
                <AppDataGrid columns={columns} rows={cohortUsers} pageSize={10} fieldToBeSorted={"userName"} sortType={"asc"}/>
                <div className={styles.buttonContainer}>
                    <AppButton text={"Go back"} type="button" width="100%" handlerFunction={()=>{goBack()}}>            
                    </AppButton>
                </div>
            </Paper>
        </Container>
    )
};

export default RegisterOnCohort;