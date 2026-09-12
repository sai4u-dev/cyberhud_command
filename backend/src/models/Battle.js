import mongoose from "mongoose";

export const BATTLE_TYPES = {
  ONE_TO_ONE: "one_to_one",
  ONE_TO_MANY: "one_to_many",
};

export const BATTLE_STATUS = {
  WAITING: "waiting",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const BATTLE_MODES = {
  RANKED: "ranked",
  CASUAL: "casual",
  TOURNAMENT: "tournament",
};

const participantSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    username: String,
    displayName: String,
    avatar: String,
    role: { type: String, enum: ["host", "challenger", "participant"], default: "participant" },
    score: { type: Number, default: 0 },
    isReady: { type: Boolean, default: false },
    isWinner: { type: Boolean, default: false },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const battleSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      // human-readable e.g., BT-8X2K9P
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    description: {
      type: String,
      maxlength: 300,
      default: "",
    },
    type: {
      type: String,
      enum: Object.values(BATTLE_TYPES),
      required: true,
    },
    mode: {
      type: String,
      enum: Object.values(BATTLE_MODES),
      default: BATTLE_MODES.CASUAL,
    },
    status: {
      type: String,
      enum: Object.values(BATTLE_STATUS),
      default: BATTLE_STATUS.WAITING,
      index: true,
    },
    // Creator/host
    host: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Participants array - includes host
    participants: [participantSchema],

    // Capacity
    maxParticipants: {
      type: Number,
      required: true,
      min: 2,
      max: 32,
      validate: {
        validator: function (v) {
          if (this.type === BATTLE_TYPES.ONE_TO_ONE) return v === 2;
          if (this.type === BATTLE_TYPES.ONE_TO_MANY) return v >= 3 && v <= 16;
          return true;
        },
        message: "1v1 must be 2, 1vN must be 3-16",
      },
    },

    // Game-specific
    mapZone: {
      name: String,
      coordinates: [Number], // [lng, lat]
      googlePlaceId: String,
    },
    entryFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    prizePool: {
      type: Number,
      default: 0,
    },
    winner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    // For 1v1
    challenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // Timing
    scheduledAt: Date,
    startedAt: Date,
    endedAt: Date,

    // Metadata
    isPrivate: { type: Boolean, default: false },
    password: { type: String, select: false, default: null }, // for private battles
    // For extensibility: store battle log/events
    events: [
      {
        eventType: { type: String, default: "info" },
        message: String,
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Indexes for performant queries
battleSchema.index({ type: 1, status: 1 });
battleSchema.index({ host: 1 });
battleSchema.index({ "participants.user": 1 });
battleSchema.index({ createdAt: -1 });

// Generate code pre-save
battleSchema.pre("validate", function (next) {
  if (!this.code) {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let c = "BT-";
    for (let i = 0; i < 6; i++) c += chars[Math.floor(Math.random() * chars.length)];
    this.code = c;
  }
  // Ensure host is in participants
  if (this.host && this.participants.length === 0) {
    // will be populated in controller; keep placeholder
  }
  next();
});

battleSchema.methods.isFull = function () {
  return this.participants.length >= this.maxParticipants;
};

battleSchema.methods.hasParticipant = function (userId) {
  return this.participants.some((p) => p.user.toString() === userId.toString());
};

battleSchema.methods.canJoin = function (userId) {
  if (this.status !== BATTLE_STATUS.WAITING) return { ok: false, reason: "Battle not open for joining" };
  if (this.isFull()) return { ok: false, reason: "Battle is full" };
  if (this.hasParticipant(userId)) return { ok: false, reason: "Already joined" };
  return { ok: true };
};

const Battle = mongoose.model("Battle", battleSchema);
export default Battle;
