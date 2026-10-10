import test from 'node:test';
import assert from 'node:assert/strict';
import { validateTaskPayload } from '../src/utils/validateTaskPayload.js';

test('accepts a valid task with required fields and normalizes text', () => {
  const task = validateTaskPayload({ title: '  Prepare assessment  ', description: '  API work  ', dueAt: '2026-10-15T10:00:00.000Z', priority: 'High' });
  assert.equal(task.title, 'Prepare assessment');
  assert.equal(task.description, 'API work');
  assert.equal(task.priority, 'High');
  assert.ok(task.dueAt instanceof Date);
});
test('rejects a blank title', () => {
  assert.throws(() => validateTaskPayload({ title: '  ', dueAt: '2026-10-15T10:00:00.000Z' }), /Title is required/);
});
test('rejects a missing date', () => {
  assert.throws(() => validateTaskPayload({ title: 'A task' }), /valid date and time/);
});
test('rejects an invalid date', () => {
  assert.throws(() => validateTaskPayload({ title: 'A task', dueAt: 'not-a-date' }), /valid date and time/);
});
test('rejects an unsupported priority', () => {
  assert.throws(() => validateTaskPayload({ title: 'A task', dueAt: '2026-10-15', priority: 'Urgent' }), /Priority must be/);
});
test('rejects an unsupported status', () => {
  assert.throws(() => validateTaskPayload({ title: 'A task', dueAt: '2026-10-15', status: 'Pending' }), /Status must be/);
});
test('supports partial updates without requiring title and date', () => {
  assert.deepEqual(validateTaskPayload({ status: 'Completed' }, true), { status: 'Completed' });
});
test('rejects an empty partial update', () => {
  assert.deepEqual(validateTaskPayload({}, true), {});
});
