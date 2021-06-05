import { useState, useContext } from 'react'
import AppData from '../AppContext'

const NewConnect = () => {

  const ContextData = useContext(AppData)

  const [input, setInput] = useState({
    userName: '',
    joinRoom: ''
  })

  const handleChange = (event) => setInput({...input,
    [event.currentTarget.name]: event.currentTarget.value
  })

  const joinRoom = (event) => {
    event.preventDefault()
    if (input.userName === '') {
      console.log('no name ya dork')
    } else {
      ContextData.userName = input.userName;
      ContextData.roomName = input.joinRoom;
      ContextData.joinRoom()
    }
  }

  const newRoom = (event) => {
    event.preventDefault()
    if (input.userName === '') {
      console.log('no name ya dork')
    } else {
      ContextData.userName = input.userName;
      ContextData.roomName = 'new';
      ContextData.joinRoom()
    }
  }

  return(
    <div>
      Name <input required onChange={handleChange} name="userName" value={input['userName']} type="text" />
      <button onClick={newRoom}>New Room</button>
      <hr />
      or
      <hr />
      Join Room
      <input onChange={handleChange} name="joinRoom" value={input['joinRoom']} type="text" />
      <button onClick={joinRoom}>Join Room</button>
    </div>
  )
}

export default NewConnect;