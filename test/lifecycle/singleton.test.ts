import { container, Inject, Injectable, Lifecycle, Scope } from 'inzect';
import { beforeEach } from 'node:test';
import { describe, test } from 'vitest';
import { Base } from '~test/common/data/base';
import { expectService } from '~test/common/utils/expect';

describe('Lifecycle Singleton Scope', () => {
  const TOKEN = Symbol('Service');

  describe('container.register', () => {
    beforeEach(() => {
      container.clear();
    });

    test('should return same instance when resolving using class as token', () => {
      class Service extends Base {}

      container.register({
        token: Service,
        provider: {
          useClass: Service,
        },
        scope: Lifecycle.Singleton,
      });

      const service1 = container.resolve(Service);
      const service2 = container.resolve(Service);

      expectService.same(service1, service2);
    });

    test('should return same instance when resolving using symbol token', () => {
      class Service extends Base {}

      container.register({
        token: TOKEN,
        provider: {
          useClass: Service,
        },
        scope: Lifecycle.Singleton,
      });

      const service1 = container.resolve<Service>(TOKEN);
      const service2 = container.resolve<Service>(TOKEN);

      expectService.same(service1, service2);
    });

    test('should return different instances for different tokens of the same class', () => {
      class Service extends Base {}

      container.register({
        token: Service,
        provider: {
          useClass: Service,
        },
        scope: Lifecycle.Singleton,
      });
      container.register({
        token: TOKEN,
        provider: {
          useClass: Service,
        },
        scope: Lifecycle.Singleton,
      });

      const service1 = container.resolve(Service);
      const service2 = container.resolve<Service>(TOKEN);

      expectService.not.same(service1, service2);
    });
  });

  describe('@Injectable', () => {
    beforeEach(() => {
      container.clear();
    });

    test('should resolve same instance', () => {
      @Injectable(TOKEN, Lifecycle.Singleton)
      class Service extends Base {}

      const service1 = container.resolve<Service>(TOKEN);
      const service2 = container.resolve<Service>(TOKEN);

      expectService.same(service1, service2);
    });
  });

  describe('@Scope', () => {
    beforeEach(() => {
      container.clear();
    });

    test('should resolve same instance', () => {
      @Scope(Lifecycle.Singleton)
      class Service extends Base {}

      const service1 = container.resolve(Service);
      const service2 = container.resolve(Service);

      expectService.same(service1, service2);
    });
  });

  describe('Reuse across injection targets', () => {
    test('should share instance across multiple injection targets with @Inject constructor parameter', () => {
      class Service extends Base {}
      container.register({
        token: Service,
        provider: {
          useClass: Service,
        },
        scope: Lifecycle.Singleton,
      });

      @Inject([Service])
      class Module1 {
        public constructor(public service: Service) {}
      }

      @Inject([Service])
      class Module2 {
        public constructor(public service: Service) {}
      }

      const module1 = container.resolve(Module1);
      const module2 = container.resolve(Module2);

      expectService.same(module1.service, module2.service);
    });

    test('should share instance across multiple injection targets with @Inject property', () => {
      class Service extends Base {}
      container.register({
        token: Service,
        provider: {
          useClass: Service,
        },
        scope: Lifecycle.Singleton,
      });

      class Module1 {
        @Inject(Service)
        public service!: Service;
      }

      class Module2 {
        @Inject(Service)
        public service!: Service;
      }

      const module1 = container.resolve(Module1);
      const module2 = container.resolve(Module2);

      expectService.same(module1.service, module2.service);
    });

    test('should share instance across multiple injection targets with @Inject constructor parameter and @Inject property', () => {
      class Service extends Base {}
      container.register({
        token: Service,
        provider: {
          useClass: Service,
        },
        scope: Lifecycle.Singleton,
      });

      @Inject([Service])
      class Module1 {
        public constructor(public service: Service) {}
      }

      class Module2 {
        @Inject(Service)
        public service!: Service;
      }

      const module1 = container.resolve(Module1);
      const module2 = container.resolve(Module2);

      expectService.same(module1.service, module2.service);
    });
  });
});
