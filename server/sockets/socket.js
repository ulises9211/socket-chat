const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utilidades/utilidades');

const usuarios = new Usuarios();
io.on('connection', (client) => {

    console.log('Usuario conectado');

    //informa quien entro al chat
    client.on('entrarChat', (data, callback) => {
        console.log(data);
        if (!data.nombre ||   !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y/o sala son necesario'
            });
        }
        client.join(data.sala);
        usuarios.agregarPersona( client.id, data.nombre, data.sala);
        client.broadcast.to(data.sala).emit('listaPersonas' , usuarios.getPersonaPorSala(data.sala));
        callback(usuarios.getPersonaPorSala( data.sala ));
    });

    //Mandar un mensaje a todos los usuarios
    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona( client.id );
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
    });
    //Mandar un mensaje a otro usuario
    client.on('mensajePrivado', (data) => {
        let persona = usuarios.getPersona( client.id );
        console.log(persona);
        client.broadcast.emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje) );
    });

    //Desconectar al servidor
    client.on('disconnect', () => {
        let personaBorrada = usuarios.borrarPersona( client.id );

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salio` ));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas' , usuarios.getPersonaPorSala(personaBorrada.sala));
    });
});
