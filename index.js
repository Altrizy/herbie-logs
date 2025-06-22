require("dotenv").config();
const { Client } = require("guilded.js");

const bot = new Client({ token: process.env.TOKEN });

// Only you can issue commands
const OWNER_ID = "dBnprLLd";

// Map of server → log channel
const SERVER_LOG_CHANNELS = {
  "Mlv4M2Gj": "168c26e4-1836-405c-9b66-e6dada472441",
  "4R5Q7QWR": "0dc18448-0101-4e51-a0c9-eca7ab2b2d49",
};

bot.on("ready", () => {
  console.log(`HERBIE is online and standing by.`);
});

bot.on("messageCreated", async (msg) => {
  if (!msg.content.startsWith("!herbie log")) return;
  if (msg.createdById !== OWNER_ID) return;

  // Get log message
  let logContent = msg.content.slice("!herbie log".length).trim();

  if (
    (logContent.startsWith('"') && logContent.endsWith('"')) ||
    (logContent.startsWith('“') && logContent.endsWith('”'))
  ) {
    logContent = logContent.slice(1, -1);
  }

  if (!logContent) {
    await msg.reply("⚠ HERBIE: No log message provided.");
    return;
  }

  const targetChannelId = SERVER_LOG_CHANNELS[msg.serverId];

  if (!targetChannelId) {
    await msg.reply("⚠ HERBIE: This server has no configured log channel.");
    return;
  }

  try {
    const channel = await bot.channels.fetch(targetChannelId);
    await channel.send(logContent);
    console.log(`✅ Sent to ${targetChannelId}`);
    await msg.reply("✅ HERBIE log transmitted.");
  } catch (err) {
    console.error(`❌ Error sending log:`, err);
    await msg.reply("❌ HERBIE failed to deliver the log.");
  }
});

bot.login();
