
    var socket = io();
    socket.on('connect', () => {
        console.log('Connect to server')
    })

    socket.on('disconnect', ()=> {
        console.log('Disconnect ')
    })

    socket.on('welcome', (msg)=> {
        console.log(msg)
    })  

    socket.on('newUser', (msg)=> {
        console.log(msg)
    })  

    socket.on('alert', (msg)=> {
        console.log(msg)
    })

    socket.emit('message', {
        from: "client",
        text: "hi server"
    })

    // //send msg to server => server send all client
    // socket.emit('createMsg',{
    //     from : "User1",
    //     text : "Hello im user1"
    // })

    socket.on('sendMsg',(msg)=> {
        var template = $('#message-template').html()
        var html = Mustache.render(template, {
            text: msg.text,
            from : msg.from,
            createdAt : moment(msg.createdAt).format('h:mm a')
        })
        // let liTag = $(`<li>${moment(msg.createdAt).format('h:mm a')}${msg.text}</li>`)
        // $("#message").append(liTag)
        $("#message").append(html)
    })
    

$('#message-form').on('submit',(e) => {
    e.preventDefault();
    socket.emit('createMsg', {
        from : "user",
        text : $("[name=message]").val()
    })
    $('input[name=message]').val("") 
    $('#message').animate({
        scrollTop: $('#message')[0].scrollHeight
    }, 100);
})



$('#sendLocation').on('click',()=> {
    if (!navigator.geolocation){
        alert("do browser dosenot support, please Update")
    }else{
        navigator.geolocation.getCurrentPosition(position => {
            const {latitude,longitude} = position.coords
            socket.emit('createLocation',{
                from : 'User',
                latitude,
                longitude
            })
        })
    }
})

socket.on('sendLocation',(msg)=> {

    
    // let liTag = $("<li></li>")
    // let aTag = $("<a>My Location</a>")
    // aTag.attr("href", `https://www.google.com/maps/@${msg.latitude},${msg.longitude},1z`)
    // aTag.attr("target", "_blank")
   
    // liTag.append(aTag)
    // $('#message').append(liTag)

    var template = $('#location-template').html()
    var html = Mustache.render(template, {
        location: '<a href=' + `https://www.google.com/maps/@${msg.latitude},${msg.longitude},1z` + ' target="_blank">My Location</a>',
        from : msg.from,
        createdAt : moment(msg.createdAt).format('h:mm a')
    })

    $("#message").append(html)
})

