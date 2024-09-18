import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1);

  const sendOtp = async () => {
    try {
      await axios.post('http://localhost:5000/send-otp', { email });
      setStep(2);
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post('http://localhost:5000/verify-otp', { email, enteredOtp: otp });
      alert('OTP verified successfully!');
    } catch (error) {
      console.error(error);
      alert('Invalid OTP');
    }
  };

  return (
    <div className="container">
      {step === 1 && (
        <div className="step-transition">
          <h2>Enter your email</h2>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address"
          />
          <button onClick={sendOtp}>Send OTP</button>
        </div>
      )}
      {step === 2 && (
        <div className="step-transition">
          <h2>Enter the OTP</h2>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={verifyOtp}>Verify OTP</button>
        </div>
      )}
    </div>
  );
}

export default App;
