import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/User.js";
import Theme, { DEFAULT_THEMES } from "./models/Theme.js";
import Battle from "./models/Battle.js";

const users = [
  {
    username: "admin_command",
    email: "admin@cyberhud.io",
    password: "Admin@1234",
    displayName: "COMMAND_OVERLORD",
    role: "admin",
    stats: { level: 99, xp: 99999, battlesWon: 500, rank: "OVERLORD", credits: 999999 },
  },
  {
    username: "moderator_01",
    email: "mod@cyberhud.io",
    password: "Mod@1234",
    displayName: "GRID_MODERATOR",
    role: "moderator",
  },
  {
    username: "organizer_alpha",
    email: "organizer@cyberhud.io",
    password: "Organizer@1234",
    displayName: "TOURNAMENT_CORE",
    role: "organizer",
  },
  {
    username: "void_walker",
    email: "player@cyberhud.io",
    password: "Player@1234",
    displayName: "VOID_WALKER_01",
    role: "user",
  },
];

const seed = async () => {
  try {
    if (!process.env.MONGO_URI) throw new Error("MONGO_URI not set");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected for seeding...");

    for (const u of users) {
      const exists = await User.findOne({ email: u.email });
      if (exists) {
        console.log(`Skip ${u.email} - already exists`);
        continue;
      }
      await User.create(u);
      console.log(`Created ${u.role}: ${u.email} / ${u.password}`);
    }

    console.log("\nSeeding themes (10 themes)...");
    for (const t of DEFAULT_THEMES) {
      const exists = await Theme.findOne({ key: t.key });
      if (exists) {
        // update to keep colors in sync
        await Theme.updateOne({ key: t.key }, { $set: t });
        console.log(`Updated theme ${t.key}`);
      } else {
        await Theme.create(t);
        console.log(`Created theme ${t.key} - ${t.name}`);
      }
    }
    const themeCount = await Theme.countDocuments();
    console.log(`Total themes: ${themeCount}`);

    // Create demo battles if none
    const battleCount = await Battle.countDocuments();
    if (battleCount === 0) {
      const admin = await User.findOne({ email: "admin@cyberhud.io" });
      const player = await User.findOne({ email: "player@cyberhud.io" });
      if (admin && player) {
        await Battle.create({
          title: "NEURAL_DUEL_ALPHA",
          description: "1v1 ranked duel — first to breach the core wins",
          type: "one_to_one",
          host: admin._id,
          maxParticipants: 2,
          mode: "ranked",
          mapZone: { name: "NEURAL_GRID_ALPHA" },
          participants: [
            { user: admin._id, username: admin.username, displayName: admin.displayName, role: "host", isReady: true },
          ],
        });
        await Battle.create({
          title: "VOID_ROYALE_SQUAD",
          description: "1vN squad assault — 8 operators, last team standing",
          type: "one_to_many",
          host: player._id,
          maxParticipants: 8,
          mode: "casual",
          mapZone: { name: "VOID_SECTOR_7" },
          participants: [
            { user: player._id, username: player.username, displayName: player.displayName, role: "host", isReady: true },
          ],
        });
        console.log("Created demo battles (1v1 & 1vN)");
      }
    }

    console.log("\nSeeding complete. Credentials:");
    console.table(users.map(u => ({ email: u.email, password: u.password, role: u.role })));

    await mongoose.disconnect();
    process.exit(0);
  } catch (e) {
    console.error("Seed error:", e);
    process.exit(1);
  }
};

seed();
