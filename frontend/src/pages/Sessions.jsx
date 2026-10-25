import { useEffect, useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { Plus, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { sessionService, getErrorMessage } from '../api/services';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import SessionFormModal from '../components/sessions/SessionFormModal';
import SessionRow from '../components/sessions/SessionRow';

export default function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ pages: 1, total: 0 });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const loadSessions = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await sessionService.list({
        page,
        limit: 10,
        subject: filterSubject || undefined,
      });
      setSessions(data.sessions);
      setPagination(data.pagination);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, [page, filterSubject]);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    sessionService
      .subjects()
      .then(({ data }) => setSubjects(data.subjects))
      .catch(() => {});
  }, [sessions.length]);

  const openAdd = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (session) => {
    setEditing(session);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editing) {
        await sessionService.update(editing._id, payload);
        toast.success('Session updated');
      } else {
        await sessionService.create(payload);
        toast.success('Session added');
      }
      setModalOpen(false);
      setEditing(null);
      loadSessions();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeletingBusy(true);
    try {
      await sessionService.remove(deleting._id);
      toast.success('Session deleted');
      setDeleting(null);
      loadSessions();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Select
          value={filterSubject}
          onChange={(e) => {
            setFilterSubject(e.target.value);
            setPage(1);
          }}
          containerClassName="w-48"
        >
          <option value="">All subjects</option>
          {subjects.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Button icon={Plus} onClick={openAdd}>
          Add session
        </Button>
      </div>

      <Card padded={false}>
        {loading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner size={26} />
          </div>
        ) : sessions.length === 0 ? (
          <EmptyState
            icon={BookOpen}
            title="No sessions found"
            message="Try a different filter, or log your first study session."
            action={
              <Button size="sm" onClick={openAdd}>
                Add session
              </Button>
            }
          />
        ) : (
          <div className="px-5 sm:px-6">
            {sessions.map((s) => (
              <SessionRow key={s._id} session={s} onEdit={openEdit} onDelete={setDeleting} />
            ))}
          </div>
        )}
      </Card>

      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-ink-800"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-sm text-slate-500">
            Page {page} of {pagination.pages}
          </span>
          <button
            disabled={page >= pagination.pages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-ink-800"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      <SessionFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
        initialData={editing}
        subjects={subjects}
        saving={saving}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={handleDelete}
        title="Delete session?"
        message={`This will permanently remove "${deleting?.subject}" from your history.`}
        confirming={deletingBusy}
      />
    </div>
  );
}
