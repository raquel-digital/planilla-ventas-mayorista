const fs = require('fs');
const { async } = require('rxjs');
const path = `./baseDeDatos`;
const writeXlsxFile = require('write-excel-file/node');
//chequeamos si el archivo existe
function moduleIsAvailable (path) {
    try {
        require.resolve(path);
        return true;
    } catch (e) {
        return false;
    }
}

//cargar un JSON chequea si existe y devuelve la informacion 
async function leer(ventas, path) {
    try{    
        let test = moduleIsAvailable(`${path}`);
        
        if(test){
            ventas = require(`${path}`);
            return ventas;
        }else{
            crearJson(ventas, path);
            ventas = require(`${path}`);
            return ventas;
        } 

    }catch(error){
        crearJson(ventas, path);
        ventas = require(`${path}`);
        console.log(`CREANDO ARCHIVO DEL MES ${fecha}`)
        return ventas;
    }
}

function crearJson(data, path){    
    return fs.writeFileSync(path, JSON.stringify(data));        
}

//suma una venta al JSON del mes
async function sumarVentas(data, ventas, path){
    if(ventas != undefined){
     let test = ventas.find( e => e.vendedor == data.vendedor);
    if(test != undefined){
     let server   
     ventas.map( e => {
     if(e.vendedor == data.vendedor){
         e.monto = e.monto + data.monto;         
         console.log("VENDEDOR " + data.vendedor + " SUMO VENTA: " + e.monto); 
         escribir(ventas, path);        
         server = e                            
        }  
      });
      return server
    }else{
     ventas.push(data);
     console.log("NUEVO VENDEDOR")
     escribir(ventas, path);
     return data
        }
    }else{        
        ventas = [];
        ventas.push(data);
        console.log("NUEVO VENDEDOR")
        escribir(ventas, path);
        return data
    }
}

async function sumaVentaDiario(nuevaVenta, dataGlobal){
    if(dataGlobal != undefined){
        let test = dataGlobal.find( e => e.vendedor == nuevaVenta.vendedor)
       if(test != undefined){
        let vendedor = dataGlobal.filter(e =>  e.vendedor == nuevaVenta.vendedor)
        vendedorPOP = vendedor.pop();
             nuevaVenta.totalVentadiaria = vendedorPOP.totalVentadiaria + nuevaVenta.monto;
        return nuevaVenta;
       }else{
            nuevaVenta.totalVentadiaria = nuevaVenta.monto;
            console.log("NUEVA VENTA DEL DIA: VENDEDOR: " + nuevaVenta.vendedor + " SUMA: " + nuevaVenta.totalVentadiaria);
            return nuevaVenta
         }
       }else{
        nuevaVenta.totalVentadiaria = nuevaVenta.monto;        
        console.log("NUEVA VENTA DEL DIA: VENDEDOR: " + nuevaVenta.vendedor + " SUMA: nuevaVenta.totalVentadiaria")
        return nuevaVenta
       }

}

//escritura de archivo JSON Y EXCEL
async function escribir(data, path, model){   
    await escribirExcel(data, path);
    return fs.writeFileSync(`${path}.json`, JSON.stringify(data));
}

async function escribirExcel(data, path){     
    try{
    let valorTotal = 0;
    var schema = await [
        {
            column: 'vendedor',
            type: String,
            value: data => data.vendedor            
        },
        {
            column: 'monto',
            type: Number,
            value: data => data.monto
        },
        {
            column: 'observaciones',
            type: String,
            value: data => data.observaciones
        },
        {
            column: 'fecha',
            type: String,
            value: data => data.fecha
        },
        {
            column: "valor total",
            type: Number,
            value: data => valorTotal += data.monto
        }
    ]
  
    await writeXlsxFile(data, {
        schema,
        filePath: `${path}.xls`
    })
    return;
    }
    catch(err){
        console.log(err)
    }
}

module.exports = {
    escribir,    
    leer, 
    crearJson,
    sumaVentaDiario,
    sumarVentas
};