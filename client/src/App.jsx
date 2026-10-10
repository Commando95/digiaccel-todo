import { useEffect, useMemo, useState } from 'react';
import { addDays, format, isSameDay, startOfWeek } from 'date-fns';
import { Bell, CalendarDays, Check, CheckSquare, Circle, Clock3, Pencil, Plus, Search, Settings, Trash2, X, ChevronLeft } from 'lucide-react';
import { taskApi } from './services/api';
import TaskModal from './components/TaskModal';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [screen, setScreen] = useState('home');

  async function loadTasks() {
    setLoading(true); setLoadError('');
    try { const data = await taskApi.list(); setTasks(data.tasks || []); }
    catch (error) { setLoadError(error.message); }
    finally { setLoading(false); }
  }
  useEffect(() => { loadTasks(); }, []);
  useEffect(() => { if (!toast) return undefined; const timer = setTimeout(() => setToast(''), 2600); return () => clearTimeout(timer); }, [toast]);

  const completed = tasks.filter(t => t.status === 'Completed').length;
  const open = tasks.length - completed;
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekTasks = tasks.filter(t => { const d = new Date(t.dueAt); return d >= weekStart && d < addDays(weekStart, 7); });
  const weekDone = weekTasks.filter(t => t.status === 'Completed').length;
  const progress = weekTasks.length ? Math.round(weekDone / weekTasks.length * 100) : 0;
  const shownTasks = useMemo(() => tasks.filter(t => {
    const matches = `${t.title} ${t.description || ''}`.toLowerCase().includes(query.trim().toLowerCase());
    return matches && (screen !== 'in-progress' || t.status !== 'Completed') && (screen !== 'completed' || t.status === 'Completed') && (screen !== 'home' || isSameDay(new Date(t.dueAt), selectedDate));
  }).sort((a,b) => new Date(a.dueAt)-new Date(b.dueAt)), [tasks, query, screen, selectedDate]);

  async function saveTask(payload) {
    setSaving(true);
    try {
      if (editingTask) await taskApi.update(editingTask._id, payload); else await taskApi.create(payload);
      await loadTasks(); setModalOpen(false); setEditingTask(null); setToast(editingTask ? 'Task updated' : 'Task created');
    } finally { setSaving(false); }
  }
  async function toggleTask(task) {
    try { const result = await taskApi.update(task._id, { status: task.status === 'Completed' ? 'In Progress' : 'Completed' }); setTasks(items => items.map(item => item._id === task._id ? result.task : item)); }
    catch (error) { setToast(error.message); }
  }
  async function deleteTask(task) {
    if (!window.confirm(`Delete “${task.title}”?`)) return;
    try { await taskApi.remove(task._id); setTasks(items => items.filter(item => item._id !== task._id)); setToast('Task deleted'); }
    catch (error) { setToast(error.message); }
  }
  function createTask() { setEditingTask(null); setModalOpen(true); }
  function editTask(task) { setEditingTask(task); setModalOpen(true); }

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfWeek(new Date(), { weekStartsOn: 1 }), i));
  return <div className="mobile-app-shell">
    <div className="mobile-app">
      <header className="mobile-header">
        {screen === 'search' || screen === 'in-progress' || screen === 'completed' ? <button className="plain-icon" aria-label="Back to home" onClick={() => { setScreen('home'); setQuery(''); }}><ChevronLeft/></button> : <button className="app-logo" aria-label="Daymark home" onClick={() => setScreen('home')}><CheckSquare size={21}/></button>}
        <div className="brand-name">daymark<span>.</span></div>
        <div className="header-actions"><button className="plain-icon" aria-label="Settings" onClick={() => setToast('Settings are not part of this assessment')}><Settings size={19}/></button><button className="plain-icon" aria-label="Notifications" onClick={() => setToast('You are all caught up')}><Bell size={19}/></button></div>
      </header>

      {screen === 'onboarding' ? <section className="onboarding-screen"><div className="onboarding-art"><div className="art-circle"/><div className="art-zigzag">⌁⌁⌁<br/>⌁⌁⌁<br/>⌁⌁⌁</div></div><div className="onboarding-copy"><h1>Manage What To Do</h1><p>The best way to manage what you have to do, don't forget your plans.</p><button className="primary-button wide-button" onClick={() => setScreen('home')}>Get Started</button></div></section> : <>
        <main className="mobile-content">
          <div className="mobile-title-row"><div><p className="muted-overline">YOUR PERSONAL PLANNER</p><h1>{screen === 'home' ? 'Make room for what matters.' : screen === 'search' ? 'Find a task' : screen === 'completed' ? 'Completed tasks' : 'In progress'}</h1></div><div className="today-date"><span>{format(new Date(), 'EEE')}</span><strong>{format(new Date(), 'd')}</strong></div></div>

          {screen === 'home' && <>
            <div className="search-field"><Search size={18}/><input aria-label="Search tasks" placeholder="Search for a task" value={query} onFocus={() => setScreen('search')} onChange={e => setQuery(e.target.value)}/></div>
            <div className="date-strip" aria-label="Choose a day">{weekDays.map(day => <button key={day.toISOString()} className={`date-day ${isSameDay(day, selectedDate) ? 'date-selected' : ''}`} onClick={() => setSelectedDate(day)}><span>{format(day, 'EEE')}</span><strong>{format(day, 'dd')}</strong>{isSameDay(day, new Date()) && <i/>}</button>)}</div>
            <section className="summary-pair"><article className="summary-tile complete-tile"><div className="tile-label"><span className="tile-icon"><CheckSquare size={19}/></span><span>Task Complete</span></div><div className="tile-number">{String(completed).padStart(2,'0')} <small>All time</small></div></article><article className="summary-tile pending-tile"><div className="tile-label"><span className="tile-icon"><X size={19}/></span><span>Task Pending</span></div><div className="tile-number">{String(open).padStart(2,'0')} <small>To do</small></div></article></section>
            <section className="progress-section"><div className="section-title"><h2>Weekly Progress</h2><span>{progress}%</span></div><div className="progress-track"><span style={{width:`${progress}%`}}/></div><p>{weekDone} of {weekTasks.length} tasks completed this week</p></section>
          </>}

          {screen === 'search' && <div className="search-field search-page-field"><Search size={18}/><input autoFocus aria-label="Search tasks" placeholder="Search for a task" value={query} onChange={e => setQuery(e.target.value)}/><button className="plain-icon" aria-label="Clear search" onClick={() => setQuery('')}><X size={16}/></button></div>}
          <section className="today-section"><div className="section-title"><h2>{screen === 'home' ? 'Tasks Today' : screen === 'search' ? 'Search results' : screen === 'completed' ? 'Completed' : 'In progress'}</h2><button className="text-button" onClick={() => { setScreen(screen === 'home' ? 'search' : 'home'); if (screen === 'home') setQuery(''); }}>{screen === 'home' ? 'View All' : 'Home'}</button></div>
            {loadError && <div className="error-message"><p>{loadError}</p><button onClick={loadTasks}>Retry</button></div>}
            {loading ? <p className="state-message">Loading your tasks…</p> : shownTasks.length === 0 ? <div className="empty-tasks"><CalendarDays size={27}/><strong>{query ? 'No matching tasks' : 'Nothing planned here'}</strong><span>{query ? 'Try another keyword.' : 'Add a task to get started.'}</span></div> : <div className="task-list">{shownTasks.map(task => { const done = task.status === 'Completed'; return <article className={`simple-task ${done ? 'task-is-done' : ''}`} key={task._id}><button className={`task-checkbox ${done ? 'checkbox-done' : ''}`} aria-label={done ? `Mark ${task.title} in progress` : `Complete ${task.title}`} onClick={() => toggleTask(task)}>{done && <Check size={13}/>}</button><button className="task-content" onClick={() => editTask(task)}><strong>{task.title}</strong>{task.description && <span>{task.description}</span>}<small><Clock3 size={12}/>{format(new Date(task.dueAt), 'MMM d, h:mm a')}<b>·</b>{task.priority || 'Medium'}</small></button><div className="task-row-actions"><button className="plain-icon" aria-label={`Edit ${task.title}`} onClick={() => editTask(task)}><Pencil size={16}/></button><button className="plain-icon" aria-label={`Delete ${task.title}`} onClick={() => deleteTask(task)}><Trash2 size={16}/></button></div></article>; })}</div>}
          </section>
        </main>
        <button className="floating-add" onClick={createTask} aria-label="Add new task"><Plus size={28}/></button>
        <nav className="bottom-nav" aria-label="Task filters"><button className={screen === 'home' ? 'bottom-nav-active' : ''} onClick={() => { setScreen('home'); setQuery(''); }}><CalendarDays size={19}/><span>Home</span></button><button className={screen === 'in-progress' ? 'bottom-nav-active' : ''} onClick={() => setScreen('in-progress')}><Circle size={19}/><span>Pending</span></button><button className={screen === 'completed' ? 'bottom-nav-active' : ''} onClick={() => setScreen('completed')}><CheckSquare size={19}/><span>Completed</span></button><button className={screen === 'search' ? 'bottom-nav-active' : ''} onClick={() => setScreen('search')}><Search size={19}/><span>Search</span></button></nav>
      </>}
    </div>
    {modalOpen && <TaskModal task={editingTask} onClose={() => { setModalOpen(false); setEditingTask(null); }} onSave={saveTask} saving={saving}/>}
    {toast && <div className="toast" role="status">{toast}<button aria-label="Dismiss notification" onClick={() => setToast('')}><X size={15}/></button></div>}
  </div>;
}
