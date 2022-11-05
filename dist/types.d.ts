import { FC } from "react";
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

interface SocketProviderProps {
  children: JSX.Element;
  socketIoConfig: {
    uri: string | Partial<ManagerOptions & SocketOptions>;
    options?: Partial<ManagerOptions & SocketOptions>;
  };
  globalEventHandlers?: { [eventName: string]: SocketEventHandler };
}

export declare const SocketProvider: FC<SocketProviderProps>;

export declare const useSocketContext: () => SocketContextProps;
