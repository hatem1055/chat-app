const generateMessage = (text,user)=>{
    return{
        text,
        createdAt:new Date().getTime(),
        user
    }
}

const generateLocation = (url,user)=>{
    return{
        url,
        createdAt:new Date().getTime(),
        user
    }
}

module.exports = {
    generateMessage,generateLocation
}