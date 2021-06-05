import { useContext, useState } from 'react'
import AppContext from './AppContext'
import ChatRoom from './components/ChatRoom'
import NewConnect from './components/NewConenct'


const App = () => {
  
  const [connectionInfo, setConnectionInfo] = useState({
    userName: '',
    roomName: ''
  })

  const appData = {
    connectionInfo: {
      userName: '',
      roomName: ''
    },
    joinRoom: () => {
      setConnectionInfo({
        userName: appData.userName,
        roomName: appData.roomName
      })
    }
  }

  return (
    <AppContext.Provider value={appData}>
      <div>
        { connectionInfo.userName !== '' ? <ChatRoom data={connectionInfo} /> : <NewConnect /> }
        { connectionInfo.userName } { connectionInfo.roomName }
      </div>
    </AppContext.Provider>
  )
}

export default App;