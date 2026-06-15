// WebSocketCommunication.js

import { useEffect, useRef, useState } from 'react';

const useWebSocketCommunication = (url, onMessage, onOpen, onClose) => {
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef(null);
  const reconnectAttempts = useRef(0);

  const connectWebSocket = () => {
    if (ws.current && (ws.current.readyState === WebSocket.OPEN || ws.current.readyState === WebSocket.CONNECTING)) {
      return;
    }

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setIsConnected(true);
      reconnectAttempts.current = 0;  // Reset attempts on successful connection
      if (onOpen) onOpen();
    };

    ws.current.onmessage = (event) => {
      console.log('WebSocket message received:', event.data);
      if (onMessage) onMessage(event.data);
    };

    ws.current.onclose = () => {
      console.log('WebSocket closed.');
      setIsConnected(false);
      if (onClose) onClose();
      attemptReconnect();  // Try to reconnect if the socket closes
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      attemptReconnect();  // Attempt to reconnect on error
    };
  };

  const attemptReconnect = () => {
    if (reconnectAttempts.current < 5) {
      reconnectAttempts.current += 1;
      const timeout = Math.min(1000 * (2 ** reconnectAttempts.current), 30000);  // Exponential backoff with a cap
      setTimeout(connectWebSocket, timeout);
    }
  };

  useEffect(() => {
    connectWebSocket();

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      console.error('WebSocket is not open. Unable to send message.');
    }
  };

  const closeWebSocket = () => {
    if (ws.current) {
      ws.current.close();
    }
  };

  const openWebSocket = () => {
    if (!isConnected) {
      connectWebSocket();
    }
  };

  return { sendMessage, closeWebSocket, openWebSocket, isConnected };
};

export default useWebSocketCommunication;
