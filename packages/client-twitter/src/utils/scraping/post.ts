import {
    getRandomDateRange,
    getRandomKeyword,
    getRandomKeywordsWithOr,
    getRandomLocation,
} from "./main";

const keywords = [
    "crypto",
    "cryptocurrency",
    "DeFi",
    "web3",
    "decentralized app",
    "scalability",
    "wallet",
    "crypto wallet",
    "hardware wallet",
    "EOA wallet",
    "public wallet",
    "Trust Wallet",
    "Phantom",
    "MetaMask",
    "Rabby Wallet",
    "Exodus Wallet",
    "Rainbow Wallet",
    "Coinbase Wallet",
    "Binance Wallet",
    "OKX Wallet",
    "Gnosis Safe",
    "Ledger Wallet",
    "Trezor",
    "Atomic Wallet",
    "Coinomi Wallet",
    "privacy",
    "crypto privacy",
    "private wallet",
    "transaction privacy",
    "Hinkal Protocol",
    "Hinkal",
    "Fantom",
    "Ethereum",
    "Avalanche",
    "multi-chain",
    "cross-chain transaction",
    "security",
    "crypto security",
    "public blockchain",
    "doxxing",
    "crypto phishing",
    "transaction visibility",
    "self-custody",
    "crypto safety",
];

// Function to generate a query for finding founders and CEOs
export function generateQuery(): string {
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

export function generateQueryForInteractions(): string {
    const keyword = getRandomKeywordsWithOr(keywords,5); // Pass keywords here

    const queryParts: string[] = [keyword];

    return queryParts.filter(Boolean).join(" ");
}
