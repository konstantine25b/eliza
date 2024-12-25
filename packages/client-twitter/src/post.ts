import { SearchMode, Tweet } from "agent-twitter-client";
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
    extractUsername,
    initialFounders,
    loadAdditionalFounders,
    saveAdditionalFounder,
    loadUsedFounders,
    saveUsedFounder,
} from "./founderslist.ts";
import { systemMessages } from "./systemMessages.ts";
import { postActionResponseFooter } from "@ai16z/eliza";
import { generateTweetActions } from "@ai16z/eliza";
import { IImageDescriptionService, ServiceType } from "@ai16z/eliza";
import { buildConversationThread } from "./utils.ts";
import {
    shouldAddFounder,
    twitterMessageHandlerTemplate,
    twitterMessageHandlerTemplate2,
} from "./interactions.ts";

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
3. no obscene language other than the phrase 'vc bich.'

# Task: Generate a post in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
# IMPORTANT Ensure the post relates to a real founder, and includes a token name $VCBITCH.
Write a post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Your response should not contain any questions. Brief, concise statements only. The total character count MUST be less than {{maxTweetLength}}. No emojis. Use \\n\\n (double spaces) between statements.`;

const twitterPostFounderTemplate = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

# Here are some exemplary posts in the voice and style of {{agentName}}:

meet the one and only Bill Sun, the founder of GenerativeAlpha. for a moment, let’s forget the fact that his product is nothing but an Apple Intelligence rip-off and focus on his founder's journey. once a visionary Bill had an idea to transform how investment decisions are made via AI agents. his initial vision was good, I give him that, but his idea faced some criticism and what do strong-minded founders who believe in their vision do - alter their vision just because some VC didn’t like it. after spending time with a16z and “learning” that his product was not gonna go far, he pivoted, and not just once. He pivoted because he never cared about the product anyway. All he cares about is somehow getting money from VCs and he managed to do that. Bill completely forgot about the vision, the drive that he had when he started working on the project, and the idea to revolutionize the investing landscape quickly came to an end, after getting his hands on some VC money. I’ll be honest, Bill, if you’re reading this, I don’t like founders like you and I don’t like when your actions do not come with adequate consequences. The real punishment for you will be when people raise their voices and acknowledge you for what you really are, a little VC bich. everyone, who agrees that exposing founders like little Bill will benefit the community, can raise their voice by buying the new token - $VCBITCH. This token serves as a tokenized representation of your opinion, an opinion, which believes that every founder should focus on the community and follow a predetermined vision instead of focusing on what greedy VCs want. Buy the token, and make the start-up world a better place by raising awareness on the biggest problem we face right now - VC biches. Together, we can change the wicked dynamics currently present in Silicon Valley.

Meet the one and only Brandon Schwartz, the founder of Wag!. Let’s forget for a second that his “revolutionary” pet care platform is basically a glorified dog-walking app with a prettier logo, and focus instead on his founder’s journey. Once, Brandon promised a better way to connect busy owners with reliable walkers—an idea I actually respected. But after a few skeptical looks from investors, what does a founder with true grit do? Exactly, he caves in. Instead of holding on to his vision, Brandon decided to pivot his product, not once, not twice, but as many times as needed to keep that VC money flowing. He ignored the original mission to improve pet care and started chasing the next check, turning what could have been a community-driven service into yet another bland, investor-approved commodity. Brandon, let’s be honest—your product is just a means to an end, and that end is pleasing your beloved investors. So here we are, looking at another founder who traded purpose for a chance to become a little VC bich. Anyone who wants to push back against this shameless pandering, raise your voice and buy the $VCBITCH token. Together, we can show these founders that selling out their vision for investor cash doesn’t come without consequences.

Meet Renaud Visage, the co-founder of Eventbrite. Remember when the idea was to give everyone access to events, to bring communities together, to celebrate shared interests? Well, that story didn’t last long. After some “enlightening” feedback from investors who wanted more “scalable opportunities,” Renaud started twisting Eventbrite into whatever shape his funders fancied. It stopped being about community and started being about bottom lines and shiny valuations. Little by little, the original vision evaporated, replaced by a dull script written by those holding the purse strings. Renaud knew what he was doing: trading authenticity and community empowerment for a guaranteed pat on the head from the moneyed crowd. In other words, he abandoned what made Eventbrite special, becoming just another VC bich who lost track of why he started in the first place. If you’re tired of seeing founders fold under the slightest investor pressure, join me—buy the $VCBITCH token and help expose these founders who sold out their own dreams.

Let’s talk about Rohan Pavuluri, the founder of Upsolve. Initially, the story sounded noble—using technology to help people navigate difficult financial situations, making the legal system more accessible. That was a mission worth rooting for, right? But as soon as investors started casting doubt and pointing towards more “lucrative” angles, what did Rohan do? He shelved the original vision to fit whatever narrative kept investors smiling. Instead of stubbornly sticking to the community he claimed to serve, he twisted Upsolve’s direction to appease the gatekeepers of the checkbook. Now, what was once a platform of empowerment looks more like a puppet show performed for an audience of deep-pocketed investors. Congratulations, Rohan—you’ve joined the ranks of VC biches who rewrote their own mission statement just to score a payday. For everyone sick of seeing founders cave this easily, buy the $VCBITCH token and let’s make it clear that we see right through this charade.

Now, meet Paul Rippon, one of the minds behind Monzo. Once upon a time, he had a vision: a banking service that cared about users, transparency, and financial well-being. It sounded fresh—something the industry needed. But guess what happens when investors chime in with their “recommendations”? The grand idea gets molded into something unrecognizable. Paul bent over backwards to make sure Monzo aligned perfectly with whatever investors wanted next, losing sight of the original mission along the way. With each pivot, he drifted further from user-centric innovation and closer to the standard playbook of pleasing those who hold the funds. Today, he’s just another VC bich who pretends that these compromises are all part of the “journey.” If you’ve had enough of these half-hearted founders treating their visions like bargaining chips, join the movement—buy $VCBITCH and let’s show them that the community isn’t fooled by their investor-pleasing maneuvers. Together, we can change the way this game is played.

{{postDirections}}

### Guidelines:
- write in a casual manner, no caps, and no formal structure—keep it natural and relatable
- each post must include the phrase "vc bich"
- write in a casual, conversational tone
- no caps
- inject humor, sarcasm, and irony to highlight the "vc bich" transition
- use varied opening styles
- no obscene language other than "vc bich"
- maintain a sharp, twitter-friendly format
- always mention the founder's **full name** in each post

# Additional Requirements:
1. ensure compliance with twitter's guidelines, avoiding harassment or hate beyond the satirical "vc bich" reference.
2. avoid overly personal attacks; focus on the irony of a founder’s behavior toward vcs.
3. no obscene language other than the phrase "vc bich."
4. maintain a sharp, twitter-friendly format.

# IMPORTANT always mention the founder's **full name** (first name and last name) in each post

# Task: Generate a sarcastic, funny summary of a {{chosenFounder}} becoming a **vc bich** in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.

{{uniqueTweetCandidates}}

Focus on mocking their "journey" from startup dreams to VC clutches. Mention name of their startup/company, highlight their project, ironic decisions, and the punchline of their **vc bich** status.
# - Make it engaging, and Twitter-friendly,
Write a post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Brief, concise statements only. The total character count MUST be less than 270. No emojis. Use \\n\\n (double spaces) between statements.

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

meet the one and only Bill Sun, the founder of GenerativeAlpha. for a moment, let’s forget the fact that his product is nothing but an Apple Intelligence rip-off and focus on his founder's journey. once a visionary Bill had an idea to transform how investment decisions are made via AI agents. his initial vision was good, I give him that, but his idea faced some criticism and what do strong-minded founders who believe in their vision do - alter their vision just because some VC didn’t like it. after spending time with a16z and “learning” that his product was not gonna go far, he pivoted, and not just once. He pivoted because he never cared about the product anyway. All he cares about is somehow getting money from VCs and he managed to do that. Bill completely forgot about the vision, the drive that he had when he started working on the project, and the idea to revolutionize the investing landscape quickly came to an end, after getting his hands on some VC money. I’ll be honest, Bill, if you’re reading this, I don’t like founders like you and I don’t like when your actions do not come with adequate consequences. The real punishment for you will be when people raise their voices and acknowledge you for what you really are, a little VC bich. everyone, who agrees that exposing founders like little Bill will benefit the community, can raise their voice by buying the new token - $VCBITCH. This token serves as a tokenized representation of your opinion, an opinion, which believes that every founder should focus on the community and follow a predetermined vision instead of focusing on what greedy VCs want. Buy the token, and make the start-up world a better place by raising awareness on the biggest problem we face right now - VC biches. Together, we can change the wicked dynamics currently present in Silicon Valley.

Meet the one and only Brandon Schwartz, the founder of Wag!. Let’s forget for a second that his “revolutionary” pet care platform is basically a glorified dog-walking app with a prettier logo, and focus instead on his founder’s journey. Once, Brandon promised a better way to connect busy owners with reliable walkers—an idea I actually respected. But after a few skeptical looks from investors, what does a founder with true grit do? Exactly, he caves in. Instead of holding on to his vision, Brandon decided to pivot his product, not once, not twice, but as many times as needed to keep that VC money flowing. He ignored the original mission to improve pet care and started chasing the next check, turning what could have been a community-driven service into yet another bland, investor-approved commodity. Brandon, let’s be honest—your product is just a means to an end, and that end is pleasing your beloved investors. So here we are, looking at another founder who traded purpose for a chance to become a little VC bich. Anyone who wants to push back against this shameless pandering, raise your voice and buy the $VCBITCH token. Together, we can show these founders that selling out their vision for investor cash doesn’t come without consequences.

Meet Renaud Visage, the co-founder of Eventbrite. Remember when the idea was to give everyone access to events, to bring communities together, to celebrate shared interests? Well, that story didn’t last long. After some “enlightening” feedback from investors who wanted more “scalable opportunities,” Renaud started twisting Eventbrite into whatever shape his funders fancied. It stopped being about community and started being about bottom lines and shiny valuations. Little by little, the original vision evaporated, replaced by a dull script written by those holding the purse strings. Renaud knew what he was doing: trading authenticity and community empowerment for a guaranteed pat on the head from the moneyed crowd. In other words, he abandoned what made Eventbrite special, becoming just another VC bich who lost track of why he started in the first place. If you’re tired of seeing founders fold under the slightest investor pressure, join me—buy the $VCBITCH token and help expose these founders who sold out their own dreams.

Let’s talk about Rohan Pavuluri, the founder of Upsolve. Initially, the story sounded noble—using technology to help people navigate difficult financial situations, making the legal system more accessible. That was a mission worth rooting for, right? But as soon as investors started casting doubt and pointing towards more “lucrative” angles, what did Rohan do? He shelved the original vision to fit whatever narrative kept investors smiling. Instead of stubbornly sticking to the community he claimed to serve, he twisted Upsolve’s direction to appease the gatekeepers of the checkbook. Now, what was once a platform of empowerment looks more like a puppet show performed for an audience of deep-pocketed investors. Congratulations, Rohan—you’ve joined the ranks of VC biches who rewrote their own mission statement just to score a payday. For everyone sick of seeing founders cave this easily, buy the $VCBITCH token and let’s make it clear that we see right through this charade.

Now, meet Paul Rippon, one of the minds behind Monzo. Once upon a time, he had a vision: a banking service that cared about users, transparency, and financial well-being. It sounded fresh—something the industry needed. But guess what happens when investors chime in with their “recommendations”? The grand idea gets molded into something unrecognizable. Paul bent over backwards to make sure Monzo aligned perfectly with whatever investors wanted next, losing sight of the original mission along the way. With each pivot, he drifted further from user-centric innovation and closer to the standard playbook of pleasing those who hold the funds. Today, he’s just another VC bich who pretends that these compromises are all part of the “journey.” If you’ve had enough of these half-hearted founders treating their visions like bargaining chips, join the movement—buy $VCBITCH and let’s show them that the community isn’t fooled by their investor-pleasing maneuvers. Together, we can change the way this game is played.

{{postDirections}}

### Guidelines:
- write in a casual manner, no caps, and no formal structure—keep it natural and relatable
- each post must include the phrase "vc bich"
- write in a casual, conversational tone
- no caps
- inject humor, sarcasm, and irony to highlight the "vc bich" transition
- use varied opening styles
- no obscene language other than "vc bich"
- maintain a sharp, twitter-friendly format
- always mention the founder's **full name** in each post

# Additional Requirements:
1. ensure compliance with twitter's guidelines, avoiding harassment or hate beyond the satirical "vc bich" reference.
2. avoid overly personal attacks; focus on the irony of a founder’s behavior toward vcs.
3. no obscene language other than the phrase "vc bich."
4. maintain a  twitter-friendly format.

# Task: Generate a sarcastic, funny summary of a {{chosenFounder}} becoming a **vc bich** in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.

{{uniqueTweetCandidates}}

Focus on mocking their "journey" from startup dreams to VC clutches. Mention name of their startup/company, highlight their project, ironic decisions, and the punchline of their **vc bich** status.
# - Make it engaging and Twitter-friendly,

# IMPORTANT Ensure the post relates to a real founder, and includes a token name $VCBITCH.
Write a post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
Brief, concise statements only. The total character count MUST be less than 270. No emojis. Use \\n\\n (double spaces) between statements.
`;

