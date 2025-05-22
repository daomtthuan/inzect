import { container, Lifecycle } from 'inzect';

class Service {}

container.register({
  token: 'Service',
  provider: {
    useClass: Service,
  },
  scope: Lifecycle.Container,
});

const childContainer = container.createChild();

try {
  childContainer.resolve('Service');
} catch (error) {
  // It will throw an error because the scope is Container, childContainer can't resolve Service that is registered in global container
}
