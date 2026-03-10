import axios from 'axios';
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DetalleOrden = () => {
    const location = useLocation();
    const navigate = useNavigate();
    //const carrito = location.state?.carrito || [];
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const cantidadRefs = useRef([]);

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic aW50cmFuZXQ6MTIzNA==",
            "X-API-Key": "Kbeuc31ajfYCv6oawGQjcxmnGd2xY3qLfP5lmAKJv6nlR"
        }
    }

    const baseURLUD = "https://ser-kinetic/kineticprod/api/v2/odata/19009/Ice.BO.UD03Svc";

    const getNewNumPedido = async () => {
        try {
            const res = await axios.get(
                `https://ser-kinetic/kineticProd/api/v2/odata/19009/BaqSvc/getNewNumPedido/Data`,
                config
            );
            return res.data.value[0].Calculated_NewPedidoNum;
        } catch (error) {
            console.error("Error obteniendo nuevo NumPedido:", error);
            return null;
        }
    };

    const completarPedido = async () => {
        var numPedido = await getNewNumPedido();
        try {
            carrito.forEach((parte, index) => {
                // Obtener la cantidad del input
                const cantidadInput = cantidadRefs.current[index];
                const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;
                
                // Agregar cantidad al objeto de parte
                const parteConCantidad = { ...parte, Cantidad: cantidad };
                
                const res = axios.post(
                    `${baseURLUD}/UpdateExt`,
                    {
                        // Datos del pedido
                        ds: {
                            UD03: [
                                {
                                    Key1: parteConCantidad.PartNum,
                                    Key2: parteConCantidad.PartDescription,
                                    Key3: numPedido,
                                    Key4: "Pendiente Revision",
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
            });
                alert("Pedido completado con éxito. Número de pedido: " + numPedido);
        } catch (error) {
            console.error("Error completando el pedido:", error);
        }


    }
   

    return (
        <div>
            <h1>Detalle de la Orden</h1>
            <table>
                <thead>
                    <tr>
                        <th>Part ID</th>
                        <th>Description</th>
                        <th>Cantidad</th>
                        <th>Price</th>
                    </tr>
                </thead>
                <tbody>
                    {carrito.map((item, index) => (
                        <tr key={index}>
                            <td>{item.PartNum}</td>
                            <td>{item.PartDescription}</td>
                            <td><input ref={el => cantidadRefs.current[index] = el} name='cant' type="number" min="1" defaultValue={1} style={{"width": "40%"}}/></td>
                            <td>{item.UnitPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={completarPedido}>Completar Pedido</button>
            <button onClick={() => navigate('/')}>Volver</button>
        </div>
    );
};

export default DetalleOrden;