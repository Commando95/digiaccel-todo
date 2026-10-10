import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true, maxlength: [120, 'Title cannot exceed 120 characters'] },
  description: { type: String, trim: true, default: '', maxlength: [2000, 'Description cannot exceed 2000 characters'] },
  dueAt: { type: Date, required: [true, 'Date and time are required'] },
  startTime: { type: String, match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Start time must use HH:mm format'], default: '' },
  priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
  status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' }
}, { timestamps: true, versionKey: false });

taskSchema.index({ dueAt: 1, status: 1 });
taskSchema.index({ title: 'text', description: 'text' });

export default mongoose.model('Task', taskSchema);
