import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { analyticsService, getErrorMessage } from '../api/services';
import BarChartCard from '../components/charts/BarChartCard';
import { formatDateShort } from '../utils/format';

const TABS = [
  { key: 'daily', label: 'Daily' },
  { key: 'weekly', label: 'Weekly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'yearly', label: 'Yearly' },
];

const LABEL_FORMATTERS = {
  daily: (v) => formatDateShort(v),
  weekly: (v) => `Wk of ${formatDateShort(v)}`,
  monthly: (v) => v,
  yearly: (v) => v,
};

export default function Analytics() {
  const [period, setPeriod] = useState('daily');
  const [series, setSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    analyticsService
      .charts(period)
      .then(({ data }) => {
        if (!ignore) setSeries(data.series);
      })
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [period]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setPeriod(t.key)}
            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-colors ${
              period === t.key
                ? 'border-pine-500 bg-pine-50 text-pine-700 dark:bg-pine-500/15 dark:text-pine-300'
                : 'border-slate-300 text-slate-600 dark:border-ink-700 dark:text-slate-300'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <BarChartCard
        title={`${TABS.find((t) => t.key === period).label} study time`}
        series={series}
        loading={loading}
        labelFormatter={LABEL_FORMATTERS[period]}
        color={period === 'monthly' || period === 'yearly' ? '#E8A33D' : '#2F6F5E'}
      />
    </div>
  );
}
