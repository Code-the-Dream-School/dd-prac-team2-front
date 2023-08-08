/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import PropTypes from "prop-types";

/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import { InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

const FormSelect = ({id, label, selectValue, onSelectValue, list}) => {

/*
    ==========================
    =       HANDLERS         =
    ==========================
*/
const handleChange = (event) => {
    onSelectValue(event.target.value);
}
    return (
        <>
            <InputLabel id={label} sx={{color:"white", fontWeight:"bold", "&.Mui-focused":{color:"white"}}}>{label}</InputLabel>
            <Select
                fullWidth
                label={label}
                labelId={label}
                id={id}
                name={id}
                value={selectValue}
                onChange={handleChange}
                sx={
                    {
                        "& fieldset":{
                            borderColor: "#0F3460", 
                            borderWidth: 2
                        }, 
                        "&:hover": {
                            "&& fieldset": {
                                border: "2px solid #C84B31"
                            }
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            border: "2px solid #C84B31"
                        },
                        "&, & .MuiSvgIcon-root":{
                            color:"white", 
                            fontWeight:"bold"
                        }
                    }
                }
                required
            >
                {
                    list.map((selectItem) => {
                        return(
                            <MenuItem 
                                key={selectItem} 
                                value={selectItem} 
                                sx={{
                                    "&:hover, &:focus, &:focus:hover":{
                                        bgcolor:"#C84B31", 
                                        color:"white"
                                    },
                                }}
                            >
                                {selectItem}
                            </MenuItem>
                        );
                    })
                }
            </Select>
        </>
    );
}

export default FormSelect;

FormSelect.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    selectValue: PropTypes.string.isRequired,
    onSelectValue: PropTypes.func.isRequired,
    list: PropTypes.array.isRequired
};