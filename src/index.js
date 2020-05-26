//modules
const express = require('express')
const http = require('http')
const path = require('path')
const socketio = require('socket.io')
const {generateMessage,generateLocation} = require('../src/utils/messages')
const {getRoomUsers,getUser,addUser,removeUser}= require('../src/utils/users')
//the server
const app = express()
const server = http.createServer(app)
const io = socketio(server)
//constants
const PORT = process.env.PORT
//static folder path
const static = path.join(__dirname,'../public')
//connecting to the static folder
app.use(express.static(static))
// making socket io make something on connection
io.on('connection',(socket)=>{
    //joining a room
socket.on('join',({username,room},cb)=>{
const {error,user} = addUser({id:socket.id,username,room})
if(error){
    return cb(error)
}

socket.join(room)
//welcome message
socket.emit('welcome',generateMessage('hello',user),getRoomUsers(room))
//sendign message to other users when this user come
socket.broadcast.to(room).emit('userCame',generateMessage(`${username} has joined!`,user),getRoomUsers(room))
// function runs when this user send a message
socket.on('sendingMessage',(input,cb)=>{
    //letting client side konws that there is a message 
        io.to(room).emit('messageSent',generateMessage(input,user))
        cb()
})
// when user disconnect
    socket.on('disconnect',()=>{
         removeUser(socket.id)
         io.to(room).emit('userLeft',generateMessage(`${username} has left`,user),getRoomUsers(room))
    })
// function runs when this user send his location
    socket.on('sendLocation',(p,cb)=>{
//letting client side konws that there is a location 
        io.to(room).emit('locationSent',generateLocation(`https://google.com/maps?q=${p.lat},${p.long}`,user))
        cb()
    })
    cb()
})
})
server.listen(PORT,_=>{
    console.log(`srever is up on ${PORT}`)
})