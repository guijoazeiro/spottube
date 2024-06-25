import { Module } from '@nestjs/common';
import { PlaylistController } from './playlist.controller';
import { HttpConnectionModule } from 'src/http-connection/http-connection.module';
import { PlaylistService } from './playlist.service';

@Module({
  imports: [HttpConnectionModule],
  controllers: [PlaylistController],
  providers: [PlaylistService],
})
export class PlaylistModule {}
