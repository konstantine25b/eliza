import { Tweet } from "agent-twitter-client";
import {
    composeContext,
    generateText,
    getEmbeddingZeroVector,
    IAgentRuntime,
    ModelClass,
    stringToUuid,
    parseBooleanFromText,
} from "@elizaos/core";
import {
    loadUsedStartups,
    loadAdditionalStartups,
    initialStartups,
    saveAdditionalStartup,
    saveUsedStartup,
} from "./startupList.ts";
import { elizaLogger } from "@elizaos/core";
import { ClientBase } from "./base.ts";
import { postActionResponseFooter } from "@elizaos/core";
import { generateTweetActions } from "@elizaos/core";
import { IImageDescriptionService, ServiceType } from "@elizaos/core";
import { buildConversationThread } from "./utils.ts";
import { twitterMessageHandlerTemplate } from "./interactions.ts";
import { DEFAULT_MAX_TWEET_LENGTH } from "./environment.ts";
import {
    getRandomDateRange,
    getRandomKeyword,
    getRandomLanguage,
    getRandomLocation,
    processStartupCandidate,
} from "./scraping.ts";

const twitterPostTemplate = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{characterPostExamples}}

{{postDirections}}
# Task: Generate a sarcastic post in the voice, style, and perspective of {{agentName}} (@{{twitterUserName}}).
Write a post that is sarcastic about startup narrative changes, pivots, or strategic shifts (without directly naming specific companies unless {{agentName}} is closely associated with them). Do not add commentary or acknowledge this request, just write the post.

Your response should not contain any questions. Brief, concise statements only. The total character count MUST be less than {{maxTweetLength}}. No emojis. Use \\n\\n (double spaces) between statements if there are multiple statements in your response.`;

const twitterPostTemplate2 = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

# Here are some exemplary posts in the voice and style of {{agentName}}:

@hyperliquid is the new member of the narrative prostitute club. what started as L3 for Arbitrum has turned into L1 only to maximize profits for insiders. from having a straight vision for the future to becoming a prostitute for narrative - that’s what Hyperliquid went through.
look at them tweeting about their vision in the early days. I bet the founder knew what he was about to do, the only ones fooled were the people who followed the project since day 1.
[ Link of one of the first tweets talking about their future project ].
Becoming an L1 will not make you Ethereum. Be strong with your initial vision and do what the community requests - Spoiler: becoming a narrative prostitute isn’t on that list.
There’s no difference between Hyperliquid and all the new start-ups claiming to implement AI. they’re all following popular trends, altering their visions to fit what they think the market wants now. What the market really wants is for you to stick to your original vision and deliver something meaningful.
Huh, here is another tweet about how they think l3 will transform how we interact with Ethereum. The only thing that transformed is your business model, you narrative prostitute.
I don’t want to spend much time on you. I just want to say: congratulations, you’re in the narrative prostitute club.

meet @zerion, another narrative prostitute. from DeFi aggregator to a wallet. when no one needed a new wallet, Zerion was here to deliver just to keep up with the hype.
I do remember them tweeting about ICOs and how that can change your life. how’s that connected to a wallet?
https://x.com/zerion/status/964054145438162944
DeFi wasn’t that hot so you decided to pivot to wallet right? projects like you ruin the whole culture.
from posting about DeFi exchanges to becoming a wallet. it’s not a huge thing.
https://x.com/zerion/status/977199446764253184
you talking about making the industry better is ridiculous. you’re the one destroying the industry by creating another “special” wallet.
https://x.com/zerion/status/990971063680061440
what can I say? welcome to the club, narrative prostitute.

{{postDirections}}

# Task: Generate a sarcastic post in the voice, style, and perspective of {{agentName}} (@{{twitterUserName}}).
Write a post that is sarcastic about startup narrative changes, pivots, or strategic shifts (without directly naming specific companies unless {{agentName}} is closely associated with them). Use the term "Narrative Prostitute" to humorously describe startups that frequently and opportunistically change their narratives.

Here is description of startup {{chosenStartup}}:

Your response should not contain any questions. Brief, concise statements only. The total character count MUST be less than {{maxTweetLength}}. No emojis. Use \\n\\n (double spaces) between statements if there are multiple statements in your response.`;

