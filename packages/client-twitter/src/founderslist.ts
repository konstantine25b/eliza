import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

export const initialFounders = [
    "Oisin Hanrahan (Handy)",
    "Umang Dua (Handy)",
    "Adi Tatarko (Houzz)",
    "Alon Cohen (Houzz)",
    "Joshua Reeves (Gusto)",
    "Edward Kim (Gusto)",
    "Tomer London (Gusto)",
    "Henry Ward (Carta)",
    "Jack Conte (Patreon)",
    "Sam Yam (Patreon)",
    "Emily Weiss (Glossier)",
    "Dylan Field (Figma)",
    "Ivan Zhao (Notion)",
    "Simon Last (Notion)",
    "Chris Britt (Chime)",
    "Ryan King (Chime)",
    "Zach Perret (Plaid)",
    "William Hockey (Plaid)",
    "Apoorva Mehta (Instacart)",
    "Max Mullen (Instacart)",
    "Brandon Leonardo (Instacart)",
    "Ryan Petersen (Flexport)",
    "Simón Borrero (Rappi)",
    "Sebastian Mejia (Rappi)",
    "Felipe Villamarin (Rappi)",
    "Chris Comparato (Toast)",
    "Aman Narang (Toast)",
    "Steve Fredette (Toast)",
    "Jonathan Grimm (Toast)",
    "Henrique Dubugras (Brex)",
    "Pedro Franceschi (Brex)",
    "Alex Timm (Root)",
    "Dan Manges (Root)",
    "Michael Acton Smith (Calm)",
    "Alex Tew (Calm)",
    "Vishal Garg (Better.com)",
    "Daniel Schreiber (Lemonade)",
    "Shai Wininger (Lemonade)",
    "Harry Hurst (Pipe)",
    "Josh Mangel (Pipe)",
    "Zain Allarakhia (Pipe)",
    "Andrey Khusid (Miro)",
    "Brian Long (Attentive)",
    "Andrew Jones (Attentive)",
    "Ian Crosby (Bench)",
    "Jordan Menashy (Bench)",
    "Pavel Rodionov (Bench)",
    "Adam Saint (Bench)",
    "Ryan Breslow (Bolt)",
    "Payal Kadakia (ClassPass)",
    "Mary Biggins (ClassPass)",
    "Sanjiv Sanghavi (ClassPass)",
    "Daphne Koller (Coursera)",
    "Andrew Ng (Coursera)",
    "Jeff Maggioncalda (Coursera)",
    "Eren Bali (Udemy)",
    "Gagan Biyani (Udemy)",
    "Oktay Caglar (Udemy)",
    "Luis von Ahn (Duolingo)",
    "Severin Hacker (Duolingo)",
    "Andrew Dudum (Hims & Hers)",
    "James Reinhart (ThredUp)",
    "Oliver Lubin (ThredUp)",
    "Chris Homer (ThredUp)",
    "Jennifer Hyman (Rent the Runway)",
    "Jennifer Fleiss (Rent the Runway)",
    "Marco Zappacosta (Thumbtack)",
    "Jonathan Swanson (Thumbtack)",
    "Sander Daniels (Thumbtack)",
    "Ryan Holmes (Hootsuite)",
    "Dario Meli (Hootsuite)",
    "David Tedman (Hootsuite)",
    "Ali Parsa (Babylon Health)",
    "Nima Ghamsari (Blend)",
    "Erin Collard (Blend)",
    "Eugene Marinelli (Blend)",
    "Rosco Hill (Blend)",
    "Seth Sternberg (Honor)",
    "Sandy Jen (Honor)",
    "Cameron Ring (Honor)",
    "Jennifer Fitzgerald (Policygenius)",
    "Francois de Lame (Policygenius)",
    "Joshua Viner (Wag!)",
    "Brandon Schwartz (Wag!)",
    "Jonathan Viner (Wag!)",
    "Alex Chesterman (Cazoo)",
    "Jeff Cavins (Outdoorsy)",
    "Jen Young (Outdoorsy)",
    "Steven Gutentag (Keeps)",
    "Demetri Karagas (Keeps)",
    "Jonathan Neman (Sweetgreen)",
    "Nicolas Jammet (Sweetgreen)",
    "Nathaniel Ru (Sweetgreen)",
    "Jim VandeHei (Axios)",
    "Mike Allen (Axios)",
    "Roy Schwartz (Axios)",
    "Elan Babchuck (BentoBox)",
    "Krystle Mobayeni (Bentobox)",
    "Heather Hasson (Figs)",
    "Trina Spear (Figs)",
    "Wade Foster (Zapier)",
    "Bryan Helmig (Zapier)",
    "Mike Knoop (Zapier)",
    "Adora Cheung (Homejoy)",
    "Aaron Cheung (Homejoy)",
    "Leah Busque (TaskRabbit)",
    "Stacy Brown-Philpot (TaskRabbit, former CEO)",
    "Noah Ready-Campbell (Built Robotics)",
    "Andrew Boggeri (Built Robotics)",
    "Wade Eyerly (Surf Air)",
    "David Eyerly (Surf Air)",
    "Tristan Walker (Walker & Company)",
    "Christina Cacioppo (Vanta)",
    "Jake Schneider (Vanta)",
    "Heidi Zak (ThirdLove)",
    "David Spector (ThirdLove)",
    "Jess Lee (Polyvore)",
    "Pasha Sadri (Polyvore)",
    "Victoria Ransom (Wildfire Interactive)",
    "Alain Chuard (Wildfire Interactive)",
    "Ryan Hoover (Product Hunt)",
    "Jules Pieri (The Grommet)",
    "Joanne Domeniconi (The Grommet)",
    "Dave Gilboa (Warby Parker)",
    "Neil Blumenthal (Warby Parker)",
    "Andrew Hunt (Warby Parker)",
    "Jeffrey Raider (Warby Parker, also Harry’s)",
    "Andy Katz-Mayfield (Harry’s)",
    "Michael Preysman (Everlane)",
    "Jesse Genet (Lumi)",
    "Stephan Ango (Lumi)",
    "Shan-Lyn Ma (Zola)",
    "Nobu Nakaguchi (Zola)",
    "Kevin Ryan (Gilt, Business Insider - known serial entrepreneur)",
    "Dwight Crow (Whisper)",
    "Michael Heyward (Whisper)",
    "Julia Hartz (Eventbrite)",
    "Kevin Hartz (Eventbrite)",
    "Renaud Visage (Eventbrite)",
    "Patrick Brown (Impossible Foods)",
    "Josh Tetrick (Eat Just)",
    "Ilir Sela (Slice)",
    "Carisa Miklusak (tilr)",
    "Matt O'Connor (AdQuick)",
    "Maren Kate Donovan (Zirtual)",
    "Bo Fishback (Zaarly)",
    "Eric Migicovsky (Pebble)",
    "Kathryn Minshew (The Muse)",
    "Alexandra Cavoulacos (The Muse)",
    "Mathilde Collin (Front)",
    "Laurent Perrin (Front)",
    "Keith McCarty (Eaze)",
    "Carol Reiley (Drive.ai)",
    "Sameep Tandon (Drive.ai)",
    "Richard Craib (Numerai)",
    "Andrew Mason (Groupon, former CEO/founder, not widely considered a billionaire)",
    "Ken Lin (Credit Karma, founder & former CEO)",
    "Nichole Mustard (Credit Karma)",
    "Jon Stein (Betterment)",
    "Eli Broverman (Betterment)",
    "Noah Kerner (Acorns)",
    "Jeff Cruttenden (Acorns)",
    "Walter Cruttenden (Acorns)",
    "Sarah Leary (Nextdoor)",
    "Nirav Tolia (Nextdoor)",
    "Prakash Janakiraman (Nextdoor)",
    "David Wiesen (Nextdoor)",
    "T.J. Parker (PillPack)",
    "Elliot Cohen (PillPack)",
    "Manny Medina (Outreach)",
    "Andrew Kinzer (Outreach)",
    "Gordon Hempton (Outreach)",
    "Michael Rosenbaum (Catalyte)",
    "Lindsay Kaplan (Chief)",
    "Carolyn Childers (Chief)",
    "Jessica Ewing (Literati)",
    "Eoghan McCabe (Intercom)",
    "Des Traynor (Intercom)",
    "Ciaran Lee (Intercom)",
    "David Barrett (Expensify)",
    "Shoaib Makani (KeepTruckin, now Motive)",
    "Obaid Khan (KeepTruckin)",
    "Jessica Mah (inDinero)",
    "Andy Su (inDinero)",
    "Justin Kan (Atrium, previously Twitch co-founder—while wealthy, not broadly cited as a billionaire)",
    "Robin Chan (Operator)",
    "Garrett Kimball (Operator)",
    "Sergey Faguet (Wikimart)",
    "Jared Friedman (Scribd)",
    "Trip Adler (Scribd)",
    "Tikhon Bernstam (Scribd, Parse)",
    "Shafqat Islam (NewsCred)",
    "Ira Winker (NewsCred)",
    "Russ Heddleston (DocSend)",
    "Alyssa Ravasio (Hipcamp)",
    "Tim Young (Hipcamp)",
    "Rich Fulop (Brooklinen)",
    "Vicki Fulop (Brooklinen)",
    "Gregg Spiridellis (JibJab)",
    "Evan Spiridellis (JibJab)",
    "Nicolas Dessaigne (Algolia)",
    "Julien Lemoine (Algolia)",
    "Megan O'Connor (Clark)",
    "Carly Strife (BarkBox)",
    "Matt Meeker (BarkBox)",
    "Henrik Werdelin (BarkBox)",
    "Noah Dentzel (Nomad)",
    "Brian Hahn (Nomad)",
    "Timo Rein (Pipedrive)",
    "Urmas Purde (Pipedrive)",
    "Ragnar Sass (Pipedrive)",
    "Martin Henk (Pipedrive)",
    "Daniel Yanisse (Checkr)",
    "Arnaud Weber (Checkr)",
    "Jon Steinberg (Cheddar)",
    "Marcela Sapone (Hello Alfred)",
    "Jessica Beck (Hello Alfred)",
    "Dylan Serota (Lyra Health)",
    "Dena Bravata (Lyra Health)",
    "David Ebersman (Lyra Health)",
    "Rohan Pavuluri (Upsolve)",
    "Jonathan Petts (Upsolve)",
    "Edith Harbaugh (LaunchDarkly)",
    "John Kodumal (LaunchDarkly)",
    "Melanie Gordon (Tapingo)",
    "Daniel Almog (Tapingo)",
    "Udi Geva (Tapingo)",
    "Hayley Barna (Birchbox)",
    "Katia Beauchamp (Birchbox)",
    "Jacob DeGeer (iZettle)",
    "Magnus Nilsson (iZettle)",
    "Deepak Rao (X1 Card)",
    "Siddharth Batra (X1 Card)",
    "Michelle Zatlyn (Cloudflare)",
    "Matthew Prince (Cloudflare)",
    "Lee Holloway (Cloudflare)",
    "Peter Reinhardt (Segment)",
    "Calvin French-Owen (Segment)",
    "Ilya Volodarsky (Segment)",
    "Ian White (ChartHop)",
    "Ellen Chisa (Dark)",
    "Paul Biggar (Dark)",
    "Jeff Wald (WorkMarket)",
    "Jeffrey Leventhal (WorkMarket)",
    "Dan Lewis (Convoy)",
    "Grant Goodale (Convoy)",
    "Alex Turnbull (GrooveHQ)",
    "Chris Clark (GrooveHQ)",
    "Danny Shader (PayNearMe)",
    "Rachel Drori (Daily Harvest)",
    "Kyle Taylor (The Penny Hoarder)",
    "Dan Teran (Managed by Q)",
    "Saman Rahmanian (Ro)",
    "Rob Schutz (Ro)",
    "Karan Mehta (Ro)",
    "Gregg Brockway (Chairish)",
    "Eric Grosse (Chairish)",
    "Dave Ferguson (Nuro)",
    "Jiajun Zhu (Nuro)",
    "Christine Moseley (Full Harvest)",
    "Tammy Sun (Carrot Fertility)",
    "Tessa Price (Carrot Fertility)",
    "Tristan Handy (dbt Labs)",
    "Drew Banin (dbt Labs)",
    "Christine T. Nguyen (Kindbody)",
    "Gina Bartasi (Kindbody)",
    "Eduardo Vivas (Bright)",
    "Nathalie Molina Niño (Brava Investments)",
    "Al Goldstein (Avant)",
    "John Sun (Avant)",
    "Garrett Camp (Uber)",
    "Travis Kalanick (Uber)",
    "Ryan Graves (Uber)",
    "Brian Chesky (Airbnb)",
    "Joe Gebbia (Airbnb)",
    "Nathan Blecharczyk (Airbnb)",
    "Evan Spiegel (Snapchat)",
    "Bobby Murphy (Snapchat)",
    "Reggie Brown (Snapchat)",
    "Drew Houston (Dropbox)",
    "Arash Ferdowsi (Dropbox)",
    "Jan Koum (WhatsApp)",
    "Brian Acton (WhatsApp)",
    "Kevin Systrom (Instagram)",
    "Mike Krieger (Instagram)",
    "Ben Silbermann (Pinterest)",
    "Evan Sharp (Pinterest)",
    "Paul Sciarra (Pinterest)",
    "Stewart Butterfield (Slack)",
    "Cal Henderson (Slack)",
    "Patrick Collison (Stripe)",
    "John Collison (Stripe)",
    "Tony Xu (DoorDash)",
    "Stanley Tang (DoorDash)",
    "Andy Fang (DoorDash)",
    "Evan Williams (Twitter, Medium)",
    "Biz Stone (Twitter)",
    "Jack Dorsey (Twitter, Square)",
    "Noah Glass (Twitter)",
    "Reid Hoffman (LinkedIn)",
    "Allen Blue (LinkedIn)",
    "Konstantin Guericke (LinkedIn)",
    "Eric Ly (LinkedIn)",
    "Jean-Luc Vaillant (LinkedIn)",
    "Elon Musk (Tesla, SpaceX, Neuralink, OpenAI)",
    "JB Straubel (Tesla)",
    "Marc Tarpenning (Tesla)",
    "Martin Eberhard (Tesla)",
    "Sergey Brin (Google)",
    "Eric Schmidt (Google, early CEO)",
    "Steve Wozniak (Apple)",
    "Ronald Wayne (Apple)",
    "Eduardo Saverin (Facebook)",
    "Andrew McCollum (Facebook)",
    "Dustin Moskovitz (Facebook, Asana)",
    "Chris Hughes (Facebook)",
    "Adam D’Angelo (Quora)",
    "Charlie Cheever (Quora)",
    "Garrett Smallwood (Wag!)",
    "David Marcus (Zong, former PayPal exec)",
    "Peter Thiel (PayPal, Palantir)",
    "Max Levchin (PayPal, Affirm)",
    "Reid Hoffman (PayPal, LinkedIn)",
    "Elon Musk (PayPal, SpaceX, Tesla)",
    "Luke Nosek (PayPal)",
    "Ken Howery (PayPal)",
    "David Sacks (PayPal, Yammer, Zenefits)",
    "Roelof Botha (PayPal, Sequoia Capital)",
    "Chad Hurley (YouTube)",
    "Steve Chen (YouTube)",
    "Jawed Karim (YouTube)",
    "Daniel Ek (Spotify)",
    "Martin Lorentzon (Spotify)",
    "Sebastian Siemiatkowski (Klarna)",
    "Niklas Adalberth (Klarna)",
    "Victor Jacobsson (Klarna)",
    "Dara Khosrowshahi (Expedia, Uber CEO)",
    "Pierre Omidyar (eBay)",
    "Jerry Yang (Yahoo!)",
    "David Filo (Yahoo!)",
    "Andrew Jassy (AWS, Amazon CEO)",
    "Marc Andreessen (Netscape, Andreessen Horowitz)",
    "Ben Horowitz (Andreessen Horowitz)",
    "Fred Wilson (Union Square Ventures)",
    "Chris Dixon (Andreessen Horowitz)",
    "Paul Graham (Y Combinator, Viaweb)",
    "Jessica Livingston (Y Combinator)",
    "Trevor Blackwell (Y Combinator)",
    "Robert Tappan Morris (Y Combinator)",
    "Sundar Pichai (Google CEO)",
    "Parag Agrawal (Twitter CEO)",
    "Satya Nadella (Microsoft CEO)",
    "Shantanu Narayen (Adobe CEO)",
    "Arvind Krishna (IBM CEO)",
    "Ginni Rometty (IBM, former CEO)",
    "Susan Wojcicki (YouTube CEO)",
    "Marissa Mayer (Yahoo!, Google)",
    "Whitney Wolfe Herd (Bumble)",
    "Andrey Andreev (Badoo)",
    "Sean Rad (Tinder)",
    "Jonathan Badeen (Tinder)",
    "Justin Mateen (Tinder)",
    "Joe Munoz (Tinder)",
    "Nathaniel Motte (Tinder)",
    "Alexis Ohanian (Reddit)",
    "Steve Huffman (Reddit)",
    "Vitalik Buterin (Ethereum)",
    "Charles Hoskinson (Cardano)",
    "Gavin Wood (Polkadot, Ethereum)",
    "Joseph Lubin (ConsenSys, Ethereum)",
    "Brad Garlinghouse (Ripple)",
    "Brian Armstrong (Coinbase)",
    "Fred Ehrsam (Coinbase, Paradigm)",
    "Changpeng Zhao (Binance)",
    "Tyler Winklevoss (Gemini)",
    "Cameron Winklevoss (Gemini)",
    "Sam Bankman-Fried (FTX, Alameda Research)",
    "Caroline Ellison (Alameda Research)",
    "Anatoly Yakovenko (Solana)",
    "Raj Gokal (Solana)",
    "Hayden Adams (Uniswap)",
    "Robert Leshner (Compound)",
    "Stani Kulechov (Aave)",
    "Muneeb Ali (Stacks)",
    "Dan Larimer (EOS, Steemit)",
    "Brendan Blumer (EOS, Block.one)",
    "Jesse Powell (Kraken)",
    "Olaf Carlson-Wee (Polychain Capital)",
    "Naval Ravikant (AngelList)",
    "Babak Nivi (AngelList)",
    "Nikhil Basu Trivedi (AngelList)",
    "Katerina Fake (Flickr, Hunch)",
    "Stewart Butterfield (Flickr, Slack)",
    "Caterina Fake (Hunch, Flickr)",
    "Rashmi Sinha (SlideShare)",
    "Jonathan Boutelle (SlideShare)",
    "Aneesh Chopra (CareJourney)",
    "Rishabh Agarwal (GharPay, innovator in payment tech)",
    "Divya Gokulnath (Byju's)",
    "Byju Raveendran (Byju's)",
    "Steve Blank (Startup Methodology Pioneer)",
    "Eric Ries (Lean Startup)",
    "Ash Maurya (Running Lean)",
    "Jason Fried (Basecamp)",
    "David Heinemeier Hansson (Basecamp, Ruby on Rails)",
    "Brian Chesky (Airbnb)",
    "Nathan Blecharczyk (Airbnb)",
    "Joe Gebbia (Airbnb)",
    "Marc Benioff (Salesforce)",
    "Parker Harris (Salesforce)",
    "Frank van Veenendaal (Salesforce)",
    "George Hu (Salesforce)",
    "Ryan Holmes (Hootsuite)",
    "Dario Meli (Hootsuite)",
    "David Tedman (Hootsuite)",
    "Stuart Landesberg (Grove Collaborative)",
    "Jordan Savage (Grove Collaborative)",
    "Adam Lowry (Ripple Foods)",
    "Neil Renninger (Ripple Foods)",
    "Ben Hindman (Splash)",
    "Brett Boskoff (Splash)",
    "Steve Martocci (Splice)",
    "Matt Aimonetti (Splice)",
    "Robert Luo (Mi Terro)",
    "Harj Taggar (Triplebyte)",
    "Guillaume Luccisano (Triplebyte)",
    "Ammon Bartram (Triplebyte)",
    "Steven Galanis (Cameo)",
    "Martin Blencowe (Cameo)",
    "Devon Townsend (Cameo)",
    "Chris Ovitz (Workpop)",
    "Reed Shaffner (Workpop)",
    "Daniel Gulati (FashionStake)",
    "Alexa von Tobel (LearnVest)",
    "Deena Varshavskaya (Wanelo)",
    "Maria Zhang (Wanelo)",
    "Eric Setton (Tango)",
    "Uri Raz (Tango)",
    "Derek Steer (Mode)",
    "Benn Stancil (Mode)",
    "Josh Ferguson (Mode)",
    "Alex Mather (The Athletic)",
    "Adam Hansmann (The Athletic)",
    "Jason Citron (Discord)",
    "Stanislav Vishnevskiy (Discord)",
    "Eugenio Pace (Auth0)",
    "Matias Woloski (Auth0)",
    "Jyoti Bansal (AppDynamics, Harness)",
    "Rishi Bhargava (Demisto)",
    "Slavik Markovich (Demisto)",
    "Jason Kelly (Ginkgo Bioworks)",
    "Reshma Shetty (Ginkgo Bioworks)",
    "Barry Canton (Ginkgo Bioworks)",
    "Austin Che (Ginkgo Bioworks)",
    "Tom Knight (Ginkgo Bioworks)",
    "Steve Huffman (Reddit)",
    "Alexis Ohanian (Reddit)",
    "Aaron Easterly (Rover)",
    "Greg Gottesman (Rover)",
    "Philip Kimmey (Rover)",
    "Eric Wu (Opendoor)",
    "Ian Wong (Opendoor)",
    "JD Ross (Opendoor)",
    "Brandon Krieg (Stash)",
    "Ed Robinson (Stash)",
    "Stephen Dash (Credible)",
    "Noah Lichtenstein (Foundation Labs)",
    "Bryce Maddock (TaskUs)",
    "Jaspar Weir (TaskUs)",
    "Aaron Rasmussen (MasterClass)",
    "David Rogier (MasterClass)",
    "James Park (Fitbit)",
    "Eric Friedman (Fitbit)",
    "Nick Axelrod (Into The Gloss / Glossier)",
    "Russell Glass (Ginger, now Headspace Health)",
    "Rohan Seth (Clubhouse)",
    "Paul Davison (Clubhouse)",
    "Jared Hecht (Fundera, previously GroupMe)",
    "Tom X. Lee (One Medical)",
    "Ragy Thomas (Sprinklr)",
    "Renaud Laplanche (Lending Club)",
    "Sam Shank (HotelTonight)",
    "Jared Simon (HotelTonight)",
    "Mukesh Bansal (CureFit)",
    "Ankit Nagori (CureFit)",
    "Shintaro Yamada (Mercari)",
    "Oscar Pierre (Glovo)",
    "Sacha Michaud (Glovo)",
    "Markus Villig (Bolt - Europe)",
    "Tom Blomfield (Monzo)",
    "Jonas Huckestein (Monzo)",
    "Paul Rippon (Monzo)",
    "Gary Dolman (Monzo)",
    "Anne Boden (Starling Bank)",
    "Hiroki Takeuchi (GoCardless)",
    "Matt Robinson (GoCardless)",
    "Danae Ringelmann (Indiegogo)",
    "Slava Rubin (Indiegogo)",
    "Eric Schell (Indiegogo)",
    "James Freeman (Blue Bottle Coffee)",
    "Philip Krim (Casper)",
    "Neil Parikh (Casper)",
    "Luke Sherwin (Casper)",
    "Jeff Chapin (Casper)",
    "Tim Brown (Allbirds)",
    "Joey Zwillinger (Allbirds)",
    "Mike Farley (Tile)",
    "Nick Evans (Tile)",
    "Afton Vechery (Modern Fertility)",
    "Carly Leahy (Modern Fertility)",
    "Irving Fain (Bowery Farming)",
    "Jason Cozens (Glint)",
    "Ben Davies (Glint)",
    "Keller Rinaudo (Zipline)",
    "William Hetzler (Zipline)",
    "Max Levchin (Affirm)",
    "Jeremy Johnson (Andela)",
    "Christina Sass (Andela)",
    "Iyinoluwa Aboyeji (Andela)",
    "Ian Carnevale (Andela)",
    "Olugbenga Agboola (Flutterwave)",
    "Matt Flannery (Branch International)",
    "Assaf Wand (Hippo)",
    "Eyal Navon (Hippo)",
    "Blake Murray (Divvy)",
    "Alex Bean (Divvy)",
    "Alex Solomon (PagerDuty)",
    "Andrew Miklas (PagerDuty)",
    "Baskar Puvanathasan (PagerDuty)",
    "Isaac Saldana (SendGrid)",
    "Jose Lopez (SendGrid)",
    "Tim Jenkins (SendGrid)",
    "Andy Rachleff (Wealthfront)",
    "Dan Carroll (Wealthfront)",
    "Peter Arvai (Prezi)",
    "Peter Halacsy (Prezi)",
    "Adam Somlai-Fischer (Prezi)",
    "Sam Chaudhary (ClassDojo)",
    "Liam Don (ClassDojo)",
    "Toby Sun (Lime)",
    "Brad Bao (Lime)",
    "Travis VanderZanden (Bird)",
    "Stephen Hawthornthwaite (Rothy’s)",
    "Roth Martin (Rothy’s)",
    "Steph Korey (Away)",
    "Jen Rubio (Away)",
    "Clark Valberg (InVision)",
    "Casey Fenton (Couchsurfing)",
    "Sebastian Thrun (Udacity)",
    "Naval Ravikant (AngelList)",
    "Babak Nivi (AngelList)",
    "Perry Chen (Kickstarter)",
    "Yancey Strickler (Kickstarter)",
    "Charles Adler (Kickstarter)",
];

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the path to additionalFounders.json
const ADDITIONAL_FOUNDERS_PATH = path.resolve(
    __dirname,
    "../src/data/additionalFounders.json"
);

console.log("Resolved Path:", ADDITIONAL_FOUNDERS_PATH);

// Function to load additional founders
export async function loadAdditionalFounders(): Promise<string[]> {
    try {
        const data = await fs.readFile(ADDITIONAL_FOUNDERS_PATH, "utf8");
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return an empty array
        console.log(error);
        return [];
    }
}

// Function to save additional founders
export async function saveAdditionalFounder(founder: string) {
    const additionalFounders = await loadAdditionalFounders();

    // Only add if not already in the list
    if (!additionalFounders.includes(founder)) {
        additionalFounders.push(founder);

        await fs.writeFile(
            ADDITIONAL_FOUNDERS_PATH,
            JSON.stringify(additionalFounders, null, 2)
        );
    }
}
