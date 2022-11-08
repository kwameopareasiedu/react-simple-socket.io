import { createContext, useContext, useEffect, useMemo } from "react";
import io from "socket.io-client";
import {
  SocketContextProps,
  SocketEventHandler,
  SocketEventSubscription,
  SocketProviderProps
} from "../dist/types";

const SocketContext = createContext<SocketContextProps>(null);

export const SocketProvider = ({
  children,
  socketIoConfig,
  globalEventHandlers
}: SocketProviderProps): JSX.Element => {
  const socket = useMemo(
    () => io(socketIoConfig.uri, socketIoConfig.options),
    []
  );

  const connect = () => {
    if (!socket.connected) socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  const subscribe = (eventName: string, eventHandler: SocketEventHandler) => {
    socket.on(eventName, eventHandler);

    return {
      unsubscribe: () => {
        socket.off(eventName, eventHandler);
      }
    } as SocketEventSubscription;
  };

  const subscribeOnce = (
    eventName: string,
    eventHandler: SocketEventHandler
  ) => {
    socket.once(eventName, eventHandler);
  };

  const subscribeAny = (eventHandler: SocketEventHandler) => {
    socket.onAny(eventHandler);

    return {
      unsubscribe: () => {
        socket.offAny(eventHandler);
      }
    } as SocketEventSubscription;
  };

  const emit = (eventName: string, eventData?: any) => {
    socket.emit(eventName, eventData);
  };

  useEffect(() => {
    const globalSubscriptions: Array<SocketEventSubscription> = [];

    if (globalEventHandlers) {
      const globalEventNames = Object.keys(globalEventHandlers);

      for (const eventName of globalEventNames) {
        const eventHandler = globalEventHandlers[eventName];
        globalSubscriptions.push(subscribe(eventName, eventHandler));
      }
    }

    return () => {
      // Unsubscribe global socket events during unmount
      for (const subscription of globalSubscriptions) {
        subscription.unsubscribe();
      }
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{
        connect,
        disconnect,
        subscribe,
        subscribeOnce,
        subscribeAny,
        emit
      }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => useContext(SocketContext);
