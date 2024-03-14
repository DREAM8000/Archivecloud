const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Manejar conexión de cliente
io.on('connection', (socket) => {
    console.log('Nuevo cliente conectado');

    // Manejar recepción de archivos
    socket.on('file', (data) => {
        console.log('Archivo recibido:', data.filename);
        // Guardar el archivo en el servidor (aquí puedes implementar la lógica para almacenarlo en el sistema de archivos)
        fs.writeFileSync(`uploads/${data.filename}`, data.file);
        // Notificar a todos los clientes (excepto al remitente) que hay un nuevo archivo disponible
        socket.broadcast.emit('newFile', { filename: data.filename });
    });
});

server.listen(3000, () => {
    console.log('Servidor WebSocket escuchando en el puerto 3000');
});
