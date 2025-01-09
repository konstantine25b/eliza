import { SearchMode } from "agent-twitter-client";
import {
    composeContext,
    generateText,
    IAgentRuntime,
    ModelClass,
    stringToUuid,
} from "@elizaos/core";
import { ClientBase } from "../../base.ts";
import { shouldAddStartup } from "../templatesT/bioTemplate.ts";
import {
    getRandomLanguage,
    getRandomDataRange,
    getRandomKeyword,
    getRandomLocation,
} from "../scraping/main.ts";

export class bioScraping {
    client: ClientBase;
    runtime: IAgentRuntime;
    twitterUsername: string;

    async isStartup() {
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

        const startupsIterator = this.client.twitterClient.searchProfiles(
            query,
            profilesPerCall
        );

        for await (const profile of startupsIterator) {
            try {
                const userInfo = await this.client.fetchProfile(
                    profile.username
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
                        username: profile.username,
                        bio: userInfo.bio,
                    }
                );
                const AddFounderState = composeContext({
                    state: state1,
                    template: shouldAddStartup,
                });

                const answerOfFounder = await generateText({
                    runtime: this.runtime,
                    context: AddFounderState,
                    modelClass: ModelClass.MEDIUM, // Adjust the model class if needed
                });
                console.log("answerOfFounder ", answerOfFounder);

                // if (answerOfFounder.trim() === "true") {
                //     await addFounder(
                //         this.runtime,
                //         this.client.profile.username,
                //         `username: @${profile.username} ,
                //         screenName: ${userInfo.screenName}
                //         bio: (${userInfo.bio})
                //         profile URL: `
                //     );
                //     console.log(
                //         `Added founder: ${founderName} to founder list.`
                //     );
                // } else {
                //     console.log(`Did not add founder: ${founderName}`);
                // }
            } catch (error) {
                console.log(
                    "Error fetching user info or adding founder:",
                    error
                );
            }
        }
    }
    getRandomDateRange(): { sinceDate: any; untilDate: any } {
        throw new Error("Method not implemented.");
    }
    getRandomLanguage() {
        throw new Error("Method not implemented.");
    }
    getRandomKeyword() {
        throw new Error("Method not implemented.");
    }
    getRandomLocation() {
        throw new Error("Method not implemented.");
    }
}
