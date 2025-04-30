import container, { Inject, Injectable, InjectionLifecycle } from 'tinydi';

@Injectable({ scope: InjectionLifecycle.Singleton })
class Greeter {
  public greet(): void {
    console.log(`Hello`);
  }
}

class Person {
  @Inject({ token: Greeter })
  private readonly greeter!: Greeter;

  /** Say hello. */
  public sayHello(): void {
    this.greeter.greet();
  }
}

const person = container.resolve({ token: Person });

person.sayHello();
