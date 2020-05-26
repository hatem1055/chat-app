const socket = io()
//templates
const messageTemplate = $('#message-template').html()
const messageTemplateMe = $('#message-template-me').html()
const locationTemplate = $('#location-template').html()
const locationTemplateMe = $('#location-template-me').html()
//options
const {username,room} = Qs.parse(location.search,{ignoreQueryPrefix:true})
//functions
const usersStringFunc = users =>{
    let usersArr = []
    for(u of users){
        usersArr.push(u.username)
    }
    return usersArr.join(',')
}
socket.on('welcome',({text,user},users)=>{
    // console.log(users)
    const usersString = usersStringFunc(users)
    $('.friends').text(usersString)
    $('.roomName').text(room)
})
$('#sendingMessageForm').submit(function (e){
    e.preventDefault()
//disabling the form untill the message delevers
$('#sendMessage').prop("disabled", true)
    let message = $('#sendingMessageInput').val()
//emiting the message
    socket.emit('sendingMessage',message,()=>{
        $('#sendingMessageInput').val('') // clearing the input field
        $('#sendMessage').prop("disabled", false) //makes the form able again
        $('#sendingMessageInput').focus()
    })
})
// when a message came
socket.on('messageSent',({text,createdAt,user})=>{
    // $('#messageSpan').text(message)
    if(user.username == username){
        const html = Mustache.render(messageTemplateMe,{
            text,
            createdAt:moment(createdAt).format('hh:mm'),
            user:user.username
        })
        $('#messagesContainer').append(html)
    }else{
        const html = Mustache.render(messageTemplate,{
            text,
            createdAt:moment(createdAt).format('hh:mm'),
            user:user.username
        })
        $('#messagesContainer').append(html)
    }

})
//when user come
socket.on('userCame',({text,createdAt,user},users)=>{
    const html = Mustache.render(messageTemplate,{
        text,
        createdAt:moment(createdAt).format('hh:mm'),
        user:user.username
    })
    $('#messagesContainer').append(html)

    const usersString = usersStringFunc(users)
    console.log(usersString)
    $('.friends').text(usersString)
})
//when user leave
socket.on('userLeft',({text,createdAt,user},users)=>{
    const html = Mustache.render(messageTemplate,{
        text,
        createdAt:moment(createdAt).format('hh:mm'),
        user:user.username
    })
    $('#messagesContainer').append(html)
    const usersString = usersStringFunc(users)
    $('.friends').text(usersString)
})

$('#sendLocationBtn').click(function(){
    //checking if the browser of the user support geolocation
    if(!navigator.geolocation){
        return alert('geoloaction is not supported by your browser')
}
$(this).prop("disabled", true) //disabling the send location button untill the location to be sent
navigator.geolocation.getCurrentPosition((p)=>{
    socket.emit('sendLocation',{
        long:p.coords.longitude,
        lat:p.coords.latitude
    },_=>{
        $(this).prop("disabled", false)
    })
})
})
//when location came
socket.on('locationSent',({url,createdAt,user})=>{
    if(user.username == username){
        const html = Mustache.render(locationTemplateMe,{
            link:url,
            createdAt:moment(createdAt).format('hh:mm'),
            user:user.username
        })
        $('#messagesContainer').append(html)
    }else{
        const html = Mustache.render(locationTemplate,{
            link:url,
            createdAt:moment(createdAt).format('hh:mm'),
            user:user.username
        })
        $('#messagesContainer').append(html)
    }
        
})

socket.emit('join',{username,room},(error)=>{
    if(error){
        alert(error)
        location.replace('/')
    }
})