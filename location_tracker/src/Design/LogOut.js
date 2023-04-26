import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthService from "./AuthService";
import axios from "axios";

const LogOut = () => {
  const ip = 'localhost:5050';
  const navigate = useNavigate();
  const e = useParams();
  const email = e.uID;
  

  useEffect(() => {
    AuthService.clearToken();

    const loginSign = 'False';

    axios.post(`http://${ip}/updateLoginSign`, {
      email,
      loginSign
    }).then(response => {
      navigate("/login");
    })
  }, [navigate]);

  return null;
};

export default LogOut;