import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import withReactContent from "sweetalert2-react-content";
import Swal from 'sweetalert2'
import bcrypt from 'bcryptjs';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const credenciales = {
    username: "",
    password: ""
  };
  const MySwal = withReactContent(Swal)
  const baseUrlLogin = "https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/Ice.BO.UD05Svc";


  const showAlert = () => {
    MySwal.fire({
      title: <h1>Inicio de sesión exitoso.</h1>,
      text: '',
      icon: 'success'
    })
  };

  const handleLogin = async () => {
    const usernameInput = document.getElementById("user");
    const passwordInput = document.getElementById("pwd");
    credenciales.username = usernameInput.value;
    credenciales.password = passwordInput.value;

    try {
      const url = `${baseUrlLogin}/GetByID?key1=${credenciales.username}&key2=&key3=&key4=&key5=`;
      const headers = {
        "Content-Type": "application/json",
        "Authorization": "Basic MTkwMDktZXBpY29yOlRyYWluMTgh",
        "X-API-Key": "g9Hps4BsmlZ8XsfIopSvvan6baJCdC7z35ZbwVx0PDHDN"
      };
      console.log("URL petición Login:", url);
      console.log("Datos enviados:", credenciales);
      console.log("Headers:", headers);
      const res = await axios.get(url, { headers });

      const userData = res.data.returnObj.UD05[0];
      if (userData) {
        const storedHash = userData.Character01;
        console.log("Hash almacenado:", storedHash);
        bcrypt.compare(credenciales.password, storedHash, (err, isMatch) => {
          if (err) {
            console.error("Error comparing passwords:", err);
            MySwal.fire({
              title: <h1>Error al iniciar sesión.</h1>,
              text: 'Ocurrió un error al verificar las credenciales.',
              icon: 'error'
            });
          } else if (isMatch) {
            showAlert();
            localStorage.setItem("auth", "true");
            localStorage.setItem("username", credenciales.username);
            navigate("/home");
          } else {
            MySwal.fire({
              title: <h1>Credenciales incorrectas.</h1>,
              text: 'El usuario o la contraseña son incorrectos. Por favor, inténtalo de nuevo.',
              icon: 'error'
            });
          }
        });
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
      MySwal.fire({
        title: <h1>Error al iniciar sesión.</h1>,
        text: 'Ocurrió un error al verificar las credenciales.',
        icon: 'error'
      });
    }
  }

  return (
    <div className="login-container">
      <header>
        <div className="white-bar">
          <div className="flixa-logo">
            <p>Powered By</p>
            <img src="/FlixaLogo.jpeg" alt="Flixa Logo" />
          </div>

        </div>
      </header>

      <div className="overlay">

        <div className="logo-section">
          <img src="https://imgs.search.brave.com/n4NtzkwKIWvkSOq6vVT8JdA9CcKr9S1MDaPNhI0uOXE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzU1LzIvbmFjaGkt/ZnVqaWtvc2hpLWxv/Z28tcG5nX3NlZWts/b2dvLTU1NjkxNy5w/bmc_dj0xOTU4NTA5/OTU1MTQ0MTM3NDI0" alt="" />
        </div>

        <div className="login-card">
          <h1>Inicio de Sesión</h1>
          <h2>Usuario:</h2>
          <input id="user" type="text" placeholder="Usuario" />

          <h2>Contraseña:</h2>
          <input id="pwd" type="password" placeholder="Contraseña" />

          <button onClick={handleLogin}>Login</button>
        </div>

      </div>

    </div>
  );
}