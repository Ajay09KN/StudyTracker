import { useMemo } from 'react';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  getDay,
  format,
  isSameDay,
  isToday,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import Card from '../ui/Card';
import { formatMinutes, subjectColor } from '../../utils/format';

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function intensityLevel(minutes) {
  if (!minutes) return 0;
  if (minutes < 30) return 1;
  if (minutes < 60) return 2;
  if (minutes < 120) return 3;
  return 4;
}

const LEVEL_CLASSES = [
  'bg-transparent border border-dashed border-slate-200 dark:border-ink-700',
  'bg-pine-100 dark:bg-pine-500/25',
  'bg-pine-300 dark:bg-pine-500/55',
  'bg-pine-500 text-white',
  'bg-amber-500 text-ink',
];

export default function StudyCalendar({
  year,
  month,
  days = [],
  onNavigate,
  selectedDate,
  onSelectDate,
}) {
  const dataByDate = useMemo(() => new Map(days.map((d) => [d.date, d])), [days]);

  const monthAnchor = new Date(Date.UTC(year, month - 1, 1));
  const gridDays = useMemo(() => {
    const start = startOfMonth(monthAnchor);
    const end = endOfMonth(monthAnchor);
    return eachDayOfInterval({ start, end });
  }, [year, month]);

  // getDay: 0=Sun..6=Sat -> convert to Mon-start offset
  const leadingBlanks = (getDay(gridDays[0]) + 6) % 7;

  const selected = selectedDate ? dataByDate.get(selectedDate) : null;

  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="font-display text-lg font-semibold text-ink dark:text-paper-100">
          {format(monthAnchor, 'MMMM yyyy')}
        </p>
        <div className="flex gap-1">
          <button
            type="button"
            onClick={() => onNavigate(-1)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-ink-800"
            aria-label="Previous month"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={() => onNavigate(1)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-ink-800"
            aria-label="Next month"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5 text-center text-xs font-medium text-slate-500">
        {WEEKDAYS.map((w) => (
          <span key={w}>{w}</span>
        ))}
      </div>

      <div className="mt-1.5 grid grid-cols-7 gap-1.5">
        {Array.from({ length: leadingBlanks }).map((_, i) => (
          <div key={`blank-${i}`} />
        ))}
        {gridDays.map((d) => {
          const key = format(d, 'yyyy-MM-dd');
          const entry = dataByDate.get(key);
          const level = intensityLevel(entry?.minutes);
          const isSelected = selectedDate === key;

          return (
            <button
              type="button"
              key={key}
              onClick={() => onSelectDate(key)}
              title={entry ? `${formatMinutes(entry.minutes)} studied` : 'No study logged'}
              className={clsx(
                'aspect-square rounded-lg text-xs font-semibold transition-all',
                LEVEL_CLASSES[level],
                isToday(d) && 'ring-2 ring-offset-1 ring-pine-500 dark:ring-offset-ink-900',
                isSelected && 'scale-110 ring-2 ring-ink dark:ring-paper-100'
              )}
            >
              {format(d, 'd')}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>Less</span>
        <div className="flex gap-1">
          {LEVEL_CLASSES.map((cls, i) => (
            <span key={i} className={clsx('h-3 w-3 rounded-sm', cls)} />
          ))}
        </div>
        <span>More</span>
      </div>

      {selectedDate && (
        <div className="mt-5 border-t border-slate-200 pt-4 dark:border-ink-700">
          <p className="text-sm font-semibold text-ink dark:text-paper-100">
            {format(new Date(`${selectedDate}T00:00:00`), 'EEEE, MMMM d')}
          </p>
          {selected ? (
            <div className="mt-2 space-y-2">
              <p className="text-sm text-slate-500">
                {formatMinutes(selected.minutes)} across {selected.sessions} session
                {selected.sessions === 1 ? '' : 's'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {selected.subjects.map((s) => (
                  <span
                    key={s}
                    className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600 dark:bg-ink-800 dark:text-slate-300"
                  >
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: subjectColor(s) }} />
                    {s}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <p className="mt-1 text-sm text-slate-500">No study logged this day.</p>
          )}
        </div>
      )}
    </Card>
  );
}
