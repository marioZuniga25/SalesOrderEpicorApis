import axios from 'axios';
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './IngresoOrden.css';
import withReactContent from 'sweetalert2-react-content';
import Swal from 'sweetalert2'

const DetalleOrden = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [carrito, setCarrito] = useState([]);
    const cantidadRefs = useRef([]);
    const needbyRef = useRef();
    const clienteRef = useRef();
    const poRef = useRef();
    const comentariosRef = useRef();
    const MySwal = withReactContent(Swal)
    const showAlert = () => {
    MySwal.fire({
      title: <p>Pedido completado✅</p>,
      text: 'Puede revisar el estado de su pedido en la sección "Estado de Pedido".',
      icon: 'success'
    })};

    useEffect(() => {
        const storedCarrito = JSON.parse(localStorage.getItem("carrito")) || [];
        setCarrito(storedCarrito);
    }, []);

    const eliminarProducto = (index) => {
        const newCarrito = carrito.filter((_, i) => i !== index);
        setCarrito(newCarrito);
        localStorage.setItem("carrito", JSON.stringify(newCarrito));
    };
    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic MTkwMDktZXBpY29yOlRyYWluMTgh",
            "X-API-Key": "g9Hps4BsmlZ8XsfIopSvvan6baJCdC7z35ZbwVx0PDHDN"
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
            }else {
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
        var needbyDate = needbyRef.current ? needbyRef.current.value : "";  
        var comentarios = comentariosRef.current ? comentariosRef.current.value : "";

        console.log("Cliente: ", cliente);
        console.log("PO: ", po);
        console.log("Fecha de Necesidad: ", needbyDate);
        console.log("Comentarios: ", comentarios);
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
                                Date01: needbyDate.toString(),
                                Character02: comentarios.toString(),
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
                const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;
                
                
                const parteConCantidad = { ...parte, Cantidad: cantidad };
                
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
                localStorage.removeItem("carrito");
        } catch ( error) {
            console.error("Error completando el pedido:", error);
        }


    }
   

    return (
        <div>
            <h1>Detalle de la Orden</h1>
            <div className="orderhed">
                    <h3>Fecha de Necesidad: <input ref={needbyRef} id='needby' type="date" /></h3>
                    {/* <h3>Cliente: <input ref={clienteRef} id='cliente' type="text" /></h3> */}
                    <h3>PO: <input ref={poRef} id='po' type="text" /></h3>
                  
                    <h3>Comentarios: <br /><textarea ref={comentariosRef} id='comentarios' /></h3>
           
            </div>
            
            <table className='part-table'>
                <thead>
                    <tr className='encabezado-partes'>
                        <th>Part ID</th>
                        <th>Description</th>
                        <th>Cantidad</th>
                        <th>Price</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map((item, index) => (
                        <tr key={index}>
                            <td>{item.PartNum}</td>
                            <td>{item.PartDescription}</td>
                            <td><input ref={el => cantidadRefs.current[index] = el} name='cant' type="number" min="1" defaultValue={1} style={{"width": "40%"}}/></td>
                            <td>{item.UnitPrice}</td>
                            <td><button onClick={() => eliminarProducto(index)} className='btn-Eliminar'>Eliminar</button></td>
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