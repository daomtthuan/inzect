// import { container, Inject, Lifecycle, Scope } from 'inzect';
// import { expect } from '~playground/modules/test';

// @Scope(Lifecycle.Singleton)
// class Singleton {}

// @Scope(Lifecycle.Resolution)
// class Resolution {}

// @Scope(Lifecycle.Transient)
// @Inject([Singleton, Singleton, Resolution, Resolution])
// class Transient {
//   @Inject(Singleton)
//   public readonly singleton1!: Singleton;

//   @Inject(Singleton)
//   public readonly singleton2!: Singleton;

//   @Inject(Resolution)
//   public readonly resolution1!: Resolution;

//   @Inject(Resolution)
//   public readonly resolution2!: Resolution;

//   public constructor(
//     public readonly paramSingleton1: Singleton,
//     public readonly paramSingleton2: Singleton,
//     public readonly paramResolution1: Resolution,
//     public readonly paramResolution2: Resolution,
//   ) {}
// }

// const singleton1 = container.resolve(Singleton);
// const singleton2 = container.resolve(Singleton);
// expect('singleton1 === singleton2', singleton1 === singleton2, true);

// const resolution1 = container.resolve(Resolution);
// const resolution2 = container.resolve(Resolution);
// expect('resolution1 === resolution2', resolution1 === resolution2, false);

// const transient1 = container.resolve(Transient);
// const transient2 = container.resolve(Transient);
// expect('transient1 === transient2', transient1 === transient2, false);

// const transient3 = container.resolve(Transient);
// expect('transient3.singleton1 === transient3.singleton2', transient3.singleton1 === transient3.singleton2, true);
// expect('transient3.resolution1 === transient3.resolution2', transient3.resolution1 === transient3.resolution2, true);
// expect('transient3.paramSingleton1 === transient3.paramSingleton2', transient3.paramSingleton1 === transient3.paramSingleton2, true);
// expect('transient3.paramResolution1 === transient3.paramResolution2', transient3.paramResolution1 === transient3.paramResolution2, true);
// expect('transient3.singleton1 === transient3.paramSingleton1', transient3.singleton1 === transient3.paramSingleton1, true);
// expect('transient3.resolution1 === transient3.paramResolution1', transient3.resolution1 === transient3.paramResolution1, true);

import { container, Inject, Lifecycle, Scope } from 'inzect';
import { expect } from '~playground/modules/test';

@Scope(Lifecycle.Singleton)
class Singleton {}

@Scope(Lifecycle.Resolution)
class Resolution {}

@Scope(Lifecycle.Transient)
@Inject([Singleton, Resolution])
class Transient {
  @Inject(Singleton)
  public readonly singleton1!: Singleton;

  @Inject(Resolution)
  public readonly resolution1!: Resolution;

  public constructor(
    public readonly paramSingleton1: Singleton,
    public readonly paramResolution1: Resolution,
  ) {}
}

const transient = container.resolve(Transient);
expect('transient3.singleton1 === transient3.paramSingleton1', transient.singleton1 === transient.paramSingleton1, true);
expect('transient3.resolution1 === transient3.paramResolution1', transient.resolution1 === transient.paramResolution1, true);
