import { container } from 'inzect';
import { Logger } from '~examples/modules/logger';

container.register({
  token: 'logger',
  provider: {
    useClass: Logger,
  },
});
