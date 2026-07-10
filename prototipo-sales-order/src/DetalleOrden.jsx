import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import './IngresoOrden.css';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2'

const DetalleOrden = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);
    const [needbyDate, setNeedbyDate] = useState(() => new Date().toISOString().split('T')[0]);
    const [lineNeedbyDates, setLineNeedbyDates] = useState([]);
    const cantidadRefs = useRef([]);
    const needbyRef = useRef();
    const clienteRef = useRef();
    const poRef = useRef();
    const comentariosRef = useRef();
    const MySwal = withReactContent(Swal)
    const [minDate] = useState(() => new Date().toISOString().split('T')[0]);
    const getTodayDate = () => new Date().toISOString().split('T')[0];
    const showAlert = () => {
        MySwal.fire({
            title: <p>Pedido completado✅</p>,
            text: 'Puede revisar el estado de su pedido en la sección "Estado de Pedido".',
            icon: 'success'
        })
    };

    useEffect(() => {
        const storedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        const today = getTodayDate();
        setCarrito(storedCarrito);
        setNeedbyDate(today);
        setLineNeedbyDates(storedCarrito.map(() => today));
    }, []);

    useEffect(() => {
        if (carrito.length === 0) {
            setLineNeedbyDates([]);
            return;
        }

        setLineNeedbyDates((prev) => {
            const baseDate = needbyDate || getTodayDate();
            return Array.from({ length: carrito.length }, (_, index) => prev[index] ?? baseDate);
        });
    }, [carrito.length, needbyDate]);

    const handleNeedbyDateChange = (selectedDate) => {
        const today = getTodayDate();
        if (selectedDate < today) {
            MySwal.fire({
                title: 'Fecha inválida',
                text: 'La fecha de necesidad no puede ser anterior a la fecha actual.',
                icon: 'warning',
                confirmButtonText: 'Entendido'
            });
            setNeedbyDate(today);
            setLineNeedbyDates((prev) => prev.map(() => today));
            return;
        }

        setNeedbyDate(selectedDate);
        setLineNeedbyDates((prev) => prev.map(() => selectedDate));
    };

    const eliminarProducto = (index) => {
        const newCarrito = carrito.filter((_, i) => i !== index);
        setCarrito(newCarrito);
        setLineNeedbyDates((prev) => prev.filter((_, i) => i !== index));
        localStorage.setItem("carrito", JSON.stringify(newCarrito));
    };
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic MTkwMDktZXBpY29yOlRyYWluMTgh",
            "X-API-Key": "MQirm93k5Nvi1L1JOn2FvH0Pmo8JYeAkJDDJmKXYAUkeb"
        }
    }

    const baseURLUD = "https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/Ice.BO.UD03Svc";
    const baseURLUD4 = "https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/Ice.BO.UD04Svc";


    const getNewNumPedido = async () => {
        try {
            const res = await axios.get(
                `https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/BaqSvc/getNewNumPedido/Data`,
                config
            );
            if (res.data.value.length === null || res.data.value.length === 0) {
                console.log("No se recibió un nuevo número de pedido");
                return 1;
            } else {
                return res.data.value[0].Calculated_NewPedidoNum;
            }

        } catch (error) {
            console.error("Error obteniendo nuevo NumPedido:", error);
            return null;
        }
    };

    const completarPedido = async () => {
        var numPedido = await getNewNumPedido();
        var cliente = localStorage.getItem("username") || "ClienteDesconocido";
        var po = poRef.current ? poRef.current.value : "";
        var headerNeedbyDate = needbyDate || (needbyRef.current ? needbyRef.current.value : "");
        var comentarios = comentariosRef.current ? comentariosRef.current.value : "";

        console.log("Cliente: ", cliente);
        console.log("PO: ", po);
        console.log("Fecha de Necesidad: ", headerNeedbyDate);
        console.log("Comentarios: ", comentarios);

        if (!cliente || !po || !headerNeedbyDate) {
            MySwal.fire({
                title: <p>Faltan campos obligatorios❌</p>,
                text: 'Por favor, complete los campos de Cliente, PO y Fecha de Necesidad antes de completar el pedido.',
                icon: 'error'
            });
            console.log("Error: Faltan campos obligatorios");
            return;
        }

        try {
            const resHead = await axios.post(
                `${baseURLUD4}/UpdateExt`,
                {
                    ds: {
                        UD04: [
                            {
                                Key1: numPedido.toString(),
                                Key2: cliente.toString(),
                                Key3: po.toString(),
                                Key4: "",
                                Date01: headerNeedbyDate.toString(),
                                Character03: comentarios.toString(),
                                Character01: "Pendiente Revision",
                                RowMod: "A"
                            }
                        ],
                    },
                    continueProcessingOnError: true,
                    rollbackParentOnChildError: true,
                },
                config
            );
            console.log("Respuesta UD04:", resHead.data);
        } catch (error) {
            console.error("Error completando el encabezado del pedido:", error.response ? error.response.data : error.message);
        }

        try {
            carrito.forEach((parte, index) => {

                const cantidadInput = cantidadRefs.current[index];
                const cantidad = cantidadInput ? parseInt(cantidadInput.value.replace(/[^0-9]/g, '')) : 1;


                const parteConCantidad = { ...parte, Cantidad: cantidad };
                const lineNeedbyValue = lineNeedbyDates[index] || headerNeedbyDate;

                const res = axios.post(
                    `${baseURLUD}/UpdateExt`,
                    {

                        ds: {
                            UD03: [
                                {
                                    Key1: numPedido,
                                    Key2: (index + 1).toString(),
                                    Key3: parteConCantidad.PartNum.toString(),
                                    Key4: parteConCantidad.PartDescription.toString(),
                                    Number01: parteConCantidad.Cantidad,
                                    Number02: parteConCantidad.UnitPrice,
                                    Date01: lineNeedbyValue.toString(),
                                    RowMod: "A"
                                }
                            ],
                        },
                        continueProcessingOnError: true,
                        rollbackParentOnChildError: true,
                    },
                    config
                );
                console.log("NumPedido: ", numPedido);

                console.log("PartNum: ", parteConCantidad.PartNum);
                console.log("PartNum: ", parteConCantidad.PartDescription);
                console.log("Cantidad: ", parteConCantidad.Cantidad);
                console.log("UnitPrice: ", parteConCantidad.UnitPrice);
                console.log("linea: ", index + 1);
                console.log("Respuesta UD03:", res.data);
            });


            //alert("Pedido completado con éxito. Número de pedido: " + numPedido);
            showAlert();
            enviarConfirmacion(numPedido, carrito.reduce((total, item, index) => total + (item.UnitPrice * (cantidadRefs.current[index] ? parseInt(cantidadRefs.current[index].value) : 1)), 0));
            localStorage.removeItem("carrito");
            setCarrito([]);
            window.dispatchEvent(new Event('carritoUpdated'));

        } catch (error) {
            console.error("Error completando el pedido:", error);
        }


    }

    const enviarConfirmacion = async (po, total) => {
        const userEmail = localStorage.getItem("customerEmail") || "";
        const userName = localStorage.getItem("customerName") || "ClienteDesconocido";
        const comentarios = comentariosRef.current ? comentariosRef.current.value : "";
         
         //const loginUrl = '/api/auth/login';
         //const sendMailUrl = '/api/api/sendmail';
        const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || '/facturaxion-api').replace(/\/$/, '');
        const loginUrl = `${apiBaseUrl}/auth/login`;
        const sendMailUrl = `${apiBaseUrl}/api/sendmail`;

        const formatearFecha = (fecha) => {
            if (!fecha) return '';
            const [year, month, day] = fecha.split('-');
            return `${day}/${month}/${year}`;
        };

        const lineasDetalle = carrito.map((item, index) => {
            const cantidadInput = cantidadRefs.current[index];
            const cantidad = cantidadInput ? parseInt(cantidadInput.value.replace(/[^0-9]/g, ''), 10) || 1 : 1;
            const fechaLinea = formatearFecha(lineNeedbyDates[index] || needbyDate);

            return {
                numero_Linea: String(index + 1),
                numero_Parte: String(item.PartNum),
                cantidad: String(cantidad),
                estatus: 'En Proceso',
                fechaNecesidad: fechaLinea
            };
        });

        const payload = {
            correoReceptor: userEmail,
            orden_compra: String(poRef.current ? poRef.current.value : ''),
            comentarios: comentarios,
            detalle: lineasDetalle
        };

        let token = "";

        try {
            const tokenResponse = await axios.post(
                loginUrl,
                {
                    username: 'EPICOR_HUB_ENVSEND',
                    password: ':an!d8Ef+MJZ_k1?Uf/P1{:'
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );
            const responseData = tokenResponse.data || {};
            token = responseData.token || responseData.accessToken || responseData.data?.token || responseData.data?.accessToken || '';
        } catch (error) {
            console.error('Error obteniendo token de envio de correo:', error.response?.data || error.message);
            return;
        }

        try {
            await axios.post(
                sendMailUrl,
                payload,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            console.log('Payload de confirmación enviado:', payload);
        } catch (error) {
            console.error('Error enviando confirmación por Axios:', error.response?.data || error.message);
        }
    }

    return (
        <div>
            <h1>Detalle de la Orden</h1>
            <div className="orderhed">
                <h3>Fecha de Necesidad: <input ref={needbyRef} id='needby' type="date" min={minDate} value={needbyDate} onChange={(e) => handleNeedbyDateChange(e.target.value)} /></h3>
                {/* <h3>Cliente: <input ref={clienteRef} id='cliente' type="text" /></h3> */}
                <h3>OC: <input ref={poRef} id='po' type="text" /></h3>

                <h3>Comentarios: <br />
                    <textarea ref={comentariosRef} id='comentarios' maxLength={255} /><br />
                    <span style={{fontSize: '0.85rem', color: '#666'}}>Máximo 255 caracteres</span>
                </h3>

            </div>

            <table className='part-table'>
                <thead>
                    <tr className='encabezado-partes'>
                        <th>Parte</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Fecha Necesidad</th>
                        <th>Precio U.</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map((item, index) => (
                        <tr key={index}>
                            <td>{item.PartNum}</td>
                            <td>{item.PartDescription}</td>
                            <td><input ref={el => cantidadRefs.current[index] = el} name='cant' type="text" inputMode="numeric" defaultValue="1" onChange={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                e.target.value = value ? Number(value).toLocaleString('es-MX') : '';
                            }} onBlur={(e) => {
                                const value = e.target.value.replace(/[^0-9]/g, '');
                                e.target.value = value ? Number(value).toLocaleString('es-MX') : '1';
                            }} style={{ "width": "100%", "textAlign": "center" }} /></td>
                            <td>
                                <input
                                    type="date"
                                    min={minDate}
                                    value={lineNeedbyDates[index] || needbyDate}
                                    onChange={(e) => {
                                        const selectedDate = e.target.value;
                                        setLineNeedbyDates((prev) => {
                                            const next = [...prev];
                                            next[index] = selectedDate;
                                            return next;
                                        });
                                    }}
                                    style={{ "width": "100%" }}
                                />
                            </td>
                            <td style={{ "textAlign": "center" }}>{Number(item.UnitPrice).toLocaleString('es-MX')}</td>
                            <td>
                                <button
                                    onClick={() => eliminarProducto(index)}
                                    className='btn-Eliminar'
                                    aria-label='Eliminar producto'
                                    title='Eliminar producto'
                                    style={{ border: 'none', backgroundColor: '#d9534f', color: '#fff', cursor: 'pointer', fontSize: '1rem', padding: '0.35rem 0.55rem', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                                >
                                    <FaTrash />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={completarPedido} className='btn-detalle'>Completar Pedido</button>
            <button onClick={() => navigate('/home/pedidos')} className='btn-detalle'>Volver</button>
        </div>
    );
};

export default DetalleOrden;