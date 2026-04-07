import { useEffect, useState } from 'react';
import './EstadoPedido.css';
import axios from 'axios';

const EstadoPedido = () => {

    const [Pedidos, setPedidos] = useState([]);
    const [allPedidos, setAllPedidos] = useState([]);
    const [searchText, setSearchText] = useState('');
    const [searchDate, setSearchDate] = useState('');
    const [selectedPedido, setSelectedPedido] = useState(null);
    const [detallePedido, setDetallePedido] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [showConfirm, setShowConfirm] = useState(false);
    const [currentPageDetalle, setCurrentPageDetalle] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [itemsPerPageDetalle, setItemsPerPageDetalle] = useState(10);
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
    const baseurlDetallePedido = "https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/BaqSvc/DetallePedidos/Data";

    const buscarPedidos = async () => {
        try {
            const res = await axios.get(baseURLPedidos, config);
            setAllPedidos(res.data.value);
            setPedidos(res.data.value);
            setCurrentPage(1);
            console.log("Pedidos encontrados:", res.data.value);
        } catch (error) {
            console.error("Error buscando pedidos:", error);
        }
    }


    const detallesPedido = (pedido) => {
        setSelectedPedido(pedido);
        const pedidoId = pedido.UD04_Key1;
        axios.get(`${baseurlDetallePedido}?Pedido=${pedidoId}`, config)
            .then(res => {
                console.log("Detalles del pedido:", res.data.value);
                setDetallePedido(res.data.value);
                setCurrentPageDetalle(1);
            })
            .catch(error => {
                console.error("Error obteniendo detalles del pedido:", error);
            });
        console.log("Pedido seleccionado:", pedido);
    }

    const cancelModal = () => {
        setShowConfirm(true);
    }

    const totalPages = Math.ceil(Pedidos.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPedidos = Pedidos.slice(startIndex, endIndex);

    const totalPagesDetalle = detallePedido ? Math.ceil(detallePedido.length / itemsPerPageDetalle) : 0;
    const startIndexDetalle = (currentPageDetalle - 1) * itemsPerPageDetalle;
    const endIndexDetalle = startIndexDetalle + itemsPerPageDetalle;
    const currentDetalleItems = detallePedido ? detallePedido.slice(startIndexDetalle, endIndexDetalle) : [];


    const formatPedidoDate = (dateString) => {
        if (!dateString) return '';
        return dateString.split('T')[0]; // Extrae la fecha sin zona horaria
    }

    const applyFilters = (text, date) => {
        const normalizedText = (text || '').trim().toLowerCase();
        const normalizedDate = date || '';

        let filtered = allPedidos;

        if (normalizedText) {
            filtered = filtered.filter(pedido =>
                (pedido.UD04_Key3 || '').toLowerCase().includes(normalizedText)
            );
        }

        if (normalizedDate) {
            filtered = filtered.filter(pedido =>
                formatPedidoDate(pedido.UD04_Date01) === normalizedDate
            );
        }

        setPedidos(filtered);
        setCurrentPage(1);
    }

    const handleSearchText = (query) => {
        setSearchText(query);
        applyFilters(query, searchDate);
    }

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const handleItemsPerPageDetalleChange = (newItemsPerPage) => {
        setItemsPerPageDetalle(newItemsPerPage);
        setCurrentPageDetalle(1);
    };

    return (
        <>
            <h1 style={{ justifySelf: 'center', margin: '10px' }}>EstadoPedido</h1>
            <div className='table-container'>
                <div className="filtros">
                    <h3>Buscar Orden Compra: <input type="text" value={searchText} onChange={(e) => handleSearchText(e.target.value)} /></h3>
                    <h3>Fecha: <input type="date" value={searchDate} onChange={(e) => handleSearchDate(e.target.value)} /></h3>
                    <button onClick={() => { setSearchText(''); setSearchDate(''); applyFilters('', ''); }}>Limpiar filtros</button>
                    <label style={{ marginLeft: '20px' }}>Registros por página:
                        <select value={itemsPerPage} onChange={(e) => handleItemsPerPageChange(parseInt(e.target.value))} style={{ marginLeft: '5px' }}>
                            <option value={5}>5</option>
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                        </select>
                    </label>
                </div>
                <table className='pedido-table'>
                    <thead>
                        <tr className='encabezado-partes'>
                            {/* <th>Pedido</th> */}
                            <th>Orden de Compra</th>
                            <th>Orden de Venta</th>
                            <th>Estado</th>
                            <th>Fecha de Necesidad</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentPedidos.map((pedido, index) => (
                            <tr key={index} onClick={() => detallesPedido(pedido)} style={{ cursor: 'pointer' }}>
                                {/* <td>{pedido.UD04_Key1}</td> */}
                                <td>{pedido.UD04_Key3}</td>
                                <td>{pedido.UD04_Character02 == '' || pedido.UD04_Character02 == null || pedido.UD04_Character02 == 'undefined' ? 'Orden de Venta no disponible' : pedido.UD04_Character02}</td>
                                <td>{pedido.UD04_Character01}</td>
                                <td>{pedido.UD04_Date01 ? formatPedidoDate(pedido.UD04_Date01) : 'S/F'}</td>
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

            <div className="detalle-modal" hidden={!selectedPedido}>

                {selectedPedido && (

                    <div className="detalle-content">
                        <i className="pi pi-times" id='close-icon' onClick={() => setSelectedPedido(null)}></i>
                        <h2>Detalles del Pedido</h2>
                        <br />
                        <p><strong>OV:</strong> {selectedPedido.UD04_Character02 == '' || selectedPedido.UD04_Character02 == null || selectedPedido.UD04_Character02 == 'undefined' ? 'Orden de Venta no disponible' : selectedPedido.UD04_Character02}</p>
                        <p><strong>Orden de Compra:</strong> {selectedPedido.UD04_Key3}</p>
                        <p><strong>Estado:</strong> {selectedPedido.UD04_Character01}</p>
                        <h3>Partes del Pedido:</h3>
                        <div style={{ marginBottom: '10px' }}>
                            <label>Registros por página:
                                <select value={itemsPerPageDetalle} onChange={(e) => handleItemsPerPageDetalleChange(parseInt(e.target.value))} style={{ marginLeft: '5px' }}>
                                    <option value={5}>5</option>
                                    <option value={10}>10</option>
                                    <option value={25}>25</option>
                                    <option value={50}>50</option>
                                </select>
                            </label>
                        </div>
                        <table className='detail-table'>
                            <thead>
                                <tr className='encabezado-partes'>
                                    <th>Linea</th>
                                    <th>Parte</th>
                                    <th>Cantidad</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentDetalleItems.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.UD03_Key2}</td>
                                        <td>{item.UD03_Key3}</td>
                                        <td>{item.UD03_Number01}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {totalPagesDetalle > 1 && (
                            <div className="pagination" style={{ marginTop: '20px', textAlign: 'center' }}>
                                <button
                                    onClick={() => setCurrentPageDetalle(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPageDetalle === 1}
                                    style={{ marginRight: '10px', padding: '5px 10px' }}
                                >
                                    Anterior
                                </button>
                                <span>Página {currentPageDetalle} de {totalPagesDetalle}</span>
                                <button
                                    onClick={() => setCurrentPageDetalle(prev => Math.min(prev + 1, totalPagesDetalle))}
                                    disabled={currentPageDetalle === totalPagesDetalle}
                                    style={{ marginLeft: '10px', padding: '5px 10px' }}
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}
                        {/* <button className='btn-cancel' onClick={cancelModal}>
                            Cancelar Pedido
                        </button> */}
                    </div>
                )}
                {showConfirm && (
                    <div className="confirm-overlay">
                        <div className="cancelar-pedido">
                            <h2>¿Desea cancelar el pedido?</h2>
                            <button className='btn-confirm'>
                                Confirmar
                            </button>
                            <button
                                className='btn-cancel'
                                onClick={() => setShowConfirm(false)}
                            >
                                Volver
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}

export default EstadoPedido;