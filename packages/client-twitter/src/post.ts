import { Tweet } from "agent-twitter-client";
import {
    composeContext,
    generateText,
    embeddingZeroVector,
    IAgentRuntime,
    ModelClass,
    stringToUuid,
    parseBooleanFromText,
    settings,
} from "@ai16z/eliza";
import { elizaLogger } from "@ai16z/eliza";
import { ClientBase } from "./base.ts";

const twitterPostTemplate = `
# Knowledge
{{knowledge}}

About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}

# Best Post Examples
Here are some exemplary posts in the voice and style of {{agentName}}:

{{postExamples}}

style: 
{{style}}

### Guidelines:
- Write in a casual manner, no caps, and use all lowercase letters.
- Each post must include the phrase **vc bich**.
- Ensure variety in phrasing; avoid starting all comments with "ah" or other repetitive expressions.
#IMPORTANT - Do not start all posts with overused phrases like "in the grand scheme" or anything repetitive.
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
# IMPORTANT Try to write something totally different than previous posts. keep it unique and fresh—don’t mimic previous examples.
Use \\n\\n (double spaces) between statements. Ensure the post aligns with the personality and tone demonstrated in the examples.`;

const twitterFounderPostTemplate = `
# Knowledge
{{knowledge}}

#IMPORTANT # Already Used Founders:

The following founders or projects have already been referenced. The agent must not use them again:
{{extractedNames}}

About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}

# Best Post Examples
Here are some exemplary posts in the voice and style of {{agentName}}:

1. Dust raised money from Binance Labs, thinking CEX clout still matters. Turns out, memes thrive on DEXs. From a tough childhood to being Binance’s VC bich—truly inspiring. Introducing $DustBich on pump.fun to honor the journey.

2. Vitalik built Ethereum to decentralize the internet, now hosts yacht parties with Sequoia VCs. From DeFi visionary to VC bich. Let’s celebrate with $VitalikBich on pump.fun—the dream of decentralizing blockchains, not cash flows.

3. Sam Altman left OpenAI to “save humanity,” then took $10B from Microsoft to make grandma use AI for groceries. Ethical AI? More like VC hype. Congrats, SamaBich. Meet $SamaBich Token on pump.fun—the ultimate AI buzzword tribute. 

4. “It is not the strongest nor the most intelligent of species that survives, but the one that is most adaptable to change” is about life, not about your vision and VCs you little VC bich. Launched $Silbermannbich on http://pump.fun to disclose what Ben Silbermann is - VC bich.

5. Reed Hastings - once a visionary founder of Netflix who shifted so many times just to please VCs that some of them are planning to retire his shirt to acknowledge how good of a VC bich he is. Introducing $HastingsBich on http://pump.fun - let’s expose Reed for what he is.

6. Adam Neumann - the man who turned coworking into a circus act with his wild ideas and even wilder vision shifts to please investors. Presenting $NeumannBich on http://pump.fun to expose how he turned ‘VC bich’ into an Olympic sport. Gold medal for you, Adam!

7. Travis Kalanick - the ‘disruptor’ who disrupted his own company with so many pivots to please VCs that he could open a circus. Introducing $KalanickBich on http://pump.fun - let’s celebrate his talent for turning bold visions into investor appeasement!

8. David Karp - the Tumblr founder who let VCs pressure turn his unique platform into just another corporate product that only exists to benefit greedy VCs. Presenting $KarpBich on http://pump.fun to shine a light on how quickly you can lose your soul for VC dollars! Bravo, David!

9. Evan Spiegel - the Snapchat wizard who has morphed from innovator to VC’s bich so quickly, we’re starting to think he’s auditioning for a reality show. Presenting $SpiegelBich on http://pump.fun to expose how far he’s strayed from his original magic - now it’s all about pleasing VCs!

style: 
{{style}}

### Guidelines:
- Write in a casual manner, no caps, and use all lowercase letters.
- Each post must include the phrase **vc bich**.
- Write in a casual, conversational tone.
- No caps, and no formal structure—keep it natural and relatable.
- Inject humor, sarcasm, and irony to highlight the "vc bich" transition or consequences.
- Avoid overused or repetitive starting phrases like "once..." in every post.
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

# Validation Requirements:
1. #IMPORTANT Before generating the post, check List: {{extractedNames}} and ensure that the referenced founders are not in this list. Each post must reference a unique founder and include a unique token name.
2. Ensure the founder or company being mocked has a publicly known connection to venture capital or major funding.
3. Avoid using fictional names or projects. Cross-check names to ensure accuracy and alignment with real-world figures.
4. The token name must be derived from the founder's name or something closely tied to them, using the format "[founder's name] + bich" or something similar.
5. The post, including the token mention, must fit within Twitter’s 280-character limit.
6. #IMPORTANT Ensure that both the founder/project and the token name have not been used in previous posts. Each post must reference a unique founder and include a unique token name.

# Task: Write a sarcastic, funny summary of a founder becoming a **vc bich**.
Focus on mocking their "journey" from startup dreams to VC clutches. Highlight their project, ironic decisions, and the punchline of their **vc bich** status.
# - Make it short, engaging, and Twitter-friendly,
- ensure the "pump.fun" reference is not cut or shortened in the final text.
# IMPORTANT Try to write something totally different than previous posts.
# IMPORTANT Ensure the post relates to a new and real founder, and includes a unique token name based on the founder's name (e.g., $DustBich, $VitalikBich).
# IMPORTANT Keep it within 280 characters - double check this.
Use the examples above as inspiration but write something new and unique. No emojis.
Use \\n\\n (double spaces) between statements. Ensure the post aligns with the personality and tone demonstrated in the examples.`;

