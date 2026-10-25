import { forwardRef } from 'react';
import clsx from 'clsx';

const Textarea = forwardRef(function Textarea(
  { label, error, className, containerClassName, id, ...props },
  ref
) {
  const areaId = id || props.name;
  return (
    <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={areaId} className="text-sm font-medium text-ink dark:text-paper-200">
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={areaId}
        className={clsx(
          'w-full rounded-xl border bg-paper-100 dark:bg-ink-800 px-3.5 py-2.5 text-sm text-ink dark:text-paper-100 placeholder:text-slate-400 resize-none',
          'border-slate-300 dark:border-ink-700 focus:border-pine-500 transition-colors',
          error && 'border-coral-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-coral-500">{error}</span>}
    </div>
  );
});

export default Textarea;
