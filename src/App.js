import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import CandidateInterview from './components/CandidateInterview';
import LoginPage from './components/LoginPage';
import Signup from './components/Signup';
import ForgotPassword from './components/ForgotPassword';
import Verification from './components/Verification';
import CheckYourEmail from './components/CheckYourEmail'; // Import CheckYourEmail component
import UserProfile from './components/UserProfile';

import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import { getAuth } from 'firebase/auth';

function Home() {
  return <Navigate to="/login" />;
}

const PrivateRoute = ({ element, ...rest }) => {
  const auth = getAuth();
  const user = auth.currentUser;

  return user ? element : <Navigate to="/login" />;
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/check-your-email" element={<CheckYourEmail />} />  {/* Add CheckYourEmail route */}
          <Route path="/candidate-interview" element={<PrivateRoute element={<CandidateInterview />} />} />
          <Route path="/sia" element={<PrivateRoute element={<UserProfile />} />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
