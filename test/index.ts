import { container } from 'tinydi';

class Greeter {
  public greet(): void {
    console.log('hello');
  }
}

container.register({
  token: Greeter,
  provider: {
    useClass: Greeter,
  },
});

const greeter = container.resolve<Greeter>({
  token: Greeter,
});

greeter.greet();
