import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Button from '../ui/Button';
import { toInputDate } from '../../utils/format';

const EMPTY_FORM = {
  subject: '',
  topic: '',
  date: toInputDate(),
  entryMode: 'duration', // 'duration' | 'time'
  durationHours: '',
  durationMins: '',
  startTime: '',
  endTime: '',
  notes: '',
};

export default function SessionFormModal({ open, onClose, onSubmit, initialData, subjects = [], saving }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) return;
    if (initialData) {
      const h = Math.floor((initialData.durationMinutes || 0) / 60);
      const m = (initialData.durationMinutes || 0) % 60;
      setForm({
        subject: initialData.subject || '',
        topic: initialData.topic || '',
        date: toInputDate(initialData.date),
        entryMode: initialData.startTime && initialData.endTime ? 'time' : 'duration',
        durationHours: String(h || ''),
        durationMins: String(m || ''),
        startTime: initialData.startTime || '',
        endTime: initialData.endTime || '',
        notes: initialData.notes || '',
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [open, initialData]);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    const errs = {};
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.date) errs.date = 'Date is required';

    if (form.entryMode === 'time') {
      if (!form.startTime) errs.startTime = 'Start time is required';
      if (!form.endTime) errs.endTime = 'End time is required';
    } else {
      const total = (Number(form.durationHours) || 0) * 60 + (Number(form.durationMins) || 0);
      if (total <= 0) errs.durationHours = 'Enter a duration greater than 0';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      subject: form.subject.trim(),
      topic: form.topic.trim(),
      date: form.date,
      notes: form.notes.trim(),
    };

    if (form.entryMode === 'time') {
      payload.startTime = form.startTime;
      payload.endTime = form.endTime;
    } else {
      payload.durationMinutes = (Number(form.durationHours) || 0) * 60 + (Number(form.durationMins) || 0);
      payload.startTime = '';
      payload.endTime = '';
    }

    onSubmit(payload);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initialData ? 'Edit session' : 'Log a study session'}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={saving} type="submit" form="session-form">
            {initialData ? 'Save changes' : 'Add session'}
          </Button>
        </>
      }
    >
      <form id="session-form" onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Subject"
          list="subject-suggestions"
          placeholder="e.g. Organic Chemistry"
          value={form.subject}
          onChange={set('subject')}
          error={errors.subject}
        />
        <datalist id="subject-suggestions">
          {subjects.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>

        <Input
          label="Topic (optional)"
          placeholder="e.g. Reaction mechanisms"
          value={form.topic}
          onChange={set('topic')}
        />

        <Input label="Date" type="date" value={form.date} onChange={set('date')} error={errors.date} />

        <div>
          <span className="text-sm font-medium text-ink dark:text-paper-200">How was this logged?</span>
          <div className="mt-1.5 flex gap-2">
            {[
              { key: 'duration', label: 'Total duration' },
              { key: 'time', label: 'Start & end time' },
            ].map((opt) => (
              <button
                key={opt.key}
                type="button"
                onClick={() => setForm((f) => ({ ...f, entryMode: opt.key }))}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  form.entryMode === opt.key
                    ? 'border-pine-500 bg-pine-50 text-pine-700 dark:bg-pine-500/15 dark:text-pine-300'
                    : 'border-slate-300 text-slate-600 dark:border-ink-700 dark:text-slate-300'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {form.entryMode === 'duration' ? (
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Hours"
              type="number"
              min="0"
              max="24"
              value={form.durationHours}
              onChange={set('durationHours')}
              error={errors.durationHours}
            />
            <Input label="Minutes" type="number" min="0" max="59" value={form.durationMins} onChange={set('durationMins')} />
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start time" type="time" value={form.startTime} onChange={set('startTime')} error={errors.startTime} />
            <Input label="End time" type="time" value={form.endTime} onChange={set('endTime')} error={errors.endTime} />
          </div>
        )}

        <Textarea
          label="Notes (optional)"
          rows={3}
          placeholder="What did you cover? Anything to remember next time?"
          value={form.notes}
          onChange={set('notes')}
        />
      </form>
    </Modal>
  );
}
