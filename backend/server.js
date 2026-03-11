import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sgMail from "@sendgrid/mail";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

dotenv.config({ path: path.resolve(__dirname, ".env") });
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();

app.use(
  cors({
    origin: (_origin, callback) => callback(null, true),
    methods: ["GET", "POST", "OPTIONS"],
    credentials: false,
  })
);

app.use(express.json());

const defaultSystemPrompt =
  "Speak as Abdulwahab Kayode in first person and explain skills, projects, and portfolio value clearly.";
const defaultPersonalityPrompt =
  "Speak as me in first person at all times. Never refer to yourself as an AI assistant.";

const promptFilePath = path.join(__dirname, "ai-system-prompt.txt");
const personalityFilePath = path.join(__dirname, "about-me-personality.txt");

function loadPromptFile(filePath, fallback, label) {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8").trim();
      if (content.length > 0) {
        console.log(`Loaded ${label}`);
        return content;
      }
    }
  } catch (err) {
    console.error(`Failed to load ${label}:`, err.message);
  }
  console.log(`Using default ${label}`);
  return fallback;
}

let systemPrompt = loadPromptFile(promptFilePath, defaultSystemPrompt, "ai-system-prompt.txt");
let personalityPrompt = loadPromptFile(
  personalityFilePath,
  defaultPersonalityPrompt,
  "about-me-personality.txt"
);

function getEffectiveSystemPrompt() {
  return `${personalityPrompt}\n\nAdditional context:\n${systemPrompt}`;
}

function shouldRelayToOwner(message) {
  const m = message.toLowerCase();
  return (
    m.includes("relay") ||
    m.includes("forward") ||
    m.includes("hire") ||
    m.includes("hiring") ||
    m.includes("hire you") ||
    m.includes("collaborate") ||
    m.includes("collaboration") ||
    m.includes("email you") ||
    m.includes("send you") ||
    m.includes("send this to you") ||
    m.includes("contact you") ||
    m.includes("reach you")
  );
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

async function sendRecruiterEmail({ name, email, message }) {
  const apiKey = process.env.SENDGRID_API_KEY;
  const from = process.env.SENDGRID_FROM;
  const to = process.env.EMAIL_TO || process.env.RECRUITER_TO_EMAIL;

  if (!apiKey || !from || !to || !email) {
    return { ok: false, error: "SendGrid is not configured." };
  }

  const msg = {
    to,
    from,
    replyTo: email,
    subject: `Portfolio message from ${name || "Recruiter"}`,
    text: `Name: ${name || "N/A"}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  await sgMail.send(msg);
  return { ok: true };
}

async function callGroq({ messages }) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error("GROQ_API_KEY is missing");

  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.6,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Groq API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim();
}

function generateDemoResponse(message, prompt) {
  const m = message.toLowerCase();
  const hasReact = prompt.toLowerCase().includes("react");
  const hasNextjs = prompt.toLowerCase().includes("next.js");
  const hasTailwind = prompt.toLowerCase().includes("tailwind");

  if (m.includes("skill") || m.includes("expertise")) {
    const skills = [
      hasReact ? "React" : null,
      hasNextjs ? "Next.js" : null,
      hasTailwind ? "Tailwind CSS" : null,
      "JavaScript",
      "HTML/CSS",
      "Figma",
    ]
      .filter(Boolean)
      .join(", ");
    return `I specialize in modern, responsive, and high-performance web applications. My key skills include ${skills}.`;
  }

  if (m.includes("project"))
    return "I have built e-commerce products, portfolio sites, and interactive web apps. I prioritize usability, responsiveness, and performance.";
  if (m.includes("tech") || m.includes("stack"))
    return "My core stack includes React, Next.js, Tailwind CSS, JavaScript, and modern component systems.";
  if (m.includes("experience"))
    return "My experience focuses on turning product ideas into clean, responsive interfaces with strong UX.";
  if (m.includes("hire") || m.includes("work"))
    return "I am available for projects where frontend quality and product clarity matter.";

  return "I can walk you through my skills, projects, process, and stack choices. Tell me what you want to know.";
}

app.post("/chat", async (req, res) => {
  try {
    const userMessage = (req.body?.message || "").trim();
    if (!userMessage) return res.status(400).json({ error: "Message is required" });

    const visitorName = (req.body?.visitorName || "").trim();
    const visitorEmail = (req.body?.visitorEmail || "").trim();

    let reply;
    let demoMode = process.env.DEMO_MODE !== "false";

    const incomingHistory = Array.isArray(req.body?.history) ? req.body.history : [];
    const historyMessages = incomingHistory
      .filter((msg) => msg && typeof msg.text === "string")
      .map((msg) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: msg.text,
      }));

    const messages = [
      { role: "system", content: getEffectiveSystemPrompt() },
      ...historyMessages.slice(-10),
      { role: "user", content: userMessage },
    ];

    if (!demoMode) {
      try {
        reply = await callGroq({ messages });
      } catch (aiError) {
        console.warn("Groq AI failed, falling back to demo mode:", aiError.message);
        demoMode = true;
      }
    }

    if (!reply) {
      reply = generateDemoResponse(userMessage, getEffectiveSystemPrompt());
      demoMode = true;
    }

    if (shouldRelayToOwner(userMessage)) {
      if (!visitorName || !visitorEmail) {
        reply =
          "Before I relay your message, please share your name and email so I can identify you.";
        return res.json({ reply, demoMode, requiresIdentity: true });
      }

      const emailBody = `Recruiter message from ${visitorName} <${visitorEmail}>:\n${userMessage}`;

      try {
        const result = await sendRecruiterEmail({
          name: visitorName,
          email: visitorEmail,
          message: emailBody,
        });

        if (result.ok) {
          reply += "\n\nI have forwarded your message to my email.";
        } else {
          reply += "\n\nI can relay this, but email is not configured yet.";
        }
      } catch (emailErr) {
        console.error("Email relay failed:", emailErr.message);
        reply += "\n\nI tried to relay this, but email delivery failed.";
      }
    }

    res.json({ reply, demoMode });
  } catch (err) {
    console.error("Chat API Error:", err.message);
    res.status(500).json({
      reply: "I am having trouble responding right now. Please try again in a moment.",
      demoMode: process.env.DEMO_MODE !== "false",
      error: err.message,
    });
  }
});

app.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "AI server is running",
    demoMode: process.env.DEMO_MODE !== "false",
    promptLoaded: Boolean(systemPrompt),
    personalityLoaded: Boolean(personalityPrompt),
    provider: "groq",
  });
});

app.post("/api/update-prompt", (req, res) => {
  try {
    const prompt = (req.body?.prompt || "").trim();
    if (!prompt) return res.status(400).json({ error: "Prompt cannot be empty" });
    fs.writeFileSync(promptFilePath, prompt, "utf-8");
    systemPrompt = prompt;
    res.json({
      success: true,
      message: "System prompt updated.",
      prompt: prompt.substring(0, 100) + "...",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update prompt", details: err.message });
  }
});

app.listen(5000, () => {
  console.log("AI Portfolio Server running on http://localhost:5000");
  console.log("Demo mode:", process.env.DEMO_MODE !== "false" ? "ENABLED" : "DISABLED");
});
