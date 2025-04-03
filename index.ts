import { Bot, GrammyError, HttpError } from "grammy";
import type { BotCommand } from "grammy/types";

const botToken = Bun.env.BOT_TOKEN;

if (!botToken) {
  console.error("Error: Telegram Bot Token not found.");
  console.error(
    "Please set the BOT_TOKEN environment variable or add it to a .env file."
  );
  process.exit(1);
}

// Define the Supa Pump links
const supaLinks = {
  buy: "https://swap.supapump.fun/",
  scanBase: "https://scan.supapump.fun/token/",
  save: "https://save.supapump.fun/",
  seek: "https://seek.supapump.fun/",
  secret: "https://secret.supapump.fun/",
  stake: "https://stake.smithii.io/supa",
  register: "https://www.sns.id/sub-registrar/supapump",
};

const bot = new Bot(botToken);
console.log("Bot instance created.");

// --- Define Commands for the Menu ---
const commands: BotCommand[] = [
  { command: "start", description: "Show welcome" },
  { command: "help", description: "help message" },
  { command: "buy", description: "Get link to buy $SUPA" },
  { command: "scan", description: "Scan token (needs address)" },
  { command: "save", description: "Get Supa Save link" },
  { command: "seek", description: "Get Supa Seek link" },
  { command: "secret", description: "Get Supa Secret link" },
  { command: "stake", description: "Get link to stake $SUPA" },
  { command: "register", description: "Get link to register .supa subdomain" },
];

// --- Set the Commands Menu (grammY way) ---
bot.api
  .setMyCommands(commands)
  .then(() => {
    console.log("Bot commands menu updated successfully.");
  })
  .catch((err) => {
    const e = err as GrammyError | HttpError;
    console.error(
      "Failed to set bot commands:",
      e.message,
      e instanceof GrammyError ? e.description : ""
    );
  });

// --- Help Message Text ---
const helpText = `
🕵️ **Supa Sleuth Link Helper** 🕵️‍♀️

Use these commands to get quick links to Supa Pump tools:

**Trading & Earning:**
/buy - 🛒 Get $SUPA on SupaSwap
/stake - 💰 Stake your $SUPA tokens
/save - 🏦 Earn yield with Supa Save

**Exploring & Info:**
/scan <token address> - 🔍 Look up token details on SupaScan
/seek - 🧭 Explore transactions with Supa Seek

**Utilities:**
/secret - 🤫 Create encrypted memos with Supa Secret
/register - 🌐 Register your '.supa' subdomain

**Help:**
/help - ❓ Show this list of commands again

Happy sleuthing! ✨
`;

// --- Command Handlers (grammY way using bot.command) ---

// /start and /help commands
bot.command(["start", "help"], async (ctx) => {
  console.log(
    `Received /${ctx.message?.text?.substring(1)} from chat ID: ${ctx.chat.id}`
  );
  await ctx.reply(helpText, { parse_mode: "Markdown" });
});

// /buy command
bot.command("buy", async (ctx) => {
  console.log(`Received /buy from chat ID: ${ctx.chat.id}`);
  await ctx.reply(`🛒 **Buy $SUPA:**\n${supaLinks.buy}`, {
    parse_mode: "Markdown",
  });
});

// /scan command
bot.command("scan", async (ctx) => {
  const tokenAddress = ctx.match?.trim(); // Get text after /scan and remove whitespace
  console.log(
    `Received /scan (match: "${tokenAddress}") from chat ID: ${ctx.chat.id}`
  );

  if (tokenAddress) {
    // Basic Solana address validation regex
    if (/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(tokenAddress)) {
      const scanUrl = `${supaLinks.scanBase}${tokenAddress}`;
      await ctx.reply(`🔍 **SupaScan for ${tokenAddress}:**\n${scanUrl}`, {
        parse_mode: "Markdown",
      });
    } else {
      await ctx.reply(
        `⚠️ That doesn't look like a valid Solana address: \`${tokenAddress}\`\nPlease check and try again.\n\nUsage: \`/scan <token_address>\``,
        { parse_mode: "Markdown" }
      );
    }
  } else {
    // No token address provided
    await ctx.reply(
      `Please provide a token address after the command.\n\nUsage: \`/scan <token_address>\``,
      { parse_mode: "Markdown" }
    );
  }
});

// /save command
bot.command("save", async (ctx) => {
  console.log(`Received /save from chat ID: ${ctx.chat.id}`);
  await ctx.reply(`💰 **Supa Save (Earn Yield):**\n${supaLinks.save}`, {
    parse_mode: "Markdown",
  });
});

// /seek command
bot.command("seek", async (ctx) => {
  console.log(`Received /seek from chat ID: ${ctx.chat.id}`);
  await ctx.reply(`🔎 **Supa Seek (Block Explorer):**\n${supaLinks.seek}`, {
    parse_mode: "Markdown",
  });
});

// /secret command
bot.command("secret", async (ctx) => {
  console.log(`Received /secret from chat ID: ${ctx.chat.id}`);
  await ctx.reply(
    `🤫 **Supa Secret (Encrypted Memos):**\n${supaLinks.secret}`,
    { parse_mode: "Markdown" }
  );
});

// /stake command
bot.command("stake", async (ctx) => {
  console.log(`Received /stake from chat ID: ${ctx.chat.id}`);
  await ctx.reply(`🔒 **Stake $SUPA:**\n${supaLinks.stake}`, {
    parse_mode: "Markdown",
  });
});

// /register command
bot.command("register", async (ctx) => {
  console.log(`Received /register from chat ID: ${ctx.chat.id}`);
  await ctx.reply(`🏷️ **Register .supa Subdomain:**\n${supaLinks.register}`, {
    parse_mode: "Markdown",
  });
});

// Handle non-command messages ---
bot.on("message:text", async (ctx) => {
  console.log(
    `Received non-command text from chat ID ${ctx.chat.id}: ${ctx.message.text}`
  );
  await ctx.reply("I only understand commands listed in the menu. Try /help");
});

// --- Error Handling ---
bot.catch((err) => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:`);

  // grammY error handling provides more context
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }

  // notify the user that something went wrong
  ctx
    .reply("Sorry, something went wrong processing your request.")
    .catch((e) => console.error("Failed to send error message to user:", e));
});

// --- Start the Bot ---
console.log("Starting bot...");
bot
  .start() // Start polling
  .then(() => {
    console.log("🤖 Supa Link Helper Bot started successfully!");
  })
  .catch((err) => {
    console.error("Failed to start bot:", err);
    process.exit(1);
  });

// --- Graceful Shutdown ---
process.once("SIGINT", () => {
  console.log("Stopping bot (SIGINT)...");
  bot.stop().then(() => console.log("Bot stopped."));
});
process.once("SIGTERM", () => {
  console.log("Stopping bot (SIGTERM)...");
  bot.stop().then(() => console.log("Bot stopped."));
});
