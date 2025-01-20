import { TelegramClient } from "telegram";
import { StringSession } from "telegram/sessions/index.js"; // Use the specific file
import readline from "readline";

const apiId = 25541039;
const apiHash = "e634f20ecc38ed0c180e5b21245694c9";
const stringSession = new StringSession(
    "1AgAOMTQ5LjE1NC4xNjcuNTABuwrnlYSi5+looc6gy7q0WZ0KPu1eyIZtcRm3ByH/tuTmVBikb84+ongjUmEja4SHlEMTTbZiXG965mXUQT5nOYu09a+8uss6uZWNPNfP2iGWgDjHc6A9wjnoQLJnZCqsIZpjyj+kjgcpEwvEAFz3WCvhXVmtsE5pvGRIJASdzGVT02OTyI1VVftEJ70Wc8cU8oLVPk3E7u3egdnrOjRonHZj2KdIHBzbuyXnDjkVCMHXGXBfzCuD3yngdrYaKEcJIw8KY/7tgZqJmxKXJ71QacOMpLJgACnn0htR3uVR/Dh/ydJ3Cgfap1O3VXqDmdeSQgNKeJqXQaJVp7pMrPRxXuc="
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

interface MessageData {
    senderId: string;
    message: string;
}

export const fetchMessages = async (): Promise<MessageData[]> => {
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

    // Example: Fetching message history from a specific chat (by username or chat ID)
    const chat = await client.getEntity("@konstantine25b"); // Use username or chat ID

    // Fetch the last 100 messages from the chat
    const messages = await client.getMessages(chat, { limit: 100 });

    // Map messages to include only senderId and message
    const messageData: MessageData[] = messages.map((message) => ({
        senderId: message.senderId.toString(),
        message: message.message,
    }));

    return messageData; // Return the array of message data
};
