import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import LandingPage from "./Landing";
import DetalleOrden from "./DetalleOrden";
import IngresoOrden from "../../prueba-sales-order/src/IngresoOrden";

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/detalle-orden" element={<DetalleOrden />} />
        <Route path="/home" element={<LandingPage />} />
        <Route path="/ingreso-orden" element={<IngresoOrden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;