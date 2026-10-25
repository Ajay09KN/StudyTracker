import { Flame, Trophy } from 'lucide-react';
import Card from '../ui/Card';
import { formatMinutes } from '../../utils/format';

function intensityClass(minutes) {
  if (!minutes) return 'bg-slate-200 dark:bg-ink-700';
  if (minutes < 30) return 'bg-pine-100 dark:bg-pine-500/25';
  if (minutes < 60) return 'bg-pine-300 dark:bg-pine-500/55';
  if (minutes < 120) return 'bg-pine-500';
  return 'bg-amber-500';
}

export default function StreakLedger({ days = [], currentStreak = 0, longestStreak = 0 }) {
  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="label-eyebrow">Study streak</p>
          <div className="mt-2 flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                <Flame size={18} strokeWidth={2.25} />
              </span>
              <div>
                <p className="stat-figure text-2xl leading-none text-ink dark:text-paper-100">
                  {currentStreak}
                  <span className="ml-1 text-sm font-medium text-slate-500">day{currentStreak === 1 ? '' : 's'}</span>
                </p>
                <p className="text-xs text-slate-500">Current streak</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine-50 text-pine-600 dark:bg-pine-500/15 dark:text-pine-300">
                <Trophy size={18} strokeWidth={2.25} />
              </span>
              <div>
                <p className="stat-figure text-2xl leading-none text-ink dark:text-paper-100">
                  {longestStreak}
                  <span className="ml-1 text-sm font-medium text-slate-500">day{longestStreak === 1 ? '' : 's'}</span>
                </p>
                <p className="text-xs text-slate-500">Longest streak</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 overflow-x-auto pb-1">
        <div className="flex min-w-max items-end gap-1.5">
          {days.map((day) => (
            <div
              key={day.label}
              title={`${day.label} — ${formatMinutes(day.minutes)}`}
              className={`h-6 w-3 rounded-sm transition-colors ${intensityClass(day.minutes)}`}
            />
          ))}
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{days[0]?.label && new Date(days[0].label).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
        <span>Today</span>
      </div>
    </Card>
  );
}
