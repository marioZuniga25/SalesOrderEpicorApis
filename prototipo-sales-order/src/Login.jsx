import React from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const credenciales = {
    username: "",
    password: ""
  };

  const handleLogin = () => {
    const usernameInput = document.getElementById("user");
    const passwordInput = document.getElementById("pwd");
    credenciales.username = usernameInput.value;
    credenciales.password = passwordInput.value;
    if (credenciales.username === "134" && credenciales.password === "admin123") {
      alert("Inicio de sesión exitoso");
      navigate("/home");
    } else {
      alert("Credenciales incorrectas. Por favor, inténtalo de nuevo.");
    }
  }

  return (
    <div className="login-container">
      
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