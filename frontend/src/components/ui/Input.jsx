import { forwardRef } from 'react';
import clsx from 'clsx';

const Input = forwardRef(function Input(
  { label, error, hint, className, containerClassName, id, ...props },
  ref
) {
  const inputId = id || props.name;
  return (
    <div className={clsx('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-ink dark:text-paper-200">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={inputId}
        className={clsx(
          'w-full rounded-xl border bg-paper-100 dark:bg-ink-800 px-3.5 py-2.5 text-sm text-ink dark:text-paper-100 placeholder:text-slate-400',
          'border-slate-300 dark:border-ink-700 focus:border-pine-500 transition-colors',
          error && 'border-coral-500 focus:border-coral-500',
          className
        )}
        {...props}
      />
      {error && <span className="text-xs text-coral-500">{error}</span>}
      {hint && !error && <span className="text-xs text-slate-500">{hint}</span>}
    </div>
  );
});

export default Input;
