import { Injectable, Logger, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger('HTTP');
  use(req: any, res: any, next: (error?: any) => void) {
    this.logger.log(
      `Logging HTTP request: ${req.method} ${req.url} ${req.statusCode}`,
    );
    next();
  }
}
