const ChatHistory = (props) => {
  return(
    <div>
      <em>{props.name}</em>: {props.message}
    </div>
  )
}

export default ChatHistory;