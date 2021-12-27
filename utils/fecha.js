var anio = new Date().getFullYear();

var meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

let mes = new Date().getMonth();
let mesEnCurso = queMes(mes);

function queMes(mes){
    return meses[mes] +"-"+ anio;
}

module.exports = mesEnCurso;