import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import EmptyState from '../ui/EmptyState';
import { formatMinutes, formatDateShort, subjectColor } from '../../utils/format';

export default function RecentSessions({ sessions = [] }) {
  return (
    <Card padded={false}>
      <div className="flex items-center justify-between px-5 pt-5 sm:px-6 sm:pt-6">
        <p className="label-eyebrow">Recent sessions</p>
        <Link to="/sessions" className="text-xs font-semibold text-pine-600 hover:text-pine-700 dark:text-pine-300">
          View all
        </Link>
      </div>

      {sessions.length === 0 ? (
        <EmptyState
          icon={Clock}
          title="No sessions logged yet"
          message="Add your first study session to start building momentum."
          compact
        />
      ) : (
        <ul className="mt-3 divide-y divide-slate-200 dark:divide-ink-700">
          {sessions.map((s) => (
            <li key={s._id} className="flex items-center justify-between gap-3 px-5 py-3 sm:px-6">
              <div className="flex min-w-0 items-center gap-3">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: subjectColor(s.subject) }}
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink dark:text-paper-100">
                    {s.subject}
                    {s.topic && <span className="font-normal text-slate-500"> · {s.topic}</span>}
                  </p>
                  <p className="text-xs text-slate-500">{formatDateShort(s.date)}</p>
                </div>
              </div>
              <Badge variant="slate" className="shrink-0 font-mono">
                {formatMinutes(s.durationMinutes)}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
