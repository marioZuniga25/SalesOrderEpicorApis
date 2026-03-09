import axios from 'axios';
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const DetalleOrden = () => {
    const location = useLocation();
    const navigate = useNavigate();
    //const carrito = location.state?.carrito || [];
    const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

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
            carrito.forEach(parte => {
                const res = axios.post(
                    `${baseURLUD}/UpdateExt`,
                    {
                        // Datos del pedido
                        ds: {
                            UD03: [
                                {
                                    Key1: parte.PartNum,
                                    Key2: parte.PartDescription,
                                    Key3: numPedido,
                                    Key4: "Pendiente Revision",
                                    //Number01: parte.Cantidad,
                                    Number02: parte.UnitPrice,
                                    RowMod: "A"
                                }
                            ],
                        },
                        config
                    }
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
                            <td><input name='cant' type="number" min="1" defaultValue={1} style={{"width": "40%"}}/></td>
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