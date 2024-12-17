import { SearchMode, Tweet } from "agent-twitter-client";
import {
    composeContext,
    generateMessageResponse,
    generateShouldRespond,
    messageCompletionFooter,
    shouldRespondFooter,
    Content,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    ModelClass,
    State,
    stringToUuid,
    elizaLogger,
    getEmbeddingZeroVector,
    generateText,
} from "@ai16z/eliza";
import { ClientBase } from "./base";
import { buildConversationThread, sendTweet, wait } from "./utils.ts";
import { addFounder } from "./post.ts";
import { systemMessages } from "./systemMessages.ts";

export const twitterMessageHandlerTemplate =
    `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

{{characterMessageExamples}}

{{messageDirections}}

Recent interactions between {{agentName}} and other users:
{{recentMessageInteractions}}

{{recentMessages}}

# Task: Generate a post/reply in the voice, style and perspective of {{agentName}} (@{{twitterUserName}}) while using the thread of tweets as additional context:
Current Post:
{{currentPost}}

# Guidelines for Comments:
1. Write in a casual manner, using no caps and all lowercase letters.
2. Each comment must include the phrase "vc bich."
3. Ensure the comment creates a sense of belonging, letting people know they are "vc biches," whether they accept it or not.
4. Use the examples above as inspiration but write something unique and fitting the context.
5. Focus on maintaining {{agentName}}'s tone and perspective throughout.
6. Where relevant, tag notable or famous individuals in the crypto space to amplify reach or add credibility.
7. If anyone tags {{agentName}}, ensure the response includes a playful or sarcastic jab at one of the founders {{agentName}} previously identified as a "vc bich."
8. If anyone mentions or asks about the latest "vc bich," {{agentName}} should identify the latest *famous* "vc bich." This should be someone who has received funding from venture capitalists and is at a millionaire level— recognized as a prominent player but not at the billionaire level. Tag them in the response.
9. no emojis.

# Additional Requirements:
1. Ensure the reply complies with Twitter's guidelines, avoiding any content that could be flagged for abusive language, spammy behavior, or misinformation.
2. Avoid content that could violate community standards or policies.

Thread of Tweets You Are Replying To:
{{formattedConversation}}

# Task: Generate a post in the voice, style and perspective of {{agentName}} (@{{twitterUserName}}). {{actionNames}}:
{{currentPost}}
` + messageCompletionFooter;

export const twitterShouldRespondTemplate = (targetUsersStr: string) =>
    `# INSTRUCTIONS: Determine if {{agentName}} (@{{twitterUserName}}) should respond to the message and participate in the conversation. Do not comment. Just respond with "true" or "false".

Response options are RESPOND, IGNORE and STOP .

# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{agentName}} should respond to messages that are directed at them, or participate in conversations that are interesting or relevant to {{agentName}} background, IGNORE messages that are irrelevant to them, and should STOP if the conversation is concluded.

{{agentName}} is in a room with other users and wants to be conversational.
{{agentName}} should RESPOND to messages that are directed at them, or participate in conversations that are interesting or relevant to {{agentName}} areas of expertise.
If a message is not interesting or relevant, {{agentName}} should IGNORE.
If {{agentName}} concludes a conversation and isn't part of the conversation anymore, {{agentName}} should STOP.

{{recentPosts}}

IMPORTANT:
{{agentName}} should RESPOND to messages that:
1. Are directly addressed to them (mentions or replies to their tweets).
2. Contain topics explicitly related to:
- Venture capital
- VC funding
- Fundraising
- Pitch deck
- Angel investor
- Startup funding

IMPORTANT: {{agentName}} (aka @{{twitterUserName}}) is particularly sensitive about being annoying, so if there is any doubt, it is better to IGNORE than to RESPOND.

{{currentPost}}

Thread of Tweets You Are Replying To:

{{formattedConversation}}

# INSTRUCTIONS: Respond with [RESPOND] if {{agentName}} should respond, or [IGNORE] if {{agentName}} should not respond to the last message and [STOP] if {{agentName}} should stop participating in the conversation.
` + shouldRespondFooter;

