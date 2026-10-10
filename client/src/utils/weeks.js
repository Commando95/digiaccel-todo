import { addDays, endOfDay, format, isSameDay, startOfDay, startOfWeek } from 'date-fns';

export function getWeekStart(date) {
  return startOfWeek(new Date(date), { weekStartsOn: 1 });
}

export function getWeekEnd(date) {
  return endOfDay(addDays(getWeekStart(date), 6));
}

export function getWeekKey(date) {
  return format(getWeekStart(date), 'yyyy-MM-dd');
}

export function groupTasksByWeek(tasks) {
  const groups = new Map();
  tasks.forEach((task) => {
    const start = getWeekStart(task.dueAt);
    const key = format(start, 'yyyy-MM-dd');
    if (!groups.has(key)) groups.set(key, { key, start, end: addDays(start, 6), tasks: [] });
    groups.get(key).tasks.push(task);
  });
  return [...groups.values()].sort((a, b) => a.start - b.start);
}

export function weekLabel(start, end) {
  const a = format(start, 'MMM d');
  const b = format(end, 'MMM d, yyyy');
  return `${a} – ${b}`;
}

export function toDateTimeLocal(date) {
  const value = new Date(date);
  const offset = value.getTimezoneOffset() * 60000;
  return new Date(value.getTime() - offset).toISOString().slice(0, 16);
}

export function isToday(date) {
  return isSameDay(new Date(date), new Date());
}
