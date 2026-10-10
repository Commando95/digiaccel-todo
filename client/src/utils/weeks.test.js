import { describe, expect, it } from 'vitest';
import { getWeekStart, groupTasksByWeek } from './weeks';

describe('week helpers', () => {
  it('starts a week on Monday', () => {
    expect(getWeekStart('2026-10-11T12:00:00').getDay()).toBe(1);
  });
  it('groups tasks that fall in the same Monday-Sunday week', () => {
    const result = groupTasksByWeek([
      { _id: 'a', dueAt: '2026-10-05T09:00:00' },
      { _id: 'b', dueAt: '2026-10-11T09:00:00' },
      { _id: 'c', dueAt: '2026-10-12T09:00:00' }
    ]);
    expect(result).toHaveLength(2);
    expect(result[0].tasks).toHaveLength(2);
    expect(result[1].tasks).toHaveLength(1);
  });
});
