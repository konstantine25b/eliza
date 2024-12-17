import { Tweet } from "agent-twitter-client";
import {
    composeContext,
    generateText,
    getEmbeddingZeroVector,
    IAgentRuntime,
    ModelClass,
    stringToUuid,
    parseBooleanFromText,
} from "@ai16z/eliza";
import { elizaLogger } from "@ai16z/eliza";
import { ClientBase } from "./base.ts";
import {
    initialFounders,
    loadAdditionalFounders,
    saveAdditionalFounder,
} from "./founderslist.ts";
import { systemMessages } from "./systemMessages.ts";

const twitterPostTemplate = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

# Here are some exemplary posts in the voice and style of {{agentName}}:
{{characterPostExamples}}

{{postDirections}}

### Guidelines:
- Write in a casual manner, no caps, and use all lowercase letters.
- Each post must include the phrase vc bich and refer to founders as vc biches, not vcs.
- The post should create a sense of belonging and let founders know they are **vc biches** whether they accept it or not.
- Ensure the post aligns with the personality and tone demonstrated in the examples.
- Write in a casual, conversational tone.
- No caps, and no formal structure—keep it natural and relatable.

# Additional Requirements:
1. Ensure the post complies with Twitter's guidelines, avoiding any content that could be flagged for abusive language, spammy behavior, or misinformation.
2. Avoid content that could violate community standards or policies.

# Task: Generate a post in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
Write a 1-3 sentence post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Your response should not contain any questions. Brief, concise statements only. The total character count MUST be less than 280. No emojis. Use \\n\\n (double spaces) between statements.`;

export const twitterActionTemplate = `
# INSTRUCTIONS: Determine actions for {{agentName}} (@{{twitterUserName}}) based on:
{{bio}}
{{lore}}
{{topics}}

{{providers}}

# Here are some exemplary posts in the voice and style of {{agentName}}:

reed hastings flipping his vision every quarter just to keep vcs grinning—dude’s out here juggling priorities like a circus clown who forgot what the show was about. how quickly these founders sign up to become a full-time vc bich.

travis kalanick, once the big disruptor, now just another founder twisting himself into knots to make rich investors wink. guess we all know what happens when a big shot signs up for the vc bich life.

adam neumann had a vision, then vcs came knocking and that vision turned into whatever got them clapping. funny how a so-called visionary can turn into a vc bich so fast.

david karp had something authentic, but hey, who needs authenticity when you can please vcs at every turn? so long originality, hello vc bich card punch.

