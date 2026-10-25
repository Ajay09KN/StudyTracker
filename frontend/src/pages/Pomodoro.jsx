import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';
import { sessionService, userService, analyticsService, getErrorMessage } from '../api/services';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import ProgressBar from '../components/ui/ProgressBar';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import { formatMinutes } from '../utils/format';

export default function Pomodoro() {
  const { user, updateUser } = useAuth();
  const [settings, setSettings] = useState(
    user?.pomodoroSettings || {
      workMinutes: 25,
      shortBreakMinutes: 5,
      longBreakMinutes: 15,
      sessionsBeforeLongBreak: 4,
    }
  );
  const [subject, setSubject] = useState('Focused study');
  const [todayMinutes, setTodayMinutes] = useState(0);

  const refreshToday = useCallback(() => {
    analyticsService
      .dashboard()
      .then(({ data }) => setTodayMinutes(data.stats.today.minutes))
      .catch(() => {});
  }, []);

  useEffect(() => {
    refreshToday();
  }, [refreshToday]);

  const handleSettingsChange = (next) => {
    setSettings(next);
    userService
      .updatePreferences({ pomodoroSettings: next })
      .then(({ data }) => updateUser(data.user))
      .catch(() => {});
  };

  const handleWorkSessionComplete = async (minutes) => {
    try {
      await sessionService.create({
        subject: subject || 'Focused study',
        topic: 'Pomodoro session',
        date: new Date().toISOString(),
        durationMinutes: minutes,
        source: 'pomodoro',
      });
      toast.success(`Nice work — logged a ${minutes}-minute focus session`, { icon: '🍅' });
      refreshToday();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const dailyTarget = user?.dailyTargetMinutes || 0;
  const todayPercent = dailyTarget ? Math.min(100, Math.round((todayMinutes / dailyTarget) * 100)) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <PomodoroTimer
          settings={settings}
          onSettingsChange={handleSettingsChange}
          onWorkSessionComplete={handleWorkSessionComplete}
        />
      </div>

      <div className="space-y-4">
        <Card>
          <p className="label-eyebrow">Today's target</p>
          <p className="stat-figure mt-2 text-2xl text-ink dark:text-paper-100">
            {formatMinutes(todayMinutes)}{' '}
            <span className="text-sm font-medium text-slate-500">/ {formatMinutes(dailyTarget)}</span>
          </p>
          <div className="mt-3">
            <ProgressBar percent={todayPercent} color={todayPercent >= 100 ? 'amber' : 'pine'} />
          </div>
          {todayPercent >= 100 && (
            <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-pine-600 dark:text-pine-300">
              <CheckCircle2 size={14} /> Daily target reached!
            </p>
          )}
        </Card>

        <Card>
          <p className="label-eyebrow">Log completed sessions as</p>
          <Input
            className="mt-3"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Focused study, Organic Chemistry..."
          />
          <p className="mt-2 text-xs text-slate-500">
            Each completed focus block is automatically saved as a study session with this subject.
          </p>
        </Card>
      </div>
    </div>
  );
}
