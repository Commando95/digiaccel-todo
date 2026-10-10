import { Calendar, Check, Circle, Clock3, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function TaskCard({ task, onToggle, onEdit, onDelete }) {
  const completed = task.status === 'Completed';
  return <article className={`task-card ${completed ? 'is-complete' : ''}`}>
    <button className={`task-check ${completed ? 'checked' : ''}`} onClick={() => onToggle(task)} aria-label={completed ? `Mark ${task.title} in progress` : `Mark ${task.title} completed`} title={completed ? 'Mark in progress' : 'Mark completed'}>{completed ? <Check size={14}/> : <Circle size={18}/>}</button>
    <div className="task-main"><div className="task-title-line"><h3>{task.title}</h3><span className={`priority priority-${(task.priority || 'Medium').toLowerCase()}`}>{task.priority || 'Medium'}</span></div>{task.description && <p className="task-description">{task.description}</p>}<div className="task-meta"><span><Calendar size={13}/>{format(new Date(task.dueAt), 'EEE, MMM d')}</span><span><Clock3 size={13}/>{format(new Date(task.dueAt), 'h:mm a')}</span><span className={`status-text ${completed ? 'done' : ''}`}>{completed ? 'Completed' : 'In progress'}</span></div></div>
    <div className="task-actions"><button className="icon-button small" onClick={() => onEdit(task)} aria-label={`Edit ${task.title}`} title="Edit task"><Pencil size={15}/></button><button className="icon-button small delete-action" onClick={() => onDelete(task)} aria-label={`Delete ${task.title}`} title="Delete task"><Trash2 size={15}/></button></div>
  </article>;
}
