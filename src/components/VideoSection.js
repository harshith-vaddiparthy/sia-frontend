// VideoSection.js
import React from 'react';
import { Box, Flex } from '@chakra-ui/react';
import Webcam from 'react-webcam';
import SiaAnimation from './SiaAnimation';  // Import the SiaAnimation component

const VideoSection = ({ userVideo, isSpeaking, isInterviewStarted }) => {
  return (
    <>
      {/* SIA Left Box */}
      <Box
        width="20%"
        height="60%"
        bg="gray.700"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        <Flex
          direction="column"
          align="center"
          justify="center"
          width="100%"
          height="100%"
          p={2}
          bg="transparent"
          borderRadius="md"
        >
          {/* All animation and text are handled by SiaAnimation now */}
          <SiaAnimation isSpeaking={isSpeaking} />
        </Flex>
      </Box>

      {/* Video Middle Box */}
      <Box
        width="46%"
        height="79%"
        bg="gray.700"
        borderRadius="md"
        display="flex"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        position="relative"
      >
        <Webcam audio={false} ref={userVideo} style={{ width: '100%', height: '100%', transform: 'scaleX(-1)' }} />

        {isInterviewStarted && (
          <Flex
            position="absolute"
            top="10px"
            right="10px"
            alignItems="center"
            bg="rgba(255, 0, 0, 0.7)"
            borderRadius="md"
            padding="5px 10px"
          >
            <Box
              width="8px"
              height="8px"
              borderRadius="50%"
              bg="red.500"
              marginRight="5px"
            />
            <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'white' }}>Recording</span>
          </Flex>
        )}
      </Box>
    </>
  );
};

export default VideoSection;
