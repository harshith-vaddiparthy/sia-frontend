import React, { useState } from 'react';
import { Box, Heading, Input, Button, Text, VStack, FormControl, HStack, Link as ChakraLink, Divider } from '@chakra-ui/react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../firebase-config';
import logo from './zavata-logo.png';

const OrSeparator = () => (
  <HStack width="100%" align="center">
    <Divider borderColor="gray.400" />
    <Text px={2} fontSize="sm" color="gray.600">OR</Text>
    <Divider borderColor="gray.400" />
  </HStack>
);

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleForgotPassword = async () => {
    setError("");
    setMessage("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("If an account with this email exists, a password reset link has been sent.");
      navigate('/check-your-email', { state: { email } }); // Pass the email to the next page
    } catch (error) {
      console.error("Error resetting password: ", error.message);
      setError("Failed to reset password. Please try again.");
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
        <VStack spacing={4} align="stretch">
          <Box textAlign="center">
            <img src={logo} alt="Zavata logo" style={{ width: '310px', height: 'auto', marginBottom: '26px' }} />
            <Heading as="h2" size="lg" textAlign="center" mb={2} fontWeight="normal">Forgot Your Password?</Heading>
            <Text fontSize="md" color="gray.600">Enter your email address and we will send you instructions to reset your password.</Text>
          </Box>

          {error && <Text color="red.500" textAlign="center">{error}</Text>}
          {message && <Text color="green.500" textAlign="center">{message}</Text>}

          <FormControl isRequired>
            <Input 
              placeholder="Enter your email" 
              type="email" 
              bg="white" 
              color="black" 
              border="1px solid black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <Button 
            bg="#FF4035" 
            color="black" 
            size="lg" 
            w="100%"
            onClick={handleForgotPassword}
            isLoading={isSubmitting}
            _hover={{ 
              bg: "#e6392d",
            }}
            transition="all 0.3s ease"
          >
            Reset Password
          </Button>

          <OrSeparator />

          {/* Navigation Links */}
          <Text textAlign="center">
            Remembered your password?{' '}
            <ChakraLink 
              as={RouterLink} 
              to="/login" 
              color="black" 
              fontWeight="bold"
              _hover={{ 
                color: "#FF4035", 
              }} 
              transition="all 0.3s ease"
            >
              Login
            </ChakraLink>
          </Text>

          <Text textAlign="center">
            Don’t have an account?{' '}
            <ChakraLink 
              as={RouterLink} 
              to="/signup" 
              color="black" 
              fontWeight="bold"
              _hover={{ 
                color: "#FF4035", 
              }} 
              transition="all 0.3s ease"
            >
              Sign up
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

export default ForgotPassword;
