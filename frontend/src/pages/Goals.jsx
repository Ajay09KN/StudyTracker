import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Target } from 'lucide-react';
import { goalService, getErrorMessage } from '../api/services';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import GoalFormModal from '../components/goals/GoalFormModal';
import GoalProgressCard from '../components/goals/GoalProgressCard';

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const load = () => {
    setLoading(true);
    goalService
      .list()
      .then(({ data }) => setGoals(data.goals))
      .catch((error) => toast.error(getErrorMessage(error)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      await goalService.set(payload);
      toast.success('Goal saved');
      setModalOpen(false);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeletingBusy(true);
    try {
      await goalService.remove(deleting._id);
      toast.success('Goal deleted');
      setDeleting(null);
      load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button icon={Plus} onClick={() => setModalOpen(true)}>
          Set a goal
        </Button>
      </div>

      {loading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size={26} />
        </div>
      ) : goals.length === 0 ? (
        <Card>
          <EmptyState
            icon={Target}
            title="No goals yet"
            message="Set a monthly or yearly target to track your progress toward it."
            action={
              <Button size="sm" onClick={() => setModalOpen(true)}>
                Set your first goal
              </Button>
            }
          />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {goals.map((g) => (
            <GoalProgressCard key={g._id} goal={g} onDelete={setDeleting} />
          ))}
        </div>
      )}

      <GoalFormModal open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit} saving={saving} />
      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete goal?"
        message="This will remove the goal and its progress tracking."
        confirming={deletingBusy}
      />
    </div>
  );
}
