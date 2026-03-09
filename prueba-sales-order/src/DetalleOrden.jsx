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

    const completarPedido = () => {
        try {
            carrito.forEach(parte => {
                const res = axios.post(
                    `${baseURLUD}/UpdateExt`,
                    {
                        // Datos del pedido
                        ds: {
                            UD03: [
                                {
                                    Company: "string",
                                    Key1: parte.PartNum,
                                    Key2: parte.PartDescription,
                                    Key3: "string",
                                    Key4: "string",
                                    Key5: "string",
                                    Character01: "string",
                                    Character02: "string",
                                    Character03: "string",
                                    Character04: "string",
                                    Character05: "string",
                                    Character06: "string",
                                    Character07: "string",
                                    Character08: "string",
                                    Character09: "string",
                                    Character10: "string",
                                    Number01: 0,
                                    Number02: 0,
                                    RowMod: "A"
                                }
                            ],
                        },
                        config
                    }
                );
            });
        } catch (error) {
            console.error("Error completando el pedido:", error);
        }


        alert("Aqui se completa el pedido jaja.");
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
                            <td><input name='cant' type="number" min="1" defaultValue={1} /></td>
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