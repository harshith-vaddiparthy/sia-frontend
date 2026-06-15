import React from 'react';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button
} from '@chakra-ui/react';

const MessageHandler = ({ isEndCallDialogOpen, setIsEndCallDialogOpen, handleEndInterview, cancelRef }) => {
  return (
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
  );
};

export default MessageHandler;