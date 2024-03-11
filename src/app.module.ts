import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpConnectionModule } from './http-connection/http-connection.module';
import { PlaylistModule } from './playlist/playlist.module';

@Module({
  imports: [HttpConnectionModule, PlaylistModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
