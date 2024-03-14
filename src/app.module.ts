import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpConnectionModule } from './http-connection/http-connection.module';
import { PlaylistModule } from './playlist/playlist.module';
import { SessionModule } from 'nestjs-session';

@Module({
  imports: [
    SessionModule.forRoot({
      session: {
        secret: 'session-super-secret',
        resave: false,
        saveUninitialized: false,
      },
    }),
    HttpConnectionModule,
    PlaylistModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
