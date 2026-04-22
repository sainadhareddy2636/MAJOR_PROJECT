import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/poseperfect";
const JWT_SECRET = process.env.JWT_SECRET || "replace-this-in-production";
const CLIENT_ORIGIN =
  process.env.CLIENT_ORIGIN || "https://pose-perfect-wheat.vercel.app";
const SESSION_COOKIE_NAME = "poseperfect_session";
const IS_PRODUCTION = process.env.NODE_ENV === "production";
app.set("trust proxy", 1);
app.use(
  cors({
    origin: "https://pose-perfect-wheat.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json({ limit: "1mb" }));

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

const reportMetricSchema = new mongoose.Schema(
  {
    name: String,
    avg: Number,
  },
  { _id: false },
);

const reportCorrectionSchema = new mongoose.Schema(
  {
    tip: String,
    count: Number,
  },
  { _id: false },
);

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    generatedAt: String,
    durationSec: Number,
    framesCaptured: Number,
    averageScore: Number,
    latestScore: Number,
    metricSummary: [reportMetricSchema],
    bestMetric: reportMetricSchema,
    worstMetric: reportMetricSchema,
    topCorrections: [reportCorrectionSchema],
    scoringMode: String,
    asanaId: String,
    asanaName: String,
    asanaSanskrit: String,
    targetArea: String,
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);
const Report = mongoose.model("Report", reportSchema);

const emailSchema = z.string().trim().email("Enter a valid email address.");
const passwordSchema = z
  .string()
  .min(8, "Password must be 8+ characters with at least 1 uppercase letter and 1 number.");

const authPayloadSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

const loginPayloadSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Email and password are required."),
});

const reportMetricPayloadSchema = z.object({
  name: z.string().trim().min(1).max(60),
  avg: z.number().min(0).max(100),
});

const reportCorrectionPayloadSchema = z.object({
  tip: z.string().trim().min(1).max(240),
  count: z.number().int().min(1).max(1000),
});

const reportPayloadSchema = z.object({
  generatedAt: z.string().datetime().optional(),
  durationSec: z.number().min(0).max(60 * 60 * 4).optional(),
  framesCaptured: z.number().int().min(0).max(100000).optional(),
  averageScore: z.number().min(0).max(100).optional(),
  latestScore: z.number().min(0).max(100).optional(),
  metricSummary: z.array(reportMetricPayloadSchema).max(12).optional(),
  bestMetric: reportMetricPayloadSchema.nullable().optional(),
  worstMetric: reportMetricPayloadSchema.nullable().optional(),
  topCorrections: z.array(reportCorrectionPayloadSchema).max(10).optional(),
  scoringMode: z.enum(["trainer", "self"]).optional(),
  asanaId: z.string().trim().min(1).max(80).optional(),
  asanaName: z.string().trim().min(1).max(120).optional(),
  asanaSanskrit: z.string().trim().min(1).max(120).optional(),
  targetArea: z.string().trim().min(1).max(120).optional(),
});

const validatePassword = (password) => {
  const minLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  return minLength && hasUpper && hasNumber;
};

const getValidationMessage = (error) => {
  if (error instanceof z.ZodError) {
    return error.issues[0]?.message || "Invalid request payload.";
  }
  return "Invalid request payload.";
};

const isDuplicateEmailError = (error) =>
  error instanceof mongoose.Error &&
  "code" in error &&
  error.code === 11000 &&
  error.keyPattern?.email;

const createToken = (user) =>
  jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
    },
    JWT_SECRET,
    { expiresIn: "7d" },
  );

const cookieOptions = {
  httpOnly: true,
  sameSite: "none",
  secure: true,
  path:"/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const setSessionCookie = (res, token) => {
  res.cookie(SESSION_COOKIE_NAME, token, cookieOptions);
};

const clearSessionCookie = (res) => {
  res.clearCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    sameSite: "lax",
    secure: IS_PRODUCTION,
  });
};

const getCookieValue = (req, name) => {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((part) => part.trim());
  for (const cookie of cookies) {
    const [key, ...rest] = cookie.split("=");
    if (key === name) {
      return decodeURIComponent(rest.join("="));
    }
  }

  return null;
};

const authRequired = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice("Bearer ".length) : null;
  const cookieToken = getCookieValue(req, SESSION_COOKIE_NAME);
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ message: "Authentication required." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.sub).lean();
    if (!user) {
      return res.status(401).json({ message: "Session is no longer valid." });
    }
    req.user = { id: user._id.toString(), email: user.email };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired session." });
  }
};

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/auth/register", async (req, res) => {
  let parsed;
  try {
    parsed = authPayloadSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ message: getValidationMessage(error) });
  }

  const email = parsed.email.trim().toLowerCase();
  const password = parsed.password;

  if (!validatePassword(password)) {
    return res.status(400).json({
      message: "Password must be 8+ characters with at least 1 uppercase letter and 1 number.",
    });
  }

  try {
    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return res.status(409).json({ message: "Email already registered. Please sign in." });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ email, passwordHash });
    const token = createToken(user);
    setSessionCookie(res, token);

    return res.status(201).json({
      user: { email: user.email },
    });
  } catch (error) {
    if (isDuplicateEmailError(error)) {
      return res.status(409).json({ message: "Email already registered. Please sign in." });
    }
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  let parsed;
  try {
    parsed = loginPayloadSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ message: getValidationMessage(error) });
  }

  const email = parsed.email.trim().toLowerCase();
  const password = parsed.password;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);
    setSessionCookie(res, token);

    return res.json({
      user: { email: user.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/auth/logout", (_req, res) => {
  clearSessionCookie(res);
  return res.status(204).send();
});

app.get("/api/auth/me", authRequired, async (req, res) => {
  res.json({ user: { email: req.user.email } });
});

app.get("/api/reports", authRequired, async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return res.json({ reports });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.post("/api/reports", authRequired, async (req, res) => {
  let payload;
  try {
    payload = reportPayloadSchema.parse(req.body);
  } catch (error) {
    return res.status(400).json({ message: getValidationMessage(error) });
  }

  try {
    const report = await Report.create({
      ...payload,
      userId: req.user.id,
    });

    return res.status(201).json({ report });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.delete("/api/reports", authRequired, async (req, res) => {
  try {
    await Report.deleteMany({ userId: req.user.id });
    return res.status(204).send();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error." });
  }
});

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error." });
});

const start = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    app.listen(PORT, () => {
      console.log(`PosePerfect API listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
