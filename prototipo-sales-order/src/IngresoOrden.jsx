import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import axios from "axios"

const IngresoOrden = ({ onGoToOrder }) => {
  const [carrito,setCarrito] = useState([]);
  const [parts, setParts] = useState([]);
  const [isCarritoOpen, setIsCarritoOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedCarrito = JSON.parse(localStorage.getItem("carrito"));
    if (storedCarrito) {    
        setCarrito(storedCarrito);
    }
  }, []);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic aW50cmFuZXQ6MTIzNA==",
      "X-API-Key": "Kbeuc31ajfYCv6oawGQjcxmnGd2xY3qLfP5lmAKJv6nlR"
    }
  }
  
    
    const baseURLParts = "https://ser-kinetic/kineticprod/api/v2/odata/19009/Erp.BO.PartSvc"
    
    const buscarPartes = async (Partnum) => {
        try {
            const res = await axios.get(
                `${baseURLParts}/Parts?%24filter=contains%28PartNum%2C%27${Partnum}%27%29`,
                config
            );
            setParts(res.data.value);
            console.log("Partes encontradas:", res.data.value);
        } catch (error) {
            console.error("Error buscando partes:", error);
        }
    }

    const verCarrito = () => {
        console.log("Carrito:", carrito);
    }


    const irOrden = async () => {
        localStorage.setItem("carrito", JSON.stringify(carrito));
        if (onGoToOrder) {
          onGoToOrder();
        } else {
          navigate('/home/estadoPedido');
        }
    }
    return (
    <>
    <div className='NavBar'> 
      <button onClick={() => setIsCarritoOpen(!isCarritoOpen)}>Carrito</button>
      {isCarritoOpen && (
        <div className="carrito-dropdown">
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
                  <td><button onClick={() => setCarrito(carrito.filter((_, i) => i !== index))}>Remover</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={irOrden}>Ir a la Orden</button>
        </div>
      )}
    </div>
        <h1>IngresoOrden</h1>
        <h3>Buscar Parte: <input type="text" onChange={(e) => buscarPartes(e.target.value)}/></h3>
        <table>
          <thead>
            <tr>
              <th>Part ID</th>
              <th>Description</th>
              <th>Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody >
            {parts.map(part => (
              <tr key={part.PartNum}>
                <td>{part.PartNum}</td>
                <td>{part.PartDescription}</td>
                <td>{part.UnitPrice}</td>
                <td><button onClick={() => {setCarrito([...carrito, part]);}}>Agregar</button></td>
              </tr>
            ))}
          </tbody>
        </table>
        
    </>
  )
}

export default IngresoOrden
