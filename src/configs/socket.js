import http from 'http';
import express from "express";
import { Server as SocketServer } from 'socket.io';

export const app = express();
// let userCount = 0;
let monitorName ="monitor-app";
let monitorId = [];


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
    console.log('from',socket.handshake.query);
    if(monitorName == socket.handshake.query.from_type ){
        let index = monitorId.findIndex((x)=>x===socket.id);
           if(index == -1){
             monitorId.push(socket.id);
           }
    //   monitorId = socket.id;
    }
    // if(monitorName !== socket.handshake.query.from_type ){
    //     userCount++;
    //   }
    if(monitorId.length>0){
        monitorId.forEach((x)=>{
            io.to(x).emit('userdetails', {...socket.handshake.query});
        })
    }
    // socket.disconnect(true)
    socket.on('disconnect', () => {
        console.log('A user disconnected',);
        // if(monitorName !== socket.handshake.query.from_type ){
        //     userCount--;
        //   }
        if(monitorName == socket.handshake.query.from_type ){
         let index = monitorId.findIndex((x)=>x===socket.id);
           if(index == -1){
             monitorId.splice(index,1);
           }
        }
        console.log(socket.handshake.query)
        console.log(monitorId)
        if(monitorId.length>0){
            monitorId.forEach((x)=>{
                io.to(x).emit('userdetails', {...socket.handshake.query});
            })
        }
    });

    // listen 
    socket.on('details', (data) => {
        console.log(data);
        if(monitorId.length>0){
            monitorId.forEach((x)=>{
                io.to(x).emit('userdetails', data);
            })
        }
    });
});

module.exports ={server,app}