import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Settings2 } from 'lucide-react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';

const MODES = {
  work: { label: 'Focus', color: 'text-pine-500', ring: 'stroke-pine-500' },
  short_break: { label: 'Short break', color: 'text-amber-500', ring: 'stroke-amber-500' },
  long_break: { label: 'Long break', color: 'text-amber-600', ring: 'stroke-amber-600' },
};

function pad(n) {
  return String(n).padStart(2, '0');
}

export default function PomodoroTimer({ settings, onSettingsChange, onWorkSessionComplete }) {
  const [mode, setMode] = useState('work');
  const [secondsLeft, setSecondsLeft] = useState(settings.workMinutes * 60);
  const [running, setRunning] = useState(false);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const intervalRef = useRef(null);

  const durationForMode = useCallback(
    (m) => {
      if (m === 'work') return settings.workMinutes * 60;
      if (m === 'short_break') return settings.shortBreakMinutes * 60;
      return settings.longBreakMinutes * 60;
    },
    [settings]
  );

  // Reset the visible countdown whenever settings or mode change while idle
  useEffect(() => {
    if (!running) setSecondsLeft(durationForMode(mode));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings, mode]);

  useEffect(() => {
    if (!running) {
      clearInterval(intervalRef.current);
      return undefined;
    }
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  // Handle a countdown reaching zero: advance to the next phase
  useEffect(() => {
    if (secondsLeft !== 0 || !running) return;

    setRunning(false);

    if (mode === 'work') {
      onWorkSessionComplete?.(settings.workMinutes);
      const nextCycles = cyclesCompleted + 1;
      setCyclesCompleted(nextCycles);
      const nextMode = nextCycles % settings.sessionsBeforeLongBreak === 0 ? 'long_break' : 'short_break';
      setMode(nextMode);
      setSecondsLeft(durationForMode(nextMode));
    } else {
      setMode('work');
      setSecondsLeft(durationForMode('work'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [secondsLeft]);

  const totalSeconds = durationForMode(mode);
  const progress = totalSeconds ? 1 - secondsLeft / totalSeconds : 0;
  const radius = 88;
  const circumference = 2 * Math.PI * radius;

  const reset = () => {
    setRunning(false);
    setSecondsLeft(durationForMode(mode));
  };

  const skip = () => {
    setRunning(false);
    if (mode === 'work') {
      const nextCycles = cyclesCompleted + 1;
      setCyclesCompleted(nextCycles);
      const nextMode = nextCycles % settings.sessionsBeforeLongBreak === 0 ? 'long_break' : 'short_break';
      setMode(nextMode);
      setSecondsLeft(durationForMode(nextMode));
    } else {
      setMode('work');
      setSecondsLeft(durationForMode('work'));
    }
  };

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  return (
    <Card className="flex flex-col items-center">
      <div className="flex w-full items-center justify-between">
        <span className={`text-sm font-semibold uppercase tracking-wide ${MODES[mode].color}`}>
          {MODES[mode].label}
        </span>
        <button
          type="button"
          onClick={() => setShowSettings((s) => !s)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-ink-800"
          aria-label="Timer settings"
        >
          <Settings2 size={17} />
        </button>
      </div>

      {showSettings ? (
        <div className="mt-5 grid w-full grid-cols-2 gap-3">
          <Input
            label="Focus (min)"
            type="number"
            min="1"
            max="180"
            value={settings.workMinutes}
            onChange={(e) => onSettingsChange({ ...settings, workMinutes: Number(e.target.value) || 1 })}
          />
          <Input
            label="Short break (min)"
            type="number"
            min="1"
            max="60"
            value={settings.shortBreakMinutes}
            onChange={(e) => onSettingsChange({ ...settings, shortBreakMinutes: Number(e.target.value) || 1 })}
          />
          <Input
            label="Long break (min)"
            type="number"
            min="1"
            max="60"
            value={settings.longBreakMinutes}
            onChange={(e) => onSettingsChange({ ...settings, longBreakMinutes: Number(e.target.value) || 1 })}
          />
          <Input
            label="Sessions / long break"
            type="number"
            min="2"
            max="8"
            value={settings.sessionsBeforeLongBreak}
            onChange={(e) => onSettingsChange({ ...settings, sessionsBeforeLongBreak: Number(e.target.value) || 2 })}
          />
        </div>
      ) : (
        <>
          <div className="relative my-6 flex h-52 w-52 items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r={radius} fill="none" strokeWidth="10" className="stroke-slate-200 dark:stroke-ink-700" />
              <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                strokeWidth="10"
                strokeLinecap="round"
                className={`${MODES[mode].ring} transition-all duration-1000 ease-linear`}
                strokeDasharray={circumference}
                strokeDashoffset={circumference * (1 - progress)}
              />
            </svg>
            <span className="stat-figure absolute text-5xl text-ink dark:text-paper-100">
              {pad(mins)}:{pad(secs)}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="secondary" size="lg" onClick={reset} aria-label="Reset timer">
              <RotateCcw size={18} />
            </Button>
            <Button size="lg" onClick={() => setRunning((r) => !r)} className="w-32">
              {running ? <Pause size={18} /> : <Play size={18} />}
              {running ? 'Pause' : 'Start'}
            </Button>
            <Button variant="secondary" size="lg" onClick={skip} aria-label="Skip phase">
              <SkipForward size={18} />
            </Button>
          </div>

          <div className="mt-6 flex gap-1.5">
            {Array.from({ length: settings.sessionsBeforeLongBreak }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-6 rounded-full ${
                  i < cyclesCompleted % settings.sessionsBeforeLongBreak || (cyclesCompleted > 0 && cyclesCompleted % settings.sessionsBeforeLongBreak === 0 && i < settings.sessionsBeforeLongBreak)
                    ? 'bg-pine-500'
                    : 'bg-slate-200 dark:bg-ink-700'
                }`}
              />
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">{cyclesCompleted} focus session{cyclesCompleted === 1 ? '' : 's'} completed today</p>
        </>
      )}
    </Card>
  );
}
