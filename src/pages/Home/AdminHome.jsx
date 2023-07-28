import React from 'react'
import useRefreshToken from '../../hooks/useRefreshToken';

const AdminHome = () => {
    const refresh = useRefreshToken();
    return (
        <button onClick={()=>refresh()}>Refresh</button>
    )
}

export default AdminHome