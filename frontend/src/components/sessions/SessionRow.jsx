import { Pencil, Trash2, StickyNote } from 'lucide-react';
import Badge from '../ui/Badge';
import { formatMinutes, formatDateLong, subjectColor } from '../../utils/format';

export default function SessionRow({ session, onEdit, onDelete }) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 py-4 last:border-0 dark:border-ink-700 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-start gap-3">
        <span
          className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: subjectColor(session.subject) }}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium text-ink dark:text-paper-100">{session.subject}</p>
            {session.topic && <span className="text-sm text-slate-500">{session.topic}</span>}
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            {formatDateLong(session.date)}
            {session.startTime && session.endTime && ` · ${session.startTime}–${session.endTime}`}
          </p>
          {session.notes && (
            <p className="mt-1.5 flex items-start gap-1.5 text-sm text-slate-600 dark:text-slate-300">
              <StickyNote size={14} className="mt-0.5 shrink-0 text-slate-400" />
              <span className="line-clamp-2">{session.notes}</span>
            </p>
          )}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:ml-4">
        <Badge variant="pine" className="font-mono">
          {formatMinutes(session.durationMinutes)}
        </Badge>
        <button
          type="button"
          onClick={() => onEdit(session)}
          aria-label="Edit session"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-ink-800"
        >
          <Pencil size={15} />
        </button>
        <button
          type="button"
          onClick={() => onDelete(session)}
          aria-label="Delete session"
          className="rounded-lg p-2 text-slate-500 hover:bg-coral-50 hover:text-coral-500 dark:hover:bg-coral-500/10"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
