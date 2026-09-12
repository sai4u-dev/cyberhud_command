import Battle, { BATTLE_STATUS, BATTLE_TYPES } from "../models/Battle.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";

// Helper to populate participant user info
const populateBattle = (query) =>
  query
    .populate("host", "username displayName avatar role stats")
    .populate("participants.user", "username displayName avatar role stats")
    .populate("winner", "username displayName");

// Create battle
export const createBattle = async (req, res, next) => {
  try {
    const { title, description, type, maxParticipants, mode, mapZone, entryFee, isPrivate, password } = req.body;

    if (!title || !type) throw new ApiError(400, "title and type are required");
    if (!Object.values(BATTLE_TYPES).includes(type)) throw new ApiError(400, "Invalid battle type");

    // Enforce capacities
    let capacity = maxParticipants;
    if (type === BATTLE_TYPES.ONE_TO_ONE) capacity = 2;
    else if (type === BATTLE_TYPES.ONE_TO_MANY) {
      if (!capacity) capacity = 8;
      if (capacity < 3 || capacity > 16) throw new ApiError(400, "1vN battles must have 3-16 participants");
    }

    const battle = await Battle.create({
      title,
      description,
      type,
      mode: mode || "casual",
      host: req.user._id,
      maxParticipants: capacity,
      mapZone,
      entryFee: entryFee || 0,
      isPrivate: !!isPrivate,
      password: password || null,
      participants: [
        {
          user: req.user._id,
          username: req.user.username,
          displayName: req.user.displayName,
          avatar: req.user.avatar,
          role: "host",
          isReady: true,
        },
      ],
      events: [{ eventType: "created", message: `${req.user.username} created battle`, user: req.user._id }],
    });

    const populated = await populateBattle(Battle.findById(battle._id));
    res.status(201).json(new ApiResponse(201, { battle: populated }, "Battle created"));
  } catch (err) {
    next(err);
  }
};

// List battles with filters
export const getBattles = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 10);
    const skip = (page - 1) * limit;
    const { type, status, search, mode } = req.query;

    const filter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    else filter.status = { $in: [BATTLE_STATUS.WAITING, BATTLE_STATUS.IN_PROGRESS] };
    if (mode) filter.mode = mode;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }

    const [battles, total] = await Promise.all([
      populateBattle(Battle.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit)),
      Battle.countDocuments(filter),
    ]);

    res.status(200).json(
      new ApiResponse(200, { battles, pagination: { page, limit, total, pages: Math.ceil(total / limit) } }, "Battles fetched")
    );
  } catch (err) {
    next(err);
  }
};

export const getBattleById = async (req, res, next) => {
  try {
    const battle = await populateBattle(Battle.findById(req.params.id));
    if (!battle) throw new ApiError(404, "Battle not found");
    res.status(200).json(new ApiResponse(200, { battle }, "Battle fetched"));
  } catch (err) {
    next(err);
  }
};

export const getBattleByCode = async (req, res, next) => {
  try {
    const battle = await populateBattle(Battle.findOne({ code: req.params.code.toUpperCase() }));
    if (!battle) throw new ApiError(404, "Battle not found");
    res.status(200).json(new ApiResponse(200, { battle }, "Battle fetched"));
  } catch (err) {
    next(err);
  }
};

// Join battle
export const joinBattle = async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) throw new ApiError(404, "Battle not found");

    const check = battle.canJoin(req.user._id);
    if (!check.ok) throw new ApiError(400, check.reason);

    if (battle.isPrivate && battle.password) {
      const { password } = req.body;
      if (password !== battle.password) throw new ApiError(403, "Invalid battle password");
    }

    battle.participants.push({
      user: req.user._id,
      username: req.user.username,
      displayName: req.user.displayName,
      avatar: req.user.avatar,
      role: battle.type === BATTLE_TYPES.ONE_TO_ONE ? "challenger" : "participant",
      isReady: false,
    });

    // If 1v1 and now 2 participants, optionally set challenger
    if (battle.type === BATTLE_TYPES.ONE_TO_ONE && battle.participants.length === 2) {
      battle.challenger = req.user._id;
    }

    battle.events.push({ eventType: "join", message: `${req.user.username} joined`, user: req.user._id });
    await battle.save();

    const populated = await populateBattle(Battle.findById(battle._id));
    res.status(200).json(new ApiResponse(200, { battle: populated }, "Joined battle"));
  } catch (err) {
    next(err);
  }
};

// Leave battle
export const leaveBattle = async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) throw new ApiError(404, "Battle not found");

    if (!battle.hasParticipant(req.user._id)) throw new ApiError(400, "Not a participant");

    if (battle.host.toString() === req.user._id.toString() && battle.participants.length > 1) {
      throw new ApiError(400, "Host cannot leave while others are present. Cancel instead.");
    }

    battle.participants = battle.participants.filter((p) => p.user.toString() !== req.user._id.toString());
    if (battle.challenger?.toString() === req.user._id.toString()) battle.challenger = null;

    battle.events.push({ eventType: "leave", message: `${req.user.username} left`, user: req.user._id });

    // If no participants left, cancel
    if (battle.participants.length === 0) {
      battle.status = BATTLE_STATUS.CANCELLED;
    }

    await battle.save();
    const populated = await populateBattle(Battle.findById(battle._id));
    res.status(200).json(new ApiResponse(200, { battle: populated }, "Left battle"));
  } catch (err) {
    next(err);
  }
};

