const ventasDiariaModel = require("../models/ventaDiarias");
const ventasMesualModel = require("../models/ventasMensual");
const sumaVentaDiaria = require("../models/totalDeVentaDiaria");
let fecha = require("../utils/fecha");
const writeXlsxFile = require('write-excel-file/node');

class Mongo {

    constructor() {}
    
   async leer(base, model) {
        
       try{
           if(model == "diaria"){
            base = await ventasDiariaModel.find();                     
           }
           if(model == "mensual"){
            base = await ventasMesualModel.find();
           }
           if(model == "totalVentaDiaria"){
            base = await sumaVentaDiaria.find();  
           }           
           return base
        }catch(error){
        console.log('Error al leer en Mongo:', base, error);
        } 
    }

    async totalVentas(vendedor, monto){
        try{
           let result = await sumaVentasDelDia.findOne({vendedor: vendedor});
           console.log(result)
           if(result == null){
             let data = {
                 vendedor: vendedor,
                 suma: monto
             }
            await sumaVentasDelDia.create(data);
            return data.suma;
           }else{
               let nuevoMonto = result.suma + monto;
               await sumaVentasDelDia.findOneAndUpdate({vendedor: vendedor}, {suma: nuevoMonto})
            return nuevoMonto;
           }
           
        }catch(error){
            console.log('Total de ventas no existe:', error);
        }
      
    }

    async guardar(data, model) {    
        try{
            if(model == "diario")            
            await ventasDiariaModel.create(data);
            if(model == "mensual")
            await ventasMesualModel.create(data);
            if(model == "sumaDiaria"){
               let base = await sumaVentaDiaria.find();
               if(base.length == 0){
                   data.suma = "suma"
                await sumaVentaDiaria.create(data);
               }else{
                
                let suma = data + base.totalVentadiaria; 
                base.ccc="ddddddddddd"  
                console.log("base "+ base)
                await sumaVentaDiaria.findOneAndUpdate({suma: "suma"}, {$set: {totalVentadiaria: base}});
                }
            }
            
        }catch{
            console.log("error en guardar MONGO: " + data);
        }      
    }

    async sumarVenta(data, model){
        try{
        if(model == "sumaMensual"){    
        let test = await ventasMesualModel.findOne({ vendedor: data.vendedor });
        if(test){
            await ventasMesualModel.updateOne({vendedor: data.vendedor}, {$set: {monto: data.monto}});
        }else{
            await ventasMesualModel.create(data);
        }
        }
        if(model == "sumaDiaria"){
            //let test = await sumaVentaDiaria.findOne({suma: "suma"});
            let test = await sumaVentaDiaria.findOne({suma: "suma"});
            if(test){
                let suma = test.totalVentadiaria + data.monto;
                await sumaVentaDiaria.updateOne({suma: "suma"}, {$set: {totalVentadiaria: suma}});
                return suma;    
            }else{
                let create = {suma: "suma", totalVentadiaria: data.monto}
                await sumaVentaDiaria.create(create);
                return data.monto;
            }
        }
        return
        }catch(err){
            console.log("ERROR EN: sumarVenta, DATA: " + data + " " + err); 
            
        }
    }
    
    async crearExcel(model, path){            
            try{
                let data = " ";
                let path = " ";
                if(model=="mensual"){
                    data = await ventasMesualModel.find();
                    path = `./baseDeDatos/${fecha}`;
                }
                if(model=="diario"){
                    data = await ventasDiariaModel.find();
                    let date =  new Date;
                    path = `./baseDeDatos/${date.getDate()+"-"+fecha}`;
                }
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
    
}    


module.exports = new Mongo;
            
            

           
       
 
