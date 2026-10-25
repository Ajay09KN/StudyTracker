const {
  startOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} = require('date-fns');

const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Returns UTC start/end Date bounds for a given period anchored at `refDate`.
 * period: 'day' | 'week' | 'month' | 'year'
 */
function getRangeBounds(period, refDate = new Date()) {
  const ref = new Date(refDate);
  switch (period) {
    case 'day':
      return { start: startOfDay(ref), end: new Date(startOfDay(ref).getTime() + DAY_MS) };
    case 'week':
      return {
        start: startOfWeek(ref, { weekStartsOn: 1 }),
        end: endOfWeek(ref, { weekStartsOn: 1 }),
      };
    case 'month':
      return { start: startOfMonth(ref), end: endOfMonth(ref) };
    case 'year':
      return { start: startOfYear(ref), end: endOfYear(ref) };
    default:
      throw new Error(`Unknown period: ${period}`);
  }
}

/**
 * Given an array of Date objects (already normalized to UTC midnight,
 * one per distinct study day, duplicates allowed), compute the current
 * and longest study streaks in days.
 */
function calculateStreaks(studyDates) {
  if (!studyDates || studyDates.length === 0) {
    return { current: 0, longest: 0 };
  }

  const uniqueTimestamps = [...new Set(studyDates.map((d) => new Date(d).getTime()))].sort(
    (a, b) => a - b
  );

  // Longest streak: scan for consecutive-day runs
  let longest = 1;
  let run = 1;
  for (let i = 1; i < uniqueTimestamps.length; i += 1) {
    const diff = uniqueTimestamps[i] - uniqueTimestamps[i - 1];
    if (diff === DAY_MS) {
      run += 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
  }

  // Current streak: walk backwards from the most recent study day, but only
  // counts as "alive" if the most recent day is today or yesterday (UTC).
  const today = startOfDay(new Date()).getTime();
  const yesterday = today - DAY_MS;
  const mostRecent = uniqueTimestamps[uniqueTimestamps.length - 1];

  let current = 0;
  if (mostRecent === today || mostRecent === yesterday) {
    current = 1;
    for (let i = uniqueTimestamps.length - 1; i > 0; i -= 1) {
      const diff = uniqueTimestamps[i] - uniqueTimestamps[i - 1];
      if (diff === DAY_MS) {
        current += 1;
      } else {
        break;
      }
    }
  }

  return { current, longest };
}

module.exports = { getRangeBounds, calculateStreaks, DAY_MS };
