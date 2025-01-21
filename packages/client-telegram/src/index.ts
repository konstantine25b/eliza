import { elizaLogger } from "@elizaos/core";
import { Client, IAgentRuntime } from "@elizaos/core";
import { initializeBot } from "./initialisingBotWithTelephon.ts"; // Import the initializeBot method
import { validateTelegramConfig } from "./environment.ts";

export const TelegramClientInterface: Client = {
    start: async (runtime: IAgentRuntime) => {
        console.log("check 4");
        await validateTelegramConfig(runtime);

        // Use the imported initializeBot method to initialize the client
        console.log("check 3");
        const tg = await initializeBot(); // This now uses the user-based authentication
        console.log("check 2");
        elizaLogger.success(
            `✅ Telegram client successfully started for character ${runtime.character.name}`
        );
        return tg;
    },
    stop: async (_runtime: IAgentRuntime) => {
        elizaLogger.warn("Telegram client does not support stopping yet");
    },
};

export default TelegramClientInterface;
