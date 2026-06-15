import React, { useState, useEffect } from 'react';
import { Box, Heading, Input, Button, Text, VStack, HStack, Link as ChakraLink, FormControl, InputGroup, InputRightElement, Divider, List, ListItem, ListIcon } from '@chakra-ui/react';
import { CheckCircleIcon, WarningIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, signInWithGoogle, signInWithMicrosoft } from '../firebase-config';
import { sendVerificationEmail } from './Verification';
import { FcGoogle } from 'react-icons/fc';
import logo from './zavata-logo.png';

const OrSeparator = () => (
  <HStack width="100%" align="center">
    <Divider borderColor="gray.400" />
    <Text px={2} fontSize="sm" color="gray.600">OR</Text>
    <Divider borderColor="gray.400" />
  </HStack>
);

const MicrosoftIcon = () => (
  <Box display="inline-flex" flexWrap="wrap" width="20px" height="20px">
    <Box width="10px" height="10px" bg="#F25022" />
    <Box width="10px" height="10px" bg="#7FBA00" />
    <Box width="10px" height="10px" bg="#00A4EF" />
    <Box width="10px" height="10px" bg="#FFB900" />
  </Box>
);

const Signup = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const [showPasswordRequirements, setShowPasswordRequirements] = useState(false);

  const [passwordValidity, setPasswordValidity] = useState({
    length: false,
    lowercase: false,
    uppercase: false,
    number: false,
    specialChar: false,
  });

  const validatePassword = (password) => {
    const length = password.length >= 8;
    const lowercase = /[a-z]/.test(password);
    const uppercase = /[A-Z]/.test(password);
    const number = /\d/.test(password);
    const specialChar = /[\W_]/.test(password);

    setPasswordValidity({
      length,
      lowercase,
      uppercase,
      number,
      specialChar,
    });
  };

  useEffect(() => {
    if (password) {
      validatePassword(password);
    }
  }, [password]);

  const handleSignUp = async () => {
    setError("");

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      setError("All fields are required.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!Object.values(passwordValidity).every(Boolean)) {
      setError("Password does not meet all the requirements.");
      return;
    }

    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      await sendVerificationEmail(user);

      alert("Verification email sent. Please check your email to verify your account.");
      navigate('/login');
    } catch (error) {
      console.error("Error signing up: ", error.message);
      if (error.code === 'auth/email-already-in-use') {
        setError("Email already in use.");
      } else {
        setError("Failed to sign up. Please try again.");
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
            <Text fontSize="md" color="gray.600">Create your account with Zavata</Text>
          </Box>

          {error && <Text color="red.500" textAlign="center">{error}</Text>}

          <HStack spacing={4}>
            <FormControl isRequired>
              <Input 
                placeholder="First Name*" 
                bg="white" 
                color="black" 
                border="1px solid black"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired>
              <Input 
                placeholder="Last Name*" 
                bg="white" 
                color="black" 
                border="1px solid black"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </FormControl>
          </HStack>

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
                onFocus={() => setShowPasswordRequirements(true)} 
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

          {showPasswordRequirements && (
            <Box bg="gray.100" p={4} borderRadius="md" border="1px solid gray">
              <Text fontSize="sm">Your password must contain:</Text>
              <List spacing={2} mt={2}>
                <ListItem>
                  <ListIcon boxSize={4} as={passwordValidity.length ? CheckCircleIcon : WarningIcon} color={passwordValidity.length ? "green.500" : "red.500"} />
                  At least 8 characters
                </ListItem>
                <ListItem>
                  <ListIcon boxSize={4} as={passwordValidity.lowercase ? CheckCircleIcon : WarningIcon} color={passwordValidity.lowercase ? "green.500" : "red.500"} />
                  Lower case letters (a-z)
                </ListItem>
                <ListItem>
                  <ListIcon boxSize={4} as={passwordValidity.uppercase ? CheckCircleIcon : WarningIcon} color={passwordValidity.uppercase ? "green.500" : "red.500"} />
                  Upper case letters (A-Z)
                </ListItem>
                <ListItem>
                  <ListIcon boxSize={4} as={passwordValidity.number ? CheckCircleIcon : WarningIcon} color={passwordValidity.number ? "green.500" : "red.500"} />
                  Numbers (0-9)
                </ListItem>
                <ListItem>
                  <ListIcon boxSize={4} as={passwordValidity.specialChar ? CheckCircleIcon : WarningIcon} color={passwordValidity.specialChar ? "green.500" : "red.500"} />
                  Special characters (e.g. !@#$%^&*)
                </ListItem>
              </List>
            </Box>
          )}

          <FormControl isRequired>
            <Input 
              placeholder="Confirm Password*" 
              type="password" 
              bg="white" 
              color="black" 
              border="1px solid black"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </FormControl>

          <Button 
            bg="#FF4035" 
            color="black" 
            size="lg" 
            w="100%"
            onClick={handleSignUp}
            isLoading={isSubmitting}
            _hover={{ 
              bg: "#e6392d",
            }}
            transition="all 0.3s ease"
          >
            Sign Up
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
            Sign up with Google
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
            Sign up with Microsoft
          </Button>

          <Text textAlign="center">
  Already have an account?{' '}
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

export default Signup;
