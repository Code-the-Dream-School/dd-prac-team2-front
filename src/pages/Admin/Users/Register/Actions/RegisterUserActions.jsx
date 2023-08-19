/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import { Container } from '@mui/material'
import { DeleteRounded, EditRounded } from '@mui/icons-material'
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react'
/*
    ==========================
    =        COMPONENTS      =
    ==========================
*/
import AppButton from '../../../../../components/Button/AppButton'

const RegisterUserActions = () => {
  return (
    <>
        <Container sx={{display:"flex", flexDirection:"row", gap:"5px", "&":{paddingLeft:0, paddingRight:0}, paddingLeft:0}}>
            <AppButton text={"Edit"} type="button" width="auto" color="#F3950D" handlerFunction={()=>{}}>
                <EditRounded></EditRounded>
            </AppButton>
            <AppButton text={"Delete"} type="button" width="auto" color="#CD1818"  handlerFunction={()=>{}}>
                <DeleteRounded></DeleteRounded>
            </AppButton>                
        </Container>
    </>
  )
}

export default RegisterUserActions