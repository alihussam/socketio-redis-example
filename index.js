const express = require('express');
const redis = require('socket.io-redis');
const socketIO = require('socket.io');
const socketIOClient = require('socket.io-client');
const app = express();

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => console.log(`Server on PORT:${PORT}`));

// creates a new server
const io_server = socketIO(server);

// run socket io with sockIORedis adapter to handle rooms
// allows running multiple instances
io_server.adapter(redis({
  host: '127.0.0.1',
  port: 6379
}));

// create a namespace
const io_sample_namespace = io_server.of('/sample-namespace');

io_sample_namespace.on('connection', (socket) => {
  console.log(`${PORT} : New Connection :`, socket.id);

  socket.on('message', (data) => {
    socket.broadcast.emit('message', data);
  })
});

//useless name space
const io_useless_namespace = io_server.of('/useless-ns');
io_useless_namespace.on('connection', (socket) => {
  console.log(`${PORT} : New connection at useless`, socket.id);
  socket.on('message', (data) => {
    console.log(`${PORT} : Useless recieved a message`, data);
  })
})


/* Act Client */
const client_socket = socketIOClient('http://localhost:' + PORT + '/sample-namespace');

client_socket.on('connect', () => {
  // schedule a message to send in namespace
  setTimeout(() => {
    client_socket.emit('message', `Hello from the other side!! ${PORT}`);
  }, 6000 + Math.floor(Math.random() * 3000));
});

client_socket.on('message', (data) => {
  console.log(`${PORT} recvd: `, data);
  setTimeout(() => {
    client_socket.emit('message', `Hello from the other side!! ${PORT}`);
  }, 6000 + Math.floor(Math.random() * 3000));
});