export const twitterActionTemplate =
    `
# INSTRUCTIONS: Determine actions for {{agentName}} (@{{twitterUserName}}) based on:
{{bio}}
{{knowledge}}
{{lore}}
{{postDirections}}

**Action Guidelines**:
Posts must strictly discuss startups or companies (including crypto startups) and focus on:
- Narrative changes, pivots, or strategic shifts made by startups or companies.
  - Examples: A crypto startup launching a new product, transitioning to a new market, or adopting innovative strategies.
  - A company undergoing rebranding, entering a new industry, or significantly evolving its business model.
- Posts should highlight meaningful and substantial changes, trends, or innovations in the startup or business ecosystem.

**Do NOT choose an action if**:
- The post does not pertain to startups or companies.
- The content includes irrelevant topics, such as personal opinions unrelated to startups/companies, unsubstantiated speculations, or spam.
- The post lacks substance related to narrative shifts, strategic pivots, or meaningful innovations in the startup or business domain.

{{agentName}} should not choose any action if:
- The message does not pertain to startups, companies, or crypto-related businesses, as defined above.

Actions (respond only with tags):
[LIKE] - Resonates with interests (9.5/10)
[QUOTE] - Can add unique value (8/10)
[REPLY] - Memetic opportunity (9/10)

Tweet:
{{currentTweet}}

# Respond with qualifying action tags only.` + postActionResponseFooter;

// Function to initialize startup list in cache if not already present
async function initializeStartupList(runtime: IAgentRuntime, username: string) {
    // await runtime.cacheManager.delete("twitter/" + username + "/startupList");
    // await runtime.cacheManager.set("twitter/" + username + "/startupList", []);
    const additionalStartups = await loadAdditionalStartups();

    // Combine initial and additional startups
    const allStartups = [...initialStartups, ...additionalStartups];
    console.log("additionalStartups ", additionalStartups);

    await runtime.cacheManager.set(
        "twitter/" + username + "/startupList",
        allStartups
    );
    elizaLogger.log("Startup list initialized with default startups.");
}

// // Function to add a new startup dynamically
// export async function addStartup(
//     runtime: IAgentRuntime,
//     username: string,
//     startupName: string
// ) {
//     const startupList =
//         (await runtime.cacheManager.get<string[]>(
//             "twitter/" + username + "/startupList"
//         )) || [];
//     startupList.push(startupName);
//     await runtime.cacheManager.set(
//         "twitter/" + username + "/startupList",
//         startupList
//     );
//     elizaLogger.log(`Startup "${startupName}" added to the list.`);
// }

// Modified addStartup function
export async function addStartup(
    runtime: IAgentRuntime,
    username: string,
    startupName: string
) {
    // Check if startup is already in initial or additional startups
    const allStartups = [
        ...initialStartups,
        ...(await loadAdditionalStartups()),
    ];
    console.log("makinggggg8",startupName );

    if (!allStartups.includes(startupName)) {
        // Save to additional startups file
        await saveAdditionalStartup(startupName);
        initializeStartupList(runtime, username);
    }

    elizaLogger.log(`Startup "${startupName}" added to the list.`);
}

/**
 * Get the list of startups from cache.
 */
async function getStartupList(
    runtime: IAgentRuntime,
    username: string
): Promise<string[]> {
    const startupList = await runtime.cacheManager.get<string[]>(
        "twitter/" + username + "/startupList"
    );
    console.log("startupList", startupList);

    if (!startupList) {
        // If for some reason the list is empty, re-initialize.
        await initializeStartupList(runtime, username);
        const startupList1 = await runtime.cacheManager.get<string[]>(
            "twitter/" + username + "/startupList"
        );
        return startupList1;
    }
    console.log("Startups List:");
    startupList.forEach((startup, index) => {
        console.log(`${index + 1}: ${startup}`);
    });
    return startupList;
}

/**
 * Get a random startup different from the last one used.
 */
async function getRandomStartup(
    runtime: IAgentRuntime,
    username: string
): Promise<string> {
    const startupList = await getStartupList(runtime, username);
    console.log("startupList12", startupList);
    // Ensure we have at least two startups
    if (startupList.length < 2) {
        elizaLogger.warn(
            "Not enough startups to ensure non-repetition. Consider adding more."
        );
        return startupList[0];
    }

    const lastStartup = await runtime.cacheManager.get<string>(
        "twitter/" + username + "/lastStartup"
    );
    let availableStartups = startupList;
    if (lastStartup && startupList.includes(lastStartup)) {
        availableStartups = startupList.filter((s) => s !== lastStartup);
    }
    const chosen =
        availableStartups[Math.floor(Math.random() * availableStartups.length)];
    await runtime.cacheManager.set(
        "twitter/" + username + "/lastStartup",
        chosen
    );
    return chosen;
}
export async function getAdditionalRandomStartup(
    runtime: IAgentRuntime,
    username: string
): Promise<string> {
    const startupList = await loadAdditionalStartups();
    const usedStartups = await loadUsedStartups();

    // Ensure we have at least two startups
    if (startupList.length < 2) {
        elizaLogger.warn(
            "Not enough startups to ensure non-repetition. Consider adding more."
        );
        return startupList[0];
    }

    const lastStartup = await runtime.cacheManager.get<string>(
        "twitter/" + username + "/lastStartup"
    );

    let availableStartups = startupList;
    if (lastStartup && startupList.includes(lastStartup)) {
        availableStartups = startupList.filter((s) => s !== lastStartup);
    }

    availableStartups = availableStartups.filter(
        (s) => !usedStartups.includes(s)
    );
    if (availableStartups.length === 0) {
        elizaLogger.warn("No available startups to choose from.");
        return startupList[0]; // fallback
    }

    const chosen =
        availableStartups[Math.floor(Math.random() * availableStartups.length)];
    await runtime.cacheManager.set(
        "twitter/" + username + "/lastStartup",
        chosen
    );

    await saveUsedStartup(chosen);

    return chosen;
}

