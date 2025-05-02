import { Injectable } from 'inzect';

@Injectable()
export class Logger {
  public log(message: string): void {
    console.log(`[LOG]: ${message}`);
  }
}
