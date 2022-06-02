import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";
import React from "react";
import {IAuthWrapperProps} from "../types/props";

export const AuthWrapper = ({children, isFromPersonalPage}: IAuthWrapperProps) => {
    const navigate = useNavigate();

    useEffect(() => {
       const verifyUser = async () => {
           await axios('http://localhost:3000/auth/verify', {
               withCredentials: true
           }).then(response => {
               console.log(response);
               if(response.status === 200 && !isFromPersonalPage) {
                   navigate('/personal')
               }
           }).catch(() => {
               navigate('/login')
           })
       }

       verifyUser();
    }, []);

    return (<>{children}</>)
}