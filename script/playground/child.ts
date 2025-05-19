import { container, Lifecycle } from 'inzect';
import { expect } from '~playground/modules/test';

class Singleton {}

container.register({
  token: 'SingletonParent',
  provider: {
    useClass: Singleton,
  },
  scope: Lifecycle.Singleton,
});

const childContainer1 = container.createChild();
childContainer1.register({
  token: 'Singleton',
  provider: {
    useClass: Singleton,
  },
  scope: Lifecycle.Singleton,
});

const childContainer2 = container.createChild();
childContainer2.register({
  token: 'Singleton',
  provider: {
    useClass: Singleton,
  },
  scope: Lifecycle.Singleton,
});

const singletonParent1 = childContainer1.resolve('SingletonParent');
const singletonParent2 = childContainer2.resolve('SingletonParent');
const singleton1 = childContainer1.resolve('Singleton');
const singleton2 = childContainer2.resolve('Singleton');

expect('singletonParent1 === singletonParent2', singletonParent1 === singletonParent2, true);
expect('singleton1 === singleton2', singleton1 === singleton2, false);
