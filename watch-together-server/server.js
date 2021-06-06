const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)

const cors = require('cors')

app.use(cors())

io.on('connection', (socket) => {

  socket.on('joinRoom', (roomName, userName) => {
    socket.join(roomName)
    io.to(roomName).emit('newUserJoin', userName)
  })

  // socket.emit('updateInfo', props.data.roomName, currentVideo, playState, playTime)
  socket.on('updateInfo', (room, currentVideo, playState, playTime, userName) => {
    io.to(room).emit('checkInfo', currentVideo, playState, playTime, userName)
  })

  socket.on('message', ({userName, message, room}) => {
    io.to(room).emit('message', {userName, message})
  })

  socket.on('changeVideo', (video, room) => {
    console.log(video)
    io.to(room).emit('newVideo', video)
  })

  socket.on('pauseVideo', (room) => {
    io.to(room).emit('requestPause')
  })

  socket.on('playVideo', (room) => {
    io.to(room).emit('requestPlay')
  })

})


http.listen(3000, () => {
  console.log('Listening ... ')
})