import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-4 text-center dark:bg-ink-950">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-pine-500 text-white">
        <GraduationCap size={24} />
      </div>
      <h1 className="font-display text-4xl font-semibold text-ink dark:text-paper-100">404</h1>
      <p className="mt-2 text-slate-500">This page doesn&apos;t exist.</p>
      <Button as={Link} to="/" className="mt-6">
        Back to dashboard
      </Button>
    </div>
  );
}
