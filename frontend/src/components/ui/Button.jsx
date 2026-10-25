import clsx from 'clsx';
import { Loader2 } from 'lucide-react';

const VARIANTS = {
  primary:
    'bg-pine-500 text-white hover:bg-pine-600 active:bg-pine-700 disabled:bg-pine-300',
  secondary:
    'bg-transparent text-ink dark:text-paper-200 border border-slate-300 dark:border-ink-700 hover:bg-slate-50 dark:hover:bg-ink-800',
  ghost:
    'bg-transparent text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-ink-800',
  danger:
    'bg-coral-500 text-white hover:bg-coral-600 active:bg-coral-600 disabled:bg-coral-300',
  amber: 'bg-amber-500 text-ink hover:bg-amber-600 disabled:bg-amber-100',
};

const SIZES = {
  sm: 'text-sm px-3 py-1.5 gap-1.5',
  md: 'text-sm px-4 py-2.5 gap-2',
  lg: 'text-base px-5 py-3 gap-2',
};

export default function Button({
  as: Component = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  icon: Icon,
  ...props
}) {
  return (
    <Component
      disabled={disabled || loading}
      className={clsx(
        'inline-flex items-center justify-center rounded-xl font-semibold transition-colors duration-150 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        Icon && <Icon size={16} strokeWidth={2.25} />
      )}
      {children}
    </Component>
  );
}
