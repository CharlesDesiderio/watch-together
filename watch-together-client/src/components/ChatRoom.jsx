import { useReducer, useState, useEffect, useContext, useRef } from 'react'
import AppData from '../AppContext'
import ChatHistory from './ChatHistory';

import YouTube from 'react-youtube';
import io from 'socket.io-client'

const socket = io('http://localhost:3000', {transports: ['websocket']});

const reducer = (state, action) => {
  return action.value;
}

const ChatRoom = (props) => {

  const [chat, setChat] = useState([])
  const [input, setInput] = useState({
    message: '',
    videoInput: ''
  })
  // const [currentVideo, setCurrentVideo] = useState('') // TCRwQikQbxs
  const [currentVideo, setCurrentVideo] = useReducer(reducer, '')

  const videoRef = useRef()

  const handleChange = (event) => setInput({...input,
    [event.currentTarget.name]: event.currentTarget.value
  })

  const handleMessageSend = (event) => {
    event.preventDefault()
    const userName = props.data.userName
    const message = input['message']
    const room = props.data.roomName
    socket.emit('message', { userName, room, message })

    setInput({
      ...input, ['message']: ''
    })
  }

  const handleVideoChange = (event) => {
    event.preventDefault()

    // console.log(input['videoInput'], currentVideo)
    setCurrentVideo({value: input['videoInput']})
    console.log('47', currentVideo)

    const room = props.data.roomName
    socket.emit('changeVideo', input['videoInput'], room )
  }

  const handlePlay = () => {
    socket.emit('playVideo', props.data.roomName)
  }

  const handlePause = () => {
    socket.emit('pauseVideo', props.data.roomName)
  }

    const opts = {
    height: '390',
    width: '640',
    playerVars: {
      autoplay: 1,
    },
  };

  const _onReady = (event) => {
    // access to player in all event handlers via event.target
    event.target.playVideo();
  }

  useEffect(() => {
    
    socket.emit('joinRoom', props.data.roomName, props.data.userName)

    socket.on('message', (incomingMessage) => {
      setChat([...chat, incomingMessage])
    })
  
    socket.on('newUserJoin', (userName) => {
      if (userName !== props.data.userName) {
  
        console.log(userName, 'joined')
  
        // let videoState
        // Promise.resolve(videoRef.current.internalPlayer.getPlayerState())
        //   .then((v) => {
        //     // 1 for playing, 2 for paused
        //     videoState = v
        //   })
        // const videoTime = Promise.resolve(videoRef.current.internalPlayer.getCurrentTime()).then((v) => console.log('time', v))       
  
        let playerState = Promise.resolve(videoRef.current.internalPlayer.getPlayerState())
        let videoTime = Promise.resolve(videoRef.current.internalPlayer.getCurrentTime())
        let curVid = currentVideo

        playerState.then((playState) => {
          videoTime.then((playTime) => {
            console.log(playState, playTime)
            console.log('telling', userName, 'that', curVid, 'is playing')
            socket.emit('updateInfo', props.data.roomName, currentVideo, playState, playTime, userName)
          })
        })
      }
    })
  
    socket.on('newVideo', (incomingVideoId) => {
      setCurrentVideo(incomingVideoId)
    })
  
    socket.on('requestPause', () => {
      console.log('Pause requested')
      videoRef.current.internalPlayer.pauseVideo()
    })
  
    socket.on('requestPlay', () => {
      console.log('Play requested')
      videoRef.current.internalPlayer.playVideo()
    })
  
    socket.on('checkInfo', (vidId, playState, playTime, userName) => {
      if (userName === props.data.userName) {
        if (playState === 1 || playState === 2) {
          console.log('checking ... ', vidId, playState, playTime, userName)
          setCurrentVideo(vidId)
          videoRef.current.internalPlayer.seekTo(parseInt(playTime + 2), true)
        }
        // if (playState === 1) {
        //   videoRef.current.internalPlayer.playVideo()
        // } else {
        //   videoRef.current.internalPlayer.pauseVideo()
        // }
      }
    })

  }, [])


  

  const ContextData = useContext(AppData)

  return (
    <div>
      <YouTube ref={videoRef} videoId={currentVideo} opts={opts} onPlay={handlePlay} onPause={handlePause} onReady={_onReady} />
      { chat.map((item) => {
        return <ChatHistory name={item.userName} message={item.message} />
      }) }
      Hey {ContextData.userName}
      <input type="text" onChange={handleChange} value={input['message']} name="message" /><button onClick={handleMessageSend}>Send</button>
      <input type="text" onChange={handleChange} value={input['videoInput']} name="videoInput" /><button onClick={handleVideoChange}>New Video</button>
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
