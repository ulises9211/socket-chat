var socket = io();

var params = new URLSearchParams( window.location.search);

if( !params.has('nombre') || !params.has('sala')){
    window.location = 'index.html'
    throw new Error('El nombre y sala son necesarios es necesario');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function (resp) {
        console.log('Usuarios conecados:', resp);
    });
});

socket.on('crearMensaje', (resp) => {
    console.log(resp);
});

socket.on('listaPersonas', (resp) => {
    console.log(resp);
})
// escuchar

socket.on('mensajePrivado', function (mensaje) {
    console.log('Mensaje privado', mensaje);
});

socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});
