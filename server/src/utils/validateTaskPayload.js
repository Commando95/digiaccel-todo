const allowedFields = ['title', 'description', 'dueAt', 'startTime', 'priority', 'status'];

export function validateTaskPayload(body, partial = false) {
  const source = body || {};
  const data = Object.fromEntries(allowedFields.filter((key) => Object.hasOwn(source, key)).map((key) => [key, source[key]]));
  if (!partial || Object.hasOwn(data, 'title')) {
    if (typeof data.title !== 'string' || !data.title.trim()) {
      const error = new Error('Title is required.'); error.status = 400; throw error;
    }
    data.title = data.title.trim();
  }
  if (!partial || Object.hasOwn(data, 'dueAt')) {
    const parsed = new Date(data.dueAt);
    if (!data.dueAt || Number.isNaN(parsed.getTime())) {
      const error = new Error('A valid date and time are required.'); error.status = 400; throw error;
    }
    data.dueAt = parsed;
  }
  if (Object.hasOwn(data, 'startTime') && data.startTime !== '' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(data.startTime)) {
    const error = new Error('Start time must use HH:mm format.'); error.status = 400; throw error;
  }
  if (Object.hasOwn(data, 'description') && typeof data.description !== 'string') {
    const error = new Error('Description must be text.'); error.status = 400; throw error;
  }
  if (Object.hasOwn(data, 'priority') && !['Low', 'Medium', 'High'].includes(data.priority)) {
    const error = new Error('Priority must be Low, Medium, or High.'); error.status = 400; throw error;
  }
  if (Object.hasOwn(data, 'status') && !['In Progress', 'Completed'].includes(data.status)) {
    const error = new Error('Status must be In Progress or Completed.'); error.status = 400; throw error;
  }
  if (Object.hasOwn(data, 'description')) data.description = data.description.trim();
  return data;
}
