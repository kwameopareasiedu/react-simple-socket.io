import { createContext, useContext, useMemo } from "react";
import io from "socket.io-client";
import { ManagerOptions } from "socket.io-client/build/esm/manager";
import { SocketOptions } from "socket.io-client/build/esm/socket";

export type SocketEventHandler = (eventData?: any) => void;

// The subscription object which contains
// functions for managing a subscription
export interface SocketEventSubscription {
  unsubscribe: () => void;
}

interface SocketContextProps {
  connect: () => void;
  disconnect: () => void;
  subscribe: (
    eventName: string,
    callback: SocketEventHandler
  ) => SocketEventSubscription;
  emit: (eventName: string, eventData?: any) => void;
}

const SocketContext = createContext<SocketContextProps>(null);

interface SocketProviderProps {
  children: JSX.Element;
  socketIoUri: string | Partial<ManagerOptions & SocketOptions>;
  socketIoOptions?: Partial<ManagerOptions & SocketOptions>;
}

export const SocketProvider = ({
  children,
  socketIoUri,
  socketIoOptions
}: SocketProviderProps): JSX.Element => {
  const socket = useMemo(() => io(socketIoUri, socketIoOptions), []);

  const connect = () => {
    if (!socket.connected) socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const subscribe = (eventName: string, callback: SocketEventHandler) => {
    socket.on(eventName, callback);

    return {
      unsubscribe: () => {
        socket.off(eventName, callback);
      }
    } as SocketEventSubscription;
  };

  const emit = (eventName: string, eventData?: any) => {
    socket.emit(eventName, eventData);
  };

  return (
    <SocketContext.Provider
      value={{
        connect,
        disconnect,
        subscribe,
        emit
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
