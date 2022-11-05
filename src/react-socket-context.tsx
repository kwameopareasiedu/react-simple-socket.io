import { createContext, useContext, useEffect, useMemo } from "react";
import io from "socket.io-client";
import { ManagerOptions } from "socket.io-client/build/esm/manager";
import { SocketOptions } from "socket.io-client/build/esm/socket";

type SocketEventHandler = (eventData?: any) => void;

// The subscription object which contains
// functions for managing a subscription
interface SocketEventSubscription {
  unsubscribe: () => void;
}

interface SocketContextProps {
  connect: () => void;
  disconnect: () => void;
  subscribe: (
    eventName: string,
    eventHandler: SocketEventHandler
  ) => SocketEventSubscription;
  subscribeOnce: (eventName: string, eventHandler: SocketEventHandler) => void;
  subscribeAny: (eventHandler: SocketEventHandler) => SocketEventSubscription;
  emit: (eventName: string, eventData?: any) => void;
}

const SocketContext = createContext<SocketContextProps>(null);

interface SocketProviderProps {
  children: JSX.Element;
  socketIoConfig: {
    uri: string | Partial<ManagerOptions & SocketOptions>;
    options?: Partial<ManagerOptions & SocketOptions>;
  };
  globalEventHandlers?: { [eventName: string]: SocketEventHandler };
}

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
