import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import readline from "readline";

// Your API credentials and string session
const apiId = 25541039;
const apiHash = "your_api_hash_here";
const stringSession = new StringSession("your_string_session_here");

// Configuration for readline
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to fetch messages from a specific chat
export const fetchMessages = async (chatId: string, limit: number = 10) => {
    // Create and start the client
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () =>
            new Promise((resolve) =>
                rl.question("Please enter your phone number: ", resolve)
            ),
        password: async () =>
            new Promise((resolve) =>
                rl.question("Please enter your password: ", resolve)
            ),
        phoneCode: async () =>
            new Promise((resolve) =>
                rl.question("Please enter the code you received: ", resolve)
            ),
        onError: (err) => console.log(err),
    });

    console.log(`Connected to Telegram, fetching messages from chat: ${chatId}`);

    // Fetch messages from the chat
    try {
        const messages = await client.getMessages(chatId, {
            limit: limit,
        });

        console.log(`Fetched ${messages.length} messages from chat ${chatId}`);
        return messages;
    } catch (error) {
        console.error("Error fetching messages:", error);
        return [];
    } finally {
        client.disconnect(); // Always disconnect when done
    }
};
