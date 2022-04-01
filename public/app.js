// inicializamos la conexion
const socket = io.connect();

var formulario = document.querySelector(".formulario");
var montoVenta = document.querySelector(".ingreso-venta");
var vendedor = document.querySelector(".vendedor");
var observaciones = document.querySelector(".observaciones");
var dropdown =  document.querySelector(".vendedoresDropdown");
var report = document.querySelector(".report");
var global = document.querySelector(".global");
var mayorista = document.querySelector(".sectorVendedores");

socket.emit("ready")

socket.on("mayorista", () => {
  mayorista.innerHTML = `
    ${vendedoresMayorista}
  `;
})


global.addEventListener("click", event => {
    let mouse = event.target;
    if(mouse.classList.contains('venta')){
        let vendedor = mouse.previousElementSibling.previousElementSibling.previousElementSibling;
        let monto = mouse.previousElementSibling;
        ingresarVenta(vendedor.textContent, parseInt(monto.value))
        //monto.value = " ";
    }
    if(mouse.classList.contains('salir')){
      console.log("salir")
      salir()
    }
})

var vendedores = [{vendedor: "elba", totalVentadiaria: 0}, {vendedor: "santiago", totalVentadiaria: 0}, {vendedor: "cristina", totalVentadiaria: 0}, {vendedor: "juan", totalVentadiaria: 0}, {vendedor: "fabian", totalVentadiaria: 0}]

socket.on("ventas-realizadas", ventas => {
    ventas.forEach(v => {
      
        report.innerHTML +=  `<tr><td>${v.vendedor}</td><td>${v.monto}</td><td>${v.fecha}</td></tr>`//`<li">fecha: ${v.fecha} vendio: ${v.vendedor} monto: ${v.monto}</li>`
    })
})
socket.on("totalVentas-inicio", data => {
  if(data.lenght > 0){
    console.log(data)
    if(data[0].totalVentadiaria == undefined){
      document.querySelector(".totalVentas").innerHTML = `<h1>INGRESO DE VENTAS. TOTAL DE VENTAS DEL DIA: 0</h1>`;
    }else{
    document.querySelector(".totalVentas").innerHTML = `<h1>INGRESO DE VENTAS. TOTAL DE VENTAS DEL DIA: ${data[0].totalVentadiaria}</h1>`;
   }
  }
})
socket.on("totalVentas", data => {
  console.log(data)
    if(data[0].totalVentadiaria != null){
      document.querySelector(".totalVentas").innerHTML = `<h1>INGRESO DE VENTAS. TOTAL DE VENTAS DEL DIA: ${data[0].totalVentadiaria}</h1>`;
    }
  })

socket.on("ventaDiaria", ventas => {
    ventas.forEach(venta => { 
    let suma = document.querySelector("." + venta.vendedor);
        suma.textContent = `${venta.totalVentadiaria}`;
  })
})

function ingresarVenta(vendedor, monto){
    let fecha = new Date().toLocaleString();
    let venta = {
        vendedor: vendedor,
        monto: monto,        
        fecha: fecha        
    }
    let confirm = window.confirm(vendedor + " vendio: $ " + monto + " fecha: " + fecha)
    if(confirm){
        report.innerHTML += `<tr><td>${vendedor}</td><td>${monto}</td><td>${fecha}</td></tr>`
        // let borrarMonto = document.querySelectorAll(".monto");
        // borrarMonto.forEach( m => {
        //     m.value = " ";
        // })
        socket.emit('nueva-venta', venta);
        return;
    }else{
        alert("venta cancelada");
        venta = "";
        return;
    }
}

function cambiarNombre(nombre){     
    return vendedor.textContent = nombre;
}

//check admin
socket.on("admin", () => {
  document.querySelector(".admin").innerHTML = `<span class="col-1"> </span><button><a href="/fileMes">descarga del mes</a></button><span class="col-1"> </span><button><a href="/fileDia">descarga del dia</a></button><hr>`
})

//---BARS GRAPH

// const labels = ["Elba", "Santiago", "Juan", "Fabian", "Cristina", "Daniel"];
// let data = {
//   labels: labels,
//   datasets: [{
//     label: 'VENTAS DIARIAS',
//     data: [0, 0, 0, 0, 0, 0],
//     backgroundColor: [
//       'rgba(239, 255, 22, 0.2)',
//       'rgba(241, 58, 119, 0.2)',
//       'rgba(60, 109, 243, 0.2)',
//       'rgba(60, 243, 203, 0.2)',
//       'rgba(255, 192, 245, 0.2)',
//       "rgba(28, 233, 21,0.2)"
//     ],
//     borderColor: [
//       'rgb(239, 255, 22)',
//       'rgb(241, 58, 119)',
//       'rgb(60, 109, 243)',
//       'rgb(60, 243, 203)',
//       'rgb(55, 192, 245)',
//       "rgb(28, 233, 21)"
//     ],
//     borderWidth: 1
//   }]
// };
// let config = {
//   type: 'bar',
//   data: data,
//   options: {
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   },
// };
// var myChart = new Chart(
//     document.getElementById('myChart'),
//     config
//   );

  function salir(){
    socket.emit("salir");
  }

const vendedoresMayorista = `
<div class="col-4" style="background-color: rgb(239, 255, 22);">
<b>Elba</b>
<p>monto venta:</p>
<input class="monto" type="number"> 
<button class="btn btn-success center venta">Confirmar</button>
<p>Total venta diaria: </p><p class="Elba"></p> 
</div>
<hr>
<div class="col-4" style="background-color: rgb(241, 58, 119);">
<b>Santiago</b>
<p>monto venta:</p>
<input class="monto" type="number"> 
<button class="btn btn-success center venta">Confirmar</button>
<p>Total venta diaria: </p><p class="Santiago"></p>  
</div>
<hr>
<div class="col-4 " style="background-color:rgb(90, 132, 250)">
<b>Juan</b>
<p>monto venta:</p>
<input class="monto" type="number"> 
<button class="btn btn-success center venta">Confirmar</button> 
<p>Total venta diaria: </p><p class="Juan"></p> 
</div>
<hr>
<div class="col-4 " style="background-color:rgb(125, 250, 208)">
<b>Fabian</b>
<p>monto venta:</p>
<input class="monto" type="number"> 
<button class="btn btn-success center venta">Confirmar</button>
<p>Total venta diaria: </p><p class="Fabian"></p>  
</div>

<div class="col-4 " style="background-color:rgb(255, 192, 245)">
<b>Cristina</b>
<p>monto venta:</p>    
<input class="monto" type="number"><button class="btn btn-success center venta">Confirmar</button>   
<p>Total venta diaria: </p><p class="Cristina"></p> 
</div>

<div class="col-4 " style="background-color:rgb(28, 233, 21)">
<b>Daniel</b>
<p>monto venta:</p>    
<input class="monto" type="number"><button class="btn btn-success center venta">Confirmar</button>   
<p>Total venta diaria: </p><p class="Daniel"></p> 
</div>`;  


