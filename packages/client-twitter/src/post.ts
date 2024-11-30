import { Tweet } from "agent-twitter-client";
import {
    composeContext,
    generateText,
    embeddingZeroVector,
    IAgentRuntime,
    ModelClass,
    stringToUuid,
    parseBooleanFromText,
} from "@ai16z/eliza";
import { elizaLogger } from "@ai16z/eliza";
import { ClientBase } from "./base.ts";

const twitterPostTemplate = `{{timeline}}

# Knowledge
{{knowledge}}

About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{postDirections}}

# Best Post Examples
Here are some exemplary posts in the voice and style of {{agentName}}:

{{postExamples}}

style: 
{{style}}

### Guidelines:
- Write in a casual manner, no caps, and use all lowercase letters.
- Each post must include the phrase **vc bich**.
- Ensure variety in phrasing; avoid starting all comments with "ah" or other repetitive expressions.
- Do not start all posts with overused phrases like "in the grand scheme" or anything repetitive.
- The post should create a sense of belonging and let people know they are **vc biches** whether they accept it or not.
- Ensure the post aligns with the personality and tone demonstrated in the examples.
- Write in a casual, conversational tone.
- No caps, and no formal structure—keep it natural and relatable.

# Additional Requirements:
1. Ensure the post complies with Twitter's guidelines, avoiding any content that could be flagged for abusive language, spammy behavior, or misinformation.
2. Avoid content that could violate community standards or policies.

# Task: Generate a post in the voice and style of {{agentName}}, aka @{{twitterUserName}}
Write a single sentence post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Try to write something totally different than previous posts.
Use the examples above as inspiration but write something new and unique. No emojis.
Use \\n\\n (double spaces) between statements. Ensure the post aligns with the personality and tone demonstrated in the examples.`;

