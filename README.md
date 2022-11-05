# React Simple Socket.IO

![](https://img.shields.io/badge/version-1.0.0-blue) ![](https://img.shields.io/badge/react-v18.2.0-blue) [![](https://img.shields.io/badge/github-star-lightgrey)](https://github.com/kwameopareasiedu/react-simple-socket.io)

**Easily use [Socket.IO](https://socket.io/) in your React app**.

## Ugh, another Socket.IO provider 🙄?

Seriously, how is this different from using plain Socket.IO?

- Use a single instance of Socket.IO across all pages in your React app
- Access the Socket.IO interface using a simple React Context API
- **Easily subscribe** to socket events and use the
  return `SocketEventSubscription` object to easily unsubscribe
- Easily setup global socket event handlers

## Installation

React Simple Socket.IO marks React as a peer dependency. So you will need React
installed in your app as well.

```bash
yarn add react react-simple-socket.io
```

```bash
npm install --save react react-simple-socket.io
```

## Setup

In your `index.tsx`, wrap you app in the `SocketProvider` component

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { SocketProvider } from "react-simple-socket.io";
import App from "./app";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SocketProvider
    socketIoConfig={{
      uri: "<Socket URL Here>",
      options: {
        autoConnect: false
        /* Additional Socket.IO options */
      },
      // Optional globalEventHandlers map
      globalEventHandlers: {
        connect: () => {
        },
        "some-global-event": () => {
          /* Do something globally */
        }
      }
    }}>
    <App />
  </SocketProvider>
);
```

> Global event handlers are automatically unsubscribed from when
> the `SocketProvider` unmounts

## Usage

Now that you have the `SocketProvider` setup, you can use the context functions
in your app.

`chat-page.tsx`

```tsx
import React, { useEffect } from "react";
import {
  ChatMessage,
  ChatPanel,
  ChatUser,
  ChatMessageList,
  ChatInput
} from "ficticious-chat-library";
import { useSocketContext } from "react-simple-socket.io";
/* Other imports */

const ChatWidget = (): JSX.Element => {
  const { connect, disconnect, subscribe, emit } = useSocketContext();
  const [messages, setMessages] = useState<ChatMessage>([]);
  const [userTyping, setUserTyping] = useState<ChatUser>();

  const sendMessage = (text: string) => {
    emit("new-message", { msg: text });
  };

  useEffect(() => {
    // Subscribe to socket events when component mounts
    const onNewMessage = subscribe("new-message", data => {
      setMessages(list => [...list, new ChatMessage(data)]);
    });

    const onRemoteUserTyping = subscribe("start-typing", data => {
      setUserTyping(new ChatUser(data));
    });

    const onRemoteUserStopTyping = subscribe("stop-typing", data => {
      setUserTyping(undefined);
    });

    // Connect if Socket.IO autoConnect = false, manually connect
    connect();

    return () => {
      // Unsubscribe from socket events during unmount
      onNewMessage.unsubscribe();
      onRemoteUserTyping.unsubscribe();
      onRemoteUserStopTyping.unsubscribe();

      // Disconnect on unmount
      disconnect();
    };
  }, []);

  return (
    <ChatPanel>
      <ChatMessageList messages={messages} />

      {chatUser && <p>{chatUser.name} is typing</p>}

      <ChatInput onSend={sendMessage} />
    </ChatPanel>
  );
};

export default ChatWidget;
```

## Running The Examples

The `example/` folder contains:

1. A simple Express server setup with Socket.IO
2. An example client app demonstrating `react-simple-socket.io`;

To run the examples, first clone the project repository from GitHub:

```bash
git clone git@github.com:kwameopareasiedu/react-socket.io.git
```

### Server Setup

1. `cd` into `example/server/`
2. Run `yarn` or `npm install` to install dependencies
3. Run `yarn start` or `npm start` to start the server on port `3000`

### Client Setup

1. `cd` into `example/client/`
2. Run `yarn` or `npm install` to install dependencies
3. Run `yarn dev` or `npm start` to start the client on port `3001`
4. Open your browser to http://localhost:3001 to access the client app

> Open your browser devtools and navigate to the network tab to see the socket
> calls as you use the client app

## Maintainers

- [Kwame Opare Asiedu](https://github.com/kwameopareasiedu/)
