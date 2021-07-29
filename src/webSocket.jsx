import React, { useState, useMemo, useRef, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const [socketUrl, setSocketUrl] = useState('wss://echo.websocket.org');
  const messageHistory = useRef([]);
  const [inputSocket, setInputSocket] = useState(socketUrl);
  const [text, setText] = useState('Hello');
  const [sender, setSender] = useState(97);
  const [chatRoom, setChatRoom] = useState(1);
  const [token, setToken] = useState('');

  const [messagesState, setMessagesState] = useState([]);

  const HanifToken =
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjI3NjM4MzI0LCJqdGkiOiI5NDMzMWEzODAzOWI0YTg5OWIxNGMyNzNmYzFhNGU4MSIsInVzZXJfaWQiOjh9._BJaIrdU4cj3i0PVeyCKr5M2OI0Jt61OelkOzpcRszs';

  const { sendJsonMessage, lastMessage, readyState } = useWebSocket(
    socketUrl,
    token && {
      protocols: token,
      shouldReconnect: () => true,
    }
  );

  useEffect(() => {
    setMessagesState([...messagesState, lastMessage]);
  }, [lastMessage]);

  const handleClickChangeSocketUrl = () => setSocketUrl(inputSocket);

  const handleClickSendMessage = () =>
    sendJsonMessage({
      action: 'send_message',
      message: {
        text: text,
        link: '',
        sender: sender,
        chat_room: chatRoom,
        created_at: '2021-07-08:12:58:23',
      },
    });

  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Connecting',
    [ReadyState.OPEN]: 'Open',
    [ReadyState.CLOSING]: 'Closing',
    [ReadyState.CLOSED]: 'Closed',
    [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
  }[readyState];

  return (
    <div>
      <div className={'socketName'}>
        current WebSocket Link: <p>{socketUrl}</p>
      </div>
      <span>
        The WebSocket is currently <b>{connectionStatus}</b>
      </span>
      <br />
      socketURL -{' '}
      <input
        type="text"
        value={inputSocket}
        onChange={(e) => setInputSocket(e.target.value)}
      />
      <button
        onClick={() => {
          setInputSocket(
            'wss://gor6ofedjc.execute-api.us-east-2.amazonaws.com/test'
          );
        }}
      >
        Set <p>wss://gor6ofedjc.execute-api.us-east-2.amazonaws.com/test</p>{' '}
        socket
      </button>
      <br />
      token -{' '}
      <input
        type="text"
        value={token}
        onChange={(e) => setToken(e.target.value)}
      />
      <button
        onClick={() => {
          setToken(HanifToken);
        }}
      >
        Set <p>Hanif token</p>
      </button>
      <br />
      <button onClick={handleClickChangeSocketUrl}>
        Click Me to change Socket 
      </button>
      <br />
      <br />
      text -{' '}
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      senderID -{' '}
      <input
        type="text"
        value={sender}
        onChange={(e) => setSender(e.target.value)}
      />
      chatRoom -{' '}
      <input
        type="text"
        value={chatRoom}
        onChange={(e) => setChatRoom(e.target.value)}
      />
      <button
        onClick={handleClickSendMessage}
        disabled={readyState !== ReadyState.OPEN}
      >
        Click Me to send message
      </button>
      <br />
      {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
      <br />
      <br />
      <div>
        <code>
          {`{"action": "send_message", "message":{"text": "${text}", "link": "", "sender": ${sender}, "chat_room":${chatRoom}, "created_at": "2021-07-08:12:58:23" }}`}
        </code>
      </div>
      <ul>
        {messagesState.map((message, idx) => (
          <li key={idx}>{message && JSON.parse(message.data).message.text}</li>
        ))}
      </ul>
    </div>
  );
};
