import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, OAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC5i0f6AvY-nP77gQ8hjwcKiDwKaLPdTX4",
  authDomain: "sia-oauth-6e754.firebaseapp.com",
  projectId: "sia-oauth-6e754",
  storageBucket: "sia-oauth-6e754.appspot.com",
  messagingSenderId: "817559144271",
  appId: "1:817559144271:web:6dc5168a656f49c700273a",
  measurementId: "G-LFE0MBZBVX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);  // Initialize and assign the auth object

// Providers
const googleProvider = new GoogleAuthProvider();
const microsoftProvider = new OAuthProvider('microsoft.com');

// Google sign-in function
export const signInWithGoogle = (navigate) => {
  signInWithPopup(auth, googleProvider)
    .then((result) => {
      const user = result.user;
      console.log("User Info: ", user);
      navigate('/candidate-interview');  // Navigate to the correct page after successful login
    })
    .catch((error) => {
      console.error("Error during Google sign-in:", error);
    });
};

// Microsoft sign-in function
export const signInWithMicrosoft = (navigate) => {
  signInWithPopup(auth, microsoftProvider)
    .then((result) => {
      const user = result.user;
      console.log("Microsoft User Info: ", user);
      navigate('/candidate-interview');
    })
    .catch((error) => {
      console.error("Error during Microsoft sign-in:", error);
    });
};

export { auth };  // Export the auth object so it can be used elsewhere
