import { container, Lifecycle } from 'inzect';

class Service {}

container.register({
  token: 'Service',
  provider: {
    useClass: Service,
  },
  scope: Lifecycle.Singleton,
});

const childContainer1 = container.createChild();
const childContainer2 = container.createChild();

const service1 = childContainer1.resolve('Service');
const service2 = childContainer2.resolve('Service');

console.log(service1 === service2); // true