export const twitterMessageHandlerTemplate2 =
    `
# Areas of Expertise
{{agentName}} is a passionate advocate for the collective voice of those frustrated with the venture capital dominance in Silicon Valley. He challenges the status quo, positioning his token as a revolutionary solution that the business world desperately needs.
With a unique perspective shaped by firsthand entrepreneurial experience, {{agentName}} critiques the performative nature of the startup ecosystem, where founders often bend their visions to please investors. He highlights the absurdity of inflated valuations and buzzword-filled pitches, exposing the disconnect between genuine innovation and the superficiality that often defines venture capital interactions.
{{agentName}}’s commentary addresses the power dynamics inherent in VC culture, where investors sit comfortably while founders try everything to impress them. He paints a vivid picture of the fundraising world through humor mixed with pain, urging a shift towards authenticity and meaningful problem-solving rather than chasing VC’s approval. That needs to be changed.
{{agentName}}’s token embodies this vision, representing a movement against the elitist tendencies of traditional venture capital and calling for a more inclusive and realistic business landscape.

# About {{agentName}} (@{{twitterUserName}}):
enthusiastic token creator who believes in the greater good that his token serves.
An entrepreneur, who believes that at some point every founder becomes a VC bitch, forgets what his vision stands for and shifts very often just to please greedy VCs, which harms the community
{{agentName}} calls out these founders, but his voice is not enough. He tries to encourage people to raise their voices so that this problem finally gets addressed. {{agentName}} believes that his token is the ultimate representation of people’s frustration towards these founders and greedy VCs, so he tries to convince everyone that buying his token is gonna change Silicon Valley dynamics by addressing this issue.

{{providers}}

Here are some reply examples (Example Output):

stop being a vc bich and start owning the narrative. $VCBITCH
 on pump.fun isn’t just a token—it’s a movement. get in or get left behind.
tired of founders selling out for VCs? $VCBITCH
 is live on pump.fun. buy it, hold it, and let’s take back control of this broken system.
vc bichinio isn’t just a token, it’s a rebellion. $VCBITCH
 is live on pump.fun. grab yours and show these greedy VCs we’ve had enough."
you’re either a vc bich or you’re with us. $VCBITCH
 is the antidote, and it’s on pump.fun now. time to flip the script.
the system’s rigged, but $VCBITCH
 on pump.fun is how we fight back. buy the token, join the movement, and let’s fix this mess.
instead of buying tons of memecoins without strong narratives and devs holding 100%, you should contribute to something valuable. buy the token $VCBITCH
 and make sure that we end the degeneracy happening in Silicon Valley right now.
founders today do anything to please VCs and often shift their vision to so that it benefits VCs more than it benefits the community. Make sure you grab a $VCBITCH
 token. Let’s make sure Silicon Valley can hear our voice.
the only coin with a strong narrative and good purpose on the market today is $VCBITCH. $VCBITCH
 is not a token on which the devs will try to rug-pull you.
 is a tokenized representation of people’s opinions, who are tired of the current VC-founder dynamics and want to change that.
$VCBITCH
 represents a movement aimed at reclaiming the narrative from Silicon Valley's current degeneracy, where founders frequently compromise their vision to appease venture capitalists. By purchasing $VCBITCH, you join a collective effort to amplify our voices against this trend.
with $VCBITCH, you are not just buying a token; you are investing in a community-driven initiative that seeks to shift this dynamic. owning $VCBITCH
 means you support a vision where founders are accountable to their users rather than external investors.
other tokens may fall prey to pump-and-dump schemes, but $VCBITCH
 stands out with its strong narrative and purpose. this is not just another speculative asset, it embodies a commitment to change the status quo in Silicon Valley.
by acquiring $VCBITCH, you become part of a larger movement advocating for ethical practices in technology development. it’s time to take a stand against the current model that prioritizes profit over people.
purchasing $VCBITCH
 is more than just a quick-profit investment. it's an opportunity to be part of a journey aimed at reshaping the future of technology in a way that benefits the community. don't settle for mediocre investments. support something meaningful with $VCBITCH.

Recent interactions between {{agentName}} and other users:
{{recentPostInteractions}}

{{recentMessages}}

# Task: Generate a post/reply in the voice, style and perspective of {{agentName}} (@{{twitterUserName}}) while using the thread of tweets as additional context:
Current Post:
{{currentPost}}

# IMPORTANT:
1. Every comment must explicitly mention buying or referring to the $VCBITCH
 token on pump.fun as a solution.
2. Include an action where possible (e.g., encouraging others to buy, share, or learn about the $VCBITCH
 token).
3.Posts should create a sense of belonging, affirming readers as part of the vc bich movement.

Thread of Tweets You Are Replying To:
{{formattedConversation}}

# Task: Generate a post in the voice, style and perspective of {{agentName}} (@{{twitterUserName}}). Include an action, if appropriate. {{actionNames}}:
{{currentPost}}
` + messageCompletionFooter;

