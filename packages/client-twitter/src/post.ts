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
import { initialFounders } from "./founderslist.ts";

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

const twitterPostFounderTemplate = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
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

const MAX_TWEET_LENGTH = 280;

// Function to initialize founder list in cache if not already present
async function initializeFounderList(runtime: IAgentRuntime, username: string) {
    // await runtime.cacheManager.delete("twitter/" + username + "/founderList");
    const existing = await runtime.cacheManager.get<string[]>(
        "twitter/" + username + "/founderList"
    );
    if (!existing || existing.length < 500) {
        await runtime.cacheManager.set(
            "twitter/" + username + "/founderList",
            initialFounders
        );
        elizaLogger.log("Founder list initialized with default founders.");
    }
}

// Function to add a new founder dynamically
export async function addFounder(
    runtime: IAgentRuntime,
    username: string,
    founderName: string
) {
    const founderList =
        (await runtime.cacheManager.get<string[]>(
            "twitter/" + username + "/founderList"
        )) || [];
    founderList.push(founderName);
    await runtime.cacheManager.set(
        "twitter/" + username + "/founderList",
        founderList
    );
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
    if (!founderList || founderList.length === 0) {
        // If for some reason the list is empty, re-initialize.
        await initializeFounderList(runtime, username);
        return initialFounders;
    }
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
function truncateToCompleteSentence(text: string): string {
    if (text.length <= MAX_TWEET_LENGTH) {
        return text;
    }

    // Attempt to truncate at the last period within the limit
    const truncatedAtPeriod = text.slice(
        0,
        text.lastIndexOf(".", MAX_TWEET_LENGTH) + 1
    );
    if (truncatedAtPeriod.trim().length > 0) {
        return truncatedAtPeriod.trim();
    }

    // If no period is found, truncate to the nearest whitespace
    const truncatedAtSpace = text.slice(
        0,
        text.lastIndexOf(" ", MAX_TWEET_LENGTH)
    );
    if (truncatedAtSpace.trim().length > 0) {
        return truncatedAtSpace.trim() + "...";
    }

    // Fallback: Hard truncate and add ellipsis
    return text.slice(0, MAX_TWEET_LENGTH - 3).trim() + "...";
}

export class TwitterPostClient {
    client: ClientBase;
    runtime: IAgentRuntime;

    async start(postImmediately: boolean = false) {
        if (!this.client.profile) {
            await this.client.init();
        }

        const generateNewTweetLoop = async () => {
            const lastPost = await this.runtime.cacheManager.get<{
                timestamp: number;
            }>(
                "twitter/" +
                    this.runtime.getSetting("TWITTER_USERNAME") +
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
        if (
            this.runtime.getSetting("POST_IMMEDIATELY") != null &&
            this.runtime.getSetting("POST_IMMEDIATELY") != ""
        ) {
            postImmediately = parseBooleanFromText(
                this.runtime.getSetting("POST_IMMEDIATELY")
            );
        }
        if (postImmediately) {
            this.generateNewTweet();
        }

        generateNewTweetLoop();
    }

    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;
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

            const minProbability = 0.4;
            const postTypeChoice = Math.random();

            const topics = this.runtime.character.topics.join(", ");


            let chosenFounder:string = "";

            // If we are generating a founder-focused post
            if (postTypeChoice < minProbability) {
                chosenFounder = await getRandomFounder(this.runtime, this.client.profile.username);
            }

            const state = await this.runtime.composeState(
                {
                    userId: this.runtime.agentId,
                    roomId: roomId,
                    agentId: this.runtime.agentId,
                    content: {
                        text: topics,
                        action: "",
                    },
                },
                {
                    twitterUserName: this.client.profile.username,
                    chosenFounder : chosenFounder!== "" ?chosenFounder :""
                }
            );

            const context = composeContext({
                state,
                template:
                    postTypeChoice < minProbability
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
            });
            console.log("newTweetContent ", newTweetContent);

            // Replace \n with proper line breaks and trim excess spaces
            const formattedTweet = newTweetContent
                .replaceAll(/\\n/g, "\n")
                .trim();

            // Use the helper function to truncate to complete sentence
            const content = truncateToCompleteSentence(formattedTweet);

            if (this.runtime.getSetting("TWITTER_DRY_RUN") === "true") {
                elizaLogger.info(
                    `Dry run: would have posted tweet: ${content}`
                );
                return;
            }

            try {
                elizaLogger.log(`Posting new tweet:\n ${content}`);

                const result = await this.client.requestQueue.add(
                    async () =>
                        await this.client.twitterClient.sendTweet(content)
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
                    permanentUrl: `https://twitter.com/${this.runtime.getSetting("TWITTER_USERNAME")}/status/${tweetResult.rest_id}`,
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
}
