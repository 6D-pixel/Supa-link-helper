# Supa Link Bot 🤖

A Telegram bot that provides quick access to various Supa Pump related tools and services.

## Features

- Quick access to Supa Pump trading and utility links
- Token scanning functionality
- Easy navigation to various Supa services
- User-friendly command interface

## Available Commands

- `/start` - Show welcome message
- `/help` - Display help message
- `/buy` - Get link to buy $SUPA
- `/scan <token_address>` - Scan token details (requires address)
- `/save` - Get Supa Save link
- `/seek` - Get Supa Seek link
- `/secret` - Get Supa Secret link
- `/stake` - Get link to stake $SUPA
- `/register` - Get link to register .supa subdomain

## Services Included

- SupaSwap - Trading platform
- SupaScan - Token scanner
- Supa Save - Yield earning platform
- Supa Seek - Block explorer
- Supa Secret - Encrypted memos
- Smithii - Staking platform
- SNS ID - Subdomain registration

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Telegram bot token:
   ```
   BOT_TOKEN=your_bot_token_here
   ```
4. Start the bot:
   ```bash
   npm start
   ```

## Environment Variables

- `BOT_TOKEN` - Your Telegram bot token (required)

## Error Handling

The bot includes comprehensive error handling for:

- Invalid token addresses
- Missing bot token
- API errors
- Network issues

## Graceful Shutdown

The bot implements graceful shutdown handling for SIGINT and SIGTERM signals.