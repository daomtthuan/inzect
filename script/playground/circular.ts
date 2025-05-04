import { container, Inject, Injectable, Lifecycle } from 'inzect';
import { expect } from '~playground/modules/test';

@Injectable({ token: 'ModuleA', scope: Lifecycle.Singleton })
class ModuleA {
  @Inject(() => 'ModuleB')
  public readonly moduleB!: ModuleB;
}

@Injectable({ token: 'ModuleB', scope: Lifecycle.Singleton })
class ModuleB {
  @Inject(() => 'ModuleA')
  public readonly moduleA!: ModuleA;
}

const moduleA = container.resolve(ModuleA);
const moduleB = container.resolve(ModuleB);

expect('moduleA.moduleB === moduleB', moduleA.moduleB === moduleB, true);
expect('moduleB.moduleA === moduleA', moduleB.moduleA === moduleA, true);
expect('moduleA.moduleB.moduleA === moduleA', moduleA.moduleB.moduleA === moduleA, true);
expect('moduleB.moduleA.moduleB === moduleB', moduleB.moduleA.moduleB === moduleB, true);
