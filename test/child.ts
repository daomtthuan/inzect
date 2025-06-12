import { container, Lifecycle, ResolutionError } from 'inzect';
import { expect, performTest } from '~playground/modules/test';

class Singleton {}
class Transient {}
const childContainer1 = container.createChild();
const childContainer2 = container.createChild();

const clear = (): void => {
  container.clear();
  childContainer1.clear();
  childContainer2.clear();
};

performTest(
  () => {
    container.register({
      token: 'ParentSingleton',
      provider: {
        useClass: Singleton,
      },
      scope: Lifecycle.Singleton,
    });
    childContainer1.register({
      token: 'Singleton',
      provider: {
        useClass: Singleton,
      },
      scope: Lifecycle.Singleton,
    });
    childContainer2.register({
      token: 'Singleton',
      provider: {
        useClass: Singleton,
      },
      scope: Lifecycle.Singleton,
    });

    const parentSingleton1 = childContainer1.resolve('ParentSingleton');
    const parentSingleton2 = childContainer2.resolve('ParentSingleton');
    expect('parentSingleton1 === parentSingleton2', parentSingleton1 === parentSingleton2, true);

    const singleton1 = childContainer1.resolve('Singleton');
    const singleton2 = childContainer2.resolve('Singleton');
    expect('singleton1 === singleton2', singleton1 === singleton2, false);
  },
  { postTest: clear },
);

performTest(
  () => {
    container.register({
      token: 'ParentTransient',
      provider: {
        useClass: Transient,
      },
      scope: Lifecycle.Transient,
    });
    childContainer1.register({
      token: 'Transient1',
      provider: {
        useClass: Transient,
      },
      scope: Lifecycle.Transient,
    });
    childContainer2.register({
      token: 'Transient2',
      provider: {
        useClass: Transient,
      },
      scope: Lifecycle.Transient,
    });

    const parentTransient1 = childContainer1.resolve('ParentTransient');
    const parentTransient2 = childContainer2.resolve('ParentTransient');
    expect('parentTransient1 === parentTransient2', parentTransient1 === parentTransient2, false);

    let expectedError = null;
    try {
      childContainer1.resolve('Transient2');
    } catch (error) {
      expectedError = error;
    }
    expect('expectedError instanceof ResolutionError', expectedError instanceof ResolutionError, true);
  },
  { postTest: clear },
);

performTest(
  () => {
    container.register({
      token: 'Transient',
      provider: {
        useClass: Transient,
      },
      scope: Lifecycle.Container,
    });

    let expectedError = null;
    try {
      childContainer1.resolve('Transient');
    } catch (error) {
      expectedError = error;
    }
    expect('expectedError instanceof ResolutionError', expectedError instanceof ResolutionError, true);
  },
  { postTest: clear },
);
