import { useState, useEffect } from "react";
import SignInPage from "./signIn";
import SignUpPage from "./signUp";

import { useNavigate } from 'react-router-dom';

// communicate with the parent

const LoginPage = () => {
    
    const [isSignIn, setisSignIn] = useState(false);
    const handleSignIn = () => setisSignIn(!isSignIn);

    let navigate = useNavigate(); // to navigate here

    useEffect(() => {
        const loggedInUser = localStorage.getItem("token"); // check if there is a user here
        if (loggedInUser) 
        {
          navigate('/home');
        }
    }, []);

    return ( 
        <div>
            {isSignIn ? <SignInPage isSignIn={handleSignIn} /> : <SignUpPage isSignIn={handleSignIn}/>}
        </div>
    );
}
export default LoginPage;