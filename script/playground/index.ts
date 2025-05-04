import { container, Inject, Injectable, Lifecycle } from 'inzect';
import { expect } from './common';

@Injectable({ token: 'A', scope: Lifecycle.Singleton })
class A {
  @Inject(() => 'B')
  public readonly b!: B;
}

@Injectable({ token: 'B', scope: Lifecycle.Singleton })
class B {
  @Inject(() => 'A')
  public readonly a!: A;
}

const a = container.resolve(A);

expect('a.b.b', a.b.a, a);
