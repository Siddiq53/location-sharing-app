let express=require("express")
let app=express()

let ejs=require("ejs")
let http=require("http")
let server=http.createServer(app)
let socket=require("socket.io")
const path = require("path")
let io=socket(server)

io.on("connect",(socket)=>{
    
    socket.on("send-location",(data)=>{
        io.emit("receive-location",{id:socket.id,...data})
    })

    socket.on("disconnect",(data)=>{
        io.emit("user-disconnected",socket.id)
    })
})
app.set("view engine","ejs")
app.use(express.static(path.join(__dirname,"public")))

app.get("/",(req,res)=>{
    res.render("app")
})

server.listen(8000,()=>{
    console.log("Server connected")
})