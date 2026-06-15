import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, VStack, Button, Link as ChakraLink } from '@chakra-ui/react';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { EmailIcon } from '@chakra-ui/icons';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase-config';

const CheckYourEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    } else {
      navigate('/forgot-password'); // Redirect back if no email is available
    }
  }, [location, navigate]);

  const handleResendEmail = async () => {
    setError("");
    setMessage("");

    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("The reset email has been resent successfully.");
    } catch (error) {
      console.error("Error resending email: ", error.message);
      setError("Failed to resend the email. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box 
      className="auth-container"
      minH="100vh" 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      bgImage="url('/BackgroundAuth.png')"  
      bgSize="cover"
      bgPosition="center"
      color="black"
    >
      <Box 
        bg="white" 
        p={8} 
        borderRadius="md" 
        boxShadow="lg" 
        w="sm" 
        border="1px solid black"
      >
        <VStack spacing={6} align="stretch" textAlign="center">
          <EmailIcon w={16} h={16} color="green.500" mx="auto" /> {/* Centered and made larger */}
          <Heading as="h2" size="lg" mb={2} fontWeight="normal">Check Your Email</Heading>
          <Text fontSize="md" color="gray.600">
            Please check the email address <strong>{email}</strong> for instructions to reset your password.
          </Text>

          {message && <Text color="green.500">{message}</Text>}
          {error && <Text color="red.500">{error}</Text>}

          <Button 
            bg="white" 
            color="black" 
            border="1px solid black"
            size="lg" 
            w="100%"
            onClick={handleResendEmail}
            isLoading={isSubmitting}
            _hover={{ 
              bg: "gray.300",
            }}
            transition="all 0.3s ease"
          >
            Resend email
          </Button>

          <Text>
            Remember your password?{' '}
            <ChakraLink 
              as={RouterLink} 
              to="/login" 
              color="#FF4035" 
              fontWeight="bold"
              _hover={{ 
                color: "#FF4035", 
              }} 
              transition="all 0.3s ease"
            >
              Login
            </ChakraLink>
          </Text>
        </VStack>
      </Box>

      <Box position="absolute" bottom="10px" right="10px">
        <Text fontSize="sm" color="black.500">
          <ChakraLink href="https://www.zavata.ai/terms-of-service" isExternal>
            Terms of Service
          </ChakraLink> 
          {' | '}
          <ChakraLink href="https://www.zavata.ai/privacy-policy" isExternal>
            Privacy Policy
          </ChakraLink>
        </Text>
      </Box>
    </Box>
  );
};

export default CheckYourEmail;
