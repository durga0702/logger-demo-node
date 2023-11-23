import http from 'http';
import express from "express";
import { Server as SocketServer } from 'socket.io';

export const app = express();
// let userCount = 0;
let monitorName ="monitor-app";
let monitorId = [];
let hostname ="host-app";
let connectedUsers = [];


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
    console.log('from',socket.handshake.query);

    // monitor - store socket ids into array
    if(monitorName == socket.handshake.query.from_type ){
        let index = monitorId.findIndex((x)=>x===socket.id);
           if(index == -1){
             monitorId.push(socket.id);
           }
    }

    // host App - store host user Ids and socket Ids into array
    if(hostname == socket.handshake.query.from_type ){
        let index = connectedUsers.findIndex((x)=>x.id===socket.handshake.query.user_id);
           if(index == -1){
             monitorId.push({user_id:socket.handshake.query.user_id})
             console.log('user', connectedUsers);
    }
}

    if(monitorId.length>0){
        monitorId.forEach((x)=>{
            io.to(x).emit('userdetails', {...socket.handshake.query});
        })
    }
    // socket.disconnect(true)
    socket.on('disconnect', () => {
        console.log('A user disconnected',);
        // remove monitor id
       if(monitorName == socket.handshake.query.from_type ){
         let index = monitorId.findIndex((x)=>x===socket.id);
           if(index == -1){
             monitorId.splice(index,1);
           }
        }

        //remove user
        if(hostname == socket.handshake.query.from_type ){
            let index = connectedUsers.findIndex((x)=>x.user_id===socket.handshake.query.user_id);
              if(index == -1){
                connectedUsers.splice(index,1);
              }
              console.log(connectedUsers);
           }

        console.log(socket.handshake.query)
        console.log(monitorId)
        if(monitorId.length>0){
            console.log('entered')
            console.log(monitorId)
            let data={
                ...socket.handshake.query
            }
            data.status = "disconnect";
            monitorId.forEach((x)=>{
                io.to(x).emit('userdetails', {...data});
            });
        }
    });

    // listen route change
    socket.on('routedetail', (data) => {
        console.log(data);
        if(monitorId.length>0){
            monitorId.forEach((x)=>{
                io.to(x).emit('userdetails', data);
            })
        }
    });

     // listen country
     socket.on('countrydetail', (data) => {
        console.log(data);
        if(monitorId.length>0){
            monitorId.forEach((x)=>{
                io.to(x).emit('userdetails', data);
            })
        }
    });
});

module.exports ={server,app}