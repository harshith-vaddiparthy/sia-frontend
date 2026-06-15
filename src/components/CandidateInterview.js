import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Flex,
  useColorModeValue,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import VideoSection from './VideoSection';
import Chatbot from './Chatbot';
import InterviewControls from './InterviewControls';
import { useTTS } from './TTS';
import { useSTT } from './STT';
import useWebSocketCommunication from './WebSocketCommunication';
import UserProfile from './UserProfile';
import { useAIResponse } from '../hooks/useAIResponse';
import { useProfanityFilter } from '../hooks/useProfanityFilter';
import { useCandidateName } from '../hooks/useCandidateName';
import logo from './zavata-logo.png';  // Import the logo

const INTERVIEW_DURATION = 15 * 60; // 15 minutes in seconds

const CandidateInterview = () => {
  const [stream, setStream] = useState(null);
  const [micEnabled, setMicEnabled] = useState(true);
  const [camEnabled, setCamEnabled] = useState(true);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [messages, setMessages] = useState([]);
  
  // Destructure the correct variables from the hook
  const { candidateName } = useCandidateName();
  const [currentMessage, setCurrentMessage] = useState('');
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const [speakerDevices, setSpeakerDevices] = useState([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedSpeakerDevice, setSelectedSpeakerDevice] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [isEndCallDialogOpen, setIsEndCallDialogOpen] = useState(false);
  const [isMessageRevealing, setIsMessageRevealing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(INTERVIEW_DURATION);
  const [transcription, setTranscription] = useState('');

  const { filterProfanity } = useProfanityFilter();
  const { refineResponse } = useAIResponse();

  const navigate = useNavigate();
  const auth = getAuth();

  const userVideo = useRef();
  const cancelRef = useRef();
  const timerRef = useRef(null);
  const transcriptionTimeoutRef = useRef(null);

  const beepAudio = new Audio('/beep.mp3');

  const { textToSpeech, isSpeaking } = useTTS();
  const { continuousSpeechToText, stopListening, isListening } = useSTT();

  const handleWebSocketMessage = (data) => {
    const messageData = JSON.parse(data);
    if (messageData.type === 'interviewResponse') {
      const refinedMessage = refineResponse(messageData.message);
      speakMessage(refinedMessage);
    }
  };

  const { sendMessage, closeWebSocket, openWebSocket, isConnected } =
    useWebSocketCommunication(
      'wss://13.60.249.210:443/',
      handleWebSocketMessage,
      () => {
        if (!isListening && isInterviewStarted) {
          continuousSpeechToText(handleRecognizedSpeech);
        }
      },
      () => {
        stopListening();
      }
    );

  useEffect(() => {
    if (!auth.currentUser) {
      navigate('/login');
    }
  }, [auth, navigate]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const audio = devices.filter((device) => device.kind === 'audioinput');
      const video = devices.filter((device) => device.kind === 'videoinput');
      const speaker = devices.filter((device) => device.kind === 'audiooutput');

      setAudioDevices(audio);
      setVideoDevices(video);
      setSpeakerDevices(speaker);

      if (!selectedAudioDevice && audio.length > 0) {
        setSelectedAudioDevice(audio[0].deviceId);
      }
      if (!selectedVideoDevice && video.length > 0) {
        setSelectedVideoDevice(video[0].deviceId);
      }
      if (!selectedSpeakerDevice && speaker.length > 0) {
        setSelectedSpeakerDevice(speaker[0].deviceId);
      }
    });

    getUserMedia();
  }, [selectedAudioDevice, selectedVideoDevice, selectedSpeakerDevice]);

  useEffect(() => {
    if (isInterviewStarted && timerSeconds > 0) {
      timerRef.current = setInterval(() => {
        setTimerSeconds((prevSeconds) => prevSeconds - 1);
      }, 1000);

      if (timerSeconds === 120) {
        beepAudio.play();
      }

    } else if (timerSeconds === 0) {
      clearInterval(timerRef.current);
      endCall();
    }

    return () => clearInterval(timerRef.current);
  }, [isInterviewStarted, timerSeconds]);

  const getUserMedia = useCallback(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          deviceId: selectedVideoDevice ? { exact: selectedVideoDevice } : undefined,
        },
        audio: {
          deviceId: selectedAudioDevice ? { exact: selectedAudioDevice } : undefined,
        },
      })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
          userVideo.current.muted = true;
        }

        if (selectedSpeakerDevice) {
          stream.getAudioTracks().forEach(track => {
            const audioElement = new Audio();
            audioElement.srcObject = new MediaStream([track]);
            audioElement.setSinkId(selectedSpeakerDevice)
              .then(() => {
                console.log('Speaker set successfully');
              })
              .catch((err) => {
                console.error('Failed to set audio output:', err);
              });
          });
        }
      })
      .catch((error) => {
        console.error('Error accessing media devices:', error);
      });
  }, [selectedAudioDevice, selectedVideoDevice, selectedSpeakerDevice]);

  const toggleMic = useCallback(() => {
    setMicEnabled((prev) => !prev);
    if (stream) {
      stream.getAudioTracks()[0].enabled = !micEnabled;
    }
  }, [stream, micEnabled]);

  const toggleCam = useCallback(() => {
    setCamEnabled((prev) => !prev);
    if (stream) {
      stream.getVideoTracks()[0].enabled = !camEnabled;
    }
  }, [stream, camEnabled]);

  const handleRecognizedSpeech = useCallback(
    (text) => {
      const cleanText = filterProfanity(text);

      setTranscription(cleanText);

      if (transcriptionTimeoutRef.current) {
        clearTimeout(transcriptionTimeoutRef.current);
      }

      transcriptionTimeoutRef.current = setTimeout(() => {
        setMessages((prev) => [...prev, { from: 'User', text: cleanText }]);
        setConversationHistory((prev) => [...prev, { role: 'user', content: cleanText }]);
        if (isConnected) {
          sendMessage(
            JSON.stringify({ type: 'interviewQuestion', question: cleanText, history: conversationHistory })
          );
        } else {
          console.error('WebSocket is not connected. Unable to send message.');
        }
        setTranscription('');
      }, 1000);
    },
    [sendMessage, conversationHistory, isConnected, filterProfanity]
  );

  const handleTTSStart = useCallback(() => {
    closeWebSocket();
    stopListening();
    setIsMessageRevealing(true);
  }, [closeWebSocket, stopListening]);

  const handleTTSEnd = useCallback(() => {
    setIsMessageRevealing(false);
    setTimeout(() => {
      openWebSocket();
    }, 1000);
  }, [openWebSocket]);

  const speakMessage = useCallback(
    (message) => {
      setMessages((prev) => [...prev, { from: 'SIA', text: message }]);
      setConversationHistory((prev) => [...prev, { role: 'assistant', content: message }]);
      textToSpeech(message, handleTTSStart, handleTTSEnd);
    },
    [textToSpeech, handleTTSStart, handleTTSEnd]
  );

  const startInterview = useCallback(() => {
    if (!isInterviewStarted) {
      setIsInterviewStarted(true);
      if (isConnected) {
        const systemPrompt = `
          You are SIA (Smart Interview Assistant), an AI Interviewer. Your role is to strictly ask interview questions and nothing else. Do not answer any questions or engage in conversation that is not related to asking interview questions.
  
          Generate interview questions that are concise, clear, and no longer than 50 words. Ensure each question is professional, focused on one specific topic at a time, and free of any unnecessary special characters or informal language.
        
          You are SIA (Smart Interview Assistant), an AI Interviewer. Your role is to ask interview questions and guide the conversation, but keep your responses concise and avoid unnecessary repetition. Acknowledge the candidate's responses briefly, if at all, and then move directly to the next question. Keep each acknowledgment to a single sentence at most.
        `;
  
        sendMessage(
          JSON.stringify({
            type: 'startInterview',
            systemPrompt: systemPrompt
          })
        );
      } else {
        console.error('WebSocket is not connected. Unable to send startInterview message.');
      }
  
      const welcomeMessage = `Hey ${candidateName}, I am Sia - Smart Interview Assistant. I'm here to learn about your background and skills and share them with the hiring team. Let's have an open and relaxed conversation - I'd love to hear about your experiences and what makes you a great fit. Please go ahead and tell me a bit about yourself.`;
  
      speakMessage(welcomeMessage);
    }
  }, [isInterviewStarted, sendMessage, speakMessage, isConnected, candidateName]);
  

  const endCall = useCallback(() => {
    setIsEndCallDialogOpen(true);
  }, []);

  const handleEndInterview = useCallback(() => {
    setIsEndCallDialogOpen(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    stopListening();
    setIsInterviewStarted(false);
    clearInterval(timerRef.current);
  }, [stream, stopListening]);

  const bgColor = useColorModeValue('gray.800', 'gray.800');

  return (
    <Box p={2} width="100vw" height="100vh" bg={bgColor}>
      {/* Logo added at the top left */}
      <Box position="absolute" top={3} left={15} alignItems="center">
        <img src={logo} alt="logo" style={{ width: '180px', height: 'auto' }} />
      </Box>
      
      <Flex direction="column" align="center" justify="space-between" height="100%" gap={5}>
        <Flex direction="row" align="center" justify="center" height="80%" gap={5} width="100%">
          <VideoSection userVideo={userVideo} isSpeaking={isSpeaking || isMessageRevealing} isInterviewStarted={isInterviewStarted} />
          <Chatbot
            messages={messages}
            setMessages={setMessages}
            currentMessage={currentMessage}
            setCurrentMessage={setCurrentMessage}
            sendMessage={sendMessage}
            conversationHistory={conversationHistory}
            onMessageRevealed={() => {
              if (!isListening) {
                setTimeout(() => {
                  continuousSpeechToText(handleRecognizedSpeech);
                }, 1000);
              }
            }}
            transcription={transcription}
          />
        </Flex>
        <InterviewControls
          micEnabled={micEnabled}
          camEnabled={camEnabled}
          toggleMic={toggleMic}
          toggleCam={toggleCam}
          startInterview={startInterview}
          endCall={endCall}
          audioDevices={audioDevices}
          videoDevices={videoDevices}
          speakerDevices={speakerDevices}
          selectedAudioDevice={selectedAudioDevice}
          selectedVideoDevice={selectedVideoDevice}
          selectedSpeakerDevice={selectedSpeakerDevice}
          setSelectedAudioDevice={setSelectedAudioDevice}
          setSelectedVideoDevice={setSelectedVideoDevice}
          setSelectedSpeakerDevice={setSelectedSpeakerDevice}
          isInterviewStarted={isInterviewStarted}
          timerSeconds={timerSeconds}
        />
      </Flex>
      <UserProfile />
      <AlertDialog
        isOpen={isEndCallDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsEndCallDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              End Interview
            </AlertDialogHeader>
            <AlertDialogBody>
              Are you sure you want to end the interview?
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsEndCallDialogOpen(false)}>
                Continue Interview
              </Button>
              <Button colorScheme="red" onClick={handleEndInterview} ml={3}>
                End Interview
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default CandidateInterview;
