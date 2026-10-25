import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import EmptyState from '../ui/EmptyState';
import { formatMinutes, minutesToHoursDecimal } from '../../utils/format';
import { BarChart3 } from 'lucide-react';

export default function BarChartCard({ title, series = [], loading, labelFormatter, color = '#2F6F5E' }) {
  const hasData = series.some((s) => s.minutes > 0);

  return (
    <Card>
      <p className="label-eyebrow">{title}</p>
      <div className="mt-3 h-64">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner />
          </div>
        ) : !hasData ? (
          <EmptyState icon={BarChart3} title="Nothing here yet" message="Log some sessions to see this chart fill in." compact />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={series} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-ink-700" />
              <XAxis
                dataKey="label"
                tickFormatter={labelFormatter}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-slate-500"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={(v) => `${minutesToHoursDecimal(v)}h`}
                tick={{ fontSize: 11, fill: 'currentColor' }}
                className="text-slate-500"
                tickLine={false}
                axisLine={false}
                width={40}
              />
              <Tooltip
                formatter={(value) => [formatMinutes(value), 'Studied']}
                labelFormatter={labelFormatter}
                contentStyle={{ borderRadius: 10, border: 'none', fontSize: 12 }}
              />
              <Bar dataKey="minutes" fill={color} radius={[4, 4, 0, 0]} maxBarSize={28} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
