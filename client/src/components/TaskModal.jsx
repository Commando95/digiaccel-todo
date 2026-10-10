import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, X } from 'lucide-react';

const pad = (value) => String(value).padStart(2, '0');
const dateValue = (value) => {
  const date = new Date(value);
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};
const timeValue = (value) => {
  const date = new Date(value);
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
};
const blankTask = () => {
  const start = new Date(Date.now() + 30 * 60 * 1000);
  const end = new Date(start.getTime() + 60 * 60 * 1000);
  return {
    title: '', description: '', date: dateValue(end), startTime: timeValue(start),
    endTime: timeValue(end), priority: 'Medium', status: 'In Progress'
  };
};

export default function TaskModal({ task, onClose, onSave, saving }) {
  const [form, setForm] = useState(blankTask);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!task) setForm(blankTask());
    else setForm({
      title: task.title || '', description: task.description || '', date: dateValue(task.dueAt),
      startTime: task.startTime || timeValue(new Date(new Date(task.dueAt).getTime() - 60 * 60 * 1000)),
      endTime: timeValue(task.dueAt), priority: task.priority || 'Medium', status: task.status || 'In Progress'
    });
    setError('');
  }, [task]);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    if (!form.title.trim()) return setError('Please enter a task title.');
    if (!form.date || !form.endTime) return setError('Please choose a date and end time.');
    const dueAt = new Date(`${form.date}T${form.endTime}`);
    if (Number.isNaN(dueAt.getTime())) return setError('Please choose a valid date and time.');
    if (form.startTime && form.endTime <= form.startTime) return setError('End time must be after start time.');
    setError('');
    try {
      await onSave({
        title: form.title.trim(), description: form.description.trim(), dueAt: dueAt.toISOString(),
        startTime: form.startTime, priority: form.priority, status: form.status
      });
    } catch (err) { setError(err.message || 'Could not save this task.'); }
  }

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="task-modal-title">
      <div className="modal-heading">
        <h2 id="task-modal-title">{task ? 'Edit Task' : 'Add New Task'}</h2>
        <button className="icon-button modal-close" onClick={onClose} aria-label="Close dialog"><X size={20}/></button>
      </div>
      <form onSubmit={submit} className="task-form">
        <label className="field full"><span>Task title</span><input autoFocus name="title" maxLength={120} value={form.title} onChange={update} placeholder="Enter task title" required /></label>
        <div className="field full"><span>Set Time</span><div className="time-fields">
          <label className="time-input"><Clock3 size={14}/><span className="sr-only">Start time</span><input aria-label="Start time" type="time" name="startTime" value={form.startTime} onChange={update} required /></label>
          <label className="time-input"><Clock3 size={14}/><span className="sr-only">End time</span><input aria-label="End time" type="time" name="endTime" value={form.endTime} onChange={update} required /></label>
        </div></div>
        <label className="field full"><span>Set Date</span><div className="date-input"><input aria-label="Task date" type="date" name="date" value={form.date} onChange={update} required/><CalendarDays size={16}/></div></label>
        <label className="field full"><span>Description</span><textarea name="description" maxLength={2000} value={form.description} onChange={update} placeholder="Add Description" rows={4}/></label>
        <div className="form-row extra-fields"><label className="field"><span>Priority</span><select name="priority" value={form.priority} onChange={update}><option>Low</option><option>Medium</option><option>High</option></select></label><label className="field"><span>Status</span><select name="status" value={form.status} onChange={update}><option>In Progress</option><option>Completed</option></select></label></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="modal-actions"><button type="submit" className="button button-primary" disabled={saving}>{saving ? 'Saving…' : task ? 'Save changes' : 'Create task'}</button></div>
      </form>
    </section>
  </div>;
}
