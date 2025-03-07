import { describe, it, expect } from 'bun:test';
import { scrubStamp } from './github';

describe('scrubStamp', () => {
  it('does nothing when there is no stamp', () => {
    expect(scrubStamp('hello world')).toBe('hello world')
  });

  it('remove a stamp correctly', () => {
    const MOCK_DESCRIPTION = [
      "This is my PR",
      "It may not be the best, but I worked hard on it",
      "<!-- stamp start -->",
      "Blah blah",
      "<!-- stamp end -->",
    ];

    expect(scrubStamp(MOCK_DESCRIPTION.join('\n'))).toBe(MOCK_DESCRIPTION.slice(0, 2).join('\n'))
  });
});
