const mongoose = require('mongoose');
let fecha = require("../utils/fecha");
let date =  new Date; 

const schema = mongoose.Schema({
    suma: {type: String, max: 400},
    totalVentadiaria: { type: Number, max: 100000000000000 }
});

const ventas = mongoose.model(`Total-dia: ${date.getDate()+"-"+fecha}`, schema);

module.exports = ventas;