import { BrowserRouter, Route, Routes, HashRouter } from "react-router-dom";

import Login from "./Login";
import LandingPage, { LandingHome } from "./Landing";
import Productos from "./Productos";
import DetalleOrden from "./DetalleOrden";
import IngresoOrden from "./IngresoOrden";
import EstadoPedido from "./EstadoPedido";
import PrivateRoute from "./PrivateRoute";
import { NewUser } from "./NewUser";


function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/home/*"
          element={
            <PrivateRoute>
              <LandingPage />
            </PrivateRoute>
          }
        >
          <Route index element={<LandingHome />} />
          <Route path="productos" element={<Productos />} />
          <Route path="pedidos" element={<IngresoOrden />} />
          <Route path="estadoPedidos" element={<EstadoPedido />} />
          <Route path="ingreso-orden" element={<IngresoOrden />} />
          <Route path="detalle-orden" element={<DetalleOrden />} />
          <Route path="newuser" element={<NewUser />} />
        </Route>

      </Routes>
    </HashRouter>
  );
}

export default App;