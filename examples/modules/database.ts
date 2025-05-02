import { Lifecycle, Scope } from 'inzect';

@Scope(Lifecycle.Singleton)
export class Database {
  public async connect(): Promise<void> {
    console.log('Database connected');
  }
}
