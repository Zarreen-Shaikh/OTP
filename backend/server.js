const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Store OTPs with their corresponding email
const otpStore = new Map();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = generateOTP(); // Generate a new OTP for each request
  otpStore.set(email, otp); // Store the OTP with the email

  let transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: 'OTP Verification',
    text: `Your OTP is ${otp}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.status(200).send('OTP sent');
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, enteredOtp } = req.body;
  const storedOtp = otpStore.get(email);
  
  if (storedOtp && enteredOtp === storedOtp) {
    otpStore.delete(email); // Remove the OTP after successful verification
    return res.status(200).send('OTP verified');
  }
  return res.status(400).send('Invalid OTP');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
