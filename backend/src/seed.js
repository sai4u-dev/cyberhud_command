import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import User from "./models/User.js";

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
