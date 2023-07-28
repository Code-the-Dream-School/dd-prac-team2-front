import React from 'react'
import { useNavigate } from 'react-router-dom';
import AppButton from '../../components/Button/AppButton';

const Unauthorized = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    }

    return (
        <div>
            Unauthorized
            <AppButton text={"Go back"} type="button" width="100%" handlerFunction={()=>{goBack()}}>

            </AppButton>
        </div>
    )
}

export default Unauthorized;