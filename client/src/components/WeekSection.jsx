import { useState } from 'react';
import { addDays, format, isSameWeek } from 'date-fns';
import { ChevronDown, ChevronRight, CheckCheck, CircleDot, CalendarDays } from 'lucide-react';
import TaskCard from './TaskCard';
import { weekLabel } from '../utils/weeks';

export default function WeekSection({ group, onToggle, onEdit, onDelete, initiallyOpen = false }) {
  const [open, setOpen] = useState(initiallyOpen);
  const completed = group.tasks.filter((task) => task.status === 'Completed').length;
  const openCount = group.tasks.length - completed;
  const isCurrentWeek = isSameWeek(new Date(), group.start, { weekStartsOn: 1 });
  return <section className={`week-section ${isCurrentWeek ? 'current-week' : ''}`}>
    <button className="week-heading" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
      <span className="week-chevron">{open ? <ChevronDown size={18}/> : <ChevronRight size={18}/>}</span>
      <span className="week-date-icon"><CalendarDays size={18}/></span>
      <span className="week-heading-copy"><span className="week-title">{weekLabel(group.start, group.end)} {isCurrentWeek && <span className="current-pill">THIS WEEK</span>}</span><span className="week-subtitle">{format(group.start, 'EEEE')} – {format(addDays(group.start, 6), 'EEEE')}</span></span>
      <span className="week-stats"><span className="stat-open"><CircleDot size={13}/>{openCount} open</span><span className="stat-done"><CheckCheck size={14}/>{completed} done</span></span>
    </button>
    {open && <div className="week-content">{group.tasks.length ? group.tasks.map((task) => <TaskCard key={task._id} task={task} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete}/>) : <p className="week-empty">Nothing planned for this week yet.</p>}</div>}
  </section>;
}
