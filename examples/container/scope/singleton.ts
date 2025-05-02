import { container, Lifecycle, Scope } from 'inzect';

@Scope(Lifecycle.Singleton)
class Service {}

const service1 = container.resolve(Service);
const service2 = container.resolve(Service);

console.log(service1 === service2); // true
