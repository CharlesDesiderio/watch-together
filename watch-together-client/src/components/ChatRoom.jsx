import { useState, useEffect, useContext } from 'react'
import { Socket } from 'socket.io'
import AppData from '../AppContext'

import YouTube from 'react-youtube';
import io from 'socket.io-client'
import ChatHistory from './ChatHistory';

const socket = io('http://localhost:3000', {transports: ['websocket']});


const ChatRoom = (props) => {

  const [chat, setChat] = useState([])
  const [input, setInput] = useState({
    message: ''
  })

  // const handleMessageSend = (event) => {
  //   event.preventDefault()
  //   socket.emit('message', { userName, message })
  // }

  const handleChange = (event) => setInput({...input,
    [event.currentTarget.name]: event.currentTarget.value
  })

  const handleMessageSend = (event) => {
    event.preventDefault()
    const userName = props.data.userName
    const message = input['message']
    const room = props.data.roomName
    socket.emit('message', { userName, room, message })
  }

  useEffect(() => {
    
    socket.emit('joinRoom', props.data.roomName)

    socket.on('message', (incomingMessage) => {
      setChat([...chat, incomingMessage])
    })
  })

  //   useEffect(() => {

//     socket.on('message', (incomingMessage) => {
//       setChat([...chat, incomingMessage])
//     })

//     socket.on('newVideo', (incomingVideoId) => {
//       setCurrentVideo(incomingVideoId)
//     })

//     socket.on('requestPause', () => {
//       console.log('Pause requested')
//       videoRef.current.internalPlayer.pauseVideo()
//     })

//     socket.on('requestPlay', () => {
//       console.log('Play requested')
//       videoRef.current.internalPlayer.playVideo()
//     })

//   })


  const ContextData = useContext(AppData)

  return (
    <div>
      {/* youtube component */}
      {/* message component */}
      { chat.map((item) => {
        return <ChatHistory name={item.userName} message={item.message} />
      }) }
      Hey {ContextData.userName}
      <input type="text" onChange={handleChange} value={input['message']} name="message" /><button onClick={handleMessageSend}>Send</button>
    </div>
  )
}

export default ChatRoom;



// import { useState, useEffect, useRef } from 'react'
// import NewConnect from './components/NewConenct';
// import YouTube from 'react-youtube';
// import io from 'socket.io-client'

// const socket = io('http://localhost:3000', {transports: ['websocket']});

// const App = () => {

//   const [userName, setUserName] = useState('')
//   const [message, setMessage] = useState('')
//   const [chat, setChat] = useState([])
//   const [videoIdInput, setVideoIdInput] = useState('')
//   const [currentVideo, setCurrentVideo] = useState('rokGy0huYEA')

//   const [isConnected, setIsConnected] = useState(false)

//   const videoRef = useRef()

//   const handleNameChange = (event) => {
//     setUserName(event.target.value)
//   }

//   const handleMessageChange = (event) => {
//     setMessage(event.target.value)
//   }

//   const handleMessageSend = (event) => {
//     event.preventDefault()
//     socket.emit('message', { userName, message })
//   }

//   const handleVideoChange = (event) => {
//     setVideoIdInput(event.target.value)
//   }

//   const handleVideoSend = (event) => {
//     event.preventDefault()
//     console.log(videoIdInput)
//     socket.emit('changeVideo', videoIdInput)
//   }

//   const handlePlay = () => {
//     socket.emit('playVideo')
//   }

//   const handlePause = () => {
//     console.log('paused')
//     socket.emit('pauseVideo')
//   }

//   const opts = {
//     height: '390',
//     width: '640',
//     playerVars: {
//       // https://developers.google.com/youtube/player_parameters
//       autoplay: 0,
//     },
//   };

//   useEffect(() => {

//     socket.on('message', (incomingMessage) => {
//       setChat([...chat, incomingMessage])
//     })

//     socket.on('newVideo', (incomingVideoId) => {
//       setCurrentVideo(incomingVideoId)
//     })

//     socket.on('requestPause', () => {
//       console.log('Pause requested')
//       videoRef.current.internalPlayer.pauseVideo()
//     })

//     socket.on('requestPlay', () => {
//       console.log('Play requested')
//       videoRef.current.internalPlayer.playVideo()
//     })

//   })
  
//   return (
//     <div className="App">
//       { !isConnected ? <NewConnect /> :
//         <div>
//       { currentVideo !== '' ?
//         <YouTube ref={videoRef} videoId={currentVideo} opts={opts} onPlay={handlePlay} onPause={handlePause} onReady={_onReady} />
        
//       : null}
//       <div>{ chat.map((info) => {
//         return (
//           <p>{info.userName}: {info.message}</p>
//         )
//       }) }</div>
//       Name: <input type="text" value={userName} onChange={handleNameChange} />
//       Message: <input type="text" value={message} onChange={handleMessageChange} /><button onClick={handleMessageSend}>Send</button>
//       Video ID: <input type="text" value={videoIdInput} onChange={handleVideoChange} /><button onClick={handleVideoSend}>Change</button>

//         </div>
//       }

//     </div>
//   );
// }

// const _onReady = (event) => {
//   // access to player in all event handlers via event.target
//   event.target.playVideo();
// }

// export default App;
