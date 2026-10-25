import clsx from 'clsx';

const VARIANTS = {
  pine: 'bg-pine-50 text-pine-700 dark:bg-pine-500/15 dark:text-pine-300',
  amber: 'bg-amber-50 text-amber-600 dark:bg-amber-500/15 dark:text-amber-300',
  coral: 'bg-coral-50 text-coral-600 dark:bg-coral-500/15 dark:text-coral-300',
  slate: 'bg-slate-100 text-slate-600 dark:bg-ink-700 dark:text-slate-300',
};

export default function Badge({ children, variant = 'pine', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
