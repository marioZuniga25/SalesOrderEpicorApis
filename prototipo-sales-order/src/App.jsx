import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import LandingPage from "./Landing";
import DetalleOrden from "./DetalleOrden";

function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/detalle-orden" element={<DetalleOrden />} />
        <Route path="/home" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;