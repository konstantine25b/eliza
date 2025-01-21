import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js";
import readline from "readline";

// Configuration values
const apiId = 25541039;
const apiHash = "your_api_hash_here";
const stringSession = new StringSession("your_string_session_here");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Initialize the bot
export const initializeBot = async () => {
    const client = new TelegramClient(stringSession, apiId, apiHash, {
        connectionRetries: 5,
    });

    await client.start({
        phoneNumber: async () =>
            new Promise((resolve) =>
                rl.question("Please enter your number: ", resolve)
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

    console.log("You should now be connected.");
    return client;
};
