import { Link } from 'react-router-dom';
import { Target } from 'lucide-react';
import Card from '../ui/Card';
import ProgressBar from '../ui/ProgressBar';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import { formatMinutes } from '../../utils/format';

export default function GoalMiniProgress({ goals = [] }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <p className="label-eyebrow">Goal progress</p>
        <Link to="/goals" className="text-xs font-semibold text-pine-600 hover:text-pine-700 dark:text-pine-300">
          Manage goals
        </Link>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No goals set"
          message="Set a monthly or yearly target to track your progress."
          compact
          action={
            <Button as={Link} to="/goals" size="sm" variant="secondary">
              Set a goal
            </Button>
          }
        />
      ) : (
        <div className="mt-4 space-y-4">
          {goals.map((g) => (
            <div key={g._id}>
              <div className="mb-1.5 flex items-baseline justify-between text-sm">
                <span className="font-medium text-ink dark:text-paper-100 capitalize">
                  {g.type} goal
                </span>
                <span className="font-mono text-xs text-slate-500">
                  {formatMinutes(g.studiedMinutes)} / {g.targetHours}h
                </span>
              </div>
              <ProgressBar
                percent={g.progressPercent}
                color={g.progressPercent >= 100 ? 'amber' : 'pine'}
              />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
