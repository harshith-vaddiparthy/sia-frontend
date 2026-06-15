import React, { useState } from 'react';
import { Box, Heading, Input, Button, Text, VStack, Link as ChakraLink, HStack, FormControl, InputGroup, InputRightElement, Divider } from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithGoogle, signInWithMicrosoft, auth } from '../firebase-config';
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { FcGoogle } from 'react-icons/fc';
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import logo from './zavata-logo.png';

const MicrosoftIcon = () => (
  <Box display="inline-flex" flexWrap="wrap" width="20px" height="20px">
    <Box width="10px" height="10px" bg="#F25022" />
    <Box width="10px" height="10px" bg="#7FBA00" />
    <Box width="10px" height="10px" bg="#00A4EF" />
    <Box width="10px" height="10px" bg="#FFB900" />
  </Box>
);

const OrSeparator = () => (
  <HStack width="100%" align="center">
    <Divider borderColor="gray.400" />
    <Text px={2} fontSize="sm" color="gray.600">OR</Text>
    <Divider borderColor="gray.400" />
  </HStack>
);

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);

  const handleLogin = async () => {
    setError("");

    if (!email || !password) {
      setError("Both email and password are required.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        alert('Please verify your email before logging in.');
        navigate('/verification');
      } else {
        navigate('/candidate-interview'); 
      }
    } catch (error) {
      console.error("Error during login: ", error.message);
      if (error.code === 'auth/user-not-found') {
        setError("No user found with this email.");
      } else if (error.code === 'auth/wrong-password') {
        setError("Incorrect password.");
      } else {
        setError("Failed to log in. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCapsLock = (event) => {
    setCapsLockOn(event.getModifierState('CapsLock'));
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
            <Heading as="h2" size="lg" textAlign="center" mb={2} fontWeight="normal">Welcome</Heading>
            <Text fontSize="md" color="gray.600">Login to your Zavata account</Text>
          </Box>

          {error && <Text color="red.500" textAlign="center">{error}</Text>}

          <FormControl isRequired>
            <Input 
              placeholder="Email*" 
              type="email" 
              bg="white" 
              color="black" 
              border="1px solid black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </FormControl>

          <FormControl isRequired>
            <InputGroup>
              <Input 
                placeholder="Password*" 
                type={showPassword ? "text" : "password"} 
                bg="white" 
                color="black" 
                border="1px solid black"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyUp={handleCapsLock}  
              />
              <InputRightElement>
                <Button variant="ghost" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <ViewIcon color="black" /> : <ViewOffIcon color="black" />}
                </Button>
              </InputRightElement>
            </InputGroup>
            {capsLockOn && <Text color="green.500" fontSize="sm">Caps Lock is on</Text>}
          </FormControl>

          <Text textAlign="left">
            <ChakraLink 
              as={RouterLink} 
              to="/forgot-password" 
              color="black" 
              fontWeight="bold"
              _hover={{ 
                color: "#FF4035", 
              }} 
              transition="all 0.3s ease"
            >
              Forgot Password?
            </ChakraLink>
          </Text>

          <Button 
            bg="#FF4035" 
            color="black" 
            size="lg" 
            w="100%"
            onClick={handleLogin}
            isLoading={isSubmitting}
            _hover={{ 
              bg: "#e6392d",
            }}
            transition="all 0.3s ease"
          >
            Login
          </Button>

          <OrSeparator />

          <Button 
            bg="white" 
            color="black" 
            border="1px solid black"
            fontWeight="normal"
            _hover={{ 
              bg: "gray.300",
            }}
            transition="all 0.3s ease"
            size="lg" 
            w="100%" 
            onClick={() => signInWithGoogle(navigate)} 
            leftIcon={<FcGoogle size={20} />}
          >
            Login with Google
          </Button>

          <Button 
            bg="white" 
            color="black" 
            border="1px solid black"
            fontWeight="normal"
            _hover={{ 
              bg: "gray.300",
            }}
            transition="all 0.3s ease"
            size="lg" 
            w="100%" 
            onClick={() => signInWithMicrosoft(navigate)} 
            leftIcon={<MicrosoftIcon />}
          >
            Login with Microsoft
          </Button>

          <Text textAlign="center">
            Don't have an account?{' '}
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

export default Login;
