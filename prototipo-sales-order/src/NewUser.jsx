import React from 'react'
import Swal from 'sweetalert2';
import bcrypt from 'bcryptjs';
import axios from 'axios';

export const NewUser = () => {
    
    
    const baseURL = "https://centralusdtedu00.epicorsaas.com/saas951/api/v2/odata/19009E6/Ice.BO.UD05Svc";

    const config = {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Basic MTkwMDktZXBpY29yOlRyYWluMTgh",
            "X-API-Key": "g9Hps4BsmlZ8XsfIopSvvan6baJCdC7z35ZbwVx0PDHDN"
        }
    }

    const handleCreateUser = () => {
        const clientId = document.getElementById('ClientID').value;
        const password = document.getElementById('Password').value;
        const custnum = document.getElementById('Custnum').value;

        Swal.fire({
            title: '¿Crear nuevo usuario?',
            text: `ClientID: ${clientId}\nCustnum: ${custnum}\nContraseña: ${password}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Crear',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                createUser(clientId, password, custnum);
            }
        });

    }

    const createUser = async (clientId, password, custnum) => {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            
            const url = `${baseURL}/UpdateExt`;
            const datos = {
                ds: {
                    UD05: [
                        {
                            Key1: clientId,
                            Key2: "",
                            Key3: "",
                            Key4: "",
                            Character01: hashedPassword,
                            Character02: custnum,
                            RowMod: "A"
                        }
                    ],
                },
                continueProcessingOnError: true,
                rollbackParentOnChildError: true,
            };
            console.log("URL petición NewUser:", url);
            console.log("Datos enviados:", datos);
            console.log("Headers:", config.headers);

            const resUser = await axios.post(url, datos, config);
            console.log("Respuesta UD05:", resUser.data);

        } catch (error) {
            console.error("Error al crear usuario:", error.response || error);
            Swal.fire({
                title: 'Error al crear usuario',
                text: 'No se pudo crear el usuario',
                icon: 'error'
            });
        }
    }

    return (
        <>
            <h1>NewUser</h1>
            <form action="">
                <h3>ID Cliente: <input type="text" id='ClientID' /></h3>
                <h3>Contraseña: <input type="text" id='Password' /></h3>
                <h3>Custnum: <input type="text" id='Custnum' /></h3>
                <button onClick={handleCreateUser}>Crear Usuario</button>
            </form>
        </>


    )
}
