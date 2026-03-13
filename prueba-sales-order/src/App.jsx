import axios from "axios"
import "./App.css"
import { useState } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IngresoOrden from "./IngresoOrden";
import DetalleOrden from "./DetalleOrden";
import LandingPage from "./Landing";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IngresoOrden />} />
        <Route path="/detalle-orden" element={<DetalleOrden />} />
        <Route path="/home" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App