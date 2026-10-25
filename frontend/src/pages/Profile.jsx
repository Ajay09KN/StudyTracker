import { useState } from 'react';
import toast from 'react-hot-toast';
import { Sun, Moon } from 'lucide-react';
import { userService, getErrorMessage } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { formatMinutes } from '../utils/format';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [profileForm, setProfileForm] = useState({ name: user.name, email: user.email });
  const [profileSaving, setProfileSaving] = useState(false);

  const [targetMinutes, setTargetMinutes] = useState(user.dailyTargetMinutes);
  const [targetSaving, setTargetSaving] = useState(false);

  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwSaving, setPwSaving] = useState(false);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    try {
      const { data } = await userService.updateProfile(profileForm);
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setProfileSaving(false);
    }
  };

  const saveTarget = async () => {
    setTargetSaving(true);
    try {
      const { data } = await userService.updatePreferences({ dailyTargetMinutes: Number(targetMinutes) });
      updateUser(data.user);
      toast.success('Daily target updated');
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setTargetSaving(false);
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    setPwSaving(true);
    try {
      await userService.changePassword({
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });
      toast.success('Password changed');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <Card>
        <p className="label-eyebrow">Profile information</p>
        <form onSubmit={saveProfile} className="mt-4 space-y-4">
          <Input
            label="Full name"
            value={profileForm.name}
            onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Email"
            type="email"
            value={profileForm.email}
            onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
          />
          <Button type="submit" loading={profileSaving}>
            Save changes
          </Button>
        </form>
      </Card>

      <Card>
        <p className="label-eyebrow">Study preferences</p>
        <div className="mt-4 space-y-3">
          <label className="text-sm font-medium text-ink dark:text-paper-200">
            Daily study target — {formatMinutes(targetMinutes)}
          </label>
          <input
            type="range"
            min="15"
            max="480"
            step="15"
            value={targetMinutes}
            onChange={(e) => setTargetMinutes(e.target.value)}
            className="w-full accent-pine-500"
          />
          <Button size="sm" onClick={saveTarget} loading={targetSaving}>
            Save target
          </Button>
        </div>
      </Card>

      <Card>
        <p className="label-eyebrow">Security</p>
        <form onSubmit={changePassword} className="mt-4 space-y-4">
          <Input
            label="Current password"
            type="password"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, currentPassword: e.target.value }))}
          />
          <Input
            label="New password"
            type="password"
            hint="At least 6 characters"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, newPassword: e.target.value }))}
          />
          <Input
            label="Confirm new password"
            type="password"
            value={pwForm.confirmPassword}
            onChange={(e) => setPwForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          />
          <Button type="submit" variant="secondary" loading={pwSaving}>
            Change password
          </Button>
        </form>
      </Card>

      <Card>
        <p className="label-eyebrow">Appearance</p>
        <div className="mt-4 flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 dark:border-ink-700">
          <div>
            <p className="text-sm font-medium text-ink dark:text-paper-100">Color theme</p>
            <p className="text-xs text-slate-500">Switch between light and dark mode</p>
          </div>
          <Button variant="secondary" size="sm" icon={theme === 'dark' ? Sun : Moon} onClick={toggleTheme}>
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
