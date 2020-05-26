const users = []

const addUser = ({id,username,room})=>{
    username = username.trim()
    room = room.trim()

    if(!username || !room){
        return {
            error:'username and room is required!'
        }
    }

    const existingUser = users.find(u=>{
        return u.room == room && u.username == username
    })

    if(existingUser){
        return {
            error:'username is already taken'
        }
    }

    const user = {
        id,username,room
    }
    users.push(user)
    return {user}
}

const removeUser = id=>{
    const index = users.findIndex(e=>e.id === id)
    if(index != -1){
        return users.splice(index,1)[0]
    }
}

const getUser = id=>{
    const user = users.find(e => e.id == id )

    return user
}

const getRoomUsers = room =>{
    const roomUsers = users.filter(e => e.room == room)

    return roomUsers
}

module.exports = {
    addUser,removeUser,getRoomUsers,getUser
}

