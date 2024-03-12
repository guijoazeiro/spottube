import { Module } from '@nestjs/common';
import { YoutubeService } from './youtube/youtube.service';
import { HttpModule } from '@nestjs/axios';
import { SpotifyService } from './spotify/spotify/spotify.service';
import { SpotifyController } from './spotify/spotify/spotify.controller';

@Module({
  imports: [HttpModule],
  providers: [YoutubeService, SpotifyService],
  controllers: [SpotifyController],
  exports: [YoutubeService, SpotifyService],
})
export class HttpConnectionModule {}
