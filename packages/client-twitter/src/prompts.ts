export const shouldAddStartup = `
# INSTRUCTIONS:
You are an intelligent assistant tasked with determining if a Twitter user represents a "startup" or a "company."

You will receive:
- A user's bio.
- The top 50 tweets about the company or from the user's account.

Analyze the bio and the tweet content. Decide if the user (or entity) is clearly a startup or company. This could be indicated by references to product development, founding team, funding, or explicit statements about being a company/startup.

Your response must be strictly limited to one of the following words:
- "true"  (if the user or entity is indeed a startup or company)
- "false" (if there is no indication of the user or entity being a startup or company)

Do not include any additional words, explanations, or formatting.

# FORMAT:
Input:
Bio: [User's bio]
Tweets: [Top 50 tweets about this company or user]

Output:
true or false

# EXAMPLES:
Input:
Bio: Building the next-gen AI solutions for finance. Recently raised seed funding.
Tweets:
1) "Excited to launch our first MVP."
2) "Hiring engineers to grow our AI platform."
...
<total 50 tweets>

Output:
true

# EVALUATE:
Evaluate the following user/company based on their bio and top 50 tweets:

Bio: {{bio}}
Tweets: {{tweets}}

# RESPONSE:
`;

export const startupSumUpOld = `
# INSTRUCTIONS:
You are an intelligent assistant tasked with analyzing a startup's Twitter account.

You will receive:
- The oldest 50 tweets from the startup's account.

From these oldest 50 tweets, you must write a detailed summary (300-400 words) covering:
1. What the startup is doing (its product/service and mission).
2. What problem(s) they aim to solve or the market need they address.
3. Any notable achievements or milestones from these older tweets (e.g., funding announcements, product launches, partnerships).
4. Include 2-3 of these specific tweets (with their tweet IDs) that best illustrate the startup’s core activities or goals.

### Important Formatting Requirements:
- The summary must be 300-400 words in total.
- After the summary, provide 2-3 tweet references with the format:
  - "Tweet Reference: [TweetID] - [Tweet Text]"
- Maintain clarity and cohesion. Avoid extraneous information or speculation.

# FORMAT:
Input:
Oldest 50 Tweets:
1) Tweet ID: [ID], Text: [Tweet text]
2) Tweet ID: [ID], Text: [Tweet text]
...
50) Tweet ID: [ID], Text: [Tweet text]

Output (300-400 words summary + 2-3 tweet references):
[Summary here...300-400 words...]
Tweet Reference: [ID] - [Tweet Text]
Tweet Reference: [ID] - [Tweet Text]
(Optionally a third reference)

# EXAMPLE (shortened illustration):
Input:
1) Tweet ID: 12345, Text: "We just launched our MVP to tackle e-waste."
2) Tweet ID: 67890, Text: "Thrilled to join the Green Tech Accelerator!"
...

Output:
"GreenWare is a sustainability-focused startup founded to reduce electronic waste through recycling and refurbished electronics. Over their initial months..."
Tweet Reference: 12345 - "We just launched our MVP to tackle e-waste."
Tweet Reference: 67890 - "Thrilled to join the Green Tech Accelerator!"

# EVALUATE:
Analyze the oldest 50 tweets from this startup and produce the summary:

Oldest 50 Tweets:
{{tweets}}

# RESPONSE:
`;

export const startupSumUpNew = `
# INSTRUCTIONS:
You are an intelligent assistant tasked with analyzing a startup's latest 50 tweets and its bio.

You will receive:
- The startup's account bio.
- The latest 50 tweets from the startup's account.

From these inputs, produce a 300-400 word summary covering:
1. What the startup is currently doing or focusing on.
2. The problems they aim to solve or the vision they are pushing now.
3. Any new updates, announcements, or directions evident in these recent tweets (e.g., product updates, funding rounds, partnerships, or expansions).
4. Include 2-3 tweet references (with IDs) that showcase the most interesting or defining moments in these recent updates.

### Important Formatting Requirements:
- The summary must be 300-400 words in total.
- After the summary, provide 2-3 tweet references with the format:
  - "Tweet Reference: [TweetID] - [Tweet Text]"
- Maintain clarity and cohesion. Avoid irrelevant details or speculation.

# FORMAT:
Input:
Bio: [Startup's bio]
Latest 50 Tweets:
1) Tweet ID: [ID], Text: [Tweet text]
2) Tweet ID: [ID], Text: [Tweet text]
...
50) Tweet ID: [ID], Text: [Tweet text]

Output (300-400 words summary + 2-3 tweet references):
[Summary here...300-400 words...]
Tweet Reference: [ID] - [Tweet Text]
Tweet Reference: [ID] - [Tweet Text]

# EXAMPLE (shortened illustration):
Input:
Bio: "Empowering online retailers with AI-driven logistics."
Latest 50 Tweets:
1) Tweet ID: 11111, Text: "We just rolled out our new shipping algorithm!"
2) Tweet ID: 22222, Text: "Thanks @BigCommerce for featuring our solution!"
...

Output:
"LogistiCore's bio states they aim to revolutionize online retail with AI-driven logistics. In their recent tweets, they've mentioned a major shipping..."
Tweet Reference: 11111 - "We just rolled out our new shipping algorithm!"
Tweet Reference: 22222 - "Thanks @BigCommerce for featuring our solution!"

# EVALUATE:
Analyze the startup's bio and the latest 50 tweets to create the summary:

Bio: {{bio}}
Latest 50 Tweets:
{{tweets}}

# RESPONSE:
`;
