import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  Divider,
  Stack,
  Text,
  TextInput,
  Card
} from "@mantine/core";
import { SocketProvider, useSocketContext } from "react-simple-socket.io";
// import { useSocketContext } from "../../../src/react-socket-context";

export default function App() {
  const [connected, setConnected] = useState(false);
  const { connect, disconnect, subscribe, emit } = useSocketContext();
  const [input, setInput] = useState("");
  const [res, setRes] = useState<{ text: string; rnd: number }>();

  const emitMessage = () => {
    emit("message", input);
    setInput("");
  };

  useEffect(() => {
    const onConnect = subscribe("connect", () => {
      setConnected(true);
    });

    const onDisconnect = subscribe("disconnect", () => {
      setConnected(false);
      setRes(undefined);
      setInput("");
    });

    const onMessageResponse = subscribe("response", data => {
      setRes(data);
    });

    return () => {
      onConnect.unsubscribe();
      onDisconnect.unsubscribe();
      onMessageResponse.unsubscribe();
    };
  }, []);

  return (
    <Container size={480} sx={{ height: "100vh" }}>
      <Text align="center" py="md">
        React Socket.IO Usage
      </Text>

      <Divider />

      {!connected ? (
        <Stack>
          <Button onClick={connect}>Connect To Socket</Button>
        </Stack>
      ) : (
        <Stack spacing={10}>
          <Text align="center" py="md">
            Connected to socket!
          </Text>

          <TextInput
            label="Socket Message"
            placeholder="Type a message to emit"
            value={input}
            onChange={e => setInput(e.target.value)}
          />

          <Button disabled={input.length === 0} onClick={emitMessage}>
            Emit
          </Button>

          {res && (
            <Card shadow="lg" mb={10}>
              <Text size="xs" italic color="gray.6">
                Response Text
              </Text>

              <Text mb={30}>{res.text}</Text>

              <Text size="xs" italic color="gray.6">
                Response Random Number
              </Text>

              <Text mb={30}>{res.rnd}</Text>
            </Card>
          )}

          <Button color="red.5" onClick={disconnect}>
            Disconnect From Socket
          </Button>
        </Stack>
      )}
    </Container>
  );
}
