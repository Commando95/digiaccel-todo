import mongoose from 'mongoose';
import Task from '../models/Task.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validateTaskPayload } from '../utils/validateTaskPayload.js';

export const getTasks = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.status && ['In Progress', 'Completed'].includes(req.query.status)) filter.status = req.query.status;
  if (req.query.from || req.query.to) {
    filter.dueAt = {};
    if (req.query.from) {
      const from = new Date(req.query.from);
      if (Number.isNaN(from.getTime())) return res.status(400).json({ message: 'Invalid from date.' });
      filter.dueAt.$gte = from;
    }
    if (req.query.to) {
      const to = new Date(req.query.to);
      if (Number.isNaN(to.getTime())) return res.status(400).json({ message: 'Invalid to date.' });
      filter.dueAt.$lte = to;
    }
  }
  if (req.query.q?.trim()) {
    const escaped = req.query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    filter.$or = [{ title: { $regex: escaped, $options: 'i' } }, { description: { $regex: escaped, $options: 'i' } }];
  }
  const tasks = await Task.find(filter).sort({ dueAt: 1, createdAt: -1 }).lean();
  res.json({ tasks, count: tasks.length });
});

export const getTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ task });
});

export const createTask = asyncHandler(async (req, res) => {
  const data = validateTaskPayload(req.body);
  const task = await Task.create(data);
  res.status(201).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
  const data = validateTaskPayload(req.body, true);
  if (!Object.keys(data).length) return res.status(400).json({ message: 'Provide at least one task field to update.' });
  const task = await Task.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ task });
});

export const deleteTask = asyncHandler(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) return res.status(400).json({ message: 'Invalid task ID.' });
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) return res.status(404).json({ message: 'Task not found.' });
  res.json({ message: 'Task deleted successfully.', id: task.id });
});
