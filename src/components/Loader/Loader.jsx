/*
    ==========================
    =  THIRD PARTY LIBRARIES =
    ==========================
*/
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import PropTypes from 'prop-types';
/*
    ==========================
    =     REACT LIBRARIES    =
    ==========================
*/
import React from 'react';

const Loader = (props) => {
  return (
    // <Stack sx={{ color: 'grey.500' }} spacing={2} direction="row">
    <CircularProgress />
    //   {/* <CircularProgress color="success" />
    //     <CircularProgress color="inherit" /> */}
    // </Stack>
  );
};

// const StyledButton = styled(Button)(() => ({
//     transform: "scale(1.0)",
//     transition: "all 0.2s ease-in-out",
// }));

// const AppButton = ({children, text, type, width, height, color, textColor, handlerFunction}) => {

//     const handleOnClick = () => {
//         handlerFunction();
//     }

//     return (
//         <StyledButton
//             key={text}
//             type={type}
//             sx={{
//                 my:0,
//                 mx:0,
//                 color: textColor ? textColor : "white",
//                 backgroundColor: color ? color:"#C84B31",
//                 width: width,
//                 display:"flex",
//                 alignItems:"center",
//                 gap:"5px",
//                 "&:hover": {
//                     backgroundColor: color ? color:"#C84B31",
//                     transform: "scale(1.05)",
//                     transition: "all 0.2s ease-in-out"
//                 }
//             }}
//             onClick={handleOnClick}
//             disableFocusRipple
//         >
//             {children}
//             {text}
//         </StyledButton>
//     )
// }

export default Loader;

Loader.propTypes = {
  classes: PropTypes.object,
  color: PropTypes.string,
  disableShrink: PropTypes.bool,
  size: PropTypes.func | PropTypes.string,
  //   sx: (PropTypes.array < func) | object | (bool > PropTypes.func) | object,
  thickness: PropTypes.number,
  value: PropTypes.number,
  variant: PropTypes.oneOf(['determinate', 'indeterminate']),

  //   handlerFunction: PropTypes.func.isRequired,
};
