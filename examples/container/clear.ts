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
