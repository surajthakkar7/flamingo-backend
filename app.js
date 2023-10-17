const cors = require("cors");
const express = require("express");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const app = express();
const dotenv = require("dotenv");
dotenv.config();

// Create a transporter for nodemailer
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASSWORD, // Your Gmail password
  },
});

// Use bodyParser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the 'cors' middleware
app.use(cors());


app.post("/submit-appointment", (req, res) => {
  console.log("POST request received at /submit-appointment");

  const { name, email, phone, preferredDate, preferredTime, message } =
    req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO, // Replace with your email address
    subject: "New Appointment Request",
    text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nDate: ${preferredDate}\nTime: ${preferredTime}\nMessage: ${message}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send("Failed to send appointment request.");
    } else {
      console.log("Email sent: " + info.response);
      res.setHeader("Content-Type", "application/json"); // Set content type to JSON
      res
        .status(200)
        .json({ message: "Appointment request sent successfully." });
    }
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
