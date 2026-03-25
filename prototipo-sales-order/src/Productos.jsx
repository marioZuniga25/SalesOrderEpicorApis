import React, { useEffect, useState } from 'react'
import axios from "axios"
 
const Productos = () => {
 const [parts, setParts] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;
  const currentParts = parts.slice(startIndex, endIndex);
  const totalPages = Math.ceil(parts.length / itemsPerPage);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic MTkwMDktZXBpY29yOlRyYWluMTgh",
      "X-API-Key": "g9Hps4BsmlZ8XsfIopSvvan6baJCdC7z35ZbwVx0PDHDN"
    }
  }
const baseURLParts = "https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/BaqSvc/Existencias/Data"
    
    const buscarPartes = async (Partnum = '') => {
        try {
            let url = `${baseURLParts}`;
            if (Partnum) {
                url += `?%24filter=contains%28PartNum%2C%27${Partnum}%27%29`;
            }
            const res = await axios.get(url, config);
            setParts(res.data.value);
            setCurrentPage(1); 
            setStartIndex(0);
            setEndIndex(10);
        } catch (error) {
            console.error("Error buscando partes:", error);
        }
    }

    useEffect(() => {
        buscarPartes(); 
    }, []);

    useEffect(() => {
        setStartIndex((currentPage - 1) * itemsPerPage);
        setEndIndex(currentPage * itemsPerPage);
    }, [currentPage]);

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        buscarPartes(value);
    }

  return (
    <div className="content">
      <h1>Productos</h1>
      <input
        type="text"
        placeholder="Buscar por PartNum"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ marginBottom: '20px', padding: '5px', width: '200px' }}
      />
      <table className='part-table'>
            <thead>
              <tr className='encabezado-partes'>
                <th>Part ID</th>
                <th>Description</th>
                <th>Existencias</th>
              </tr>
            </thead>
            <tbody>
              {currentParts.map((part, index) => (
                <tr key={part.PartBin_PartNum + index}>
                  <td>{part.PartBin_PartNum}</td>
                  <td>{part.Part_PartDescription}</td>
                  <td>{part.PartBin_OnhandQty}</td>
                  {/* <td><button onClick={() => {
                    const newCarrito = [...carrito, part];
                    setCarrito(newCarrito);
                    localStorage.setItem("carrito", JSON.stringify(newCarrito));
                    window.dispatchEvent(new Event('carritoUpdated'));
                  }}>Agregar</button></td> */}
                </tr>
              ))}
            </tbody>
          </table>
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
    </div>
  );
}

export default Productos