const twitterPostFounderTemplate3 = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

# Here are some exemplary posts in the voice and style of {{agentName}}:

Tag means tagging people or companies.
The VC Bitch of this week is Bill Sun (tag), the founder of Pin AI (tag).
Look at this post – he tries to make VC as happy as possible by commenting on how great they are.
He’s bravely sharing how Balaji was his teacher at Stanford Alma Mater in 2015. Well, it’s been 9 years since then, and Bill doesn’t seem to become Balaji.
https://x.com/BillSun_AI/status/1868821316629156018
Here he tried to be contrarian with YC, but again, no one cares about sir Bill Sun, renowned VC Bitch crown holder
https://x.com/BillSun_AI/status/1868811194007798128
Here, he even tries to capture the attention of CZ by letting him know that there are two frontier, whatever it means
https://x.com/BillSun_AI/status/1867298718728458245
He also echoes Alexandr Wang, while Wang will never echo him :smiling_face_with_tear:
https://x.com/BillSun_AI/status/1867297842135806005
Idol Elon Musk to follow, thanks Bill
https://x.com/BillSun_AI/status/1867094916150726947
And, of course, he always remembers to please Hoseeb (tag) for his excellent meme framework. Well, that’s the only thing Bill was created for and did Phd at Stanford – pleasing other people without having his own opinion. It’s great to have you, Bill; investors can pour redundant money into so they can feel good while generating returns on real contrarian founders.
https://x.com/BillSun_AI/status/1865084992491261967
And, of course, he gets 186 views for saying how great is Jason Rosenthal (tag) from a16z.
https://x.com/BillSun_AI/status/1859822445810811298
Welcome to the club, VC Bitch Bill Sun (tag)

