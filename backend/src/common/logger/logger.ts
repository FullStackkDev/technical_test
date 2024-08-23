import { ConsoleLogger } from '@nestjs/common';

/**
 * Logging class
 */
export class CustomLogger extends ConsoleLogger {
  /**
   * Error logging
   * @param message
   * @param rest
   */
  error(error: Error, ...rest): void {
    if (process.env.LOGGER_DISABLED) {
      return;
    }
    let message = `\x1b[31m[ERROR]\x1b[33m[${timestamp()}]\x1b[37m[${error.message} - ${error.stack}]`;
    for (const i in rest) {
      const arg = rest[i];
      message += +i === 0 ? ' - ' : ' ';
      message += `${+i % 2 ? '\x1b[35m' : '\x1b[31m'}`;
      message += `${typeof arg === 'object' ? JSON.stringify(arg) : arg}`;
    }
    console.error(message);
  }
  /**
   * Normal logging
   * @param message
   * @param rest
   */
  log(message: string, ...rest): void {
    if (process.env.LOGGER_DISABLED) {
      return;
    }
    // start-up log of routes
    if (message.startsWith('Mapped')) {
      message = `\x1b[34m[LOG]\x1b[37m[${timestamp()}]\x1b[34m[${message}]`;
      return console.log(message);
    }
    // omit start-up log of controllers etc loading
    const stackFile = rest.pop();
    if (stackFile === 'InstanceLoader' || stackFile === 'RoutesResolver') {
      return;
    }
    message = `\x1b[34m[LOG]\x1b[37m[${timestamp()}]\x1b[34m[${
      typeof message === 'object' ? JSON.stringify(message) : message
    }]`;
    if (stackFile) {
      message += `\x1b[33m[${stackFile}]`;
    }
    for (const i in rest) {
      const arg = rest[i];
      message += +i === 0 ? ' - ' : ' ';
      message += `${!(+i % 2) ? '\x1b[32m' : '\x1b[34m'}`;
      message += `${typeof arg === 'object' ? JSON.stringify(arg) : arg}`;
    }
    return console.log(message);
  }
  /**
   * Warning logging
   * @param message
   * @param rest
   */
  warn(message: string, ...rest): void {
    if (process.env.LOGGER_DISABLED) {
      return;
    }
    message = `\x1b[33m[WARN]\x1b[36m[${timestamp()}]\x1b[37m[${
      typeof message === 'object' ? JSON.stringify(message) : message
    }]`;
    const stackFile = rest.pop();
    if (stackFile) {
      message += `\x1b[33m[${stackFile}]`;
    }
    for (const i in rest) {
      const arg = rest[i];
      message += +i === 0 ? ' - ' : ' ';
      message += `${+i % 2 ? '\x1b[36m' : '\x1b[33m'}`;
      message += `${typeof arg === 'object' ? JSON.stringify(arg) : arg}`;
    }
    return console.warn(message);
  }
  /**
   * Notification logging
   * @param message
   */
  notify(message: string): void {
    if (process.env.LOGGER_DISABLED) {
      return;
    }
    message = `\x1b[33m${message}`;
    return console.info(message);
  }
}

/**
 * Generates a timestamp for the logs
 * @returns {string}
 */
function timestamp(): string {
  const now = new Date();
  return (
    now.getHours().toString().padStart(2, '0') +
    ':' +
    now.getMinutes().toString().padStart(2, '0') +
    ':' +
    now.getSeconds().toString().padStart(2, '0')
  );
}
