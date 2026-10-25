import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { analyticsService, getErrorMessage } from '../api/services';
import StudyCalendar from '../components/calendar/StudyCalendar';
import Spinner from '../components/ui/Spinner';

export default function CalendarPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [days, setDays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    setLoading(true);
    setSelectedDate(null);
    analyticsService
      .calendar({ year, month })
      .then(({ data }) => setDays(data.days))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  }, [year, month]);

  const navigate = (dir) => {
    let m = month + dir;
    let y = year;
    if (m < 1) {
      m = 12;
      y -= 1;
    } else if (m > 12) {
      m = 1;
      y += 1;
    }
    setMonth(m);
    setYear(y);
  };

  if (loading && days.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size={28} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <StudyCalendar
        year={year}
        month={month}
        days={days}
        onNavigate={navigate}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />
    </div>
  );
}
