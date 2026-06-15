// InterviewControls.js

import React from 'react';
import {
  HStack,
  IconButton,
  Text,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import {
  FaMicrophone,
  FaMicrophoneSlash,
  FaVideo,
  FaVideoSlash,
  FaPhoneSlash,
  FaChevronUp,
  FaVolumeUp, // Add this import for the speaker icon
} from 'react-icons/fa';

const InterviewControls = ({
  micEnabled,
  camEnabled,
  toggleMic,
  toggleCam,
  startInterview,
  endCall,
  audioDevices,
  videoDevices,
  speakerDevices, // Add this state for speaker devices
  selectedAudioDevice,
  selectedVideoDevice,
  selectedSpeakerDevice, // Add this state for the selected speaker device
  setSelectedAudioDevice,
  setSelectedVideoDevice,
  setSelectedSpeakerDevice, // Add this function for setting speaker device
  timerSeconds,
  isInterviewStarted,
}) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <HStack spacing={4} mb={4}>
      {/* Microphone Selection */}
      <Menu>
        <MenuButton as={IconButton} icon={<FaChevronUp />}>
          Microphone
        </MenuButton>
        <MenuList>
          {audioDevices.map((device, index) => (
            <MenuItem
              key={index}
              onClick={() => setSelectedAudioDevice(device.deviceId)}
              bg={selectedAudioDevice === device.deviceId ? 'teal.500' : 'transparent'}
              color={selectedAudioDevice === device.deviceId ? 'white' : 'black'}
            >
              {device.label || `Microphone ${index + 1}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <IconButton
        icon={micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
        onClick={toggleMic}
      />

      {/* Camera Selection */}
      <Menu>
        <MenuButton as={IconButton} icon={<FaChevronUp />}>
          Camera
        </MenuButton>
        <MenuList>
          {videoDevices.map((device, index) => (
            <MenuItem
              key={index}
              onClick={() => setSelectedVideoDevice(device.deviceId)}
              bg={selectedVideoDevice === device.deviceId ? 'teal.500' : 'transparent'}
              color={selectedVideoDevice === device.deviceId ? 'white' : 'black'}
            >
              {device.label || `Camera ${index + 1}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <IconButton
        icon={camEnabled ? <FaVideo /> : <FaVideoSlash />}
        onClick={toggleCam}
      />

      {/* Speaker Selection */}
      <Menu>
        <MenuButton as={IconButton} icon={<FaChevronUp />}>
          Speaker
        </MenuButton>
        <MenuList>
          {speakerDevices.map((device, index) => (
            <MenuItem
              key={index}
              onClick={() => setSelectedSpeakerDevice(device.deviceId)}
              bg={selectedSpeakerDevice === device.deviceId ? 'teal.500' : 'transparent'}
              color={selectedSpeakerDevice === device.deviceId ? 'white' : 'black'}
            >
              {device.label || `Speaker ${index + 1}`}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
      <IconButton icon={<FaVolumeUp />} />

      {/* Timer */}
      <Text color={timerSeconds <= 120 ? 'red' : 'white'}>
        Timer: {formatTime(timerSeconds)}
      </Text>

      {/* Start Interview Button */}
      <Button colorScheme="blue" onClick={startInterview} isDisabled={isInterviewStarted}>
        {isInterviewStarted ? 'Interview Started' : 'Start Interview'}
      </Button>

      {/* End Call Button */}
      <IconButton icon={<FaPhoneSlash />} colorScheme="red" onClick={endCall} />
    </HStack>
  );
};

export default InterviewControls;
