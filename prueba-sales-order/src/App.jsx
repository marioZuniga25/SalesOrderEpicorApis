import axios from "axios"
import "./App.css"
import { useState } from "react"

function App() {
  const [parts, setParts] = useState([]);

  const config = {
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Basic aW50cmFuZXQ6MTIzNA==",
      "X-API-Key": "Kbeuc31ajfYCv6oawGQjcxmnGd2xY3qLfP5lmAKJv6nlR"
    }
  }

  const baseURL = "https://ser-kinetic/kineticprod/api/v2/Erp.BO.SalesOrderSvc"
  const baseURLParts = "https://ser-kinetic/kineticprod/api/v2/odata/19009/Erp.BO.PartSvc"
  const crearOrden = async () => {
    try {
      // 1️⃣ GetNewOrderHed
      let res = await axios.post(
        `${baseURL}/GetNewOrderHed`,
        { ds: {} },
        config
      )

      let ds = res.data.parameters.ds
      console.log("GetNewOrderHed OK")

      // 2️⃣ Asignar cliente
      ds.OrderHed[0].CustNum = 346
      ds.OrderHed[0].BTCustNum = 346
      ds.OrderHed[0].TermsCode = "CR15"
      ds.OrderHed[0].ShipToCustNum = "346"
      //ds.OrderHed[0].ShipToNum = "1" 
      ds.OrderHed[0].RowMod = "A"

      // ChangeCustomer
      res = await axios.post(
        `${baseURL}/ChangeCustomer`,
        { ds: ds, custNum: 346 },
        config
      )

      ds = res.data.parameters.ds
      console.log("ChangeCustomer OK")
      console.log("ShipTo asignado:", ds.OrderHed[0].ShipToNum)

      // PRIMER MASTERUPDATE - Crear la orden
      res = await axios.post(
        `${baseURL}/MasterUpdate`,
        {
          ds: ds,
          lCheckForOrderChangedMsg: true,
          lcheckForResponse: true,
          cTableName: "OrderHed",
          iCustNum: 346,
          iOrderNum: 0, // Importante: 0 para nueva orden
          lweLicensed: false
        },
        config
      )

      ds = res.data.parameters.ds
      const orderNum = ds.OrderHed[0].OrderNum
      console.log("✅ Orden creada con número:", orderNum)

      ds.OrderHed[0].PONum = "pruebaAPI"
      ds.OrderHed[0].CurrencyCode = "MXN"
      ds.OrderHed[0].RowMod = "U"

      // SEGUNDO MASTERUPDATE - Actualizar encabezado
      res = await axios.post(
        `${baseURL}/MasterUpdate`,
        {
          ds: ds,
          lCheckForOrderChangedMsg: true,
          lcheckForResponse: true,
          cTableName: "OrderHed",
          iCustNum: 346,
          iOrderNum: orderNum,
          lweLicensed: false
        },
        config
      )

      ds = res.data.parameters.ds
      console.log("Encabezado actualizado OK")

      res = await axios.post(
        `${baseURL}/GetNewOrderDtl`,
        { orderNum: orderNum, ds: ds },
        config
      )

      ds = res.data.parameters.ds
      ds.OrderDtl[0].RowMod = "A"

      // Cambiar parte
      res = await axios.post(
        `${baseURL}/ChangePartNum`,
        {
          ds: ds,
          partNum: "MG-MP-01-A32-5076",
          lSubstitutePartsExist: false,
          uomCode: "PZS",
          isPhantom: false,
          multipleMatch: false,
          promptForRev: false
        },
        config
      )

      ds = res.data.parameters.ds

      // Cambiar cantidad
      res = await axios.post(
        `${baseURL}/ChangeSellingQuantity`,
        { ds: ds, ipSellingQuantity: 10, lKeepUnitPrice: true },
        config
      )

      ds = res.data.parameters.ds

      // Asignar precio
      let linea = ds.OrderDtl[0]
      linea.UnitPrice = 10
      linea.DocUnitPrice = 10
      linea.OverridePriceList = true
      linea.LockPrice = true
      linea.RowMod = "U"

      // MASTERUPDATE para la línea
      res = await axios.post(
        `${baseURL}/MasterUpdate`,
        {
          ds: ds,
          lCheckForOrderChangedMsg: true,
          lcheckForResponse: true,
          cTableName: "OrderDtl",
          iCustNum: 346,
          iOrderNum: orderNum,
          lweLicensed: false
        },
        config
      )
      /*
  
      console.log("🔥 Orden completa creada correctamente. Número:", orderNum)
  */
    } catch (error) {
      console.error("❌ Error completo:")
      if (error.response) {
        console.error("Status:", error.response.status)
        console.error("Data:", error.response.data)
        if (error.response.data.exceptionDetail) {
          console.error("Detalle:", error.response.data.exceptionDetail)
        }
      } else {
        console.error(error.message)
      }
    }
  }


  const buscarPartes = async ( searchText ) => {
    try {
      
      //var searchText = document.getElementById("partes").value;
      const res = await axios.get(
        `${baseURLParts}/Parts?%24filter=contains%28PartNum%2C%27${searchText}%27%29`,
        config
      )
      console.log("Partes encontradas:", res.data)
      setParts(res.data.value);
    } catch (error) {
      console.error("❌ Error al buscar partes:")
      if (error.response) {
        console.error("Status:", error.response.status)
        console.error("Data:", error.response.data)
      } else {
        console.error(error.message)
      }
    }
  }

  return (
    <>
      <div className="card">
        <h1>Partes</h1>
        <p>Buscar: <input type="text" placeholder="Buscar parte..." onChange={(e) => buscarPartes(e.target.value)}/></p>
        <textArea id="partes"></textArea>
        <table>
          <th>Part</th>
          <th>Description</th>
          <th>Unit Price</th>
          <th>UOM</th>
          <tbody>
            {
              parts.map((part) => (
                <tr key={part.PartNum}>
                  <td>{part.PartNum}</td>
                  <td>{part.PartDescription}</td>
                  <td>{part.UnitPrice}</td>
                  <td>{part.IUM}</td>
                </tr>
              )) 
            }
          </tbody>
        </table>
      </div>
      <div className="card">
        <h1>Crear Orden</h1>
        <button onClick={crearOrden}>
          Crear Orden
        </button>
      </div>
    </>
  )
}

export default App