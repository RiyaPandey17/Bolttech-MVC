export function getSeason(date: Date): 'peak' | 'mid' | 'off' {
  const year = date.getFullYear();

  const midSeasonRanges = [
    { from: new Date(year, 2, 1), to: new Date(year, 5, 0) },    // Mar 1 - May 31
    { from: new Date(year, 8, 15), to: new Date(year, 9, 30) }   // Sep 15 - Oct 30
  ];
  const peakSeasonRange = { from: new Date(year, 5, 1), to: new Date(year, 8, 15) }; // Jun 1 - Sep 15

  if (date >= peakSeasonRange.from && date <= peakSeasonRange.to) return 'peak';
  if (midSeasonRanges.some(r => date >= r.from && date <= r.to)) return 'mid';
  return 'off';
}