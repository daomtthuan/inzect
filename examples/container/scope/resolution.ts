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