// Ready toggle
export const toggleReady = async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) throw new ApiError(404, "Battle not found");

    const participant = battle.participants.find((p) => p.user.toString() === req.user._id.toString());
    if (!participant) throw new ApiError(400, "Not a participant");

    participant.isReady = !participant.isReady;
    await battle.save();

    const populated = await populateBattle(Battle.findById(battle._id));
    res.status(200).json(new ApiResponse(200, { battle: populated }, `Ready: ${participant.isReady}`));
  } catch (err) {
    next(err);
  }
};

// Start battle (host only)
export const startBattle = async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) throw new ApiError(404, "Battle not found");
    if (battle.host.toString() !== req.user._id.toString()) throw new ApiError(403, "Only host can start battle");
    if (battle.status !== BATTLE_STATUS.WAITING) throw new ApiError(400, `Cannot start battle in ${battle.status} state`);
    if (battle.type === BATTLE_TYPES.ONE_TO_ONE && battle.participants.length < 2) throw new ApiError(400, "Need 2 players for 1v1");
    if (battle.type === BATTLE_TYPES.ONE_TO_MANY && battle.participants.length < 3) throw new ApiError(400, "Need at least 3 players for 1vN");

    // Check all ready (optional - require host to be ready + at least 50% ready)
    // For now, allow start if host initiates

    battle.status = BATTLE_STATUS.IN_PROGRESS;
    battle.startedAt = new Date();
    battle.events.push({ eventType: "start", message: `Battle started by ${req.user.username}`, user: req.user._id });
    await battle.save();

    const populated = await populateBattle(Battle.findById(battle._id));
    res.status(200).json(new ApiResponse(200, { battle: populated }, "Battle started"));
  } catch (err) {
    next(err);
  }
};

// Finish battle (host or admin)
export const finishBattle = async (req, res, next) => {
  try {
    const { winnerId } = req.body;
    const battle = await Battle.findById(req.params.id);
    if (!battle) throw new ApiError(404, "Battle not found");
    if (battle.status !== BATTLE_STATUS.IN_PROGRESS) throw new ApiError(400, "Battle not in progress");

    const isHost = battle.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isHost && !isAdmin) throw new ApiError(403, "Only host or admin can finish battle");

    let winner = null;
    if (winnerId) {
      winner = battle.participants.find((p) => p.user.toString() === winnerId.toString());
      if (!winner) throw new ApiError(400, "Winner must be a participant");
      battle.winner = winnerId;
      winner.isWinner = true;
    } else {
      // auto-pick highest score or random for demo
      const sorted = [...battle.participants].sort((a, b) => b.score - a.score);
      winner = sorted[0];
      battle.winner = winner.user;
      winner.isWinner = true;
    }

    battle.status = BATTLE_STATUS.COMPLETED;
    battle.endedAt = new Date();
    battle.events.push({ eventType: "finish", message: `Battle finished. Winner: ${winner.username}`, user: winner.user });

    await battle.save();

    // Update user stats (simple)
    // Winner gets XP + credits
    const User = (await import("../models/User.js")).default;
    for (const p of battle.participants) {
      const isWinner = p.user.toString() === battle.winner.toString();
      await User.findByIdAndUpdate(p.user, {
        $inc: {
          "stats.battlesWon": isWinner ? 1 : 0,
          "stats.battlesLost": isWinner ? 0 : 1,
          "stats.xp": isWinner ? 150 : 30,
          "stats.credits": isWinner ? 500 : 50,
        },
      });
    }

    const populated = await populateBattle(Battle.findById(battle._id));
    res.status(200).json(new ApiResponse(200, { battle: populated }, "Battle completed"));
  } catch (err) {
    next(err);
  }
};

// Cancel battle (host/admin)
export const cancelBattle = async (req, res, next) => {
  try {
    const battle = await Battle.findById(req.params.id);
    if (!battle) throw new ApiError(404, "Battle not found");
    const isHost = battle.host.toString() === req.user._id.toString();
    const isAdmin = req.user.role === "admin";
    if (!isHost && !isAdmin) throw new ApiError(403, "Only host or admin can cancel");

    battle.status = BATTLE_STATUS.CANCELLED;
    battle.events.push({ eventType: "cancel", message: `Battle cancelled by ${req.user.username}`, user: req.user._id });
    await battle.save();

    const populated = await populateBattle(Battle.findById(battle._id));
    res.status(200).json(new ApiResponse(200, { battle: populated }, "Battle cancelled"));
  } catch (err) {
    next(err);
  }
};

// Get my battles
export const getMyBattles = async (req, res, next) => {
  try {
    const battles = await populateBattle(Battle.find({ "participants.user": req.user._id }).sort({ createdAt: -1 }).limit(50));
    res.status(200).json(new ApiResponse(200, { battles }, "My battles fetched"));
  } catch (err) {
    next(err);
  }
};

// Leaderboard for battles (most wins)
export const getBattleLeaderboard = async (req, res, next) => {
  try {
    const leaderboard = await Battle.aggregate([
      { $match: { status: BATTLE_STATUS.COMPLETED, winner: { $ne: null } } },
      { $group: { _id: "$winner", wins: { $sum: 1 } } },
      { $sort: { wins: -1 } },
      { $limit: 20 },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          wins: 1,
          username: "$user.username",
          displayName: "$user.displayName",
          avatar: "$user.avatar",
          role: "$user.role",
        },
      },
    ]);
    res.status(200).json(new ApiResponse(200, { leaderboard }, "Battle leaderboard fetched"));
  } catch (err) {
    next(err);
  }
};
