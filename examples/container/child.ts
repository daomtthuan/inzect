import { container, Lifecycle } from 'inzect';

class Service {}

const childContainer1 = container.createChild();
childContainer1.register({
  token: 'Service',
  provider: {
    useClass: Service,
  },
  scope: Lifecycle.Singleton,
});

const childContainer2 = container.createChild();
childContainer2.register({
  token: 'Service',
  provider: {
    useClass: Service,
  },
  scope: Lifecycle.Singleton,
});

const service1 = childContainer1.resolve('Service');
const service2 = childContainer2.resolve('Service');

console.log(service1 === service2); // false
