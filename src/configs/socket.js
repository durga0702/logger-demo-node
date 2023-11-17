import http from 'http';
import express from "express";
import { Server as SocketServer } from 'socket.io';

export const app = express();
let userCount = 0;
let monitorName ="monitor-app";
let monitorId = '';


const server = http.createServer(app);
const socketParams = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    transports: ["websocket", "polling"],
};

// Initialize Socket.io
const io = new SocketServer(server, socketParams);

// Define Socket.io behavior
io.on('connection', (socket) => {
    console.log('A user connected');
    // console.log(socket.handshake);
    // console.log('from',socket.handshake.query.from_type);
    if(monitorName == socket.handshake.query.from_type ){
      monitorId = socket.id;
    }
    if(monitorName !== socket.handshake.query.from_type ){
        userCount++;
      }
    if(monitorId){
        io.to(monitorId).emit('userdetails', {...socket.handshake.query});
    }
    // socket.disconnect(true)
    socket.on('disconnect', (data) => {
        console.log('A user disconnected');
        if(monitorName !== socket.handshake.query.from_type ){
            userCount--;
          }
        if(monitorId){
        io.to(monitorId).emit('userdetails', data);
       }
    });

    // listen 
    socket.on('details', (data) => {
        console.log(data);
        io.to(monitorId).emit('userdetails', data);
    });
});

module.exports ={server,app}