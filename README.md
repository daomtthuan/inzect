# **Inzect**

[![npm](https://img.shields.io/npm/v/inzect.svg)](https://www.npmjs.com/package/inzect)
[![npm](https://img.shields.io/npm/dt/inzect.svg)](https://www.npmjs.com/package/inzect)

> **Inzect** is a lightweight injection container for TypeScript and JavaScript.\
> It is built upon thee **[Stage 3 Decorators Proposal](https://github.com/tc39/proposal-decorators)**.

## 📑 Table of contents

- [📑 Table of contents](#-table-of-contents)
- [⚙️ Installation](#️-installation)
- [📘 APIs](#-apis)
  - [Decorators](#decorators)
    - [`@Injectable()`](#injectable)
    - [`@Inject()`](#inject)
    - [`@Scope()`](#scope)
  - [Container](#container)
    - [`container.register()`](#containerregister)
    - [`container.unregister()`](#containerunregister)
    - [`container.isRegistered()`](#containerisregistered)
    - [`container.clear()`](#containerclear)
    - [`container.resolve()`](#containerresolve)
    - [`container.createChild()`](#containercreatechild)
  - [Injection](#injection)
    - [Token](#token)
    - [Provider](#provider)
    - [Lifecycle Scope](#lifecycle-scope)
- [🧪 Planned Features](#-planned-features)
  - [Circular Dependencies](#circular-dependencies)
  - [Disposable Instances](#disposable-instances)
  - [Interception](#interception)
- [📄 License](#-license)
- [🤝 Contributing](#-contributing)

## ⚙️ Installation

Install by `npm`

```sh
npm install --save inzect
```

**or** install with `yarn`

```sh
yarn add inzect
```

**or** install with `pnpm`

```sh
pnpm add inzect
```

**Inzect is built upon the [Stage 3 Decorators Proposal](https://github.com/tc39/proposal-decorators)**.\
Please ensure that your `tsconfig.json` is configured to support Stage 3 decorators.\
Specifically, **do not enable** `experimentalDecorators` or `emitDecoratorMetadata`, or simply omit them from the configuration:

```json
// tsconfig.json

{
  "compilerOptions": {
    // ...
    "experimentalDecorators": false,
    "emitDecoratorMetadata": false
  }
}
```

## 📘 APIs

**Inzect** performs [Constructor Injection](https://en.wikipedia.org/wiki/Dependency_injection#Constructor_injection)
on the constructors of decorated classes.

### Decorators

#### `@Injectable()`

Marks a class as available for dependency injection.
Use this decorator to register a class as a provider that can be injected into other classes.

**Parameters**

- `token` — Injection Token (see [Token](#token)). Leave empty to use the decorated `class` as the token.
- `scope` (**default**: `Lifecycle.Transient`) — Lifecycle scope (see [Lifecycle Scope](#lifecycle-scope)).

**Usage**

```ts
// logger-service.ts

import { Injectable } from 'inzect';

@Injectable()
export class Logger {
  public log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}
```

```ts
// index.ts

import { container } from 'inzect';
import { Logger } from '~examples/modules/logger';

const logger = container.resolve(Logger);
logger.log('Hello world!');
```

#### `@Inject()`

Specifies a dependency to be injected.
Use this decorator to inject into class fields or class properties. Or use this decorator to inject into constructor parameters.

1. Inject into class fields or class properties.

   **Parameters**

   - `token` — Injection Token (see [Token](#token)).
   - `optional` (**default**: `false`) — Whether the dependency is optional.

   **Usage**

   ```ts
   // app.ts

   import { Inject } from 'inzect';
   import { Logger } from '~examples/modules/logger';

   export class App {
     @Inject(Logger)
     readonly #logger!: Logger;

     run(): void {
       this.#logger.log('Hello world!');
     }
   }
   ```

2. Inject into constructor parameters.

   **Parameters**

   - `injects` — List of `Inject Parameter`. Inject parameters are used to inject dependencies into the constructor.

   **Usage**

   ```ts
   // app.ts

   import { Inject } from 'inzect';
   import { Logger } from '~examples/modules/logger';

   @Inject([Logger])
   export class App {
     readonly #logger: Logger;

     public constructor(logger: Logger) {
       this.#logger = logger;
     }

     run(): void {
       this.#logger.log('Hello world!');
     }
   }
   ```

#### `@Scope()`

Defines the lifecycle scope of a provider.
Use this decorator to control how and when instances are created.

**Parameters**

- `scope` (**default**: `Lifecycle.Transient`) — Lifecycle scope (see [Lifecycle Scope](#lifecycle-scope)).

**Usage**

```ts
// database.ts

import { Lifecycle, Scope } from 'inzect';

@Scope(Lifecycle.Singleton)
export class Database {
  public async connect(): Promise<void> {
    console.log('Database connected');
  }
}
```

### Container

The `Container` is the core of the **Inzect** dependency injection system. It manages provider registration, resolution, and instance lifecycle.\
The general principle behind [Inversion of Control (IoC)](https://en.wikipedia.org/wiki/Inversion_of_control) containers is:
**you give the container a token, and in exchange you get an instance or value**.

**Inzect** adheres to the [Stage 3 Decorators](https://github.com/tc39/proposal-decorators) specification of ECMAScript.
Unlike legacy decorators, **Stage 3 does not support `emitDecoratorMetadata`**, which means the container **cannot infer types** from TypeScript metadata.

Therefore, **you must explicitly specify the token to inject in most cases**, using the `@Inject()` to decorate (see [Inject](#inject)).

#### `container.register()`

Registers a provider with the container.

**Parameters**

- `options.token` — Injection Token (see [Token](#token)).
- `options.provider` — Injection Provider (see [Provider](#provider)).
- `options.scope` (**default**: `Lifecycle.Transient`) — Lifecycle scope (see [Lifecycle Scope](#lifecycle-scope)).

**Usage**

```ts
// index.ts

import { container, Lifecycle } from 'inzect';
import { Logger } from '~examples/modules/logger';

container.register({
  token: 'logger',
  provider: {
    useClass: Logger,
  },
  scope: Lifecycle.Resolution,
});
```

#### `container.unregister()`

Unregister a dependency.

**Parameters**

- `token` — Injection Token (see [Token](#token)).

**Usage**

```ts
// index.ts

import { container } from 'inzect';

class Service {}

container.register({
  token: Service,
  provider: {
    useClass: Service,
  },
});

console.log(container.isRegistered(Service)); // true

container.unregister(Service);
console.log(container.isRegistered(Service)); // false
```

#### `container.isRegistered()`

Check if a dependency is registered.\
It only checks the current container, not the parent containers.

**Parameters**

- `token` — Injection Token (see [Token](#token)).

**Usage**

```ts
// index.ts

import { container, Injectable } from 'inzect';

@Injectable()
class Service {}

console.log(container.isRegistered(Service)); // true
console.log(container.isRegistered('some-token')); // false
```

#### `container.clear()`

Clears all registered dependencies.
It only clears the current container, not the parent containers.

**Usage**

```ts
// index.ts

import { container } from 'inzect';

class Service {}

container.register({
  token: Service,
  provider: {
    useClass: Service,
  },
});

console.log(container.isRegistered(Service)); // true

container.clear();
console.log(container.isRegistered(Service)); // false
```

#### `container.resolve()`

Resolves a dependency.

**Parameters**

- `token` — Injection Token (see [Token](#token)).
- `optional` (**default**: `false`) — Whether the dependency is optional.

**Usage**

```ts
// index.ts

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
```

#### `container.createChild()`

Creates a child container that shares access to the registrations of its parent.\
When resolving a dependency in the child container, if the token is not registered locally, the lookup will fall back to the parent container.

**Usage**

```ts
// index.ts

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
```

Sharing access to the registrations of its parent

```ts
// index.ts

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
```

### Injection

#### Token

An **injection token** is used to identify a provider.

Such tokens can be:

- Class: `class`, `abstract class`
- Primitive: `string`, `number`, `boolean`, `symbol`, `bigint`

#### Provider

##### Class Injection Provider

A **class injection provider** is used to provide an instance of a class.

**Properties**

- `useClass` — Class to provide.

**Usage**

```ts
// index.ts

import { container } from 'inzect';
import { Logger } from '~examples/modules/logger';

container.register({
  token: 'logger',
  provider: {
    useClass: Logger,
  },
});
```

##### Value Injection Provider

A **value injection provider** is used to provide a value.

**Properties**

- `useValue` — Value to provide.

**Usage**

```ts
// index.ts

import { container } from 'inzect';

container.register({
  token: 'isProduction',
  provider: {
    useValue: process.env['NODE_ENV'] === 'production',
  },
});
```

##### Factory Injection Provider

A **factory injection provider** is used to provide an instance using a factory function.

**Properties**

- `useFactory` — Factory function.
- `inject` — List of `Inject Parameter`. Inject parameters are used to inject dependencies into the factory function.

**Usage**

```ts
// index.ts

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
```

#### Lifecycle Scope

The **lifecycle scope** of a provider defines how and when instances are created and reused.

**Values**

- `Lifecycle.Singleton` — One shared instance across the entire application.
- `Lifecycle.Transient` — A new instance is created every time the provider is injected.
- `Lifecycle.Resolution` — A new instance is created per resolution graph (i.e. per `container.resolve()` call), and reused within that resolution graph.
- `Lifecycle.Container` — A new instance is created per container (i.e. per `container.createChild()` call), and reused within that container itself.

**Usage**

1. Singleton Scope

   ```ts
   // index.ts

   import { container, Lifecycle, Scope } from 'inzect';

   @Scope(Lifecycle.Singleton)
   class Service {}

   const service1 = container.resolve(Service);
   const service2 = container.resolve(Service);

   console.log(service1 === service2); // true
   ```

2. Transient Scope

   ```ts
   // index.ts

   import { container, Lifecycle, Scope } from 'inzect';

   @Scope(Lifecycle.Transient)
   class Service {}

   const service1 = container.resolve(Service);
   const service2 = container.resolve(Service);

   console.log(service1 === service2); // false
   ```

3. Resolution Scope

   ```ts
   // index.ts

   import { container, Inject, Lifecycle, Scope } from 'inzect';

   @Scope(Lifecycle.Resolution)
   class Service {}

   @Inject([Service])
   class App {
     @Inject(Service)
     readonly #service1!: Service;
     readonly #service2: Service;

     public constructor(service2: Service) {
       this.#service2 = service2;
     }

     run(): void {
       console.log(this.#service1 === this.#service2); // true
     }
   }

   const app = container.resolve(App);
   app.run();
   ```

4. Container Scope

   ```ts
   // index.ts

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
   ```

## 🧪 Planned Features

The following features are not yet implemented in **Inzect** but are planned for future releases:

### Circular Dependencies

Support for automatically resolving circular dependencies using lazy proxies or factory wrappers.
This requires careful lifecycle management and reference deferral.

### Disposable Instances

Support for `[Symbol.dispose]` and `[Symbol.asyncDispose]` to allow cleanup logic for services (e.g., closing DB connections, unsubscribing from streams).

### Interception

This enables you to hook into the container's internal resolution flow to perform tasks like:

- Logging tokens being resolved
- Measuring resolution time
- Auditing resolved instances

It provides two main hooks:

- `beforeResolution` – called before the container resolves a dependency
- `afterResolution` – called after the instance is resolved

This is useful for logging, metrics, and debugging.

## 📄 License

This project is licensed under the [MIT License](./LICENSE).

You are free to use, modify, and distribute this library in both commercial and non-commercial projects.

---

## 🤝 Contributing

**Inzect** is an open-source project, and contributions are welcome!

Whether it's a bug report, feature request, documentation improvement, or pull request — your input helps make the library better for everyone.

To get started:

1. Fork the repository
2. Create a feature branch
3. Submit a pull request

For major changes or architectural discussions, please open an issue first to discuss your ideas.

> Together we can build a more powerful dependency injection system for TypeScript.
