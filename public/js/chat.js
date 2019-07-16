    var queryString = window.location.search;
    var userObj = $.deparam(queryString)
    console.log(userObj)

    var socket = io();
    socket.on('connect', () => {
        socket.emit('joinroom',userObj)
    })

    socket.on('disconnect', ()=> {
    })
    //
    // //send msg to server => server send all client
    // socket.emit('createMsg',{
    //     from : "User1",
    //     text : "Hello im user1"
    // })

    socket.on("listUser", (msg)=> {
        const listUser = msg.listUser
        let olTag = $("<ol></ol>")

        listUser.forEach(user => {
            let liTag = $("<li></li>")
            liTag.text(user.name)
            olTag.append(liTag)
        })
        console.log(olTag)
        $("#users").html(olTag);
    })
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
        from : userObj.name,
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
                from : userObj,
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

