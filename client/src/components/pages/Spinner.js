import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

const Spinner = ({path="login"}) => {
    const [count, setCount] = useState(3);
    const navigate = useNavigate();
    const location=useLocation();
    useEffect(() => {
        const interval = setInterval(() => {
            setCount((value) => --value)
        }, 1000);
        count === 0 && navigate(`/${path}`,{
            state:location.pathname
        });
        return () => clearInterval(interval);
        // eslint-disable-next-line
    }, [count, navigate])

    return (
        <div className="d-flex flex-column justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <h1>Not Authorized redirecting you in {count} seconds </h1>
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
            </div>
        </div>

    )
}

export default Spinner