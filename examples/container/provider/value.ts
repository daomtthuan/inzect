import { container } from 'inzect';

container.register({
  token: 'isProduction',
  provider: {
    useValue: process.env['NODE_ENV'] === 'production',
  },
});
