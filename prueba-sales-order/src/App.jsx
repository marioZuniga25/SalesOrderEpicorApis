import axios from "axios"
import "./App.css"
import { useState } from "react"
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import IngresoOrden from "./IngresoOrden";
import DetalleOrden from "./DetalleOrden";

function App() {
  

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<IngresoOrden />} />
        <Route path="/detalle-orden" element={<DetalleOrden />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App