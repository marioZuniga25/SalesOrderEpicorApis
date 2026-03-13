import { useState, useRef, useEffect } from "react";
import "./Landing.css";

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div className="container">
      
      {/* HEADER */}
      <header className="header">

        <button
          ref={buttonRef}
          className={`hamburger ${menuOpen ? "open" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setMenuOpen(!menuOpen);
          }}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        {/* LOGO */}
        <img
          src="https://imgs.search.brave.com/Dm4Jz6oxB_Vxr1PU91qVisrbeCferLzvK8TrxvPvWTk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQ0LzIvbmFjaGkt/ZnVqaWtvc2hpLWNv/cnAtbG9nby1wbmdf/c2Vla2xvZ28tNDQy/OTUzLnBuZw"
          alt="Nachi"
          className="logo-Nav"
        />
      </header>

      {/* MENU LATERAL */}
      <nav
        ref={menuRef}
        className={`sideMenu ${menuOpen ? "show" : ""}`}
      >
        <ul>
          <li>Inicio</li>
          <li>Productos</li>
          <li>Empresa</li>
          <li>Contacto</li>
        </ul>
      </nav>

      {/* CONTENIDO CENTRAL */}
      <main className="hero">
        <img
          src="https://imgs.search.brave.com/C09tPIfQI2X2pl_VHXme95pAeSzwBRKnKtqpMnamu_s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDIu/ZGVwb3NpdHBob3Rv/cy5jb20vMTAwMTMz/NS8xMDY5Mi9pLzQ1/MC9kZXBvc2l0cGhv/dG9zXzEwNjkyODc3/Mi1zdG9jay1waG90/by1zZXQtZGlmZmVy/ZW50LWJlYXJpbmdz/LWlzb2xhdGVkLXdo/aXRlLmpwZz9mb3Jj/ZWpwZWc9dHJ1ZQ"
          alt="Bearings"
          className="heroImage"
        />

        <div className="brand">
          <img
            src="https://imgs.search.brave.com/Dm4Jz6oxB_Vxr1PU91qVisrbeCferLzvK8TrxvPvWTk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQ0LzIvbmFjaGkt/ZnVqaWtvc2hpLWNv/cnAtbG9nby1wbmdf/c2Vla2xvZ28tNDQy/OTUzLnBuZw"
            alt="Nachi"
            className="logo-home"
          />
        </div>
      </main>
    </div>
  );
}