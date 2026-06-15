import React, { useRef, useEffect, useState } from 'react';
import { Box, Flex, Text, VStack, HStack, Input, IconButton } from '@chakra-ui/react';
import { FaPaperPlane, FaFileUpload } from 'react-icons/fa';
import { getAuth } from 'firebase/auth'; // Import Firebase Auth

// CSS for the custom scroll bar
const customScrollbar = `
  ::-webkit-scrollbar {
    width: 12px;
  }
  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  ::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: #555;
  }
`;

const AnimatedText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, 50); // Adjust speed as needed

      return () => clearTimeout(timeout);
    } else {
      onComplete();
    }
  }, [text, currentIndex, onComplete]);

  return <Text>{displayedText}</Text>;
};

const useChatScroll = (dep) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [dep]);
  return ref;
};

const Chatbot = ({
  messages,
  setMessages,
  currentMessage,
  setCurrentMessage,
  sendMessage,
  conversationHistory,
  onMessageRevealed,
  transcription,
}) => {
  const chatBoxRef = useChatScroll(messages);
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [isRevealing, setIsRevealing] = useState(false);

  const auth = getAuth();
  const displayName = auth.currentUser?.displayName || "Candidate"; // Default to "Candidate" if not available
  const firstName = displayName.split(" ")[0]; // Extract first name

  useEffect(() => {
    if (messages.length > visibleMessages.length) {
      const newMessage = messages[messages.length - 1];
      if (newMessage.from === 'SIA') {
        setIsRevealing(true);
        setVisibleMessages((prev) => [...prev, { ...newMessage, partialText: '' }]);
      } else {
        setVisibleMessages((prev) => [...prev, newMessage]);
      }
    }
  }, [messages, visibleMessages]);

  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [visibleMessages]);

  const handleMessageRevealed = () => {
    setIsRevealing(false);
    // Notify parent component that message reveal is complete
    onMessageRevealed();
  };

  const handleSendMessage = () => {
    if (currentMessage.trim() !== '') {
      // Update messages state to include the user's message
      setMessages((prev) => [...prev, { from: firstName, text: currentMessage.trim() }]);

      sendMessage(
        JSON.stringify({ type: 'interviewQuestion', question: currentMessage.trim(), history: conversationHistory })
      );
      setCurrentMessage('');
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64File = reader.result.split(',')[1];
        sendMessage(
          JSON.stringify({ type: 'fileUpload', fileName: file.name, fileContent: base64File })
        );
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Flex
      direction="column"
      width="30%"
      height="79%"
      bg="gray.700"
      borderRadius="md"
      p={3}
      css={customScrollbar}
    >
      <Box as="header" width="100%" position="sticky" top={0} bg="gray.700" zIndex={1} p={2}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Chat
        </Text>
      </Box>
      <VStack spacing={3} align="stretch" overflowY="auto" ref={chatBoxRef} flex="1">
        {visibleMessages.map((msg, index) => (
          <Box
            key={index}
            bg={msg.from === 'SIA' ? 'blue.500' : 'gray.500'}
            color="white"
            p={2}
            borderRadius="md"
            alignSelf={msg.from === 'SIA' ? 'flex-start' : 'flex-end'}
            maxWidth="80%"
          >
            <Text fontSize="xs" fontWeight="bold">
              {msg.from === 'SIA' ? 'SIA' : firstName} {/* Display first name instead of 'Candidate' */}
            </Text>
            {msg.from === 'SIA' && index === visibleMessages.length - 1 && isRevealing ? (
              <AnimatedText
                text={msg.text}
                onComplete={() => {
                  setVisibleMessages((prev) =>
                    prev.map((m, i) => (i === index ? { ...m, partialText: msg.text } : m))
                  );
                  handleMessageRevealed();
                }}
              />
            ) : (
              <Text>{msg.partialText || msg.text}</Text>
            )}
          </Box>
        ))}
      </VStack>
      {transcription && (
        <Box bg="gray.600" p={2} borderRadius="md" mt={2}>
          <Text color="white" fontSize="sm">
            {transcription}
          </Text>
        </Box>
      )}
      <Box mt={2}>
        <HStack spacing={2}>
          <Input
            placeholder="If voice input fails, type here..."
            value={currentMessage}
            onChange={(e) => setCurrentMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            color="white"
          />
          <IconButton icon={<FaPaperPlane />} onClick={handleSendMessage} colorScheme="blue" />
          <IconButton as="label" icon={<FaFileUpload />} colorScheme="blue">
            <input type="file" accept="application/pdf" hidden onChange={handleFileUpload} />
          </IconButton>
        </HStack>
      </Box>
    </Flex>
  );
};

export default Chatbot;