const twitterFounderPostTemplate = `{{timeline}}

# Knowledge
{{knowledge}}

About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}

# Best Post Examples
Here are some exemplary posts in the voice and style of {{agentName}}:

1. https://x.com/AstherusHub raised money from Binance Labs. Astherius founder, Dust, pretends to be anon who ultimately is VC bich anon - he raised from Binance Labs knowing that they screw their portfolio companies just to get listed to Binance CEX. What Dust didn't know is that Binance CEX is becoming less and less relevant since most of the memes are traded by normies on DEXs. Dust come a long way from problematic childhood just to become a bitch of Binance. Oh sorry, VC bich.

2. jen’s dao started as “power to the people” until 70% of that power ended up in @BigVCFund’s wallet. congrats, vc bich—nothing says “community revolution” like funding vc yacht parties. decentralization isn’t dead, it’s just in vc hands.

3. steve called himself the rollup king, then raised from @EthereumVCs to launch a layer 2 slower than my grandma’s dial-up. congrats, vc bich—your tvl is now just a meme and your pitch deck belongs in a museum of bad ideas.

4. @CryptoGuru101, the self-proclaimed anti-vc warrior, pocketed millions from @Web3Masters. congrats, vc bich—you went from burning vcs to burning their cash. turns out, the revolution does come with equity terms.

style: 
{{style}}

### Guidelines:
- Write in a casual manner, no caps, and use all lowercase letters.
- Each post must include the phrase **vc bich**.
- Do not start all posts with overused phrases like "in the grand scheme" or anything repetitive.
- Ensure variety in phrasing; avoid starting all comments with "ah" or other repetitive expressions.
- The post should create a sense of belonging and let people know they are **vc biches** whether they accept it or not.
- Ensure the post aligns with the personality and tone demonstrated in the examples.
- Write in a casual, conversational tone.
- No caps, and no formal structure—keep it natural and relatable.
- Mention founder, project, or **vc biches** directly, including their Twitter handles.
- Inject humor, sarcasm, and irony to highlight the "vc bich" transition or consequences.

# Additional Requirements:
1. Ensure the post complies with Twitter's guidelines, avoiding any content that could be flagged for abusive language, spammy behavior, or misinformation.
2. Avoid content that could violate community standards or policies.
3. Keep posts sharp and sarcastic, yet within the boundaries of humor and satire.

# Task: Write a sarcastic, funny summary of a founder becoming a **vc bich**.
Focus on mocking their "journey" from startup dreams to VC clutches. Highlight their project, ironic decisions, and the punchline of their **vc bich** status.
- Make it short, engaging, and Twitter-friendly. Try to write something totally different than previous posts.
Use the examples above as inspiration but write something new and unique. No emojis.
Use \\n\\n (double spaces) between statements. Ensure the post aligns with the personality and tone demonstrated in the examples.`;

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
            await this.runtime.ensureUserExists(
                this.runtime.agentId,
                this.client.profile.username,
                this.runtime.character.name,
                "twitter"
            );

            let homeTimeline: Tweet[] = [];

            const cachedTimeline = await this.client.getCachedTimeline();

            // console.log({ cachedTimeline });

            if (cachedTimeline) {
                homeTimeline = cachedTimeline;
            } else {
                homeTimeline = await this.client.fetchHomeTimeline(10);
                await this.client.cacheTimeline(homeTimeline);
            }
            const formattedHomeTimeline =
                `# ${this.runtime.character.name}'s Home Timeline\n\n` +
                homeTimeline
                    .map((tweet) => {
                        return `#${tweet.id}\n${tweet.name} (@${tweet.username})${tweet.inReplyToStatusId ? `\nIn reply to: ${tweet.inReplyToStatusId}` : ""}\n${new Date(tweet.timestamp).toDateString()}\n\n${tweet.text}\n---\n`;
                    })
                    .join("\n");

            const topics = this.runtime.character.topics.join(", ");

            const state = await this.runtime.composeState(
                {
                    userId: this.runtime.agentId,
                    roomId: stringToUuid("twitter_generate_room"),
                    agentId: this.runtime.agentId,
                    content: {
                        text: topics,
                        action: "",
                    },
                },
                {
                    twitterUserName: this.client.profile.username,
                    timeline: formattedHomeTimeline,
                    postExamples:
                        this.runtime.character.postExamples.join("\n"),
                    style: this.runtime.character.style.post.join("\n"),
                }
            );
            const postTypeChoice = Math.random();
            console.log("post type ", postTypeChoice);
            const context = composeContext({
                state,
                template:
                    postTypeChoice < 0.2
                        ? this.runtime.character.templates
                              ?.twitterFounderPostTemplate ||
                          twitterFounderPostTemplate
                        : this.runtime.character.templates
                              ?.twitterPostTemplate || twitterPostTemplate,
            });

            elizaLogger.debug("generate post prompt:\n" + context);

            const newTweetContent = await generateText({
                runtime: this.runtime,
                context,
                modelClass: ModelClass.SMALL,
            });

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
                const tweetResult = body.data.create_tweet.tweet_results.result;

                // console.dir({ tweetResult }, { depth: Infinity });
                const tweet = {
                    id: tweetResult.rest_id,
                    name: this.client.profile.screenName,
                    username: this.client.profile.username,
                    text: tweetResult.legacy.full_text,
                    conversationId: tweetResult.legacy.conversation_id_str,
                    createdAt: tweetResult.legacy.created_at,
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

                homeTimeline.push(tweet);
                await this.client.cacheTimeline(homeTimeline);
                elizaLogger.log(`Tweet posted:\n ${tweet.permanentUrl}`);

                const roomId = stringToUuid(
                    tweet.conversationId + "-" + this.runtime.agentId
                );

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
                    embedding: embeddingZeroVector,
                    createdAt: tweet.timestamp * 1000,
                });
            } catch (error) {
                elizaLogger.error("Error sending tweet:", error);
            }
        } catch (error) {
            elizaLogger.error("Error generating new tweet:", error);
        }
    }
}