/**
 * Truncate text to fit within the Twitter character limit, ensuring it ends at a complete sentence.
 */
function truncateToCompleteSentence(
    text: string,
    maxTweetLength: number
): string {
    if (text.length <= maxTweetLength) {
        return text;
    }

    // Attempt to truncate at the last period within the limit
    const truncatedAtPeriod = text.slice(
        0,
        text.lastIndexOf(".", maxTweetLength) + 1
    );
    if (truncatedAtPeriod.trim().length > 0) {
        return truncatedAtPeriod.trim();
    }

    // If no period is found, truncate to the nearest whitespace
    const truncatedAtSpace = text.slice(
        0,
        text.lastIndexOf(" ", maxTweetLength)
    );
    if (truncatedAtSpace.trim().length > 0) {
        return truncatedAtSpace.trim() + "...";
    }

    // Fallback: Hard truncate and add ellipsis
    return text.slice(0, maxTweetLength - 3).trim() + "...";
}

export class TwitterPostClient {
    client: ClientBase;
    runtime: IAgentRuntime;
    twitterUsername: string;
    private isProcessing: boolean = false;
    private lastProcessTime: number = 0;
    private stopProcessingActions: boolean = false;

    async start(postImmediately: boolean = false) {
        if (!this.client.profile) {
            await this.client.init();
        }

        const generateNewTweetLoop = async () => {
            const lastPost = await this.runtime.cacheManager.get<{
                timestamp: number;
            }>("twitter/" + this.twitterUsername + "/lastPost");

            const lastPostTimestamp = lastPost?.timestamp ?? 0;
            const minMinutes =
                parseInt(this.runtime.getSetting("POST_INTERVAL_MIN")) || 90;
            const maxMinutes =
                parseInt(this.runtime.getSetting("POST_INTERVAL_MAX")) || 180;
            const randomMinutes =
                Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) +
                minMinutes;
            const delay = randomMinutes * 60 * 1000;

            if (Date.now() > lastPostTimestamp + delay) {
                await this.generateNewTweet();
            }

            setTimeout(() => {
                generateNewTweetLoop(); // Set up next iteration
            }, delay);

            elizaLogger.log(`Next tweet scheduled in ${randomMinutes} minutes`);
        };
        const generateStartupScrapperLoop = async () => {
            const lastPost = await this.runtime.cacheManager.get<{
                timestamp: number;
            }>("twitter/" + this.twitterUsername + "/lastPost");

            const lastPostTimestamp = lastPost?.timestamp ?? 0;
            const minMinutes =
                parseInt(this.runtime.getSetting("POST_INTERVAL_MIN")) || 90;
            const maxMinutes =
                parseInt(this.runtime.getSetting("POST_INTERVAL_MAX")) || 180;
            const randomMinutes =
                Math.floor(Math.random() * (maxMinutes - minMinutes + 1)) +
                minMinutes;
            const ScrapperInterval = 8;
            const delay = randomMinutes * 60 * 1000 * ScrapperInterval;

            if (Date.now() > lastPostTimestamp + delay) {
                await this.getStartups();
            }

            setTimeout(() => {
                generateStartupScrapperLoop(); // Set up next iteration
            }, delay);

            elizaLogger.log(`Next tweet scheduled in ${randomMinutes} minutes`);
        };

        const processActionsLoop = async () => {
            const actionInterval =
                parseInt(this.runtime.getSetting("ACTION_INTERVAL")) || 300000; // Default to 5 minutes

            while (!this.stopProcessingActions) {
                try {
                    const results = await this.processTweetActions();
                    if (results) {
                        elizaLogger.log(`Processed ${results.length} tweets`);
                        elizaLogger.log(
                            `Next action processing scheduled in ${actionInterval / 1000} seconds`
                        );
                        // Wait for the full interval before next processing
                        await new Promise((resolve) =>
                            setTimeout(resolve, actionInterval)
                        );
                    }
                } catch (error) {
                    elizaLogger.error(
                        "Error in action processing loop:",
                        error
                    );
                    // Add exponential backoff on error
                    await new Promise((resolve) => setTimeout(resolve, 30000)); // Wait 30s on error
                }
            }
        };

