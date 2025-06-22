import { container, Inject } from 'dist';
import { expect, test } from 'vitest';

const get = async (): Promise<number> =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1);
    }, 1000);
  });

@Inject(['one'])
class A {
  public one;

  public constructor(one: number) {
    this.one = one;
  }
}

container.register({
  token: 'one',
  provider: {
    useFactory: async () => {
      return get();
    },
  },
});
container.register({
  token: 'A',
  provider: {
    useClass: A,
  },
});

test('Playground', async () => {
  const one = await container.resolveAsync('one');
  const a = await container.resolveAsync<A>('A');

  expect(one).toBe(1);
  expect(a.one).toBe(1);
});
