import { container } from 'inzect';
import { Logger } from '~examples/modules/logger';

container.register({
  token: 'database-connection',
  provider: {
    inject: [
      Logger,
      {
        token: 'isProduction',
        optional: true,
      },
    ],
    useFactory: (logger: Logger, isProduction?: boolean) => {
      if (isProduction) {
        return 'production-connection';
      }

      logger.log('Using development connection');
      return 'development-connection';
    },
  },
});
