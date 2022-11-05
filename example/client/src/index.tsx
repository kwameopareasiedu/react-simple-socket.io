import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./app";
import { MantineProvider } from "@mantine/core";
import { SocketProvider } from "../../../src/react-socket-context";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <StrictMode>
    <MantineProvider withNormalizeCSS>
      <SocketProvider
        socketIoConfig={{
          uri: "http://127.0.0.1:3000",
          options: { autoConnect: false }
        }}>
        <App />
      </SocketProvider>
    </MantineProvider>
  </StrictMode>
);
