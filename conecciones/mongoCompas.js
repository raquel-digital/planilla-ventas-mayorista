const mongoose = require('mongoose');
const dotenv = require('dotenv').config();
const urlMongoAtlas = process.env.mongoDB;

const connection = mongoose.connect(urlMongoAtlas, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connection.on('connected', () => {    
    console.log('[Mongoose Conexion MongoATLAS] - connected in:', urlMongoAtlas);
});

mongoose.connection.on('error', (err) => {
    console.log('[Mongoose] - error:', err);
});

module.exports = connection; 