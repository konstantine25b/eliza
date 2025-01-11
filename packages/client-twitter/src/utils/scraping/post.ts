import {
    getRandomDateRange,
    getRandomKeyword,
    getRandomKeywordsWithOr,
    getRandomLocation,
} from "./main";



// Function to generate a query for finding founders and CEOs
export function generateQuery(keywords : string[]): string {
    const { sinceDate, untilDate } = getRandomDateRange(202);
    const keyword = getRandomKeyword(keywords); // Pass keywords here
    const negationFilter = Math.random() < 0.5 ? "-filter:verified" : "";
    const randomLocation = getRandomLocation();

    const queryParts: string[] = [
        keyword,
        `since:${sinceDate}`,
        `until:${untilDate}`,
        negationFilter,
        randomLocation,
    ];

    return queryParts.filter(Boolean).join(" ");
}

export function generateQueryForInteractions(keywords : string[]): string {
    const keyword = getRandomKeywordsWithOr(keywords,5); // Pass keywords here

    const queryParts: string[] = [keyword];

    return queryParts.filter(Boolean).join(" ");
}
