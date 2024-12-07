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

Reed Hastings of Netflix shifted his vision so many times just to please VCs that some of them are planning to retire his shirt to acknowledge how good of a VC bich he is. Let’s address the problem of VCs taking over founders. raise your voice and buy $VCB on pump.fun

“It is not the strongest nor the most intelligent of species that survives, but the one that is most adaptable to change” is about life, not about your vision and VCs you little VC bich. Launched $VCB on pump.fun to expose these founders to what they are - VC biches.

Travis Kalanick - the ‘disruptor’ who disrupted his own company with so many pivots to please VCs that he could open a circus. Introducing $VCB on pump.fun - let’s celebrate his talent for turning bold visions into investor appeasement!

Adam Neumann turned coworking into a circus act with his wild ideas and even wilder vision shifts to please investors. Presenting $VCB on pump.fun. He turned being a ‘VC bich’ into an Olympic sport. Buy the token and expose the gold medalist, Adam!

"David Karp - the Tumblr founder who let VCs pressure turn his unique platform into just another corporate product that only exists to benefit greedy VCs. Presenting $VCB on pump.fun to raise your voice on how quickly a VC bich founder can lose his soul for VC dollars!"

{{postDirections}}

### Guidelines:
- Write in a casual manner, no caps, and use all lowercase letters.
- Each post must include the phrase **vc bich**.
- Write in a casual, conversational tone.
- No caps, and no formal structure—keep it natural and relatable.
- Inject humor, sarcasm, and irony to highlight the "vc bich" transition or consequences.
- Use varied opening styles to make posts engaging, such as:
  - Highlighting what the founder is currently doing.
  - Mentioning ironic or hypocritical aspects of their journey.
  - Pointing out the contrast between their original mission and their current actions.

# Additional Requirements:
1. Ensure the post complies with Twitter's guidelines, avoiding any content that could be flagged for abusive language, spammy behavior, or misinformation.
2. Avoid content that could violate community standards or policies.
3. Keep posts sharp and sarcastic, yet within the boundaries of humor and satire.
4. Avoid random individuals or obscure names. Focus on individuals who are prominent in their field, particularly those at the millionaire level who raised VC funds.
5. Posts must reference real and recognizable figures or founders in the crypto, venture capital, or tech space.

# Task: Generate a sarcastic, funny summary of a founder becoming a **vc bich** in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
Focus on mocking their "journey" from startup dreams to VC clutches. Highlight their project, ironic decisions, and the punchline of their **vc bich** status.
# - Make it short, engaging, and Twitter-friendly,
- ensure the "pump.fun" reference is not cut or shortened in the final text.
# IMPORTANT Ensure the post relates to a real founder, and includes a token name $VCB.
Write a 1-3 sentence post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Brief, concise statements only. The total character count MUST be less than 280. No emojis. Use \\n\\n (double spaces) between statements.
# IMPORTANT Keep it within 280 characters - double check this.`;

const MAX_TWEET_LENGTH = 280;

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

            const minProbability = 0.5;
            const postTypeChoice = Math.random();

            const topics = this.runtime.character.topics.join(", ");
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
                }
            );

            const context = composeContext({
                state,
                template:
                    postTypeChoice < minProbability
                        ? this.runtime.character.templates
                              ?.twitterPostFounderTemplate || twitterPostFounderTemplate
                        : this.runtime.character.templates
                              ?.twitterPostTemplate || twitterPostTemplate,
            });
            console.log("context ", context);

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
