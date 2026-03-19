import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import './IngresoOrden.css';
import axios from "axios"

const IngresoOrden = ({ onGoToOrder }) => {
  const [carrito,setCarrito] = useState([]);
  const [parts, setParts] = useState([]);
  const [isCarritoOpen, setIsCarritoOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const storedCarrito = JSON.parse(localStorage.getItem("carrito"));
    if (storedCarrito) {    
        setCarrito(storedCarrito);
    }
  }, []);

  useEffect(() => {
    const handleCarritoUpdate = () => {
      const storedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
      setCarrito(storedCarrito);
    };

    window.addEventListener('carritoUpdated', handleCarritoUpdate);

    return () => {
      window.removeEventListener('carritoUpdated', handleCarritoUpdate);
    };
  }, []);

  useEffect(() => {
    buscarPartes(); 
  }, []);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic MTkwMDktZXBpY29yOlRyYWluMTgh",
      "X-API-Key": "g9Hps4BsmlZ8XsfIopSvvan6baJCdC7z35ZbwVx0PDHDN"
    }
  }
  
    
    const baseURLParts = "https://centralusdtedu00.epicorsaas.com/SaaS951/api/v2/odata/19009E6/Erp.BO.PartSvc"
    
    const buscarPartes = async (Partnum = '') => {
        try {
            let url = `${baseURLParts}/Parts`;
            if (Partnum) {
                url += `?%24filter=contains%28PartNum%2C%27${Partnum}%27%29`;
            }
            const res = await axios.get(url, config);
            setParts(res.data.value);
            setCurrentPage(1); 
            console.log("Partes encontradas:", res.data.value);
        } catch (error) {
            console.error("Error buscando partes:", error);
        }
    }

    const totalPages = Math.ceil(parts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentParts = parts.slice(startIndex, endIndex);

  


    
    return (
    <>
    
        <h1>IngresoOrden</h1>
        <form action="" className='orden-form'>
          <h3>OC:<input type="text" /></h3>
          <h3>Fecha Necesidad: <input type="date" /> </h3>
        </form>
        <h3 className='search-bar'>Buscar Parte: <input type="text" onChange={(e) => buscarPartes(e.target.value)}/></h3>
        <div className='Pedido-container' >
          <table className='part-table'>
            <thead>
              <tr className='encabezado-partes'>
                <th>Part ID</th>
                <th>Description</th>
                <th>Price</th>
                <th></th>
              </tr>
            </thead>
            <tbody >
              {currentParts.map(part => (
                <tr key={part.PartNum}>
                  <td>{part.PartNum}</td>
                  <td>{part.PartDescription}</td>
                  <td>{part.UnitPrice}</td>
                  <td><button onClick={() => {
                    const newCarrito = [...carrito, part];
                    setCarrito(newCarrito);
                    localStorage.setItem("carrito", JSON.stringify(newCarrito));
                    window.dispatchEvent(new Event('carritoUpdated'));
                  }}>Agregar</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {totalPages > 1 && (
          <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
              style={{ marginRight: '10px', padding: '5px 10px' }}
            >
              Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
              style={{ marginLeft: '10px', padding: '5px 10px' }}
            >
              Siguiente
            </button>
          </div>
        )}
        
    </>
  )
}

export default IngresoOrden