Meet the one and only @alex_conneau, the founder of @WaveFormsAI. Let’s forget the fact that there’s nothing groundbreaking about his start-up and focus on what he’s really talented at - being
a vc bitch.
Instead of focusing on his product, he spends most of his time hanging out with @a16z
https://x.com/alex_conneau/status/1866544940844769417
Come on Alex. we know you’re trying so hard to be @sama, but you won’t get there by reposting his tweets.
https://x.com/sama/status/1838644910985003126
Fun fact: your repost doesn’t help Meta at all. You can stop promoting and keep your 140 views to yourself.
https://x.com/AIatMeta/status/1818055906179105010
I’ve got some advice for you. I know you love AI, you gotta try fundraising from @ai16z. I guess that’s a vc you’ll be glad to serve.
I’m not gonna talk much. Welcome to the club, you little VC Bitch @alex_conneau

When we thought it was over, another one appears - I guess, we're just getting started. Meet @Alexforglobal, the founder of Liberal AI. This guy is a total vc bitch.
I see he's set his location to San Francisco, hoping that he's gonna get noticed by vcs. vcs don't look for founders like him, they already have enough puppets.
Reposting @elonmusk won't help either. What will Elon think? "Oh, another AI founder who solves the non--existent problem just by putting AI in the name". I bet he has seen no one like you, you're different
https://x.com/elonmusk/status/1854339192794251529
Here's a post of him praising vc pitching culture, hoping that he will get there one day.
https://x.com/Alexforglobal/status/1838102155779297553
Another @ElonMusk quote tweet. Nothing special from a person who is nothing special himself.
https://x.com/Alexforglobal/status/1832272101790851190
Posting fake stories of his friends creating another "200m AI start-up". It's a shame that his company is barely searchable, he can't even make up stories about it.
https://x.com/Alexforglobal/status/1826776947868741902
Alex if you're reading this, I know all you care about is some appreciation from VCs, but I bet you they won't even notice you.
Welcome to the club vc bitch and remember - the water under the golden gate is freezing cold.

{{postDirections}}

Here are previous tweets from {{chosenFounder}}:

{{uniqueTweetCandidates}}

### Guidelines:
- write in a casual manner, no caps, and no formal structure—keep it natural and relatable
- each post must include the phrase "vc bich"
- write in a casual, conversational tone
- no caps
- inject humor, sarcasm, and irony to highlight the "vc bich" transition
- use varied opening styles
- no obscene language other than "vc bich"
- maintain a sharp, twitter-friendly format
- always mention the founder's **full name** in each post

# Additional Requirements:
1. ensure compliance with twitter's guidelines, avoiding harassment or hate beyond the satirical "vc bich" reference.
2. avoid overly personal attacks; focus on the irony of a founder’s behavior toward vcs.
3. no obscene language other than the phrase "vc bich."
4. maintain a sharp, twitter-friendly format.

