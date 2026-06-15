// SiaAnimation.js
import React, { useState, useEffect } from 'react';
import Lottie from 'react-lottie-player';

const SiaAnimation = ({ isSpeaking, startAnimation, stopAnimation }) => {
  const [animationData, setAnimationData] = useState(null);
  const [shouldPlay, setShouldPlay] = useState(false);

  useEffect(() => {
    fetch('/SiaAnimation.json')
      .then(response => response.json())
      .then(data => setAnimationData(data))
      .catch(error => console.error('Error loading animation data:', error));
  }, []);

  useEffect(() => {
    if (isSpeaking || startAnimation) {
      setShouldPlay(true);
    } else if (stopAnimation) {
      setShouldPlay(false);
    }
  }, [isSpeaking, startAnimation, stopAnimation]);

  if (!animationData) {
    return <div>Loading...</div>;  // You can replace this with a proper loading spinner if you prefer
  }

  return (
    <div style={{ position: "relative", width: 150, height: 150 }}>
      <Lottie
        loop
        play={shouldPlay}  // Play the animation based on shouldPlay state
        animationData={animationData}
        style={{ width: 150, height: 150 }}
      />
      <span style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: '34px',
        fontWeight: 'bold',
        color: 'white'
      }}>SIA</span>
    </div>
  );
};

export default SiaAnimation;
