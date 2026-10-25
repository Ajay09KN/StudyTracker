import { forwardRef } from 'react';
import clsx from 'clsx';
import { ChevronDown } from 'lucide-react';

const Select = forwardRef(function Select(
  { label, error, className, containerClassName, id, children, ...props },
  ref
) {
  const selectId = id || props.name;
  return (
    <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-ink dark:text-paper-200">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={clsx(
            'w-full appearance-none rounded-xl border bg-paper-100 dark:bg-ink-800 px-3.5 py-2.5 pr-9 text-sm text-ink dark:text-paper-100',
            'border-slate-300 dark:border-ink-700 focus:border-pine-500 transition-colors',
            error && 'border-coral-500',
            className
          )}
          {...props}
        >
          {children}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
        />
      </div>
      {error && <span className="text-xs text-coral-500">{error}</span>}
    </div>
  );
});

export default Select;
