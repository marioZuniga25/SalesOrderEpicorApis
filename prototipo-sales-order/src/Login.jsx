import React from "react";
import "./Login.css";

export default function Login() {
  return (
    <div className="login-container">
      
      <div className="overlay">
        
        <div className="logo-section">
          {/* <h1 className="logo">NACHI</h1> */}
          {/* <p>NACHI AMERICA INC</p> */}
          <img src="https://imgs.search.brave.com/n4NtzkwKIWvkSOq6vVT8JdA9CcKr9S1MDaPNhI0uOXE/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzU1LzIvbmFjaGkt/ZnVqaWtvc2hpLWxv/Z28tcG5nX3NlZWts/b2dvLTU1NjkxNy5w/bmc_dj0xOTU4NTA5/OTU1MTQ0MTM3NDI0" alt="" />
        </div>

        <div className="login-card">
            <h1>Inicio de Sesión</h1>
          <h2>Usuario:</h2>
          <input type="text" placeholder="Usuario" />

          <h2>Contraseña:</h2>
          <input type="password" placeholder="Contraseña" />

          <button>Login</button>
        </div>

      </div>

    </div>
  );
}