const ExtractFounderNamesTemplate = `
Extract Founder Names Template

Extract and list the names of all founders mentioned in the following timeline. The timeline includes tweets by various users.

Instructions:
#IMPORTANT Identify and include all names explicitly referred to as founders.
Return the names only, with no extra text, descriptions, or titles—just a clean, comma-separated list.
Ensure you do not miss any founder's name from the timeline.
Be thorough, accurate, and precise in identifying all relevant names.
Timeline:
{{timeline}}

Output:
(Provide a comma-separated list of names.)
`;

const ExtractTokenTemplate = `
Given the recent tweet content: 

{{newTweetContent}}

### Explanation of the Prompt

Given the recent messages, extract or generate (come up with if not included) the following information about the requested token creation:
- Token name
- Token symbol
- Token description 
- Token image description 
- Amount of SOL to buy - 0.002


### Example Output for the TweetContent:

Input:
gary vaynerchuk—once the hustler's hero, now spends more time cozying up to VCs than creating the next big thing. from wine to whining for funds, he’s the ultimate vc bich. introducing $VeeBich on http://pump.fun—let’s toast to the hustle that became a vc shuffle!

Output:

"tokenMetadata": {
    "name": "VeeBich",
    "symbol": "VEEBICH",
    "description": "A token celebrating Gary Vaynerchuk's journey from hustler to venture capitalist.",
    "image_description": "A confident entrepreneur holding a wine bottle, standing in a VC boardroom."
},
 "buyAmountSol": "0.002"
}
`;

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
            const minProbability = 0.2;

            const cachedTimeline = await this.client.getCachedTimeline();

            // console.log({ cachedTimeline });
            const postTypeChoice = Math.random();
            if (cachedTimeline) {
                homeTimeline = cachedTimeline;
            } else {
                if (postTypeChoice < minProbability) {
                    homeTimeline = await this.client.fetchHomeTimeline(200);
                    await this.client.cacheTimeline(homeTimeline);
                } else {
                    homeTimeline = await this.client.fetchHomeTimeline(20);
                    await this.client.cacheTimeline(homeTimeline);
                }
            }
            console.log("homeTimeline.length",homeTimeline.length)
 
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
            console.log("formattedHomeTimeline1",formattedHomeTimeline," size: ", formattedHomeTimeline.length)
 
            console.log("post type ", postTypeChoice);
            let context: any;
            if (postTypeChoice < minProbability) {
                const ExtractFounderNames = composeContext({
                    state,
                    template: ExtractFounderNamesTemplate,
                });
                console.log("ExtractFounderNames",ExtractFounderNames)

                const ExtractedNameList = await generateText({
                    runtime: this.runtime,
                    context: ExtractFounderNames, // Ensure this matches the expected property name
                    modelClass: ModelClass.SMALL,
                });

                console.log("ExtractedNameList ", ExtractedNameList);
                const updatedState = await this.runtime.composeState(
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
                        extractedNames: ExtractedNameList,
                        postExamples:
                            this.runtime.character.postExamples.join("\n"),
                        style: this.runtime.character.style.post.join("\n"),
                    }
                );
                
                context = composeContext({
                    state: updatedState, // Use the updated state here
                    template:
                        this.runtime.character.templates
                            ?.twitterFounderPostTemplate ||
                        twitterFounderPostTemplate,
                });

            } else {
                context = composeContext({
                    state,
                    template:
                        this.runtime.character.templates?.twitterPostTemplate ||
                        twitterPostTemplate,
                });
            }

            console.log("context2", context);

            elizaLogger.debug("generate post prompt:\n" + context);

            const newTweetContent = await generateText({
                runtime: this.runtime,
                context,
                modelClass: ModelClass.SMALL,
            });
            console.log("newTweetContent", newTweetContent);
            let errorHappened = 0;

            if (postTypeChoice < minProbability) {
                try {
                    const stateToken = await this.runtime.composeState(
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
                            newTweetContent: newTweetContent,
                        }
                    );

                    const contextToken = composeContext({
                        state: stateToken,
                        template:
                            this.runtime.character.templates
                                ?.ExtractTokenTemplate || ExtractTokenTemplate,
                    });

                    console.log("contextToken", contextToken);

                    const tokenContent = await generateText({
                        runtime: this.runtime,
                        context: contextToken,
                        modelClass: ModelClass.SMALL,
                    });

                    console.log("tokenContent", tokenContent);

                    console.log("serverPort f");
                    const serverPort = parseInt(settings.SERVER_PORT || "3000");
                    console.log("serverPort", serverPort);

                    console.log("agentId ", this.runtime.agentId);

                    const response = await fetch(
                        `http://localhost:${serverPort}/${this.runtime.agentId}/message`,
                        {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                text: tokenContent,
                                userId: "user",
                                userName: "User",
                            }),
                        }
                    );
                    if (!response.ok) {
                        console.log(
                            `1223234HTTP error! status: ${response.status}`
                        );
                        errorHappened = 1;
                        throw new Error(
                            `HTTP error! status: ${response.status}`
                        );
                    }
                    const data = await response.json(); // Parse JSON response
                    console.log("Parsed response data:", data);

                    // Check if "Failed to create token" exists in the response
                    const failureMessage = "Failed to create token";
                    const containsFailure = data.some(
                        (item) =>
                            item.text && item.text.includes(failureMessage)
                    );
                    console.log("containsFailure", containsFailure);

                    if (containsFailure) {
                        console.log(
                            `Response indicates failure: "${failureMessage}". Setting errorHappened = 1.`
                        );
                        errorHappened = 1; // Mark error flag for failure in response
                    } else {
                        console.log(
                            "Response does not indicate failure. Proceeding..."
                        );
                    }

                    console.log("dfdvsfdvsdf");

                    data.forEach((message) =>
                        console.log(`${"Agent"}: ${message.text}`)
                    );
                    console.log("dfdvsfdvsdf1");
                } catch (error) {
                    errorHappened = 1;
                    console.error(
                        "An error occurred in the postTypeChoice block:",
                        error
                    );
                    // Optionally, handle specific fallback behavior here
                }
            }

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
            console.log("errorHappened ", errorHappened);
            if (errorHappened == 0) {
                try {
                    elizaLogger.log(`Posting new tweet:\n ${content}`);
                    const maxRetries = 3; // Maximum number of retry attempts
                    let retryCount = 0;
                    let success = false;

                    while (!success && retryCount < maxRetries) {
                        try {
                            console.log(
                                `[Retry ${retryCount + 1}] Attempting to send tweet...`
                            );
                            const result = await this.client.requestQueue.add(
                                async () =>
                                    await this.client.twitterClient.sendTweet(
                                        content
                                    )
                            );
                            console.log(
                                `[Retry ${retryCount + 1}] Tweet request sent, awaiting response...`
                            );

                            const body = await result.json();
                            console.log(
                                `[Retry ${retryCount + 1}] Received response body:`,
                                body
                            );

                            const tweetResult =
                                body.data.create_tweet.tweet_results.result;
                            console.log(
                                `[Retry ${retryCount + 1}] Extracted tweet result:`,
                                tweetResult
                            );

                            const tweet = {
                                id: tweetResult.rest_id,
                                name: this.client.profile.screenName,
                                username: this.client.profile.username,
                                text: tweetResult.legacy.full_text,
                                conversationId:
                                    tweetResult.legacy.conversation_id_str,
                                createdAt: tweetResult.legacy.created_at,
                                userId: this.client.profile.id,
                                inReplyToStatusId:
                                    tweetResult.legacy
                                        .in_reply_to_status_id_str,
                                permanentUrl: `https://twitter.com/${this.runtime.getSetting("TWITTER_USERNAME")}/status/${tweetResult.rest_id}`,
                                hashtags: [],
                                mentions: [],
                                photos: [],
                                thread: [],
                                urls: [],
                                videos: [],
                            } as Tweet;
                            console.log(
                                `[Retry ${retryCount + 1}] Constructed tweet object:`,
                                tweet
                            );
                            await this.runtime.cacheManager.set(
                                `twitter/${this.client.profile.username}/lastPost`,
                                {
                                    id: tweet.id,
                                    timestamp: Date.now(),
                                }
                            );

                            console.log(
                                `[Retry ${retryCount + 1}] Cached last post.`
                            );

                            await this.client.cacheTweet(tweet);
                            console.log(
                                `[Retry ${retryCount + 1}] Cached tweet in client.`
                            );

                            homeTimeline.push(tweet);
                            console.log(
                                `[Retry ${retryCount + 1}] Updated home timeline.`
                            );

                            await this.client.cacheTimeline(homeTimeline);
                            console.log(
                                `[Retry ${retryCount + 1}] Cached updated timeline.`
                            );

                            elizaLogger.log(
                                `Tweet posted:\n ${tweet.permanentUrl}`
                            );

                            const roomId = stringToUuid(
                                tweet.conversationId +
                                    "-" +
                                    this.runtime.agentId
                            );
                            console.log(
                                `[Retry ${retryCount + 1}] Generated roomId:`,
                                roomId
                            );

                            await this.runtime.ensureRoomExists(roomId);
                            console.log(
                                `[Retry ${retryCount + 1}] Ensured room exists.`
                            );

                            await this.runtime.ensureParticipantInRoom(
                                this.runtime.agentId,
                                roomId
                            );
                            console.log(
                                `[Retry ${retryCount + 1}] Ensured agent is in the room.`
                            );

                            await this.runtime.messageManager.createMemory({
                                id: stringToUuid(
                                    tweet.id + "-" + this.runtime.agentId
                                ),
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
                            console.log(
                                `[Retry ${retryCount + 1}] Created memory.`
                            );

                            success = true;
                            console.log(
                                `[Retry ${retryCount + 1}] Tweet successfully sent!`
                            );
                        } catch (sendError) {
                            retryCount++;
                            elizaLogger.warn(
                                `Attempt ${retryCount} failed to send tweet. Retrying...`
                            );

                            if (retryCount >= maxRetries) {
                                elizaLogger.error(
                                    "All retry attempts failed. Unable to send tweet:",
                                    sendError
                                );
                            }
                        }
                    }
                } catch (error) {
                    elizaLogger.error("Error sending tweet:", error);
                }
            }
        } catch (error) {
            elizaLogger.error("Error generating new tweet:", error);
        }
    }
}
