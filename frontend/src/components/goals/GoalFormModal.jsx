import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Select from '../ui/Select';
import Button from '../ui/Button';

const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export default function GoalFormModal({ open, onClose, onSubmit, saving }) {
  const [form, setForm] = useState({
    type: 'monthly',
    year: currentYear,
    month: new Date().getMonth() + 1,
    targetHours: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm({ type: 'monthly', year: currentYear, month: new Date().getMonth() + 1, targetHours: '' });
      setError('');
    }
  }, [open]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const hours = Number(form.targetHours);
    if (!hours || hours <= 0) {
      setError('Enter a target of at least 0.5 hours');
      return;
    }
    onSubmit({
      type: form.type,
      year: Number(form.year),
      month: form.type === 'monthly' ? Number(form.month) : undefined,
      targetHours: hours,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Set a study goal"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving} type="submit" form="goal-form">
            Save goal
          </Button>
        </>
      }
    >
      <form id="goal-form" onSubmit={handleSubmit} className="space-y-4">
        <div>
          <span className="text-sm font-medium text-ink dark:text-paper-200">Goal type</span>
          <div className="mt-1.5 flex gap-2">
            {['monthly', 'yearly'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setForm((f) => ({ ...f, type: t }))}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium capitalize transition-colors ${
                  form.type === t
                    ? 'border-pine-500 bg-pine-50 text-pine-700 dark:bg-pine-500/15 dark:text-pine-300'
                    : 'border-slate-300 text-slate-600 dark:border-ink-700 dark:text-slate-300'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Select label="Year" value={form.year} onChange={(e) => setForm((f) => ({ ...f, year: e.target.value }))}>
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </Select>
          {form.type === 'monthly' && (
            <Select label="Month" value={form.month} onChange={(e) => setForm((f) => ({ ...f, month: e.target.value }))}>
              {MONTHS.map((m, i) => (
                <option key={m} value={i + 1}>
                  {m}
                </option>
              ))}
            </Select>
          )}
        </div>

        <Input
          label="Target hours"
          type="number"
          min="0.5"
          step="0.5"
          placeholder="e.g. 40"
          value={form.targetHours}
          onChange={(e) => setForm((f) => ({ ...f, targetHours: e.target.value }))}
          error={error}
        />
      </form>
    </Modal>
  );
}
