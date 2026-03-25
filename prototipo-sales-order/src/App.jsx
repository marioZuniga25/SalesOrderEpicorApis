import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import LandingPage, { LandingHome } from "./Landing";
import Productos from "./Productos";
import DetalleOrden from "./DetalleOrden";
import IngresoOrden from "./IngresoOrden";
import EstadoPedido  from "./EstadoPedido";

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/home/*" element={<LandingPage />}>
          <Route index element={<LandingHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="pedidos" element={<IngresoOrden />} />
          <Route path="estadoPedidos" element={<EstadoPedido />} />
          <Route path="ingreso-orden" element={<IngresoOrden />} />
          <Route path="detalle-orden" element={<DetalleOrden />} />
        </Route>
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;