import { container } from 'inzect';
import { Logger } from '~examples/modules/logger';

const LOGGER_TOKEN = Symbol('logger');

container.register({
  token: LOGGER_TOKEN,
  provider: {
    useClass: Logger,
  },
});

const logger = container.resolve<Logger>(LOGGER_TOKEN);
logger.log('Hello world!');
