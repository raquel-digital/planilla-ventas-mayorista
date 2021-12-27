const mongoose = require('mongoose');
let fecha = require("../utils/fecha");


const schema = mongoose.Schema({
    vendedor: { type: String, require: true, max: 400 },
    monto: { type: Number, require: true, max: 100000000000000 },    
    fecha: { type: String, require: true, max: 400 },
    totalVentadiaria: { type: Number, max: 1000000000000000 }
    
});

const ventas = mongoose.model(`${fecha}`, schema);

module.exports = ventas;