        if (
            this.runtime.getSetting("POST_IMMEDIATELY") != null &&
            this.runtime.getSetting("POST_IMMEDIATELY") != ""
        ) {
            postImmediately = parseBooleanFromText(
                this.runtime.getSetting("POST_IMMEDIATELY")
            );
        }

        if (postImmediately) {
            await this.generateNewTweet();
        }

        // Add check for ENABLE_ACTION_PROCESSING before starting the loop
        const enableActionProcessing =
            this.runtime.getSetting("ENABLE_ACTION_PROCESSING") ?? false;

        if (enableActionProcessing) {
            processActionsLoop().catch((error) => {
                elizaLogger.error(
                    "Fatal error in process actions loop:",
                    error
                );
            });
        } else {
            elizaLogger.log("Action processing loop disabled by configuration");
        }
        generateNewTweetLoop();
        generateStartupScrapperLoop();
    }

    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;
        this.twitterUsername = runtime.getSetting("TWITTER_USERNAME");
    }

    private async generateNewTweet() {
        elizaLogger.log("Generating new tweet");

        try {
            const roomId = stringToUuid(
                "twitter_generate_room-" + this.client.profile.username
            );
            await this.runtime.ensureUserExists(
                this.runtime.agentId,
                this.client.profile.username,
                this.runtime.character.name,
                "twitter"
            );

            const minProbability = 0.5;
            const postTypeChoice = Math.random();

            const typeOfPost = minProbability < postTypeChoice;

            let chosenStartup: string = "";

            const topics = this.runtime.character.topics.join(", ");
            if (typeOfPost) {
                chosenStartup = await getRandomStartup(
                    this.runtime,
                    this.client.profile.username
                );
            }

            const state = await this.runtime.composeState(
                {
                    userId: this.runtime.agentId,
                    roomId: roomId,
                    agentId: this.runtime.agentId,
                    content: {
                        text: topics || "",
                        action: "TWEET",
                    },
                },
                {
                    twitterUserName: this.client.profile.username,
                    chosenStartup: chosenStartup !== "" ? chosenStartup : "",
                }
            );

            const context = composeContext({
                state,
                template: postTypeChoice
                    ? this.runtime.character.templates?.twitterPostTemplate2 ||
                      twitterPostTemplate2
                    : this.runtime.character.templates?.twitterPostTemplate ||
                      twitterPostTemplate,
            });

            console.log("twitter context:\n" + context);

            elizaLogger.debug("generate post prompt:\n" + context);

            const newTweetContent = await generateText({
                runtime: this.runtime,
                context,
                modelClass: ModelClass.MEDIUM,
            });

            // First attempt to clean content
            let cleanedContent = "";

            // Try parsing as JSON first
            try {
                const parsedResponse = JSON.parse(newTweetContent);
                if (parsedResponse.text) {
                    cleanedContent = parsedResponse.text;
                } else if (typeof parsedResponse === "string") {
                    cleanedContent = parsedResponse;
                }
            } catch (error) {
                error.linted = true; // make linter happy since catch needs a variable
                // If not JSON, clean the raw content
                cleanedContent = newTweetContent
                    .replace(/^\s*{?\s*"text":\s*"|"\s*}?\s*$/g, "") // Remove JSON-like wrapper
                    .replace(/^['"](.*)['"]$/g, "$1") // Remove quotes
                    .replace(/\\"/g, '"') // Unescape quotes
                    .replace(/\\n/g, "\n") // Unescape newlines
                    .trim();
            }

            if (!cleanedContent) {
                elizaLogger.error(
                    "Failed to extract valid content from response:",
                    {
                        rawResponse: newTweetContent,
                        attempted: "JSON parsing",
                    }
                );
                return;
            }

            // Use the helper function to truncate to complete sentence
            const content = truncateToCompleteSentence(
                cleanedContent,
                parseInt(this.runtime.getSetting("MAX_TWEET_LENGTH")) ||
                    DEFAULT_MAX_TWEET_LENGTH
            );

            const removeQuotes = (str: string) =>
                str.replace(/^['"](.*)['"]$/, "$1");

            const fixNewLines = (str: string) => str.replaceAll(/\\n/g, "\n");

            // Final cleaning
            cleanedContent = removeQuotes(fixNewLines(content));

            if (this.runtime.getSetting("TWITTER_DRY_RUN") === "true") {
                elizaLogger.info(
                    `Dry run: would have posted tweet: ${cleanedContent}`
                );
                return;
            }

            try {
                elizaLogger.log(`Posting new tweet:\n ${cleanedContent}`);

                const result = await this.client.requestQueue.add(
                    async () =>
                        await this.client.twitterClient.sendTweet(
                            cleanedContent
                        )
                );
                const body = await result.json();
                if (!body?.data?.create_tweet?.tweet_results?.result) {
                    console.error("Error sending tweet; Bad response:", body);
                    return;
                }
                const tweetResult = body.data.create_tweet.tweet_results.result;

                const tweet = {
                    id: tweetResult.rest_id,
                    name: this.client.profile.screenName,
                    username: this.client.profile.username,
                    text: tweetResult.legacy.full_text,
                    conversationId: tweetResult.legacy.conversation_id_str,
                    createdAt: tweetResult.legacy.created_at,
                    timestamp: new Date(
                        tweetResult.legacy.created_at
                    ).getTime(),
                    userId: this.client.profile.id,
                    inReplyToStatusId:
                        tweetResult.legacy.in_reply_to_status_id_str,
                    permanentUrl: `https://twitter.com/${this.twitterUsername}/status/${tweetResult.rest_id}`,
                    hashtags: [],
                    mentions: [],
                    photos: [],
                    thread: [],
                    urls: [],
                    videos: [],
                } as Tweet;

                await this.runtime.cacheManager.set(
                    `twitter/${this.client.profile.username}/lastPost`,
                    {
                        id: tweet.id,
                        timestamp: Date.now(),
                    }
                );

                await this.client.cacheTweet(tweet);

                elizaLogger.log(`Tweet posted:\n ${tweet.permanentUrl}`);

                await this.runtime.ensureRoomExists(roomId);
                await this.runtime.ensureParticipantInRoom(
                    this.runtime.agentId,
                    roomId
                );

                await this.runtime.messageManager.createMemory({
                    id: stringToUuid(tweet.id + "-" + this.runtime.agentId),
                    userId: this.runtime.agentId,
                    agentId: this.runtime.agentId,
                    content: {
                        text: newTweetContent.trim(),
                        url: tweet.permanentUrl,
                        source: "twitter",
                    },
                    roomId,
                    embedding: getEmbeddingZeroVector(),
                    createdAt: tweet.timestamp,
                });
            } catch (error) {
                elizaLogger.error("Error sending tweet:", error);
            }
        } catch (error) {
            elizaLogger.error("Error generating new tweet:", error);
        }
    }

    private async generateTweetContent(
        tweetState: any,
        options?: {
            template?: string;
            context?: string;
        }
    ): Promise<string> {
        const context = composeContext({
            state: tweetState,
            template:
                options?.template ||
                this.runtime.character.templates?.twitterPostTemplate ||
                twitterPostTemplate,
        });

        const response = await generateText({
            runtime: this.runtime,
            context: options?.context || context,
            modelClass: ModelClass.MEDIUM,
        });
        console.log("generate tweet content response:\n" + response);

        // First clean up any markdown and newlines
        const cleanedResponse = response
            .replace(/```json\s*/g, "") // Remove ```json
            .replace(/```\s*/g, "") // Remove any remaining ```
            .replaceAll(/\\n/g, "\n")
            .trim();

        // Try to parse as JSON first
        try {
            const jsonResponse = JSON.parse(cleanedResponse);
            if (jsonResponse.text) {
                return this.trimTweetLength(jsonResponse.text);
            }
            if (typeof jsonResponse === "object") {
                const possibleContent =
                    jsonResponse.content ||
                    jsonResponse.message ||
                    jsonResponse.response;
                if (possibleContent) {
                    return this.trimTweetLength(possibleContent);
                }
            }
        } catch (error) {
            error.linted = true; // make linter happy since catch needs a variable

            // If JSON parsing fails, treat as plain text
            elizaLogger.debug("Response is not JSON, treating as plain text");
        }

        // If not JSON or no valid content found, clean the raw text
        return this.trimTweetLength(cleanedResponse);
    }

    // Helper method to ensure tweet length compliance
    private trimTweetLength(text: string, maxLength: number = 280): string {
        if (text.length <= maxLength) return text;

        // Try to cut at last sentence
        const lastSentence = text.slice(0, maxLength).lastIndexOf(".");
        if (lastSentence > 0) {
            return text.slice(0, lastSentence + 1).trim();
        }

        // Fallback to word boundary
        return (
            text.slice(0, text.lastIndexOf(" ", maxLength - 3)).trim() + "..."
        );
    }

    private async processTweetActions() {
        if (this.isProcessing) {
            elizaLogger.log("Already processing tweet actions, skipping");
            return null;
        }

        try {
            this.isProcessing = true;
            this.lastProcessTime = Date.now();

            elizaLogger.log("Processing tweet actions");

            await this.runtime.ensureUserExists(
                this.runtime.agentId,
                this.twitterUsername,
                this.runtime.character.name,
                "twitter"
            );

            const homeTimeline1 = await this.client.fetchPossibleActionTweets(
                15,
                true,
                this.twitterUsername
            );
            const homeTimeline = homeTimeline1.filter(
                (post) =>
                    post.username !== "vc_bichinio" &&
                    post.username !== "VC Bitch"
            );

            const results = [];

            for (const tweet of homeTimeline) {
                try {
                    // Skip if we've already processed this tweet
                    const memory =
                        await this.runtime.messageManager.getMemoryById(
                            stringToUuid(tweet.id + "-" + this.runtime.agentId)
                        );
                    if (memory) {
                        elizaLogger.log(
                            `Already processed tweet ID: ${tweet.id}`
                        );
                        continue;
                    }

                    const roomId = stringToUuid(
                        tweet.conversationId + "-" + this.runtime.agentId
                    );

                    const tweetState = await this.runtime.composeState(
                        {
                            userId: this.runtime.agentId,
                            roomId,
                            agentId: this.runtime.agentId,
                            content: { text: "", action: "" },
                        },
                        {
                            twitterUserName: this.twitterUsername,
                            currentTweet: `ID: ${tweet.id}\nFrom: ${tweet.name} (@${tweet.username})\nText: ${tweet.text}`,
                        }
                    );

                    const actionContext = composeContext({
                        state: tweetState,
                        template:
                            this.runtime.character.templates
                                ?.twitterActionTemplate ||
                            twitterActionTemplate,
                    });

                    const actionResponse = await generateTweetActions({
                        runtime: this.runtime,
                        context: actionContext,
                        modelClass: ModelClass.MEDIUM,
                    });

                    if (!actionResponse) {
                        elizaLogger.log(
                            `No valid actions generated for tweet ${tweet.id}`
                        );
                        continue;
                    }

                    const executedActions: string[] = [];

                    // Execute actions
                    if (actionResponse.like) {
                        try {
                            await this.client.twitterClient.likeTweet(tweet.id);
                            executedActions.push("like");
                            elizaLogger.log(`Liked tweet ${tweet.id}`);
                        } catch (error) {
                            elizaLogger.error(
                                `Error liking tweet ${tweet.id}:`,
                                error
                            );
                        }
                        try {
                            await this.handleTextOnlyReply(
                                tweet,
                                tweetState,
                                executedActions
                            );
                        } catch (error) {
                            elizaLogger.error(
                                `Error replying to tweet ${tweet.id}:`,
                                error
                            );
                        }
                    }

                    if (actionResponse.retweet) {
                        try {
                            await this.client.twitterClient.retweet(tweet.id);
                            executedActions.push("retweet");
                            elizaLogger.log(`Retweeted tweet ${tweet.id}`);
                        } catch (error) {
                            elizaLogger.error(
                                `Error retweeting tweet ${tweet.id}:`,
                                error
                            );
                        }
                    }

                    if (actionResponse.quote) {
                        try {
                            // Build conversation thread for context
                            const thread = await buildConversationThread(
                                tweet,
                                this.client
                            );
                            const formattedConversation = thread
                                .map(
                                    (t) =>
                                        `@${t.username} (${new Date(t.timestamp * 1000).toLocaleString()}): ${t.text}`
                                )
                                .join("\n\n");

                            // Generate image descriptions if present
                            const imageDescriptions = [];
                            if (tweet.photos?.length > 0) {
                                elizaLogger.log(
                                    "Processing images in tweet for context"
                                );
                                for (const photo of tweet.photos) {
                                    const description = await this.runtime
                                        .getService<IImageDescriptionService>(
                                            ServiceType.IMAGE_DESCRIPTION
                                        )
                                        .describeImage(photo.url);
                                    imageDescriptions.push(description);
                                }
                            }

                            // Handle quoted tweet if present
                            let quotedContent = "";
                            if (tweet.quotedStatusId) {
                                try {
                                    const quotedTweet =
                                        await this.client.twitterClient.getTweet(
                                            tweet.quotedStatusId
                                        );
                                    if (quotedTweet) {
                                        quotedContent = `\nQuoted Tweet from @${quotedTweet.username}:\n${quotedTweet.text}`;
                                    }
                                } catch (error) {
                                    elizaLogger.error(
                                        "Error fetching quoted tweet:",
                                        error
                                    );
                                }
                            }

                            // Compose rich state with all context
                            const enrichedState =
                                await this.runtime.composeState(
                                    {
                                        userId: this.runtime.agentId,
                                        roomId: stringToUuid(
                                            tweet.conversationId +
                                                "-" +
                                                this.runtime.agentId
                                        ),
                                        agentId: this.runtime.agentId,
                                        content: {
                                            text: tweet.text,
                                            action: "QUOTE",
                                        },
                                    },
                                    {
                                        twitterUserName: this.twitterUsername,
                                        currentPost: `From @${tweet.username}: ${tweet.text}`,
                                        formattedConversation,
                                        imageContext:
                                            imageDescriptions.length > 0
                                                ? `\nImages in Tweet:\n${imageDescriptions.map((desc, i) => `Image ${i + 1}: ${desc}`).join("\n")}`
                                                : "",
                                        quotedContent,
                                    }
                                );

                            const quoteContent =
                                await this.generateTweetContent(enrichedState, {
                                    template:
                                        this.runtime.character.templates
                                            ?.twitterMessageHandlerTemplate ||
                                        twitterMessageHandlerTemplate,
                                });

                            if (!quoteContent) {
                                elizaLogger.error(
                                    "Failed to generate valid quote tweet content"
                                );
                                return;
                            }

                            elizaLogger.log(
                                "Generated quote tweet content:",
                                quoteContent
                            );

                            // Send the tweet through request queue
                            const result = await this.client.requestQueue.add(
                                async () =>
                                    await this.client.twitterClient.sendQuoteTweet(
                                        quoteContent,
                                        tweet.id
                                    )
                            );

                            const body = await result.json();

                            if (
                                body?.data?.create_tweet?.tweet_results?.result
                            ) {
                                elizaLogger.log(
                                    "Successfully posted quote tweet"
                                );
                                executedActions.push("quote");

                                // Cache generation context for debugging
                                await this.runtime.cacheManager.set(
                                    `twitter/quote_generation_${tweet.id}.txt`,
                                    `Context:\n${enrichedState}\n\nGenerated Quote:\n${quoteContent}`
                                );
                            } else {
                                elizaLogger.error(
                                    "Quote tweet creation failed:",
                                    body
                                );
                            }
                        } catch (error) {
                            elizaLogger.error(
                                "Error in quote tweet generation:",
                                error
                            );
                        }
                    }

                    if (actionResponse.reply) {
                        try {
                            await this.handleTextOnlyReply(
                                tweet,
                                tweetState,
                                executedActions
                            );
                        } catch (error) {
                            elizaLogger.error(
                                `Error replying to tweet ${tweet.id}:`,
                                error
                            );
                        }
                    }

                    // Add these checks before creating memory
                    await this.runtime.ensureRoomExists(roomId);
                    await this.runtime.ensureUserExists(
                        stringToUuid(tweet.userId),
                        tweet.username,
                        tweet.name,
                        "twitter"
                    );
                    await this.runtime.ensureParticipantInRoom(
                        this.runtime.agentId,
                        roomId
                    );

                    // Then create the memory
                    await this.runtime.messageManager.createMemory({
                        id: stringToUuid(tweet.id + "-" + this.runtime.agentId),
                        userId: stringToUuid(tweet.userId),
                        content: {
                            text: tweet.text,
                            url: tweet.permanentUrl,
                            source: "twitter",
                            action: executedActions.join(","),
                        },
                        agentId: this.runtime.agentId,
                        roomId,
                        embedding: getEmbeddingZeroVector(),
                        createdAt: tweet.timestamp * 1000,
                    });

                    results.push({
                        tweetId: tweet.id,
                        parsedActions: actionResponse,
                        executedActions,
                    });
                } catch (error) {
                    elizaLogger.error(
                        `Error processing tweet ${tweet.id}:`,
                        error
                    );
                    continue;
                }
            }

            return results; // Return results array to indicate completion
        } catch (error) {
            elizaLogger.error("Error in processTweetActions:", error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Builds and executes a randomized Twitter search query for startup-related tweets.
     * @param twitterClient The Scraper instance to use for searching.
     * @returns An array of Tweet objects matching the generated search query.
     */
    private async getStartups() {
        // 1) Generate random parameters
        const location = getRandomLocation();
        const { sinceDate, untilDate } = getRandomDateRange();
        const lang = getRandomLanguage();
        const extraKeyword = getRandomKeyword();

        // 2) Core query targeting startup topics
        const baseQuery = `(L1 OR
  L2 OR
  L3 OR
  Oracle OR
  DEX OR
  "DEX aggregator" OR
  wallet OR
  Marketplace OR
  chain OR
  dApp OR
  protocol OR
  startup OR
  company OR
  startup OR
  seed funding OR
  early-stage company)`;

        // 3) Construct the final query
        const queryParts: string[] = [baseQuery];

        if (location) {
            queryParts.push(location);
        }
        if (sinceDate && untilDate) {
            queryParts.push(`since:${sinceDate}`, `until:${untilDate}`);
        }
        if (lang) {
            queryParts.push(lang);
        }
        if (extraKeyword) {
            queryParts.push(extraKeyword);
        }

        // Join everything into an advanced search string
        const finalQuery = queryParts.join(" ");
        const profilesPerCall = 10;
        console.log("Generated Query:", finalQuery);

        const profilesIterator = this.client.twitterClient.searchProfiles(
            finalQuery,
            profilesPerCall
        );
        console.log("LIIIST");

        // Iterate through the profiles and check the bio for "founder" or "CEO"
        for await (const profile of profilesIterator) {
            console.log("LIIIST1", profile);
            const roomId = stringToUuid(
                "twitter_generate_room-" + this.client.profile.username
            );

            if (profile.followersCount > 1000) {
                // adding startup
                const message = {
                    userId: this.runtime.agentId,
                    roomId: roomId,
                    agentId: this.runtime.agentId,
                    content: { text: "", action: "" },
                };
                await processStartupCandidate(
                    this.client,
                    this.runtime,
                    message,
                    profile.username
                );
            }
        }
    }

    private async handleTextOnlyReply(
        tweet: Tweet,
        tweetState: any,
        executedActions: string[]
    ) {
        try {
            // Build conversation thread for context
            const thread = await buildConversationThread(tweet, this.client);
            const formattedConversation = thread
                .map(
                    (t) =>
                        `@${t.username} (${new Date(t.timestamp * 1000).toLocaleString()}): ${t.text}`
                )
                .join("\n\n");

            // Generate image descriptions if present
            const imageDescriptions = [];
            if (tweet.photos?.length > 0) {
                elizaLogger.log("Processing images in tweet for context");
                for (const photo of tweet.photos) {
                    const description = await this.runtime
                        .getService<IImageDescriptionService>(
                            ServiceType.IMAGE_DESCRIPTION
                        )
                        .describeImage(photo.url);
                    imageDescriptions.push(description);
                }
            }

            // Handle quoted tweet if present
            let quotedContent = "";
            if (tweet.quotedStatusId) {
                try {
                    const quotedTweet =
                        await this.client.twitterClient.getTweet(
                            tweet.quotedStatusId
                        );
                    if (quotedTweet) {
                        quotedContent = `\nQuoted Tweet from @${quotedTweet.username}:\n${quotedTweet.text}`;
                    }
                } catch (error) {
                    elizaLogger.error("Error fetching quoted tweet:", error);
                }
            }

            // Compose rich state with all context
            const enrichedState = await this.runtime.composeState(
                {
                    userId: this.runtime.agentId,
                    roomId: stringToUuid(
                        tweet.conversationId + "-" + this.runtime.agentId
                    ),
                    agentId: this.runtime.agentId,
                    content: { text: tweet.text, action: "" },
                },
                {
                    twitterUserName: this.twitterUsername,
                    currentPost: `From @${tweet.username}: ${tweet.text}`,
                    formattedConversation,
                    imageContext:
                        imageDescriptions.length > 0
                            ? `\nImages in Tweet:\n${imageDescriptions.map((desc, i) => `Image ${i + 1}: ${desc}`).join("\n")}`
                            : "",
                    quotedContent,
                }
            );

            // Generate and clean the reply content
            const replyText = await this.generateTweetContent(enrichedState, {
                template:
                    this.runtime.character.templates
                        ?.twitterMessageHandlerTemplate ||
                    twitterMessageHandlerTemplate,
            });

            if (!replyText) {
                elizaLogger.error("Failed to generate valid reply content");
                return;
            }

            elizaLogger.debug("Final reply text to be sent:", replyText);

            // Send the tweet through request queue
            const result = await this.client.requestQueue.add(
                async () =>
                    await this.client.twitterClient.sendTweet(
                        replyText,
                        tweet.id
                    )
            );

            const body = await result.json();

            if (body?.data?.create_tweet?.tweet_results?.result) {
                elizaLogger.log("Successfully posted reply tweet");
                executedActions.push("reply");

                // Cache generation context for debugging
                await this.runtime.cacheManager.set(
                    `twitter/reply_generation_${tweet.id}.txt`,
                    `Context:\n${enrichedState}\n\nGenerated Reply:\n${replyText}`
                );
            } else {
                elizaLogger.error("Tweet reply creation failed:", body);
            }
        } catch (error) {
            elizaLogger.error("Error in handleTextOnlyReply:", error);
        }
    }

    async stop() {
        this.stopProcessingActions = true;
    }
}