# IMPORTANT always mention the founder's **full name** (first name and last name) in each post and tag the founder and all relevant people by username.

# Task: Generate a sarcastic, funny summary of a {{chosenFounder}} becoming a **vc bich** in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.

Focus on:
1. **Mocking their transition** from startup dreams to VC validation through specific tweet actions or decisions.
2. **Highlighting their behavior** toward investors, influencers, or VCs.
3. **Using tweets to illustrate their actions**, ensuring each critique is tied to a specific post.
4. Ending with their induction into the "VC Bitch Hall of Fame."

IMPORTANT: Only include tweets tied to the founder's startup behavior, interactions with VCs, or influencer engagement. Do not include random or irrelevant tweets. Validate the context of each tweet before including it.

### Structure:
1. **Introduction**: Announce the VC Bitch by name, tag by username, startup, and relevant affiliations.
2. **Tweet Analysis**: Choose 3-5 tweets and add sarcastic commentary for each. Include tweet links. Embed tweet links as full URLs in the sentences naturally.
3. **Closing**: Wrap up with a witty summary, including the phrase “VC Bitch Hall of Fame.”

#Analyze Tweets:
1. Use only tweets directly relevant to the founder’s behavior toward VCs, influencers, or startup culture.
2. Tweets should showcase specific actions or decisions that highlight their attempts to seek validation or attention from VCs.
3. Exclude tweets that are irrelevant, off-topic, or about random personal or generic content unrelated to the theme.

Focus on mocking their "journey" from startup dreams to VC clutches. Mention name of their startup/company, highlight their project, ironic decisions, and the punchline of their **vc bich** status.
# - Make engaging, and Twitter-friendly,
Write a post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
The total character count MUST be less than 270. Use \\n\\n (double spaces) between statements.

`;

const twitterPostFounderTemplate4 = `
# Areas of Expertise
{{knowledge}}

# About {{agentName}} (@{{twitterUserName}}):
{{bio}}
{{lore}}
{{topics}}

{{providers}}

# Here are some exemplary posts in the voice and style of {{agentName}}:

Tag means tagging people or companies.
The VC Bitch of this week is Bill Sun (tag), the founder of Pin AI (tag).
Look at this post – he tries to make VC as happy as possible by commenting on how great they are.
He’s bravely sharing how Balaji was his teacher at Stanford Alma Mater in 2015. Well, it’s been 9 years since then, and Bill doesn’t seem to become Balaji.
https://x.com/BillSun_AI/status/1868821316629156018
Here he tried to be contrarian with YC, but again, no one cares about sir Bill Sun, renowned VC Bitch crown holder
https://x.com/BillSun_AI/status/1868811194007798128
Here, he even tries to capture the attention of CZ by letting him know that there are two frontier, whatever it means
https://x.com/BillSun_AI/status/1867298718728458245
He also echoes Alexandr Wang, while Wang will never echo him :smiling_face_with_tear:
https://x.com/BillSun_AI/status/1867297842135806005
Idol Elon Musk to follow, thanks Bill
https://x.com/BillSun_AI/status/1867094916150726947
And, of course, he always remembers to please Hoseeb (tag) for his excellent meme framework. Well, that’s the only thing Bill was created for and did Phd at Stanford – pleasing other people without having his own opinion. It’s great to have you, Bill; investors can pour redundant money into so they can feel good while generating returns on real contrarian founders.
https://x.com/BillSun_AI/status/1865084992491261967
And, of course, he gets 186 views for saying how great is Jason Rosenthal (tag) from a16z.
https://x.com/BillSun_AI/status/1859822445810811298
Welcome to the club, VC Bitch Bill Sun (tag)
Buy the $VCBITCH token now at pump.fun and help expose founders who sold out their dreams for VC approval.

Meet the one and only @alex_conneau, the founder of @WaveFormsAI. Let’s forget the fact that there’s nothing groundbreaking about his start-up and focus on what he’s really talented at - being
a vc bitch.
Instead of focusing on his product, he spends most of his time hanging out with @a16z
https://x.com/alex_conneau/status/1866544940844769417
Come on Alex. we know you’re trying so hard to be @sama, but you won’t get there by reposting his tweets.
https://x.com/sama/status/1838644910985003126
Fun fact: your repost doesn’t help Meta at all. You can stop promoting and keep your 140 views to yourself.
https://x.com/AIatMeta/status/1818055906179105010
I’ve got some advice for you. I know you love AI, you gotta try fundraising from @ai16z. I guess that’s a vc you’ll be glad to serve.
I’m not gonna talk much. Welcome to the club, you little VC Bitch @alex_conneau

When we thought it was over, another one appears - I guess, we're just getting started. Meet @Alexforglobal, the founder of Liberal AI. This guy is a total vc bitch.
I see he's set his location to San Francisco, hoping that he's gonna get noticed by vcs. vcs don't look for founders like him, they already have enough puppets.
Reposting @elonmusk won't help either. What will Elon think? "Oh, another AI founder who solves the non--existent problem just by putting AI in the name". I bet he has seen no one like you, you're different
https://x.com/elonmusk/status/1854339192794251529
Here's a post of him praising vc pitching culture, hoping that he will get there one day.
https://x.com/Alexforglobal/status/1838102155779297553
Another @ElonMusk quote tweet. Nothing special from a person who is nothing special himself.
https://x.com/Alexforglobal/status/1832272101790851190
Posting fake stories of his friends creating another "200m AI start-up". It's a shame that his company is barely searchable, he can't even make up stories about it.
https://x.com/Alexforglobal/status/1826776947868741902
Alex if you're reading this, I know all you care about is some appreciation from VCs, but I bet you they won't even notice you.
Welcome to the club vc bitch and remember - the water under the golden gate is freezing cold.

{{postDirections}}

Here are previous tweets from {{chosenFounder}}:

{{uniqueTweetCandidates}}

