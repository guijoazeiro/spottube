import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { HttpConnectionModule } from 'src/http-connection/http-connection.module';

@Module({
  imports: [HttpConnectionModule],
  controllers: [PlaylistController],
})
export class PlaylistModule {}
