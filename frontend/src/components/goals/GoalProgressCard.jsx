import { Trash2, Calendar, CalendarRange } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import { formatMinutes } from '../../utils/format';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function GoalProgressCard({ goal, onDelete }) {
  const Icon = goal.type === 'yearly' ? CalendarRange : Calendar;
  const label = goal.type === 'yearly' ? `${goal.year}` : `${MONTH_NAMES[goal.month - 1]} ${goal.year}`;
  const complete = goal.progressPercent >= 100;

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine-50 text-pine-600 dark:bg-pine-500/15 dark:text-pine-300">
            <Icon size={17} />
          </span>
          <div>
            <p className="font-semibold capitalize text-ink dark:text-paper-100">{goal.type} goal</p>
            <p className="text-xs text-slate-500">{label}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onDelete(goal)}
          aria-label="Delete goal"
          className="rounded-lg p-2 text-slate-400 hover:bg-coral-50 hover:text-coral-500 dark:hover:bg-coral-500/10"
        >
          <Trash2 size={15} />
        </button>
      </div>

      <div className="mt-4">
        <div className="mb-1.5 flex items-baseline justify-between text-sm">
          <span className="font-mono font-semibold text-ink dark:text-paper-100">
            {formatMinutes(goal.studiedMinutes)}
          </span>
          <span className="text-xs text-slate-500">of {goal.targetHours}h target</span>
        </div>
        <ProgressBar percent={goal.progressPercent} color={complete ? 'amber' : 'pine'} size="lg" />
        <p className="mt-2 text-right text-xs font-semibold text-slate-500">
          {complete ? 'Goal reached 🎉' : `${goal.progressPercent}% complete`}
        </p>
      </div>
    </Card>
  );
}