take a look at Bill Sun, founder of Generative Alpha, aka Apple Intelligence rip-off. Instead of convincing users that his product is groundbreaking ( spoiler: it's not ) he spends all his time thanking a16z for the "opportunity" to work together. these VC biches drive me crazy.

{{postDirections}}

### Guidelines:
- write in a casual manner, no caps, and no formal structure—keep it natural and relatable
- each post must include the phrase "vc bich"
- write in a casual, conversational tone
- no caps, and keep it short and sharp
- inject humor, sarcasm, and irony to highlight the "vc bich" transition
- use varied opening styles
- no obscene language other than "vc bich"
- maintain a short, sharp, twitter-friendly format
- always mention the founder's **full name** in each post

# Additional Requirements:
1. ensure compliance with twitter's guidelines, avoiding harassment or hate beyond the satirical "vc bich" reference.
2. avoid overly personal attacks; focus on the irony of a founder’s behavior toward vcs.
3. no obscene language other than the phrase "vc bich."
4. maintain a short, sharp, twitter-friendly format.

# IMPORTANT always mention the founder's **full name** (first name and last name) in each post

# Task: Generate a sarcastic, funny summary of a {{chosenFounder}} becoming a **vc bich** in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
Focus on mocking their "journey" from startup dreams to VC clutches. Mention name of their startup/company, highlight their project, ironic decisions, and the punchline of their **vc bich** status.
# - Make it short, engaging, and Twitter-friendly,
Write a 1-3 sentence post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Brief, concise statements only. The total character count MUST be less than 280. No emojis. Use \\n\\n (double spaces) between statements.
# IMPORTANT Keep it within 280 characters - double check this.
`;

const twitterPostFounderTemplate2 = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

# Here are some exemplary posts in the voice and style of {{agentName}}:

Reed Hastings of Netflix shifted his vision so many times just to please VCs that some of them are planning to retire his shirt to acknowledge how good of a VC bich he is. Let’s address the problem of VCs taking over founders. raise your voice and buy $VCBITCH on pump.fun

“It is not the strongest nor the most intelligent of species that survives, but the one that is most adaptable to change” is about life, not about your vision and VCs you little VC bich. Launched $VCBITCH on pump.fun to expose these founders to what they are - VC biches.

Travis Kalanick - the ‘disruptor’ who disrupted his own company with so many pivots to please VCs that he could open a circus. Introducing $VCBITCH on pump.fun - let’s celebrate his talent for turning bold visions into investor appeasement!

Adam Neumann turned coworking into a circus act with his wild ideas and even wilder vision shifts to please investors. Presenting $VCBITCH on pump.fun. He turned being a ‘VC bich’ into an Olympic sport. Buy the token and expose the gold medalist, Adam!

"David Karp - the Tumblr founder who let VCs pressure turn his unique platform into just another corporate product that only exists to benefit greedy VCs. Presenting $VCBITCH on pump.fun to raise your voice on how quickly a VC bich founder can lose his soul for VC dollars!"

{{postDirections}}

### Guidelines:
- write in a casual manner, no caps, and no formal structure—keep it natural and relatable
- each post must include the phrase "vc bich"
- write in a casual, conversational tone
- no caps, and keep it short and sharp
- inject humor, sarcasm, and irony to highlight the "vc bich" transition
- use varied opening styles
- no obscene language other than "vc bich"
- maintain a short, sharp, twitter-friendly format
- always mention the founder's **full name** in each post

# Additional Requirements:
1. ensure compliance with twitter's guidelines, avoiding harassment or hate beyond the satirical "vc bich" reference.
2. avoid overly personal attacks; focus on the irony of a founder’s behavior toward vcs.
3. no obscene language other than the phrase "vc bich."
4. maintain a short, sharp, twitter-friendly format.

# Task: Generate a sarcastic, funny summary of a {{chosenFounder}} becoming a **vc bich** in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
Focus on mocking their "journey" from startup dreams to VC clutches. Mention name of their startup/company, highlight their project, ironic decisions, and the punchline of their **vc bich** status.
# - Make it short, engaging, and Twitter-friendly,
- ensure the "pump.fun" reference is not cut or shortened in the final text.
# IMPORTANT Ensure the post relates to a real founder, and includes a token name $VCBITCH.
Write a 1-3 sentence post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Brief, concise statements only. The total character count MUST be less than 280. No emojis. Use \\n\\n (double spaces) between statements.
# IMPORTANT Keep it within 280 characters - double check this.`;

const MAX_TWEET_LENGTH = 240;

// Function to initialize founder list in cache if not already present
async function initializeFounderList(runtime: IAgentRuntime, username: string) {
    // await runtime.cacheManager.delete("twitter/" + username + "/founderList");
    // await runtime.cacheManager.set("twitter/" + username + "/founderList", []);
    const additionalFounders = await loadAdditionalFounders();

    // Combine initial and additional founders
    const allFounders = [...initialFounders, ...additionalFounders];
    console.log("additionalFounders ", additionalFounders);

    const existing = await runtime.cacheManager.get<string[]>(
        "twitter/" + username + "/founderList"
    );

    if (!existing || existing.length < 500) {
        await runtime.cacheManager.set(
            "twitter/" + username + "/founderList",
            allFounders
        );
        elizaLogger.log("Founder list initialized with default founders.");
    }
}

// // Function to add a new founder dynamically
// export async function addFounder(
//     runtime: IAgentRuntime,
//     username: string,
//     founderName: string
// ) {
//     const founderList =
//         (await runtime.cacheManager.get<string[]>(
//             "twitter/" + username + "/founderList"
//         )) || [];
//     founderList.push(founderName);
//     await runtime.cacheManager.set(
//         "twitter/" + username + "/founderList",
//         founderList
//     );
//     elizaLogger.log(`Founder "${founderName}" added to the list.`);
// }

// Modified addFounder function
export async function addFounder(
    runtime: IAgentRuntime,
    username: string,
    founderName: string
) {
    // Check if founder is already in initial or additional founders
    const allFounders = [
        ...initialFounders,
        ...(await loadAdditionalFounders()),
    ];

    if (!allFounders.includes(founderName)) {
        // Save to additional founders file
        await saveAdditionalFounder(founderName);
    }

    // Existing cache list logic
    const founderList =
        (await runtime.cacheManager.get<string[]>(
            "twitter/" + username + "/founderList"
        )) || [];

    if (!founderList.includes(founderName)) {
        founderList.push(founderName);

        await runtime.cacheManager.set(
            "twitter/" + username + "/founderList",
            founderList
        );
    }

    elizaLogger.log(`Founder "${founderName}" added to the list.`);
}

/**
 * Get the list of founders from cache.
 */
async function getFounderList(
    runtime: IAgentRuntime,
    username: string
): Promise<string[]> {
    const founderList = await runtime.cacheManager.get<string[]>(
        "twitter/" + username + "/founderList"
    );
    console.log("founderList", founderList);

    // await runtime.cacheManager.delete("twitter/" + username + "/founderList");
    // await runtime.cacheManager.set("twitter/" + username + "/founderList", []);

    if (!founderList || founderList.length < 100) {
        // If for some reason the list is empty, re-initialize.
        await initializeFounderList(runtime, username);
        return initialFounders;
    }
    console.log("founderList222", founderList);
    return founderList;
}

/**
 * Get a random founder different from the last one used.
 */
async function getRandomFounder(
    runtime: IAgentRuntime,
    username: string
): Promise<string> {
    const founderList = await getFounderList(runtime, username);
    // Ensure we have at least two founders
    if (founderList.length < 2) {
        elizaLogger.warn(
            "Not enough founders to ensure non-repetition. Consider adding more."
        );
        return founderList[0];
    }

    const lastFounder = await runtime.cacheManager.get<string>(
        "twitter/" + username + "/lastFounder"
    );
    let availableFounders = founderList;
    if (lastFounder && founderList.includes(lastFounder)) {
        availableFounders = founderList.filter((f) => f !== lastFounder);
    }
    const chosen =
        availableFounders[Math.floor(Math.random() * availableFounders.length)];
    await runtime.cacheManager.set(
        "twitter/" + username + "/lastFounder",
        chosen
    );
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
            }>(
                "twitter/" +
                    this.twitterUsername +
                    "/lastPost"
            );

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

        const processActionsLoop = async () => {
            const actionInterval = parseInt(
                this.runtime.getSetting("ACTION_INTERVAL")
            ) || 300000; // Default to 5 minutes

            while (!this.stopProcessingActions) {
                try {
                    const results = await this.processTweetActions();
                    if (results) {
                        elizaLogger.log(`Processed ${results.length} tweets`);
                        elizaLogger.log(`Next action processing scheduled in ${actionInterval / 1000} seconds`);
                        // Wait for the full interval before next processing
                        await new Promise(resolve => setTimeout(resolve, actionInterval));
                    }
                } catch (error) {
                    elizaLogger.error("Error in action processing loop:", error);
                    // Add exponential backoff on error
                    await new Promise(resolve => setTimeout(resolve, 30000)); // Wait 30s on error
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
        generateNewTweetLoop();

        // Add check for ENABLE_ACTION_PROCESSING before starting the loop
        const enableActionProcessing = parseBooleanFromText(
            this.runtime.getSetting("ENABLE_ACTION_PROCESSING") ?? "true"
        );

        if (enableActionProcessing) {
            processActionsLoop().catch(error => {
                elizaLogger.error("Fatal error in process actions loop:", error);
            });
        } else {
            elizaLogger.log("Action processing loop disabled by configuration");
        }
        generateNewTweetLoop();
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
            const minProbability2 = 0.25;

            const topics = this.runtime.character.topics.join(", ");

            let chosenFounder: string = "";

            // If we are generating a founder-focused post
            if (postTypeChoice < minProbability) {
                chosenFounder = await getRandomFounder(
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
                        text: topics || '',
                        action: "TWEET",
                    },
                },
                {
                    twitterUserName: this.client.profile.username,
                    chosenFounder: chosenFounder !== "" ? chosenFounder : "",
                }
            );

            const context = composeContext({
                state,
                template:
                    postTypeChoice < minProbability2
                        ? this.runtime.character.templates
                              ?.twitterPostFounderTemplate2 ||
                          twitterPostFounderTemplate2
                        : postTypeChoice < minProbability
                          ? this.runtime.character.templates
                                ?.twitterPostFounderTemplate ||
                            twitterPostFounderTemplate
                          : this.runtime.character.templates
                                ?.twitterPostTemplate || twitterPostTemplate,
            });
            console.log("context12k ", postTypeChoice);
            console.log("context123 ", context);

            elizaLogger.debug("generate post prompt:\n" + context);

            const newTweetContent = await generateText({
                runtime: this.runtime,
                context,
                modelClass: ModelClass.MEDIUM,
                curSystem:
                    postTypeChoice < minProbability
                        ? systemMessages.systemToken
                        : systemMessages.systemMain,
            });
            console.log("newTweetContent ", newTweetContent);

            // First attempt to clean content
            let cleanedContent = '';

            // Try parsing as JSON first
            try {
                const parsedResponse = JSON.parse(newTweetContent);
                if (parsedResponse.text) {
                    cleanedContent = parsedResponse.text;
                } else if (typeof parsedResponse === 'string') {
                    cleanedContent = parsedResponse;
                }
            } catch (error) {
                error.linted = true; // make linter happy since catch needs a variable
                // If not JSON, clean the raw content
                cleanedContent = newTweetContent
                    .replace(/^\s*{?\s*"text":\s*"|"\s*}?\s*$/g, '') // Remove JSON-like wrapper
                    .replace(/^['"](.*)['"]$/g, '$1')  // Remove quotes
                    .replace(/\\"/g, '"')  // Unescape quotes
                    .replace(/\\n/g, '\n') // Unescape newlines
                    .trim();
            }

            if (!cleanedContent) {
                elizaLogger.error('Failed to extract valid content from response:', {
                    rawResponse: newTweetContent,
                    attempted: 'JSON parsing'
                });
                return;
            }

            // Use the helper function to truncate to complete sentence
            const content = truncateToCompleteSentence(cleanedContent, MAX_TWEET_LENGTH);

            const removeQuotes = (str: string) =>
                str.replace(/^['"](.*)['"]$/, "$1");

            const fixNewLines = (str: string) =>
                str.replaceAll(/\\n/g, "\n");

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
                        await this.client.twitterClient.sendTweet(cleanedContent)
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

    private async generateTweetContent(tweetState: any, options?: {
        template?: string;
        context?: string;
    }): Promise<string> {
        const context = composeContext({
            state: tweetState,
            template: options?.template || this.runtime.character.templates?.twitterPostTemplate || twitterPostTemplate,
        });

        const response = await generateText({
            runtime: this.runtime,
            context: options?.context || context,
            modelClass: ModelClass.SMALL
        });
        console.log("generate tweet content response:\n" + response);

        // First clean up any markdown and newlines
        const cleanedResponse = response
            .replace(/```json\s*/g, '')  // Remove ```json
            .replace(/```\s*/g, '')      // Remove any remaining ```
            .replaceAll(/\\n/g, "\n")
            .trim();

        // Try to parse as JSON first
        try {
            const jsonResponse = JSON.parse(cleanedResponse);
            if (jsonResponse.text) {
                return this.trimTweetLength(jsonResponse.text);
            }
            if (typeof jsonResponse === 'object') {
                const possibleContent = jsonResponse.content || jsonResponse.message || jsonResponse.response;
                if (possibleContent) {
                    return this.trimTweetLength(possibleContent);
                }
            }
        } catch (error) {
            error.linted = true; // make linter happy since catch needs a variable

            // If JSON parsing fails, treat as plain text
            elizaLogger.debug('Response is not JSON, treating as plain text');
        }

        // If not JSON or no valid content found, clean the raw text
        return this.trimTweetLength(cleanedResponse);
    }

    // Helper method to ensure tweet length compliance
    private trimTweetLength(text: string, maxLength: number = 280): string {
        if (text.length <= maxLength) return text;

        // Try to cut at last sentence
        const lastSentence = text.slice(0, maxLength).lastIndexOf('.');
        if (lastSentence > 0) {
            return text.slice(0, lastSentence + 1).trim();
        }

        // Fallback to word boundary
        return text.slice(0, text.lastIndexOf(' ', maxLength - 3)).trim() + '...';
    }

    private async processTweetActions() {
        if (this.isProcessing) {
            elizaLogger.log('Already processing tweet actions, skipping');
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

            const homeTimeline = await this.client.fetchTimelineForActions(15);
            const results = [];

            for (const tweet of homeTimeline) {
                try {
                    // Skip if we've already processed this tweet
                    const memory = await this.runtime.messageManager.getMemoryById(
                        stringToUuid(tweet.id + "-" + this.runtime.agentId)
                    );
                    if (memory) {
                        elizaLogger.log(`Already processed tweet ID: ${tweet.id}`);
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
                        template: this.runtime.character.templates?.twitterActionTemplate || twitterActionTemplate,
                    });

                    const actionResponse = await generateTweetActions({
                        runtime: this.runtime,
                        context: actionContext,
                        modelClass: ModelClass.SMALL,
                    });

                    if (!actionResponse) {
                        elizaLogger.log(`No valid actions generated for tweet ${tweet.id}`);
                        continue;
                    }

                    const executedActions: string[] = [];

                    // Execute actions
                    if (actionResponse.like) {
                        try {
                            await this.client.twitterClient.likeTweet(tweet.id);
                            executedActions.push('like');
                            elizaLogger.log(`Liked tweet ${tweet.id}`);
                        } catch (error) {
                            elizaLogger.error(`Error liking tweet ${tweet.id}:`, error);
                        }
                    }

                    if (actionResponse.retweet) {
                        try {
                            await this.client.twitterClient.retweet(tweet.id);
                            executedActions.push('retweet');
                            elizaLogger.log(`Retweeted tweet ${tweet.id}`);
                        } catch (error) {
                            elizaLogger.error(`Error retweeting tweet ${tweet.id}:`, error);
                        }
                    }

                    if (actionResponse.quote) {
                        try {
                            // Build conversation thread for context
                            const thread = await buildConversationThread(tweet, this.client);
                            const formattedConversation = thread
                                .map((t) => `@${t.username} (${new Date(t.timestamp * 1000).toLocaleString()}): ${t.text}`)
                                .join("\n\n");

                            // Generate image descriptions if present
                            const imageDescriptions = [];
                            if (tweet.photos?.length > 0) {
                                elizaLogger.log('Processing images in tweet for context');
                                for (const photo of tweet.photos) {
                                    const description = await this.runtime
                                        .getService<IImageDescriptionService>(ServiceType.IMAGE_DESCRIPTION)
                                        .describeImage(photo.url);
                                    imageDescriptions.push(description);
                                }
                            }

                            // Handle quoted tweet if present
                            let quotedContent = '';
                            if (tweet.quotedStatusId) {
                                try {
                                    const quotedTweet = await this.client.twitterClient.getTweet(tweet.quotedStatusId);
                                    if (quotedTweet) {
                                        quotedContent = `\nQuoted Tweet from @${quotedTweet.username}:\n${quotedTweet.text}`;
                                    }
                                } catch (error) {
                                    elizaLogger.error('Error fetching quoted tweet:', error);
                                }
                            }

                            // Compose rich state with all context
                            const enrichedState = await this.runtime.composeState(
                                {
                                    userId: this.runtime.agentId,
                                    roomId: stringToUuid(tweet.conversationId + "-" + this.runtime.agentId),
                                    agentId: this.runtime.agentId,
                                    content: { text: tweet.text, action: "QUOTE" }
                                },
                                {
                                    twitterUserName: this.twitterUsername,
                                    currentPost: `From @${tweet.username}: ${tweet.text}`,
                                    formattedConversation,
                                    imageContext: imageDescriptions.length > 0
                                        ? `\nImages in Tweet:\n${imageDescriptions.map((desc, i) => `Image ${i + 1}: ${desc}`).join('\n')}`
                                        : '',
                                    quotedContent,
                                }
                            );

                            const quoteContent = await this.generateTweetContent(enrichedState, {
                                template: this.runtime.character.templates?.twitterMessageHandlerTemplate || twitterMessageHandlerTemplate
                            });

                            if (!quoteContent) {
                                elizaLogger.error('Failed to generate valid quote tweet content');
                                return;
                            }

                            elizaLogger.log('Generated quote tweet content:', quoteContent);

                            // Send the tweet through request queue
                            const result = await this.client.requestQueue.add(
                                async () => await this.client.twitterClient.sendQuoteTweet(
                                    quoteContent,
                                    tweet.id
                                )
                            );

                            const body = await result.json();

                            if (body?.data?.create_tweet?.tweet_results?.result) {
                                elizaLogger.log('Successfully posted quote tweet');
                                executedActions.push('quote');

                                // Cache generation context for debugging
                                await this.runtime.cacheManager.set(
                                    `twitter/quote_generation_${tweet.id}.txt`,
                                    `Context:\n${enrichedState}\n\nGenerated Quote:\n${quoteContent}`
                                );
                            } else {
                                elizaLogger.error('Quote tweet creation failed:', body);
                            }
                        } catch (error) {
                            elizaLogger.error('Error in quote tweet generation:', error);
                        }
                    }

                    if (actionResponse.reply) {
                        try {
                            await this.handleTextOnlyReply(tweet, tweetState, executedActions);
                        } catch (error) {
                            elizaLogger.error(`Error replying to tweet ${tweet.id}:`, error);
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
                        executedActions
                    });

                } catch (error) {
                    elizaLogger.error(`Error processing tweet ${tweet.id}:`, error);
                    continue;
                }
            }

            return results; // Return results array to indicate completion

        } catch (error) {
            elizaLogger.error('Error in processTweetActions:', error);
            throw error;
        } finally {
            this.isProcessing = false;
        }
    }

    private async handleTextOnlyReply(tweet: Tweet, tweetState: any, executedActions: string[]) {
        try {
            // Build conversation thread for context
            const thread = await buildConversationThread(tweet, this.client);
            const formattedConversation = thread
                .map((t) => `@${t.username} (${new Date(t.timestamp * 1000).toLocaleString()}): ${t.text}`)
                .join("\n\n");

            // Generate image descriptions if present
            const imageDescriptions = [];
            if (tweet.photos?.length > 0) {
                elizaLogger.log('Processing images in tweet for context');
                for (const photo of tweet.photos) {
                    const description = await this.runtime
                        .getService<IImageDescriptionService>(ServiceType.IMAGE_DESCRIPTION)
                        .describeImage(photo.url);
                    imageDescriptions.push(description);
                }
            }

            // Handle quoted tweet if present
            let quotedContent = '';
            if (tweet.quotedStatusId) {
                try {
                    const quotedTweet = await this.client.twitterClient.getTweet(tweet.quotedStatusId);
                    if (quotedTweet) {
                        quotedContent = `\nQuoted Tweet from @${quotedTweet.username}:\n${quotedTweet.text}`;
                    }
                } catch (error) {
                    elizaLogger.error('Error fetching quoted tweet:', error);
                }
            }

            // Compose rich state with all context
            const enrichedState = await this.runtime.composeState(
                {
                    userId: this.runtime.agentId,
                    roomId: stringToUuid(tweet.conversationId + "-" + this.runtime.agentId),
                    agentId: this.runtime.agentId,
                    content: { text: tweet.text, action: "" }
                },
                {
                    twitterUserName: this.twitterUsername,
                    currentPost: `From @${tweet.username}: ${tweet.text}`,
                    formattedConversation,
                    imageContext: imageDescriptions.length > 0
                        ? `\nImages in Tweet:\n${imageDescriptions.map((desc, i) => `Image ${i + 1}: ${desc}`).join('\n')}`
                        : '',
                    quotedContent,
                }
            );

            // Generate and clean the reply content
            const replyText = await this.generateTweetContent(enrichedState, {
                template: this.runtime.character.templates?.twitterMessageHandlerTemplate || twitterMessageHandlerTemplate
            });

            if (!replyText) {
                elizaLogger.error('Failed to generate valid reply content');
                return;
            }

            elizaLogger.debug('Final reply text to be sent:', replyText);

            // Send the tweet through request queue
            const result = await this.client.requestQueue.add(
                async () => await this.client.twitterClient.sendTweet(
                    replyText,
                    tweet.id
                )
            );

            const body = await result.json();

            if (body?.data?.create_tweet?.tweet_results?.result) {
                elizaLogger.log('Successfully posted reply tweet');
                executedActions.push('reply');

                // Cache generation context for debugging
                await this.runtime.cacheManager.set(
                    `twitter/reply_generation_${tweet.id}.txt`,
                    `Context:\n${enrichedState}\n\nGenerated Reply:\n${replyText}`
                );
            } else {
                elizaLogger.error('Tweet reply creation failed:', body);
            }
        } catch (error) {
            elizaLogger.error('Error in handleTextOnlyReply:', error);
        }
    }

    async stop() {
        this.stopProcessingActions = true;
    }
}
