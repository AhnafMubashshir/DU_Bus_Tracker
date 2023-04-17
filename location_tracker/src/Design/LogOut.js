import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "./AuthService";
import axios from "axios";

const LogOut = () => {
  const navigate = useNavigate();
  const e = useParams();
  const email = e.uID;
  

  useEffect(() => {
    AuthService.clearToken();

    const loginSign = 'False';

    axios.post('http://localhost:5050/updateLoginSign', {
      email,
      loginSign
    }).then(response => {
      navigate("/login");
    })
  }, [navigate]);

  return null;
};

export default LogOut;