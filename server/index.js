const {generateTextMessage,generateLocation} = require('../template/message')
const {Users} = require('./user')
const user = new Users();
const path = require('path') // built in nodejs

const socketIO = require('socket.io');
const http = require('http')

const express = require('express');

//http create server
const app = express();
const server = http.createServer(app);
const io = socketIO(server)

// set duong tuyet doi
const publicPath =  path.join(__dirname + '/../public')
//server static
app.use(express.static(publicPath))

//chat app
io.on('connection', (socket) => {
    
    //join room
    socket.on('joinroom',(msg)=> {
        const {room, name} = msg
        socket.join(room)

        const newUser = {
            id: socket.id,
            name, room
        }
        
        user.addUser(newUser)

        io.to(room).emit("listUser",{
            listUser : user.getListOfUserInRoom(room)
        })
        //Alert has member join
        socket.broadcast.to(room).emit('sendMsg',generateTextMessage("Admin",`${name} Joined`))
        //welcome new user
        socket.emit('sendMsg',generateTextMessage('Admin',`Welcome to ${room}`))
        //send message to clien
        socket.on('createMsg',(msg) => {
            io.to(room).emit('sendMsg',generateTextMessage( name,msg.text))
        })
        socket.on('disconnect', () => {
            socket.broadcast.to(room).emit('sendMsg',generateTextMessage( name,`${name} left`))
            user.removeUserById(newUser.id)
            io.to(room).emit("listUser",{
                listUser : user.getListOfUserInRoom(room)
            })
            console.log("user disconnect")
        })
    })

    socket.on('createLocation',(msg)=> { 
        io.emit('sendLocation',generateLocation(msg.from,msg.latitude,msg.longitude))
    })
})

const port = process.env.PORT || 5000;
server.listen(port,()=>{
    console.log("connected")
})