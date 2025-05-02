import { container, Injectable } from 'inzect';

@Injectable()
class Service {}

console.log(container.isRegistered(Service)); // true
console.log(container.isRegistered('some-token')); // false
