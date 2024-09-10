const io = require("socket.io")(3221,{
    cors : {
        origin:"*",
        methods:["GET","POST"]
    }
})

io.on('connect',(socket)=>{
    console.log("connected to the server.....")
    console.log(socket.handshake.query.userId)
})

////