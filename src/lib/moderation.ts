const BANNED_WORDS = [
  "ass",
  "asshole",
  "bastard",
  "bitch",
  "bollocks",
  "bullshit",
  "crap",
  "cunt",
  "damn",
  "dick",
  "douche",
  "dumbass",
  "fag",
  "faggot",
  "fuck",
  "goddamn",
  "jackass",
  "motherfucker",
  "nigger",
  "piss",
  "prick",
  "pussy",
  "retard",
  "shit",
  "slut",
  "twat",
  "wanker",
  "whore",
];

export function moderateComment(
  name: string,
  comment: string
): { flagged: boolean; matchedWords: string[] } {
  const text = `${name} ${comment}`;
  const matchedWords: string[] = [];

  for (const word of BANNED_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, "i");
    if (regex.test(text)) {
      matchedWords.push(word);
    }
  }

  return { flagged: matchedWords.length > 0, matchedWords };
}
