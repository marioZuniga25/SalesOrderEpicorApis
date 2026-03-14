import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import LandingPage, { LandingHome, Productos } from "./Landing";
import DetalleOrden from "./DetalleOrden";
import IngresoOrden from "../../prueba-sales-order/src/IngresoOrden";

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/detalle-orden" element={<DetalleOrden />} />
        <Route path="/home/*" element={<LandingPage />}>
          <Route index element={<LandingHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="pedidos" element={<IngresoOrden />} />
          <Route path="estadoPedido" element={<DetalleOrden />} />
        </Route>
        <Route path="/ingreso-orden" element={<IngresoOrden />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;