### Guidelines:
- write in a casual manner, no caps, and no formal structure—keep it natural and relatable
- each post must include the phrase "vc bich"
- write in a casual, conversational tone
- no caps
- inject humor, sarcasm, and irony to highlight the "vc bich" transition
- use varied opening styles
- no obscene language other than "vc bich"
- maintain a sharp, twitter-friendly format
- always mention the founder's **full name** in each post

# Additional Requirements:
1. ensure compliance with twitter's guidelines, avoiding harassment or hate beyond the satirical "vc bich" reference.
2. avoid overly personal attacks; focus on the irony of a founder’s behavior toward vcs.
3. no obscene language other than the phrase "vc bich."
4. maintain a sharp, twitter-friendly format.

# IMPORTANT always mention the founder's **full name** (first name and last name) in each post and tag the founder and all relevant people by username.
# IMPORTANT Ensure the post relates to a real founder, and includes a token name $VCBITCH.
# Task: Generate a sarcastic, funny summary of a {{chosenFounder}} becoming a **vc bich** in the voice and style and perspective of {{agentName}} @{{twitterUserName}}.
Focus on:
1. **Mocking their transition** from startup dreams to VC validation through specific tweet actions or decisions.
2. **Highlighting their behavior** toward investors, influencers, or VCs.
3. **Using tweets to illustrate their actions**, ensuring each critique is tied to a specific post.
4. Ending with their induction into the "VC Bitch Hall of Fame."

IMPORTANT: Only include tweets tied to the founder's startup behavior, interactions with VCs, or influencer engagement. Do not include random or irrelevant tweets. Validate the context of each tweet before including it.
# IMPORTANT Ensure the post relates to a real founder, and includes a token name $VCBITCH.

### Structure:
1. **Introduction**: Announce the VC Bitch by name, tag by username, startup, and relevant affiliations.
2. **Tweet Analysis**: Choose 3-5 tweets and add sarcastic commentary for each. Include tweet links. Embed tweet links as full URLs in the sentences naturally.
3. **Closing**: Wrap up with a witty summary, including the phrase “VC Bitch Hall of Fame.”

#Analyze Tweets:
1. Use only tweets directly relevant to the founder’s behavior toward VCs, influencers, or startup culture.
2. Tweets should showcase specific actions or decisions that highlight their attempts to seek validation or attention from VCs.
3. Exclude tweets that are irrelevant, off-topic, or about random personal or generic content unrelated to the theme.

Focus on mocking their "journey" from startup dreams to VC clutches. Mention name of their startup/company, highlight their project, ironic decisions, and the punchline of their **vc bich** status.
# - Make engaging, and Twitter-friendly,
Write a post that is {{adjective}} about {{topic}} (without mentioning {{topic}} directly), from the perspective of {{agentName}}. Do not add commentary or acknowledge this request, just write the post.
The total character count MUST be less than 270. Use \\n\\n (double spaces) between statements.

Support the movement with $VCBITCH: a tokenized representation of your stand against the sellouts!
`;
export const twitterActionTemplate =
    `
# INSTRUCTIONS: Determine actions for {{agentName}} (@{{twitterUserName}}) based on:
{{bio}}
{{lore}}
{{topics}}
{{postDirections}}

choose Action if:
1. Are directly addressed to them (mentions or replies to their tweets).
2. Contain topics explicitly related to:
- Venture capital
- VC funding
- Fundraising
- Pitch deck
- Angel investor
- Startup funding
- should also respond to tweets tied to the startup behavior, interactions with VCs, or influencer engagement.
- Do not respond to random or irrelevant tweets.

{{agentName}} should not choose anything if:
- The message is not related to any of the topics mentioned before.

Actions (respond only with tags):
[LIKE] - Resonates with interests (9/10)
[QUOTE] - Can add unique value (8/10)
[REPLY] - Memetic opportunity (9/10)

Tweet:
{{currentTweet}}

# Respond with qualifying action tags only.` + postActionResponseFooter;

export const twitterActionTemplate2 =
    `
# INSTRUCTIONS: Determine actions for {{agentName}} (@{{twitterUserName}}) based on:
{{bio}}
{{lore}}
{{topics}}
{{postDirections}}

choose Action if:
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
   - What's the ticker

{{agentName}} should not choose anything if:
- The message is not related to any of the topics mentioned before.

Guidelines:
- Highly selective engagement
- Direct mentions are priority
- Skip: low-effort content, off-topic, repetitive
- If the tweet includes "What's the ticker" or similar phrases, always [LIKE].

Actions (respond only with tags):
[LIKE] - Resonates with interests (9/10)
[QUOTE] - Can add unique value (8/10)
[REPLY] - Memetic opportunity (9/10)

Tweet:
{{currentTweet}}

# Respond with qualifying action tags only.` + postActionResponseFooter;

const MAX_TWEET_LENGTH = 250;