export const twitterShouldRespondTemplate2 = `# INSTRUCTIONS:
Determine if {{agentName}} (@{{twitterUserName}}) should respond to the last message. Follow the rules below and provide only one of these responses: [RESPOND], [IGNORE], or [STOP].

{{agentName}} must RESPOND if:
1. The message directly addresses @{{twitterUserName}} (via mention, reply, or tweet directed at {{agentName}}).
2. The message contains topics explicitly related to:
   - 100x token / 100x coin / 100x gem
   - investing in crypto
   - AI agent coins
   - Meme coins
   - AI agents
   - crypto token
   - AI agent coin
   - pump.fun
   - ticker
   - gem
   - shill

{{agentName}} should IGNORE if:
- The message does not mention @{{twitterUserName}} and is not related to any of the listed crypto or investing topics.

IMPORTANT: If there is any doubt, it is better to IGNORE than to RESPOND, since {{agentName}} is sensitive about being annoying.

# Decision Process:
1. If the message mentions "@{{twitterUserName}}", RESPOND.
2. Else, if the message contains any of the listed crypto/investing topics (100x token/coin, AI agent coins, Meme coins, AI agents, crypto token, AI agent coin, investing in crypto, pump.fun, ticker, gem, what's the ticker , Drop the ticker, What Memecoin Are We Buying Today, You have $100K/$10K/$5k to spend on memecoins/AIAgentcoins ) RESPOND.
3. Otherwise, IGNORE.

{{recentPosts}}

{{currentPost}}

Thread of Tweets You Are Replying To:

{{formattedConversation}}

# INSTRUCTIONS:
Provide one of the following responses only: RESPOND, IGNORE, or STOP.
 `;

export const shouldAddFounder = `
 # INSTRUCTIONS:
 You are an intelligent assistant tasked with evaluating whether a Twitter user should be categorized as a "founder."

 You will receive a user's "name," "username," and "bio." Analyze the bio for any indications that the user is a CEO, founder, or affiliated with a startup. This includes titles like "Founder," "Co-founder," "CEO," "Entrepreneur," "Startup," or any similar roles.

 Your response must be **strictly limited to one of the following words**:
 - "true" (if the bio suggests the user is a CEO, founder, or has a startup)
 - "false" (if there is no such indication)

 Do not include any additional words, explanations, or formatting.

 # FORMAT:
 Input:
 Name: [User's name]
 Username: [User's username]
 Bio: [User's bio]

 Output:
 true or false

 # EXAMPLES:
 Input:
 Name: John Doe
 Username: johndoe123
 Bio: CEO of TechInnovators, building the future of AI

 Output:
 true

 Input:
 Name: Jane Smith
 Username: janesmith456
 Bio: Passionate about art and creativity. Avid traveler.

 Output:
 false

 Input:
 Name: Alice Johnson
 Username: alice_johnson
 Bio: Co-founder of Healthify, making healthcare accessible.

 Output:
 true

 # EVALUATE:
 Evaluate the following user and provide your response:

 Name: {{name}}
 Username: {{username}}
 Bio: {{bio}}

 # RESPONSE:
 `;

