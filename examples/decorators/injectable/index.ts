import { container } from 'inzect';
import { Logger } from '~examples/modules/logger';

const logger = container.resolve(Logger);
logger.log('Hello world!');
