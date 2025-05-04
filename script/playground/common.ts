/**
 * Expect.
 *
 * @param name Name.
 * @param value Value.
 * @param expected Expected value.
 */
export function expect(name: string, value: unknown, expected: unknown): void {
  console.log(name, value);
  if (value === expected) {
    console.log('  \x1b[32m%s\x1b[0m', 'Passed!');
  } else {
    console.error('  \x1b[31m%s\x1b[0m %s %o', 'Failed!', 'Expected:', expected);
  }
}
