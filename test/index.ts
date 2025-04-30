import Container, { Injectable, InjectionLifecycle } from 'tinydi';

@Injectable({ scope: InjectionLifecycle.Singleton })
class Greeter {
  public greet(): void {
    console.log('hello');
  }
}

const greeter1 = Container.resolve({ token: Greeter });
const greeter2 = Container.resolve({ token: Greeter });

console.log(greeter1 === greeter2);
