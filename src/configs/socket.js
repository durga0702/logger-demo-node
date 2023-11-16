import http from 'http';
import express from "express";
import { Server as SocketServer } from 'socket.io';

export const app = express();
let userCount = 0;


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
    console.log(socket.id);
    console.log(socket);
    userCount++;
    io.emit('usercount', {user_count:userCount});
    // Handle custom events
    // socket.on('chat message', (msg) => {
    //     io.emit('chat message', msg);
    // });

    io.on('disconnect', () => {
        console.log('A user disconnected');
        userCount--;
        io.emit('usercount', {user_count:userCount});
    });
});

module.exports ={server,app}