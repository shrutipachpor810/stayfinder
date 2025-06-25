export const parseItineraryText = (text) => {
  const days = [];
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  let currentDay = null;

  lines.forEach((line) => {
    // Normalize and clean markdown from headings
    const cleanedLine = line
      .replace(/^#+\s*/, "")      // Remove markdown headings like ## or #
      .replace(/\*\*/g, "")       // Remove bold markdown
      .replace(/\*/g, "")         // Remove asterisk bullets
      .replace(/`/g, "")          // Remove backticks
      .trim();

    // Identify Day headers
    if (/^Day\s*\d+:?/i.test(cleanedLine)) {
      if (currentDay) days.push(currentDay);
      currentDay = {
        title: cleanedLine,
        activities: [],
      };
    } else if (line.startsWith("* ") || line.startsWith("- ") || /^\d+\./.test(line)) {
      // Capture activities (including numbered ones like 1. Activity)
      currentDay?.activities.push(cleanedLine);
    }
  });

  if (currentDay) days.push(currentDay);
  return days;
};
