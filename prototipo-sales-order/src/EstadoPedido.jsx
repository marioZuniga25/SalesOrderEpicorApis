import { useEffect, useState } from 'react';
import './EstadoPedido.css';
import axios from 'axios';

 const EstadoPedido = () => {

    const [Pedidos, setPedidos] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic MTkwMDktZXBpY29yOlRyYWluMTgh",
            "X-API-Key": "g9Hps4BsmlZ8XsfIopSvvan6baJCdC7z35ZbwVx0PDHDN"
        }
    }

    useEffect(() => {
        buscarPedidos();
    }, []);

    const baseURLPedidos = "https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/BaqSvc/PedidosTV/Data?%24filter=UD04_Key2%20eq%20%272%27"
    
    const buscarPedidos = async () => {
        try {
            const res = await axios.get(baseURLPedidos, config);
            setPedidos(res.data.value);
            setCurrentPage(1);
            console.log("Pedidos encontrados:", res.data.value);
        } catch (error) {
            console.error("Error buscando pedidos:", error);
        }
    }

    const totalPages = Math.ceil(Pedidos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPedidos = Pedidos.slice(startIndex, endIndex);

    return (
        <>
            <h1 style={{justifySelf: 'center', margin: '10px'}}>EstadoPedido</h1>
            <div className='table-container'>
                <table className='pedido-table'>
                    <thead>
                        <tr className='encabezado-partes'>
                            <th>Pedido</th>
                            <th>Orden de Compra</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPedidos.map((pedido, index) => (
                            <tr key={index}>
                                <td>{pedido.UD04_Key1}</td>
                                <td>{pedido.UD04_Key3}</td>
                                <td>{pedido.UD04_Key4}</td>
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

export default EstadoPedido;