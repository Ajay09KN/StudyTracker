import clsx from 'clsx';

export default function EmptyState({ icon: Icon, title, message, action, compact = false }) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center',
        compact ? 'py-8' : 'py-14'
      )}
    >
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-ink-800 dark:text-slate-500">
          <Icon size={22} strokeWidth={1.75} />
        </div>
      )}
      <p className="font-display text-base font-semibold text-ink dark:text-paper-100">{title}</p>
      {message && <p className="mt-1 max-w-xs text-sm text-slate-500">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
