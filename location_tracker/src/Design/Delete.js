import { useEffect } from 'react'
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "./AuthService";
import axios from "axios";

const Delete = () => {

    const navigate = useNavigate();
    const e = useParams();
    const email = e.uID;

    useEffect(() => {
        AuthService.clearToken();

        axios.post('http://localhost:5050/delete', {
            email
        }).then(response => {
            navigate("/login");
        })
    }, [navigate]);
}

export default Delete