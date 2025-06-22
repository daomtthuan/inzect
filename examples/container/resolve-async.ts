import { container } from 'inzect';

const TIMESTAMP_TOKEN = Symbol('data');

// Fake async data
function fetchTimestamp(): Promise<number> {
  return new Promise<number>((resolve) => {
    setTimeout(() => {
      resolve(Date.now());
    }, 1000);
  });
}

container.register({
  token: TIMESTAMP_TOKEN,
  provider: {
    useFactory: fetchTimestamp,
  },
});

const data = await container.resolveAsync(TIMESTAMP_TOKEN);
console.log(data); // Current timestamp
