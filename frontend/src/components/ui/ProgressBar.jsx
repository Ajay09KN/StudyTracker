import clsx from 'clsx';

const COLORS = {
  pine: 'bg-pine-500',
  amber: 'bg-amber-500',
  coral: 'bg-coral-500',
};

export default function ProgressBar({ percent = 0, color = 'pine', size = 'md', className }) {
  const clamped = Math.min(100, Math.max(0, percent));
  const heights = { sm: 'h-1.5', md: 'h-2.5', lg: 'h-3.5' };

  return (
    <div
      className={clsx('w-full rounded-full bg-slate-200 dark:bg-ink-700 overflow-hidden', heights[size], className)}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={clsx('h-full rounded-full transition-all duration-500 ease-out', COLORS[color])}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
