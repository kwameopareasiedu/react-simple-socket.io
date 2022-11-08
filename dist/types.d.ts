import { FC } from "react";
import { ManagerOptions } from "socket.io-client/build/esm/manager";
import { SocketOptions } from "socket.io-client/build/esm/socket";

/** Event handler for an incoming socket message */
export type SocketEventHandler = (eventData?: any) => void;

/**
 * The subscription object which contain
 * functions for managing a subscription
 */
export interface SocketEventSubscription {
  unsubscribe: () => void;
}

export interface SocketContextProps {
  /** Connect to the remote socket server */
  connect: () => void;
  /** Disconnect from the remote socket server */
  disconnect: () => void;
  /**
   * Subscribe to a socket event and return
   * a SocketEventSubscription object
   */
  subscribe: (
    eventName: string,
    eventHandler: SocketEventHandler
  ) => SocketEventSubscription;
  /** Subscribe to a socket event once */
  subscribeOnce: (eventName: string, eventHandler: SocketEventHandler) => void;
  /**
   * Subscribe to any socket event and return
   * a SocketEventSubscription object
   */
  subscribeAny: (eventHandler: SocketEventHandler) => SocketEventSubscription;
  /** Send a socket event with optional data */
  emit: (eventName: string, eventData?: any) => void;
}

export interface SocketProviderProps {
  children: JSX.Element;
  socketIoConfig: {
    uri: string | Partial<ManagerOptions & SocketOptions>;
    options?: Partial<ManagerOptions & SocketOptions>;
  };
  globalEventHandlers?: { [eventName: string]: SocketEventHandler };
}

/**
 * Wrap your app in the SocketProvider to provide
 * the library's functions to the rest of your app
 */
export declare const SocketProvider: FC<SocketProviderProps>;

/**
 * Access the library's functions using this context
 */
export declare const useSocketContext: () => SocketContextProps;
