import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { analyticsService, goalService, getErrorMessage } from '../api/services';
import Spinner from '../components/ui/Spinner';
import StreakLedger from '../components/dashboard/StreakLedger';
import StatCard from '../components/dashboard/StatCard';
import SubjectBreakdownChart from '../components/dashboard/SubjectBreakdownChart';
import RecentSessions from '../components/dashboard/RecentSessions';
import GoalMiniProgress from '../components/dashboard/GoalMiniProgress';
import { minutesToHoursDecimal } from '../utils/format';
import { Clock, BarChart3, CalendarDays, Trophy } from 'lucide-react';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [streakDays, setStreakDays] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [dashboardRes, dailyRes, goalsRes] = await Promise.all([
          analyticsService.dashboard(),
          analyticsService.charts('daily', { days: 30 }),
          goalService.list({ year: new Date().getFullYear() }),
        ]);
        setStats(dashboardRes.data.stats);
        setSubjects(dashboardRes.data.subjects);
        setRecentSessions(dashboardRes.data.recentSessions);
        setStreakDays(dailyRes.data.series);
        setGoals(goalsRes.data.goals);
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      <StreakLedger days={streakDays} currentStreak={stats.streaks.current} longestStreak={stats.streaks.longest} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Today" value={minutesToHoursDecimal(stats.today.minutes)} unit="h" icon={Clock} accent="pine" />
        <StatCard label="This week" value={minutesToHoursDecimal(stats.week.minutes)} unit="h" icon={BarChart3} accent="pine" />
        <StatCard label="This month" value={minutesToHoursDecimal(stats.month.minutes)} unit="h" icon={CalendarDays} accent="amber" />
        <StatCard label="This year" value={minutesToHoursDecimal(stats.year.minutes)} unit="h" icon={Trophy} accent="amber" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <SubjectBreakdownChart subjects={subjects} />
        <RecentSessions sessions={recentSessions} />
        <GoalMiniProgress goals={goals} />
      </div>
    </div>
  );
}
