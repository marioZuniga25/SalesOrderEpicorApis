import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import "./Landing.css";

export function LandingHome() {
  return (
    <div className="content">
      {/* <img
        src="https://imgs.search.brave.com/C09tPIfQI2X2pl_VHXme95pAeSzwBRKnKtqpMnamu_s/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdDIu/ZGVwb3NpdHBob3Rv/cy5jb20vMTAwMTMz/NS8xMDY5Mi9pLzQ1/MC9kZXBvc2l0cGhv/dG9zXzEwNjkyODc3/Mi1zdG9jay1waG90/by1zZXQtZGlmZmVy/ZW50LWJlYXJpbmdz/LWlzb2xhdGVkLXdo/aXRlLmpwZz9mb3Jj/ZWpwZWc9dHJ1ZQ"
        alt="Bearings"
        className="heroImage"
      /> */}

      <div className="brand">
        <img
          src="https://imgs.search.brave.com/Dm4Jz6oxB_Vxr1PU91qVisrbeCferLzvK8TrxvPvWTk/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc2Vla2xvZ28u/Y29tL2xvZ28tcG5n/LzQ0LzIvbmFjaGkt/ZnVqaWtvc2hpLWNv/cnAtbG9nby1wbmdf/c2Vla2xvZ28tNDQy/OTUzLnBuZw"
          alt="Nachi"
          className="logo-home"
        />
      </div>
    </div>
  );
}

export function Productos() {
  return (
    <div className="content">
      <h1>Productos</h1>
      <p>En esta sección puedes buscar y seleccionar los productos que deseas agregar a tu orden.</p>
    </div>
  );
}

export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();

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

  const closeMenu = () => setMenuOpen(false);

  const isHomeRoute = ["/home", "/home/"].includes(location.pathname);

  const activeMenu = (() => {
    if (location.pathname.endsWith("/productos")) return "productos";
    if (location.pathname.endsWith("/pedidos")) return "pedidos";
    if (location.pathname.endsWith("/estadoPedido")) return "estadoPedido";
    return "inicio";
  })();

  return (
    <div className="container">

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
      <nav ref={menuRef} className={`sideMenu ${menuOpen ? "show" : ""}`}>
        <ul>
          <li className={activeMenu === "inicio" ? "active" : ""}>
            <NavLink to="/home" end onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>Inicio</NavLink>
          </li>
          <li className={activeMenu === "productos" ? "active" : ""}>
            <NavLink to="/home/productos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>Productos</NavLink>
          </li>
          <li className={activeMenu === "pedidos" ? "active" : ""}>
            <NavLink to="/home/pedidos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>Pedidos</NavLink>
          </li>
          <li className={activeMenu === "estadoPedido" ? "active" : ""}>
            <NavLink to="/home/estadoPedido" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>Estado Pedido</NavLink>
          </li>
        </ul>
      </nav>

      {/* CONTENIDO CENTRAL */}
      <main className="hero">
        {isHomeRoute ? (
          <Outlet />
        ) : (
          <div className="content-card">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}