const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const cors = require('cors')

app.use(cors())

io.on('connection', (socket) => {

  socket.on('joinRoom', (roomName) => {
    socket.join(roomName)
    console.log(socket)
  })

  socket.on('message', ({userName, message, room}) => {
    io.to(room).emit('message', {userName, message})
  })

  socket.on('changeVideo', (video) => {
    io.emit('newVideo', video)
  })

  socket.on('pauseVideo', () => {
    io.emit('requestPause')
  })

  socket.on('playVideo', () => {
    io.emit('requestPlay')
  })

})


http.listen(3000, () => {
  console.log('Listening ... ')
})