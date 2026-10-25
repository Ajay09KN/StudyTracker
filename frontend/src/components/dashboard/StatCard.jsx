import Card from '../ui/Card';
import clsx from 'clsx';

export default function StatCard({ label, value, unit, icon: Icon, accent = 'pine', sub }) {
  const accentClasses = {
    pine: 'bg-pine-50 text-pine-600 dark:bg-pine-500/15 dark:text-pine-300',
    amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
    coral: 'bg-coral-50 text-coral-600 dark:bg-coral-500/15 dark:text-coral-300',
  };

  return (
    <Card className="flex items-start justify-between">
      <div>
        <p className="label-eyebrow">{label}</p>
        <p className="stat-figure mt-2 text-3xl text-ink dark:text-paper-100">
          {value}
          {unit && <span className="ml-1 text-base font-medium text-slate-500">{unit}</span>}
        </p>
        {sub && <p className="mt-1 text-xs text-slate-500">{sub}</p>}
      </div>
      {Icon && (
        <div className={clsx('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl', accentClasses[accent])}>
          <Icon size={19} strokeWidth={2.25} />
        </div>
      )}
    </Card>
  );
}
