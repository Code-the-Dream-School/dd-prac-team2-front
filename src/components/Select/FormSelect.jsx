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
import { InputLabel, MenuItem, OutlinedInput, Select } from '@mui/material';
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
            <InputLabel id={label} sx={{color:"#1A1A2E", "&.Mui-focused":{color:"#C84B31"}}}>{label}</InputLabel>
            <Select
                fullWidth
                label={label}
                labelId={label}
                id={id}
                name={id}
                value={selectValue}
                onChange={handleChange}
                sx={{"&:after":{borderBottomColor:"#C84B31"}, "&:before":{borderColor:"#1A1A2E"}, "&:hover:not(.Mui-disabled):before":{borderColor:"#C84B31"}}}
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