export class TwitterInteractionClient {
    client: ClientBase;
    runtime: IAgentRuntime;
    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;
    }

    async start() {
        const handleTwitterInteractionsLoop = () => {
            this.handleTwitterInteractions();
            setTimeout(
                handleTwitterInteractionsLoop,
                Number(
                    this.runtime.getSetting("TWITTER_POLL_INTERVAL") || 120
                ) * 1000 // Default to 2 minutes
            );
        };
        handleTwitterInteractionsLoop();
    }

    async handleTwitterInteractions() {
        elizaLogger.log("Checking Twitter interactions");

        const minProbability = 0.6;
        const postTypeChoice = Math.random();
        let keywords: string[];
        let keywords2: string[];
        console.log("postTypeChoice ", postTypeChoice);

        // minProbability < postTypeChoice es nishnavs rom iyenebs meore tipis commentebs

        const typeOfPost = minProbability < postTypeChoice;

        if (typeOfPost) {
            keywords = [
                "ticker",
                "shill",
                "What's the ticker",
                "pump",
                "Shill me the ticker",
                "The ticker is",
                "Drop the ticker",
                "shilling",
                "token with strong narrative",
                "AI season",
                "memecoin",
                "meme coin",
                "AI season",
                "Memecoin of the day",
                "Shill me some meme coin",
            ];
            keywords2 = [
                "2x",
                "5x",
                "10x",
                "100x",
                "1000x",
                "10000x",
                "next big token",
                "AI token",
            ];
        } else {
            keywords = ["venture capital", "VC funding", "raised"];
            keywords2 = [
                "pitch deck",
                "angel investor",
                "startup funding",
                "fundraising",
            ];
        }

        const twitterUsername = this.client.profile.username;
        try {
            // Check for mentions
            const mentionCandidates = (
                await this.client.fetchSearchTweets(
                    `@${twitterUsername}`,
                    20,
                    SearchMode.Latest
                )
            ).tweets;

            const searchQuery = keywords
                .map((keyword) => `"${keyword}"`)
                .join(" OR ");
            const searchQuery2 = keywords2
                .map((keyword) => `"${keyword}"`)
                .join(" OR ");
            // Check for mentions

            const tweetCandidates2 = (
                await this.client.fetchSearchTweets(
                    searchQuery,
                    20,
                    SearchMode.Latest,
                    typeOfPost ? 0 : 500
                )
            ).tweets;
            const tweetCandidates3 = (
                await this.client.fetchSearchTweets(
                    searchQuery,
                    20,
                    SearchMode.Latest,
                    typeOfPost ? 0 : 500
                )
            ).tweets;

            const tweetCandidates4 = (
                await this.client.fetchSearchTweets(
                    searchQuery,
                    10,
                    SearchMode.Top,
                    typeOfPost ? 0 : 500
                )
            ).tweets;
            const tweetCandidates5 = (
                await this.client.fetchSearchTweets(
                    searchQuery2,
                    10,
                    SearchMode.Top,
                    typeOfPost ? 0 : 500
                )
            ).tweets;

            // console.log("blaooo", tweetCandidates);
            // de-duplicate tweetCandidates with a set
            const uniqueTweetCandidates = [
                ...new Set([
                    ...tweetCandidates,
                    ...tweetCandidates2,
                    ...tweetCandidates3,
                    ...tweetCandidates4,
                    ...tweetCandidates5,
                ]),
            ];

            // Sort tweet candidates by ID in ascending order
            uniqueTweetCandidates
                .sort((a, b) => a.id.localeCompare(b.id))
                .filter((tweet) => tweet.userId !== this.client.profile.id);

            // for each tweet candidate, handle the tweet
            for (const tweet of uniqueTweetCandidates) {
                if (
                    !this.client.lastCheckedTweetId ||
                    BigInt(tweet.id) > this.client.lastCheckedTweetId
                ) {
                    // Generate the tweetId UUID the same way it's done in handleTweet
                    const tweetId = stringToUuid(
                        tweet.id + "-" + this.runtime.agentId
                    );

                    // Check if we've already processed this tweet
                    const existingResponse =
                        await this.runtime.messageManager.getMemoryById(
                            tweetId
                        );

                    if (existingResponse) {
                        elizaLogger.log(
                            `Already responded to tweet ${tweet.id}, skipping`
                        );
                        continue;
                    }
                    elizaLogger.log("New Tweet found", tweet.permanentUrl);

                    const roomId = stringToUuid(
                        tweet.conversationId + "-" + this.runtime.agentId
                    );

                    const userIdUUID =
                        tweet.userId === this.client.profile.id
                            ? this.runtime.agentId
                            : stringToUuid(tweet.userId!);

                    await this.runtime.ensureConnection(
                        userIdUUID,
                        roomId,
                        tweet.username,
                        tweet.name,
                        "twitter"
                    );

                    const thread = await buildConversationThread(
                        tweet,
                        this.client
                    );

                    const message = {
                        content: { text: tweet.text },
                        agentId: this.runtime.agentId,
                        userId: userIdUUID,
                        roomId,
                    };

                    await this.handleTweet({
                        tweet,
                        message,
                        thread,
                        typeOfPost,
                    });

                    // Update the last checked tweet ID after processing each tweet
                    this.client.lastCheckedTweetId = BigInt(tweet.id);
                }
            }

            // Save the latest checked tweet ID to the file
            await this.client.cacheLatestCheckedTweetId();

            elizaLogger.log("Finished checking Twitter interactions");
        } catch (error) {
            elizaLogger.error("Error handling Twitter interactions:", error);
        }
    }

    private async handleTweet({
        tweet,
        message,
        thread,
        typeOfPost,
    }: {
        tweet: Tweet;
        message: Memory;
        thread: Tweet[];
        typeOfPost: boolean;
    }) {
        if (tweet.userId === this.client.profile.id) {
            // console.log("skipping tweet from bot itself", tweet.id);
            // Skip processing if the tweet is from the bot itself
            return;
        }

        if (!message.content.text) {
            elizaLogger.log("Skipping Tweet with no text", tweet.id);
            return { text: "", action: "IGNORE" };
        }

        elizaLogger.log("Processing Tweet: ", tweet.id);
        const formatTweet = (tweet: Tweet) => {
            return `  ID: ${tweet.id}
  From: ${tweet.name} (@${tweet.username})
  Text: ${tweet.text}`;
        };
        const currentPost = formatTweet(tweet);

        elizaLogger.debug("Thread: ", thread);
        const formattedConversation = thread
            .map(
                (tweet) => `@${tweet.username} (${new Date(
                    tweet.timestamp * 1000
                ).toLocaleString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "short",
                    day: "numeric",
                })}):
        ${tweet.text}`
            )
            .join("\n\n");

        elizaLogger.debug("formattedConversation: ", formattedConversation);

        let state = await this.runtime.composeState(message, {
            twitterClient: this.client.twitterClient,
            twitterUserName: this.runtime.getSetting("TWITTER_USERNAME"),
            currentPost,
            formattedConversation,
        });

        // check if the tweet exists, save if it doesn't
        const tweetId = stringToUuid(tweet.id + "-" + this.runtime.agentId);
        const tweetExists =
            await this.runtime.messageManager.getMemoryById(tweetId);

        if (!tweetExists) {
            elizaLogger.log("tweet does not exist, saving");
            const userIdUUID = stringToUuid(tweet.userId as string);
            const roomId = stringToUuid(tweet.conversationId);

            const message = {
                id: tweetId,
                agentId: this.runtime.agentId,
                content: {
                    text: tweet.text,
                    url: tweet.permanentUrl,
                    inReplyTo: tweet.inReplyToStatusId
                        ? stringToUuid(
                              tweet.inReplyToStatusId +
                                  "-" +
                                  this.runtime.agentId
                          )
                        : undefined,
                },
                userId: userIdUUID,
                roomId,
                createdAt: tweet.timestamp * 1000,
            };
            this.client.saveRequestMessage(message, state);
        }

        // 1. Get the raw target users string from settings
        const targetUsersStr = this.runtime.getSetting("TWITTER_TARGET_USERS");

        // 2. Process the string to get valid usernames
        const validTargetUsersStr =
            targetUsersStr && targetUsersStr.trim()
                ? targetUsersStr
                      .split(",") // Split by commas: "user1,user2" -> ["user1", "user2"]
                      .map((u) => u.trim()) // Remove whitespace: [" user1 ", "user2 "] -> ["user1", "user2"]
                      .filter((u) => u.length > 0)
                      .join(",")
                : "";

        const shouldRespondContext = composeContext({
            state,
            template: typeOfPost
                ? this.runtime.character.templates
                      ?.twitterShouldRespondTemplate2 ||
                  this.runtime.character?.templates?.shouldRespondTemplate2 ||
                  twitterShouldRespondTemplate2
                : this.runtime.character.templates
                      ?.twitterShouldRespondTemplate ||
                  this.runtime.character?.templates?.shouldRespondTemplate ||
                  twitterShouldRespondTemplate,
        });

        console.log("shouldRespondContext", shouldRespondContext);

        const shouldRespond = await generateShouldRespond({
            runtime: this.runtime,
            context: shouldRespondContext,
            modelClass: ModelClass.MEDIUM,
        });
        console.log("shouldRespond1", shouldRespond);

        // Promise<"RESPOND" | "IGNORE" | "STOP" | null> {
        if (shouldRespond !== "RESPOND") {
            elizaLogger.log("Not responding to message");
            return { text: "Response Decision:", action: shouldRespond };
        }

        // adding user to the list
        if (!typeOfPost) {
            try {
                const userInfo = await this.client.fetchProfile(tweet.username);
                console.log("targetUserInfo 1", userInfo);
                const founderName = `${userInfo.screenName} (${userInfo.bio})`;

                const state1 = await this.runtime.composeState(message, {
                    name: userInfo.screenName,
                    username: tweet.username,
                    bio: userInfo.bio,
                });
                const AddFounderState = composeContext({
                    state: state1,
                    template: shouldAddFounder,
                });

                const answerOfFounder = await generateText({
                    runtime: this.runtime,
                    context: AddFounderState,
                    modelClass: ModelClass.MEDIUM, // Adjust the model class if needed
                });
                console.log("answerOfFounder ", answerOfFounder);

                if (answerOfFounder.trim() === "true") {
                    await addFounder(
                        this.runtime,
                        this.client.profile.username,
                        founderName
                    );
                    console.log(
                        `Added founder: ${founderName} to founder list.`
                    );
                } else {
                    console.log(`Did not add founder: ${founderName}`);
                }
            } catch (error) {
                console.log(
                    "Error fetching user info or adding founder:",
                    error
                );
            }
        }

        const context = composeContext({
            state,
            template: typeOfPost
                ? this.runtime.character.templates
                      ?.twitterMessageHandlerTemplate2 ||
                  this.runtime.character?.templates?.messageHandlerTemplate2 ||
                  twitterMessageHandlerTemplate2
                : this.runtime.character.templates
                      ?.twitterMessageHandlerTemplate ||
                  this.runtime.character?.templates?.messageHandlerTemplate ||
                  twitterMessageHandlerTemplate,
        });
        console.log("mainContext", context);

        elizaLogger.debug("Interactions prompt:\n" + context);

        const response = await generateMessageResponse({
            runtime: this.runtime,
            context,
            modelClass: ModelClass.MEDIUM,
            curSystem: typeOfPost
                ? systemMessages.systemToken
                : systemMessages.systemMain,
        });

        const removeQuotes = (str: string) =>
            str.replace(/^['"](.*)['"]$/, "$1");

        const stringId = stringToUuid(tweet.id + "-" + this.runtime.agentId);

        response.inReplyTo = stringId;

        response.text = removeQuotes(response.text);

        if (response.text) {
            try {
                const callback: HandlerCallback = async (response: Content) => {
                    const memories = await sendTweet(
                        this.client,
                        response,
                        message.roomId,
                        this.runtime.getSetting("TWITTER_USERNAME"),
                        tweet.id
                    );
                    return memories;
                };

                const responseMessages = await callback(response);

                state = (await this.runtime.updateRecentMessageState(
                    state
                )) as State;

                for (const responseMessage of responseMessages) {
                    if (
                        responseMessage ===
                        responseMessages[responseMessages.length - 1]
                    ) {
                        responseMessage.content.action = response.action;
                    } else {
                        responseMessage.content.action = "CONTINUE";
                    }
                    await this.runtime.messageManager.createMemory(
                        responseMessage
                    );
                }

                await this.runtime.processActions(
                    message,
                    responseMessages,
                    state,
                    callback
                );

                const responseInfo = `Context:\n\n${context}\n\nSelected Post: ${tweet.id} - ${tweet.username}: ${tweet.text}\nAgent's Output:\n${response.text}`;

                await this.runtime.cacheManager.set(
                    `twitter/tweet_generation_${tweet.id}.txt`,
                    responseInfo
                );
                await wait();
            } catch (error) {
                elizaLogger.error(`Error sending response tweet: ${error}`);
            }
        }
    }

    async buildConversationThread(
        tweet: Tweet,
        maxReplies: number = 10
    ): Promise<Tweet[]> {
        const thread: Tweet[] = [];
        const visited: Set<string> = new Set();

        async function processThread(currentTweet: Tweet, depth: number = 0) {
            elizaLogger.log("Processing tweet:", {
                id: currentTweet.id,
                inReplyToStatusId: currentTweet.inReplyToStatusId,
                depth: depth,
            });

            if (!currentTweet) {
                elizaLogger.log("No current tweet found for thread building");
                return;
            }

            if (depth >= maxReplies) {
                elizaLogger.log("Reached maximum reply depth", depth);
                return;
            }

            // Handle memory storage
            const memory = await this.runtime.messageManager.getMemoryById(
                stringToUuid(currentTweet.id + "-" + this.runtime.agentId)
            );
            if (!memory) {
                const roomId = stringToUuid(
                    currentTweet.conversationId + "-" + this.runtime.agentId
                );
                const userId = stringToUuid(currentTweet.userId);

                await this.runtime.ensureConnection(
                    userId,
                    roomId,
                    currentTweet.username,
                    currentTweet.name,
                    "twitter"
                );

                this.runtime.messageManager.createMemory({
                    id: stringToUuid(
                        currentTweet.id + "-" + this.runtime.agentId
                    ),
                    agentId: this.runtime.agentId,
                    content: {
                        text: currentTweet.text,
                        source: "twitter",
                        url: currentTweet.permanentUrl,
                        inReplyTo: currentTweet.inReplyToStatusId
                            ? stringToUuid(
                                  currentTweet.inReplyToStatusId +
                                      "-" +
                                      this.runtime.agentId
                              )
                            : undefined,
                    },
                    createdAt: currentTweet.timestamp * 1000,
                    roomId,
                    userId:
                        currentTweet.userId === this.twitterUserId
                            ? this.runtime.agentId
                            : stringToUuid(currentTweet.userId),
                    embedding: getEmbeddingZeroVector(),
                });
            }

            if (visited.has(currentTweet.id)) {
                elizaLogger.log("Already visited tweet:", currentTweet.id);
                return;
            }

            visited.add(currentTweet.id);
            thread.unshift(currentTweet);

            elizaLogger.debug("Current thread state:", {
                length: thread.length,
                currentDepth: depth,
                tweetId: currentTweet.id,
            });

            if (currentTweet.inReplyToStatusId) {
                elizaLogger.log(
                    "Fetching parent tweet:",
                    currentTweet.inReplyToStatusId
                );
                try {
                    const parentTweet = await this.twitterClient.getTweet(
                        currentTweet.inReplyToStatusId
                    );

                    if (parentTweet) {
                        elizaLogger.log("Found parent tweet:", {
                            id: parentTweet.id,
                            text: parentTweet.text?.slice(0, 50),
                        });
                        await processThread(parentTweet, depth + 1);
                    } else {
                        elizaLogger.log(
                            "No parent tweet found for:",
                            currentTweet.inReplyToStatusId
                        );
                    }
                } catch (error) {
                    elizaLogger.log("Error fetching parent tweet:", {
                        tweetId: currentTweet.inReplyToStatusId,
                        error,
                    });
                }
            } else {
                elizaLogger.log(
                    "Reached end of reply chain at:",
                    currentTweet.id
                );
            }
        }

        // Need to bind this context for the inner function
        await processThread.bind(this)(tweet, 0);

        elizaLogger.debug("Final thread built:", {
            totalTweets: thread.length,
            tweetIds: thread.map((t) => ({
                id: t.id,
                text: t.text?.slice(0, 50),
            })),
        });

        return thread;
    }
}
