export function formatMinutes(totalMinutes = 0) {
  const mins = Math.round(totalMinutes || 0);
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

export function minutesToHoursDecimal(totalMinutes = 0) {
  return Math.round((totalMinutes / 60) * 10) / 10;
}

export function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function formatDateLong(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}

export function toInputDate(date = new Date()) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60 * 1000);
  return local.toISOString().slice(0, 10);
}

// A small, distinct color per subject so charts/badges stay consistent
// across the app without a manual mapping.
const SUBJECT_PALETTE = ['#2F6F5E', '#E8A33D', '#E8604C', '#4C6FFF', '#8B5CF6', '#0EA5A0', '#D6668A', '#7FB3A1'];

export function subjectColor(subject = '') {
  let hash = 0;
  for (let i = 0; i < subject.length; i += 1) {
    hash = subject.charCodeAt(i) + ((hash << 5) - hash);
  }
  return SUBJECT_PALETTE[Math.abs(hash) % SUBJECT_PALETTE.length];
}
