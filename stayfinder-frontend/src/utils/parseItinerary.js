export const parseItineraryText = (text) => {
  const days = [];
  const lines = text
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0);

  let currentDay = null;

  lines.forEach((line) => {
    // Normalizes and cleans markdown from headings
    const cleanedLine = line
      .replace(/^#+\s*/, "")      // Removes markdown headings like ## or #
      .replace(/\*\*/g, "")       // Removes bold markdown
      .replace(/\*/g, "")         // Removes asterisk bullets
      .replace(/`/g, "")          // Removes backticks
      .trim();

    // Identify Day headers
    if (/^Day\s*\d+:?/i.test(cleanedLine)) {
      if (currentDay) days.push(currentDay);
      currentDay = {
        title: cleanedLine,
        activities: [],
      };
    } else if (line.startsWith("* ") || line.startsWith("- ") || /^\d+\./.test(line)) {
      
      currentDay?.activities.push(cleanedLine);
    }
  });

  if (currentDay) days.push(currentDay);
  return days;
};
