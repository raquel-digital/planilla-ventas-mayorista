const mongoose = require('mongoose');
let fecha = require("../utils/fecha");
let date =  new Date; 

const schema = mongoose.Schema({
    vendedor: { type: String, require: true, max: 400 },
    monto: { type: Number, require: true, max: 100000000000000 },    
    fecha: { type: String, require: true, max: 400 },
    totalVentadiaria: { type: Number, max: 100000000000000 }
});

const ventas = mongoose.model(`${date.getDate()+"-"+fecha}`, schema);

module.exports = ventas;