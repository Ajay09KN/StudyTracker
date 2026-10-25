import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import Card from '../ui/Card';
import EmptyState from '../ui/EmptyState';
import { formatMinutes, subjectColor } from '../../utils/format';
import { BookOpen } from 'lucide-react';

export default function SubjectBreakdownChart({ subjects = [] }) {
  const top = subjects.slice(0, 6);
  const total = top.reduce((sum, s) => sum + s.minutes, 0);

  return (
    <Card>
      <p className="label-eyebrow">Subjects studied</p>
      {top.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No subjects yet"
          message="Log a study session to see your subject breakdown."
          compact
        />
      ) : (
        <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row">
          <div className="h-40 w-40 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={top}
                  dataKey="minutes"
                  nameKey="subject"
                  innerRadius={44}
                  outerRadius={64}
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {top.map((s) => (
                    <Cell key={s.subject} fill={subjectColor(s.subject)} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => formatMinutes(value)}
                  contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="w-full flex-1 space-y-2">
            {top.map((s) => (
              <li key={s.subject} className="flex items-center justify-between gap-2 text-sm">
                <span className="flex min-w-0 items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 shrink-0 rounded-full"
                    style={{ backgroundColor: subjectColor(s.subject) }}
                  />
                  <span className="truncate text-ink dark:text-paper-200">{s.subject}</span>
                </span>
                <span className="shrink-0 font-mono text-xs text-slate-500">
                  {total ? Math.round((s.minutes / total) * 100) : 0}%
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Card>
  );
}
