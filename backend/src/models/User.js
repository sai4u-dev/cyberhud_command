import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import validator from "validator";

export const ROLES = {
  USER: "user",
  MODERATOR: "moderator",
  ORGANIZER: "organizer",
  ADMIN: "admin",
};

export const ROLE_HIERARCHY = {
  [ROLES.USER]: 1,
  [ROLES.MODERATOR]: 2,
  [ROLES.ORGANIZER]: 3,
  [ROLES.ADMIN]: 4,
};

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
      match: [/^[a-zA-Z0-9_\-]+$/, "Username can only contain alphanumeric, underscore and hyphen"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: function () {
        return !this.googleId; // password not required for OAuth users
      },
      minlength: 8,
      select: false,
    },
    displayName: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    avatar: {
      type: String,
      default: "",
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    // RBAC - fine-grained permissions derived from role
    permissions: {
      type: [String],
      default: [],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    googleId: {
      type: String,
      sparse: true,
      unique: true,
    },
    refreshTokens: [
      {
        token: String,
        createdAt: { type: Date, default: Date.now },
        expiresAt: Date,
      },
    ],
    // Gaming specific fields
    stats: {
      level: { type: Number, default: 1 },
      xp: { type: Number, default: 0 },
      battlesWon: { type: Number, default: 0 },
      battlesLost: { type: Number, default: 0 },
      rank: { type: String, default: "RECRUIT" },
      credits: { type: Number, default: 1000 },
    },
    location: {
      // for Google Maps - battle zone preference
      type: { type: String, enum: ["Point"], default: "Point" },
      coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
      address: String,
    },
    status: {
      type: String,
      enum: ["active", "banned", "suspended"],
      default: "active",
    },
    lastLogin: Date,
    // Theme based settings - integrated with MongoDB
    selectedTheme: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Theme",
      default: null,
    },
    // Alias for quick lookup without populate
    themeKey: {
      type: String,
      default: "cyber-neon",
    },
    settings: {
      theme: { type: String, default: "cyber-neon" }, // mirror themeKey for redundancy
      notifications: {
        battleInvites: { type: Boolean, default: true },
        tournamentUpdates: { type: Boolean, default: true },
        marketing: { type: Boolean, default: false },
      },
      sound: {
        master: { type: Number, default: 80, min: 0, max: 100 },
        sfx: { type: Number, default: 80, min: 0, max: 100 },
        music: { type: Number, default: 60, min: 0, max: 100 },
      },
      graphics: {
        quality: { type: String, enum: ["low", "medium", "high", "ultra"], default: "high" },
        motion: { type: Boolean, default: true },
      },
      privacy: {
        showStats: { type: Boolean, default: true },
        allowChallenges: { type: Boolean, default: true },
      },
    },
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });
userSchema.index({ role: 1 });
// email already indexed via unique:true - no duplicate index needed

// Hash password before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Normalize role permissions - scalable RBAC
userSchema.methods.hasPermission = function (requiredRole) {
  if (!requiredRole) return true;
  const userLevel = ROLE_HIERARCHY[this.role] || 0;
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0;
  return userLevel >= requiredLevel;
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshTokens;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", userSchema);
export default User;
