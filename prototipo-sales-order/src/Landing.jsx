import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./Landing.css";
import axios from "axios";
import withReactContent from "sweetalert2-react-content";
import Swal from 'sweetalert2'

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



export default function LandingPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const carritoRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);
  const [isCarritoOpen, setIsCarritoOpen] = useState(false);
  const [cusname, setCusname] = useState(localStorage.getItem("customerName") || "");
  const user = localStorage.getItem("username");
const MySwal = withReactContent(Swal)

  const showAlertlogout = async () => {
    const result = await MySwal.fire({
      title: '¿Está seguro de cerrar la sesión?',
      text: '',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Cerrar sesión',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ee191f',
      cancelButtonColor: '#6c757d'
    });

    if (result.isConfirmed) {
      logout();
      MySwal.fire({
        title: <h1>Sesión cerrada.</h1>,
        text: '',
        icon: 'success'
      });

    }
  };

  const confirmLogout = () => {
    showAlertlogout();
  }

  const logout = () => {
    localStorage.removeItem("auth");
    localStorage.removeItem("username");
    localStorage.removeItem("customerName");
    localStorage.removeItem("customerEmail");
    setCusname("");
    navigate("/");
  };

  const custdetailURL = `https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/Erp.BO.CustomerSvc/GetByID?custNum=${user}`;
  useEffect(() => {
    if (user) {
      axios.get(custdetailURL, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Basic MTkwMDktZXBpY29yOlRyYWluMTgh",
          "X-API-Key": "g9Hps4BsmlZ8XsfIopSvvan6baJCdC7z35ZbwVx0PDHDN"
        }
      })
        .then(res => {
          const custName = res.data.returnObj.Customer[0].Name;
          localStorage.setItem("customerName", custName);
          localStorage.setItem("customerEmail", res.data.returnObj.Customer[0].EmailAddress);
          setCusname(custName);
        })
        .catch(err => console.error("Error fetching customer details:", err));
    }

    const storedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
    setCarrito(storedCarrito);

    const handleCarritoUpdate = () => {
      const stored = JSON.parse(localStorage.getItem("carrito")) || [];
      setCarrito(stored);
    };

    window.addEventListener('carritoUpdated', handleCarritoUpdate);

    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
      if (
        carritoRef.current &&
        !carritoRef.current.contains(event.target)
      ) {
        setIsCarritoOpen(false);
      }
    }

    document.addEventListener("click", handleClickOutside);

    return () => {
      window.removeEventListener('carritoUpdated', handleCarritoUpdate);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [user]);
  const closeMenu = () => setMenuOpen(false);

  const removeFromCarrito = (index) => {
    const newCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(newCarrito);
    localStorage.setItem("carrito", JSON.stringify(newCarrito));
    window.dispatchEvent(new Event('carritoUpdated'));
  };

  const irOrden = () => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
    setIsCarritoOpen(false);
    navigate('/home/detalle-orden');
  };

  const openManual = () => {
    window.open('/EpichubManual.pdf', '_blank');
  };

  const isHomeRoute = ["/home", "/home/"].includes(location.pathname);

  const activeMenu = (() => {
    if (location.pathname.endsWith("/productos")) return "productos";
    if (location.pathname.endsWith("/pedidos")) return "pedidos";
    if (location.pathname.endsWith("/estadoPedidos")) return "estadoPedidos";
    if (location.pathname.endsWith("/detalle-orden")) return "detalle-orden";

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
        <div className="right-section">
          <button className="cart-button" onClick={openManual}><i className="pi pi-book"></i></button>
          <button onClick={(e) => {
            e.stopPropagation();
            setIsCarritoOpen(!isCarritoOpen);
          }} className="cart-button">
            <i className="pi pi-shopping-cart" aria-hidden="true" />
            <span className="cart-count">{carrito.length}</span>
          </button>

          <div className="user-section">
            <i className="pi pi-user"></i>
            <span>{cusname}</span>
          </div>

          <i className="pi pi-sign-out logout-icon" onClick={confirmLogout}></i>
        </div>
      </header>

      {/* CARRITO DROPDOWN */}
      {isCarritoOpen && (
        <div ref={carritoRef} className="carrito-dropdown">
          <h2>Carrito</h2>
          <table>
            <thead>
              <tr>
                <th>Part ID</th>
                <th>Description</th>
                <th>Price</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {carrito.map((item, index) => (
                <tr key={index}>
                  <td>{item.PartNum}</td>
                  <td>{item.PartDescription}</td>
                  <td>{item.UnitPrice}</td>
                  <td><button onClick={() => removeFromCarrito(index)}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={irOrden}>Ir a la Orden</button>
        </div>
      )}

      {/* MENU LATERAL */}
      <nav ref={menuRef} className={`sideMenu ${menuOpen ? "show" : ""}`}>
        <ul>
          <li className={activeMenu === "inicio" ? "active" : ""} style={{"display": "flex"}}>
            <i className="pi pi-home" style={{"marginRight": "10px"}}></i><NavLink to="/home" end onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>Inicio</NavLink>
          </li>
          <li className={activeMenu === "productos" ? "active" : ""} style={{"display": "flex"}}>
            <i className="pi pi-box" style={{"marginRight": "10px"}}></i><NavLink to="/home/productos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>Existencias</NavLink>
          </li>
          <li className={activeMenu === "pedidos" ? "active" : ""} style={{"display": "flex"}}>
            <i className="pi pi-shopping-cart" style={{"marginRight": "10px"}}></i><NavLink to="/home/pedidos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>Realizar Pedido</NavLink>
          </li>
          <li className={activeMenu === "estadoPedidos" ? "active" : ""} style={{"display": "flex"}}>
            <i className="pi pi-info-circle" style={{"marginRight": "10px"}}></i><NavLink to="/home/estadoPedidos" onClick={closeMenu} className={({ isActive }) => (isActive ? "active" : "")}>Estado de Pedidos</NavLink>
          </li>
          <li className="under-development" style={{"display": "flex"}} title="En desarrollo">
            <i className="pi pi-cog" style={{"marginRight": "10px"}}></i>
            <span>Estado de cuenta</span>
            <i className="pi pi-hammer" style={{"marginLeft": "auto", "color": "#ffa500"}}></i>
          </li>
          <li className="under-development" style={{"display": "flex"}} title="En desarrollo">
            <i className="pi pi-file" style={{"marginRight": "10px"}}></i>
            <span>Guia de embarques</span>
            <i className="pi pi-hammer" style={{"marginLeft": "auto", "color": "#ffa500"}}></i>
          </li>
          <li style={{"display": "flex"}}>
            <i className="pi pi-file" style={{"marginRight": "10px"}}></i>
            <a
              href="https://facturaxion4.flixamexico.com.mx/"
              target="_blank"
              rel="noreferrer"
              onClick={closeMenu}
              style={{ color: 'inherit', textDecoration: 'none', display: 'flex', alignItems: 'center', width: '100%' }}
            >
              <span>Consultar comprobantes fiscales</span>
            </a>
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