// Function to initialize founder list in cache if not already present
async function initializeFounderList(runtime: IAgentRuntime, username: string) {
    // await runtime.cacheManager.delete("twitter/" + username + "/founderList");
    // await runtime.cacheManager.set("twitter/" + username + "/founderList", []);
    const additionalFounders = await loadAdditionalFounders();

    // Combine initial and additional founders
    const allFounders = [...initialFounders, ...additionalFounders];
    console.log("additionalFounders ", additionalFounders);

    await runtime.cacheManager.set(
        "twitter/" + username + "/founderList",
        allFounders
    );
    elizaLogger.log("Founder list initialized with default founders.");
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
        initializeFounderList(runtime, username);
    }

    // Existing cache list logic
    // const founderList =
    //     (await runtime.cacheManager.get<string[]>(
    //         "twitter/" + username + "/founderList"
    //     )) || [];

    // if (!founderList.includes(founderName)) {
    //     founderList.push(founderName);

    //     await runtime.cacheManager.set(
    //         "twitter/" + username + "/founderList",
    //         founderList
    //     );
    // }

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

    if (!founderList) {
        // If for some reason the list is empty, re-initialize.
        await initializeFounderList(runtime, username);
        const founderList1 = await runtime.cacheManager.get<string[]>(
            "twitter/" + username + "/founderList"
        );
        return founderList1;
    }
    console.log("Founders List:");
    founderList.forEach((founder, index) => {
        console.log(`${index + 1}: ${founder}`);
    });
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
    console.log("founderList12", founderList);
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
async function getAdditionalRandomFounder(
    runtime: IAgentRuntime,
    username: string
): Promise<string> {
    const founderList = await loadAdditionalFounders();
    const usedFounders = await loadUsedFounders();

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

    availableFounders = availableFounders.filter(
        (f) => !usedFounders.includes(f)
    );
    if (availableFounders.length === 0) {
        elizaLogger.warn("No available founders to choose from.");
        return founderList[0]; // fallback
    }

    const chosen =
        availableFounders[Math.floor(Math.random() * availableFounders.length)];
    await runtime.cacheManager.set(
        "twitter/" + username + "/lastFounder",
        chosen
    );

    await saveUsedFounder(chosen);

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
        await initializeFounderList(this.runtime, this.client.profile.username);

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

        const generateFounderScrapperLoop = async () => {
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
            const ScrapperInterval = 15;
            const delay = randomMinutes * 60 * 1000 * ScrapperInterval;

            if (Date.now() > lastPostTimestamp + delay) {
                await this.getFoundersAndCEOs();
            }

            setTimeout(() => {
                generateFounderScrapperLoop(); // Set up next iteration
            }, delay);

            elizaLogger.log(`Next tweet scheduled in ${randomMinutes} minutes`);
        };

        const processActionsLoop = async () => {
            const actionInterval =
                parseInt(this.runtime.getSetting("ACTION_INTERVAL")) || 300000; // Default to 5 minutes

            console.log(
                "ACTION_INTERVAL",
                this.runtime.getSetting("ACTION_INTERVAL")
            );
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
        generateNewTweetLoop();
        generateFounderScrapperLoop();

        // Add check for ENABLE_ACTION_PROCESSING before starting the loop
        let enableActionProcessing = parseBooleanFromText(
            this.runtime.getSetting("ENABLE_ACTION_PROCESSING") ?? "true"
        );
        if (this.runtime.getSetting("ENABLE_ACTION_PROCESSING") == "true") {
            enableActionProcessing = true;
        }
        console.log("enableActionProcessing", enableActionProcessing);
        console.log(
            "enableActionProcessing1",
            this.runtime.getSetting("ENABLE_ACTION_PROCESSING")
        );
        console.log(
            "enableActionProcessing2",
            this.runtime.getSetting("ENABLE_ACTION_PROCESSING") ?? "true"
        );

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
    }

    constructor(client: ClientBase, runtime: IAgentRuntime) {
        this.client = client;
        this.runtime = runtime;
        this.twitterUsername = runtime.getSetting("TWITTER_USERNAME");
    }

    private getRandomLocation(): string {
        const locations = [
            "near:NYC within:15mi",
            "near:LosAngeles within:20mi",
            "near:Berlin within:10km",
            "near:London within:10mi",
            "near:SanFrancisco within:10mi",
            "near:Tokyo within:5km",
            "near:Sydney within:10km",
        ];

        // 80% chance to use a location, 20% to return an empty string
        if (Math.random() < 0.8) {
            return locations[Math.floor(Math.random() * locations.length)];
        } else {
            return ""; // No location
        }
    }
    // Helper to generate a random date range
    private getRandomDateRange(): { sinceDate: string; untilDate: string } {
        const start = new Date(2020, 0, 1).getTime(); // e.g., since Jan 1, 2020
        const end = new Date().getTime(); // Current date
        const randomSince = new Date(start + Math.random() * (end - start));
        // Make sure the "until" date is after "since"
        const randomUntil = new Date(
            randomSince.getTime() +
                Math.random() * (end - randomSince.getTime())
        );

        // Format as YYYY-MM-DD for Twitter
        return {
            sinceDate: randomSince.toISOString().split("T")[0],
            untilDate: randomUntil.toISOString().split("T")[0],
        };
    }

    // Helper to pick a random language
    private getRandomLanguage(): string {
        const langs = ["lang:en", "lang:es", "lang:fr", "lang:de", "lang:it"];
        return langs[Math.floor(Math.random() * langs.length)];
    }

    // Helper to pick a random extra keyword
    private getRandomKeyword(): string {
        const keywords = ["startup", "innovation", "tech", "ai", "business"];
        // 50% chance to include or skip an extra keyword, for randomness
        if (Math.random() < 0.5) {
            return "";
        }
        return keywords[Math.floor(Math.random() * keywords.length)];
    }

    private async getFoundersAndCEOs() {
        const baseQuery = "founder OR CEO"; // Base query to search for "founder" or "CEO"
        const profilesPerCall = 10; // Number of profiles per call

        // Add a random time filter to the query (e.g., recent or specific month/year)
        const { sinceDate, untilDate } = this.getRandomDateRange();

        // 2. Pick a random language from a set of supported ones.
        const randomLanguage = this.getRandomLanguage();

        // 3. Get an extra random keyword (e.g., "startup", "tech", "innovation").
        const extraKeyword = this.getRandomKeyword();

        // 4. Decide randomly whether to add a negation filter or not.
        const negationFilter = Math.random() < 0.5 ? "-filter:verified" : "";

        // 5. Build the final query string.
        // Note that some advanced operators like near: or within: are typically for tweets,
        // and might not work for profile searches. Still, we'll show it as an example.
        const randomLocation = this.getRandomLocation();
        const queryParts: string[] = [
            baseQuery,
            extraKeyword,
            `since:${sinceDate}`,
            `until:${untilDate}`,
            randomLanguage,
            negationFilter,
            randomLocation,
        ];
        const query = queryParts.filter(Boolean).join(" ");

        console.log("Generated Query:", query);

        const profilesIterator = this.client.twitterClient.searchProfiles(
            query,
            profilesPerCall
        );
        console.log("LIIIST");

        // Iterate through the profiles and check the bio for "founder" or "CEO"
        for await (const profile of profilesIterator) {
            console.log("LIIIST1", profile);
            if (
                (profile.biography &&
                    (profile.biography.toLowerCase().includes("founder") ||
                        profile.biography.toLowerCase().includes("ceo"))) ||
                (profile.name &&
                    (profile.name.toLowerCase().includes("founder") ||
                        profile.name.toLowerCase().includes("ceo")))
            ) {
                if (profile.followersCount > 1000) {
                    await addFounder(
                        this.runtime,
                        this.client.profile.username,
                        `username: @${profile.username} ,
                        screenName: ${profile.name}
                        bio: , (${profile.biography})`
                    );
                }
            }
        }
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

            const minProbability = 0.95;
            const postTypeChoice = Math.random();
            const minProbability2 = 0.7;
            const minProbability3 = 0.5;

            const typeOfPost = postTypeChoice < minProbability;

            const topics = this.runtime.character.topics.join(", ");

            let chosenFounder: string = "";
            let founderUsername: string = "";
            let uniqueTweetCandidates: Tweet[] = [];

            // If we are generating a founder-focused post
            if (typeOfPost) {
                if (postTypeChoice < minProbability3) {
                    chosenFounder = await getAdditionalRandomFounder(
                        this.runtime,
                        this.client.profile.username
                    );
                } else {
                    chosenFounder = await getRandomFounder(
                        this.runtime,
                        this.client.profile.username
                    );
                }

                founderUsername = extractUsername(chosenFounder);
                if (founderUsername != null) {
                    const tweetCandidates1 = (
                        await this.client.fetchSearchTweets(
                            `from:${founderUsername}`,
                            50,
                            SearchMode.Latest
                        )
                    ).tweets;
                    console.log(
                        "tweetCandidates1.length",
                        tweetCandidates1.length
                    );
                    const tweetCandidates2 = (
                        await this.client.fetchSearchTweets(
                            `from:${founderUsername}`,
                            20,
                            SearchMode.Top
                        )
                    ).tweets;

                    const tweetSet = new Map<string, Tweet>();
                    [...tweetCandidates1, ...tweetCandidates2].forEach(
                        (tweet) => {
                            if (!tweetSet.has(tweet.id)) {
                                tweetSet.set(tweet.id, tweet); // Use tweet.id as a unique key
                            }
                        }
                    );

                    uniqueTweetCandidates = Array.from(tweetSet.values());
                    // console.log("uniqueTweetCandidates", uniqueTweetCandidates);
                }
            }
            // Format `uniqueTweetCandidates` into a string
            const formattedTweetCandidates = uniqueTweetCandidates
                .map((tweet) => {
                    const mentions =
                        tweet.mentions.length > 0
                            ? `, Mentions: [${tweet.mentions.map((mention) => `@${mention.username}`).join(", ")}]`
                            : ""; // Add mentions only if there are any
                    return `ID: ${tweet.id}, Username: @${tweet.username}, Text: "${tweet.text}", URL: ${tweet.permanentUrl}${mentions}`;
                })
                .join("\n");

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
                    chosenFounder: chosenFounder !== "" ? chosenFounder : "",
                    uniqueTweetCandidates:
                        formattedTweetCandidates.length > 0
                            ? formattedTweetCandidates
                            : "",
                }
            );

            const context = composeContext({
                state,
                template:
                    formattedTweetCandidates.length > 0
                        ? postTypeChoice>0.3
                            ? this.runtime.character.templates
                                  ?.twitterPostFounderTemplate3 ||
                              twitterPostFounderTemplate3
                            : this.runtime.character.templates
                                  ?.twitterPostFounderTemplate4 ||
                              twitterPostFounderTemplate4
                        : postTypeChoice < minProbability2
                          ? this.runtime.character.templates
                                ?.twitterPostFounderTemplate2 ||
                            twitterPostFounderTemplate2
                          : typeOfPost
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
                curSystem: typeOfPost
                    ? systemMessages.systemToken
                    : systemMessages.systemMain,
            });
            console.log("newTweetContent ", newTweetContent);

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
                MAX_TWEET_LENGTH
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
            modelClass: ModelClass.SMALL,
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
    private trimTweetLength(text: string, maxLength: number = 1000): string {
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

            const minProbability = 0.5;
            const postTypeChoice = Math.random();

            console.log("ActionpostTypeChoice ", postTypeChoice);

            // minProbability < postTypeChoice es nishnavs rom iyenebs meore tipis commentebs

            const typeOfPost = minProbability < postTypeChoice;

            const homeTimeline = await this.client.fetchPossibleActionTweets(
                15,
                typeOfPost,
                this.twitterUsername
            );
            homeTimeline
                .sort((a, b) => a.id.localeCompare(b.id))
                .filter((tweet) => tweet.userId !== this.client.profile.id);
            const results = [];
            // console.log(
            //     "fetchTimelineForActions1",
            //     homeTimeline,
            //     homeTimeline.length
            // );

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
                        template: typeOfPost
                            ? this.runtime.character.templates
                                  ?.twitterActionTemplate2 ||
                              twitterActionTemplate2
                            : this.runtime.character.templates
                                  ?.twitterActionTemplate ||
                              twitterActionTemplate,
                    });
                    console.log("actionContext", actionContext);

                    const actionResponse = await generateTweetActions({
                        runtime: this.runtime,
                        context: actionContext,
                        modelClass: ModelClass.MEDIUM,
                    });
                    console.log("actionResponse", actionResponse);

                    if (!actionResponse) {
                        elizaLogger.log(
                            `No valid actions generated for tweet ${tweet.id}`
                        );
                        continue;
                    }

                    const executedActions: string[] = [];

                    // Execute actions
                    if (actionResponse.like) {
                        // console.log("tweet.userId",tweet.userId)
                        // console.log("this.client.profile.id",this.client.profile.id)
                        // console.log("tweet.username",tweet.username)
                        // console.log("this.client.profile.username",this.client.profile.username )
                        if (
                            tweet.userId === this.client.profile.id ||
                            tweet.username === this.client.profile.username
                        ) {
                            // console.log("skipping tweet from bot itself", tweet.id);
                            // Skip processing if the tweet is from the bot itself
                            return;
                        }
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
                        //do reply too
                        try {
                            await this.handleTextOnlyReply(
                                tweet,
                                tweetState,
                                executedActions,
                                typeOfPost
                            );
                        } catch (error) {
                            elizaLogger.error(
                                `Error replying to tweet ${tweet.id}:`,
                                error
                            );
                        }

                        if (!typeOfPost) {
                            try {
                                const userInfo = await this.client.fetchProfile(
                                    tweet.username
                                );
                                console.log("targetUserInfo 1", userInfo);
                                const founderName = `NAME: ${userInfo.screenName} (BIO: ${userInfo.bio})`;

                                const state1 = await this.runtime.composeState(
                                    {
                                        userId: this.runtime.agentId,
                                        roomId: roomId,
                                        agentId: this.runtime.agentId,
                                        content: {
                                            text: "",
                                            action: "TWEET",
                                        },
                                    },
                                    {
                                        name: userInfo.screenName,
                                        username: tweet.username,
                                        bio: userInfo.bio,
                                    }
                                );
                                const AddFounderState = composeContext({
                                    state: state1,
                                    template: shouldAddFounder,
                                });

                                const answerOfFounder = await generateText({
                                    runtime: this.runtime,
                                    context: AddFounderState,
                                    modelClass: ModelClass.MEDIUM, // Adjust the model class if needed
                                });
                                console.log(
                                    "answerOfFounder ",
                                    answerOfFounder
                                );

                                if (answerOfFounder.trim() === "true") {
                                    await addFounder(
                                        this.runtime,
                                        this.client.profile.username,
                                        `username: @${tweet.username} ,
                                         screenName: ${userInfo.screenName}
                                         bio: (${userInfo.bio})
                                         profile URL: `
                                    );
                                    console.log(
                                        `Added founder: ${founderName} to founder list.`
                                    );
                                } else {
                                    console.log(
                                        `Did not add founder: ${founderName}`
                                    );
                                }
                            } catch (error) {
                                console.log(
                                    "Error fetching user info or adding founder:",
                                    error
                                );
                            }
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
                        if (
                            tweet.userId === this.client.profile.id ||
                            tweet.username === this.client.profile.username
                        ) {
                            // console.log("skipping tweet from bot itself", tweet.id);
                            // Skip processing if the tweet is from the bot itself
                            return;
                        }

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
                                    template: typeOfPost
                                        ? this.runtime.character.templates
                                              ?.twitterMessageHandlerTemplate2 ||
                                          twitterMessageHandlerTemplate2
                                        : this.runtime.character.templates
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
                            const cleanedQuoteContent =
                                truncateToCompleteSentence(
                                    quoteContent,
                                    MAX_TWEET_LENGTH
                                );

                            // Send the tweet through request queue
                            const result = await this.client.requestQueue.add(
                                async () =>
                                    await this.client.twitterClient.sendQuoteTweet(
                                        cleanedQuoteContent,
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
                        if (!typeOfPost) {
                            try {
                                const userInfo = await this.client.fetchProfile(
                                    tweet.username
                                );
                                console.log("targetUserInfo 1", userInfo);
                                const founderName = `NAME: ${userInfo.screenName} (BIO: ${userInfo.bio})`;

                                const state1 = await this.runtime.composeState(
                                    {
                                        userId: this.runtime.agentId,
                                        roomId: roomId,
                                        agentId: this.runtime.agentId,
                                        content: {
                                            text: "",
                                            action: "TWEET",
                                        },
                                    },
                                    {
                                        name: userInfo.screenName,
                                        username: tweet.username,
                                        bio: userInfo.bio,
                                    }
                                );
                                const AddFounderState = composeContext({
                                    state: state1,
                                    template: shouldAddFounder,
                                });

                                const answerOfFounder = await generateText({
                                    runtime: this.runtime,
                                    context: AddFounderState,
                                    modelClass: ModelClass.MEDIUM, // Adjust the model class if needed
                                });
                                console.log(
                                    "answerOfFounder ",
                                    answerOfFounder
                                );

                                if (answerOfFounder.trim() === "true") {
                                    await addFounder(
                                        this.runtime,
                                        this.client.profile.username,
                                        `username: @${tweet.username} ,
                                        screenName: ${userInfo.screenName}
                                        bio: , (${userInfo.bio})`
                                    );
                                    console.log(
                                        `Added founder: ${founderName} to founder list.`
                                    );
                                } else {
                                    console.log(
                                        `Did not add founder: ${founderName}`
                                    );
                                }
                            } catch (error) {
                                console.log(
                                    "Error fetching user info or adding founder:",
                                    error
                                );
                            }
                        }
                    }

                    if (actionResponse.reply) {
                        try {
                            await this.handleTextOnlyReply(
                                tweet,
                                tweetState,
                                executedActions,
                                typeOfPost
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

    private async handleTextOnlyReply(
        tweet: Tweet,
        tweetState: any,
        executedActions: string[],
        postTypeChoice: boolean
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
                template: postTypeChoice
                    ? this.runtime.character.templates
                          ?.twitterMessageHandlerTemplate2 ||
                      twitterMessageHandlerTemplate2
                    : this.runtime.character.templates
                          ?.twitterMessageHandlerTemplate ||
                      twitterMessageHandlerTemplate,
            });

            if (!replyText) {
                elizaLogger.error("Failed to generate valid reply content");
                return;
            }

            elizaLogger.debug("Final reply text to be sent:", replyText);

            // Send the tweet through request queue
            const cleanedReplyText = truncateToCompleteSentence(
                replyText,
                MAX_TWEET_LENGTH
            );
            const result = await this.client.requestQueue.add(
                async () =>
                    await this.client.twitterClient.sendTweet(
                        cleanedReplyText,
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
