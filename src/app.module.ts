import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpConnectionModule } from './http-connection/http-connection.module';
import { PlaylistModule } from './playlist/playlist.module';
import { LoggerMiddleware } from './middleware/logger.middleware';

@Module({
  imports: [HttpConnectionModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
