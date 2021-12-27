const express = require('express');
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//conectamos mongoDB
require('./conecciones/mongoCompas');
//CRUD
// const mongo = require("./api/mongo");
 let mongoCRUD = require("./api/mongo");

//UTILS
let fecha = require("./utils/fecha");
let controller = require("./utils/mainController");
let pathLectura = `../baseDeDatos/${fecha}.json`;
//DOTENV
const dotenv = require('dotenv').config();
//MIDLEWARE
const loginMiddleware = require("./utils/midleware");
 
var data = []; //array de ventas GLOBAL
var ventaDiaria = [];// array de ventas dia a dia
var resultDiarioTotal; //total de ventas del dia
(async () => {
    let totalVentaDiaria = undefined;
    try{
        totalVentaDiaria = await mongoCRUD.leer(totalVentaDiaria, "totalVentaDiaria");
        data = await mongoCRUD.leer(data, "mensual");        
        if(data.length == 0){
            data = await controller.leer(data, `${pathLectura}`);            
        }        
        let date =  new Date;
        ventaDiaria = await mongoCRUD.leer(ventaDiaria, "diaria");
        if(ventaDiaria.length == 0)        
        ventaDiaria = await controller.leer(ventaDiaria, `../baseDeDatos/${date.getDate()+"-"+fecha}.json`);
    }catch(err){
        console.log(`BASE DE DATOS NO ENCONTRADA. CREANDO BASE DE DATOS FECHA:  ${fecha}`);
        data = await controller.crearJson(data, `./baseDeDatos/${fecha}.json`);
        data = await controller.leer(data, `${pathLectura}`);
        let date =  new Date;
        ventaDiaria = await controller.crearJson(ventaDiaria, `./baseDeDatos/${date.getDate()+"-"+fecha}.json`);        
        ventaDiaria = await controller.leer(ventaDiaria, `../baseDeDatos/${date.getDate()+"-"+fecha}.json`);
    }
    //await mongoCRUD.crearExcel("mensual")
    socketFunction("ventaDiaria", ventaDiaria);
    let suma = 0
    if(totalVentaDiaria != undefined){ suma = totalVentaDiaria[0].totalVentadiaria }
    socketFunction("totalVentas", suma);
})()

//Iniciamos Web Socket
const http = require('http').Server(app);
const io = require('socket.io')(http);
const PORT = process.env.PORT || 8080;

//HandleBars
const handlebars = require('express-handlebars');
const { json } = require('express');
const { async } = require('rxjs');
const { nextTick, mainModule } = require('process');
const { watchOptions } = require('nodemon/lib/config/defaults');
app.engine('hbs', handlebars({
    extname: '.hbs',//extension
    defaultLayout: 'index.hbs',//pagina por defecto
    layoutsDir: __dirname + '/views/layouts',//dir layouts
    partialsDir: __dirname + '/views/partials/'//dir partials
}));

//seteo el motor de plantilla
app.set('view engine', 'hbs');
app.set('views', './views');
//Carpeta public
app.use(express.static('./public'));

//RUTA
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/singup', loginMiddleware.isLogin);

app.get('/', loginMiddleware.logged, async (req, res) => {
    const admin = loginMiddleware.superAdminCheck
    const bool = admin()
    if(bool){
        socketFunction("admin");
    }
    res.render('main');
});


app.get('/fileMes', loginMiddleware.superAdmin, async (req, res) => {
    await mongoCRUD.crearExcel("mensual")
    let pathLectura = `./baseDeDatos/${fecha}.xls`
    res.download(pathLectura);
    res.status(200);
  });
  app.get('/fileDia', loginMiddleware.superAdmin, async (req, res) => {
    await mongoCRUD.crearExcel("diario")  
    let date =  new Date;
    let pathLectura = `./baseDeDatos/${date.getDate()+"-"+fecha}.xls`
    res.download(pathLectura);
    res.status(200);
  });

let socketFunction = ((string, data) => {
    io.on('connect', socket => {
        socket.emit(string, data)
    })
    return {string: string, data: data};
})

  

//WEBSOCKET
io.on('connect', socket => {
    console.log('nueva conexion');
    if(data != null){        
        socket.emit("ventas-realizadas", ventaDiaria)
    }
    
    socket.on('nueva-venta', async nuevaVenta => {
        nuevaVenta.monto = parseFloat(nuevaVenta.monto);
        let date =  new Date;        
        controller.escribir(ventaDiaria, `./baseDeDatos/${date.getDate()+"-"+fecha}`);
        let resultDiario = await controller.sumaVentaDiario(nuevaVenta, ventaDiaria);
        await mongoCRUD.guardar(resultDiario, "diario");
        let result = await controller.sumarVentas(nuevaVenta, data, `./baseDeDatos/${fecha}`)//, "mensual");
       await mongoCRUD.sumarVenta(result, "sumaMensual");
        resultDiarioTotal = await mongoCRUD.sumarVenta(nuevaVenta, "sumaDiaria"); 
        ventaDiaria.push(nuevaVenta);
        let ventaTemp = [];
        ventaTemp.push(resultDiario)
        let totalVentaDiaria = undefined;
        totalVentaDiaria = await mongoCRUD.leer(totalVentaDiaria, "totalVentaDiaria");
        if(totalVentaDiaria != undefined){ suma = totalVentaDiaria[0].totalVentadiaria }
        socketFunction("totalVentas", suma);
        socket.emit("ventaDiaria", ventaTemp);
        socket.emit("totalVentas", resultDiarioTotal);        
    });

    socket.on("salir", ()=>{
        console.log("salir")
        loginMiddleware.salir();
    })
})

app.get("/total", (req, res) => {
    res.send("TOTAL DEL DIA: " + resultDiarioTotal)
})

http.listen(PORT, () => {
    console.log(`servidor escuchando en http://localhost:${PORT}`);
});
// en caso de error, avisar
http.on('error', error => {
    console.log('error en el servidor:', error);
});